# Transocean EXIM Solutions — PRD

## Original Problem Statement
Premium, high-converting B2B export website for "Transocean EXIM Solutions" (Pune, India) — processor/exporter of Semi Husked Coconuts, Green Tender Coconuts, and Coconut Copra. Ultra-modern, clean, professional; palette of deep palm green, crisp white, warm earthy tones. Pages: Home (sticky nav + Request Quote, full-width hero with the exact heading, trust/certifications section, product preview cards), customer enquiry/quote form (name, company, work email, phone with country code, target country, product multi-select, order volume, message) stored in a database, password-protected admin dashboard with view/filter/status-update/CSV export, AI-generated product photography, footer with Phone +91-9168007595, info@transoceanexim.com, Pune India.

## Architecture
- Frontend: React 19 + Tailwind + framer-motion (masked line-reveal hero, scroll reveals, parallax) + Lenis smooth scroll + react-fast-marquee + sonner toasts. Fonts: Cabinet Grotesk / Satoshi (Fontshare).
- Backend: FastAPI + Motor (MongoDB). Routes under /api: leads (public POST), auth (JWT Bearer, bcrypt, brute-force lockout, idempotent admin seed), admin leads list/filter/patch/stats/CSV export.
- Email: Emergent managed email (Resend proxy) — lead alert to NOTIFY_EMAIL on each enquiry, server-side template, guardrail gate.
- Images: Gemini (Nano Banana, gemini-3.1-flash-image-preview) via EMERGENT_LLM_KEY — script at /app/scripts/generate_images.py outputs to /app/frontend/public/images/.

## User Personas
- B2B importer/procurement manager (Gulf, EU, APAC) requesting quotes and specs.
- Transocean export manager reviewing and progressing leads in the admin dashboard.

## Core Requirements (static)
1. Marketing site: Home, Products, About (manifesto + export process + certifications), Gallery, Contact.
2. Enquiry/Request-Quote form on Home + Contact; leads persisted in MongoDB.
3. Admin dashboard: login, stats, search/filter, status pipeline, CSV export.
4. Email alert to the business on each new lead.
5. Footer corporate info; responsive; data-testid on interactive elements.

## Implemented (2026-08-29)
- Full marketing site with kinetic masked-reveal hero + scroll parallax, certifications marquee, trust section, product preview cards, testimonials/client strip, embedded enquiry form.
- Products page with per-product spec sheets and anchor deep-links.
- About page: numbered manifesto chapters, 6-step export process timeline, certifications grid.
- Gallery page: editorial masonry with hover captions.
- Enquiry form → POST /api/leads → MongoDB + background email alert to info@transoceanexim.com.
- Admin: /admin/login (JWT), /admin dashboard with stats, search/status/product filters, inline status updates (New→Contacted→Quoted→Negotiation→Won→Closed), CSV export.
- Admin seeded: admin@transoceanexim.com (see /app/memory/test_credentials.md).
- AI images generated: hero.png, semi-husked.png. Remaining 5 slots use curated stock (LLM key budget exhausted mid-batch).

## Backlog
- P0: Regenerate remaining 5 images (tender, copra, facility, packing, farm) with Nano Banana after LLM key top-up (Profile → Manage plan → Universal Key → Add Balance), then re-run /app/scripts/generate_images.py.
- P1: Lead detail drawer with notes/activity log in dashboard; email reply threading.
- P1: Pagination + date-range filter in dashboard.
- P2: Multi-admin user management; downloadable product spec-sheet PDFs; WhatsApp CTA.

## Next Tasks
1. Top up LLM key; re-run image script for the 5 pending visuals.
2. Add lead notes/activity timeline.
3. Add pagination to leads table.
