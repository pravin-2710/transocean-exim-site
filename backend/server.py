from dotenv import load_dotenv
load_dotenv()

import os
import csv
import io
import re
import uuid
import ipaddress
import logging
import asyncio
from datetime import datetime, timezone, timedelta
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from typing import List, Optional

import bcrypt
import jwt
import httpx
from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
LEAD_STATUSES = ["New", "Contacted", "Quoted", "Negotiation", "Won", "Closed"]


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"email": payload["email"]}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------------- Email (Emergent managed Resend proxy) ----------------
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Transocean EXIM Solutions")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
NOTIFY_EMAIL = os.environ.get("NOTIFY_EMAIL")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client_http:
            resp = await client_http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


def lead_email_html(lead: dict) -> str:
    rows = "".join(
        f'<tr><td style="padding:8px 12px;color:#666;font-size:13px;vertical-align:top">{label}</td>'
        f'<td style="padding:8px 12px;font-size:13px;color:#1A211D"><strong>{value}</strong></td></tr>'
        for label, value in [
            ("Name", escape(lead["full_name"])),
            ("Company", escape(lead["company_name"])),
            ("Email", escape(lead["email"])),
            ("Phone", escape(f'{lead["country_code"]} {lead["phone"]}')),
            ("Target Country", escape(lead["country"])),
            ("Products", escape(", ".join(lead["products"]))),
            ("Order Volume", escape(lead["volume"])),
            ("Message", escape(lead.get("message") or "-")),
        ]
    )
    return (
        '<table role="presentation" width="100%" style="background:#F8FAFC;padding:24px">'
        '<tr><td style="font-family:Arial,sans-serif;max-width:560px;margin:auto;background:#ffffff;'
        'border:1px solid #EADDCA;padding:24px">'
        f'<p style="font-size:12px;letter-spacing:2px;color:#0B3B24;text-transform:uppercase">{escape(EMAIL_FROM_NAME)}</p>'
        '<h2 style="margin:4px 0 16px;color:#0B3B24;font-size:20px">New Export Enquiry Received</h2>'
        f'<table role="presentation" width="100%" style="border-collapse:collapse">{rows}</table>'
        '<p style="font-size:12px;color:#888;margin-top:20px">Sent by the Transocean EXIM Solutions '
        'website enquiry system. View and manage this lead in the admin dashboard.</p>'
        '</td></tr></table>'
    )


async def notify_new_lead(lead: dict):
    try:
        if NOTIFY_EMAIL and EMAIL_KEY:
            await send_email(
                to=NOTIFY_EMAIL,
                subject=f'New Enquiry: {lead["full_name"]} ({lead["company_name"]})',
                html=lead_email_html(lead),
            )
    except Exception as e:
        logger.error(f"Lead notification email failed: {e}")


# ---------------- Models ----------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LeadCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    company_name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    country_code: str = Field(min_length=2, max_length=8)
    phone: str = Field(min_length=5, max_length=20)
    country: str = Field(min_length=2, max_length=80)
    products: List[str] = Field(min_length=1)
    volume: str = Field(min_length=2, max_length=80)
    message: Optional[str] = Field(default="", max_length=2000)


class LeadStatusUpdate(BaseModel):
    status: str


# ---------------- Auth routes ----------------
@api_router.post("/auth/login")
async def login(payload: LoginRequest, request: Request):
    email = payload.email.lower().strip()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        locked_since = attempts.get("last_attempt")
        if locked_since and datetime.now(timezone.utc) - datetime.fromisoformat(locked_since) < timedelta(minutes=15):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_attempt": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(str(user["_id"]), email)
    return {"token": token, "user": {"email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")}}


@api_router.get("/auth/me")
async def auth_me(admin=Depends(get_current_admin)):
    return admin


# ---------------- Public lead capture ----------------
@api_router.post("/leads")
async def create_lead(payload: LeadCreate):
    lead = payload.model_dump()
    lead["id"] = str(uuid.uuid4())
    lead["status"] = "New"
    lead["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.leads.insert_one(dict(lead))
    asyncio.create_task(notify_new_lead(lead))
    return {"success": True, "id": lead["id"], "message": "Enquiry received. Our export desk will respond within 24 hours."}


# ---------------- Admin lead management ----------------
@api_router.get("/admin/leads")
async def list_leads(status: Optional[str] = None, product: Optional[str] = None,
                     search: Optional[str] = None, admin=Depends(get_current_admin)):
    query = {}
    if status and status != "All":
        query["status"] = status
    if product and product != "All":
        query["products"] = product
    if search:
        regex = {"$regex": re.escape(search), "$options": "i"}
        query["$or"] = [{"full_name": regex}, {"company_name": regex}, {"email": regex}, {"country": regex}]
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return {"leads": leads, "count": len(leads)}


@api_router.get("/admin/stats")
async def lead_stats(admin=Depends(get_current_admin)):
    total = await db.leads.count_documents({})
    by_status = {s: await db.leads.count_documents({"status": s}) for s in LEAD_STATUSES}
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    recent = await db.leads.count_documents({"created_at": {"$gte": week_ago}})
    by_product = {}
    for p in ["Semi Husked Coconut", "Green Tender Coconut", "Coconut Copra"]:
        by_product[p] = await db.leads.count_documents({"products": p})
    return {"total": total, "by_status": by_status, "by_product": by_product, "last_7_days": recent}


@api_router.get("/admin/leads/export")
async def export_leads_csv(admin=Depends(get_current_admin)):
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Full Name", "Company", "Email", "Phone", "Target Country",
                     "Products", "Order Volume", "Message", "Status", "Submitted At"])
    for l in leads:
        writer.writerow([l.get("id"), l.get("full_name"), l.get("company_name"), l.get("email"),
                         f'{l.get("country_code", "")} {l.get("phone", "")}', l.get("country"),
                         "; ".join(l.get("products", [])), l.get("volume"), l.get("message", ""),
                         l.get("status"), l.get("created_at")])
    output.seek(0)
    filename = f"transocean-leads-{datetime.now(timezone.utc).strftime('%Y%m%d')}.csv"
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": f'attachment; filename="{filename}"'})


@api_router.patch("/admin/leads/{lead_id}")
async def update_lead_status(lead_id: str, payload: LeadStatusUpdate, admin=Depends(get_current_admin)):
    if payload.status not in LEAD_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.leads.update_one({"id": lead_id}, {"$set": {"status": payload.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    return lead


@api_router.get("/")
async def root():
    return {"message": "Transocean EXIM Solutions API"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Transocean Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin user: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info(f"Updated admin password for: {admin_email}")


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.leads.create_index("created_at")
    await db.leads.create_index("status")
    await db.login_attempts.create_index("identifier")
    await seed_admin()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
