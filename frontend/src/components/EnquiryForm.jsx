import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { api, formatApiErrorDetail } from "../lib/api";
import { COUNTRY_CODES, PRODUCTS, VOLUMES } from "../data/site";

const inputCls =
  "w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/35 outline-none transition-[border-color,box-shadow] duration-300 focus:border-palm focus:ring-1 focus:ring-palm";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/60";

export default function EnquiryForm({ compact = false }) {
  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    email: "",
    country_code: "+91",
    phone: "",
    country: "",
    products: [],
    volume: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleProduct = (name) =>
    setForm((f) => ({
      ...f,
      products: f.products.includes(name) ? f.products.filter((p) => p !== name) : [...f.products, name],
    }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.products.length === 0) {
      toast.error("Please select at least one product.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/leads", form);
      setDone(true);
      toast.success("Enquiry received. Our export desk will respond within 24 hours.");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div data-testid="enquiry-success" className="flex h-full min-h-[420px] flex-col items-start justify-center bg-white p-8 md:p-12">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-palm text-palm-100">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-6 font-display text-3xl font-bold tracking-tight text-palm">Enquiry received.</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
          Thank you, {form.full_name.split(" ")[0]}. Our export desk is reviewing your requirement for{" "}
          {form.products.join(", ")} and will respond to <strong>{form.email}</strong> within 24 hours.
        </p>
        <button
          data-testid="enquiry-another-btn"
          onClick={() => {
            setDone(false);
            setForm({ full_name: "", company_name: "", email: "", country_code: "+91", phone: "", country: "", products: [], volume: "", message: "" });
          }}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-palm px-6 py-3 text-sm font-semibold text-palm transition-[background-color,color] duration-300 hover:bg-palm hover:text-white"
        >
          Submit another enquiry <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <form data-testid="enquiry-form" onSubmit={submit} className="bg-white p-6 shadow-[0_8px_32px_rgba(11,59,36,0.06)] md:p-10">
      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label className={labelCls} htmlFor="eq-name">Full Name *</label>
          <input id="eq-name" data-testid="enquiry-name-input" required minLength={2} className={inputCls} placeholder="Rajesh Menon" value={form.full_name} onChange={set("full_name")} />
        </div>
        <div>
          <label className={labelCls} htmlFor="eq-company">Company Name *</label>
          <input id="eq-company" data-testid="enquiry-company-input" required minLength={2} className={inputCls} placeholder="Gulf Fresh Trading LLC" value={form.company_name} onChange={set("company_name")} />
        </div>
        <div>
          <label className={labelCls} htmlFor="eq-email">Work Email *</label>
          <input id="eq-email" data-testid="enquiry-email-input" required type="email" className={inputCls} placeholder="you@company.com" value={form.email} onChange={set("email")} />
        </div>
        <div>
          <label className={labelCls} htmlFor="eq-phone">Phone Number *</label>
          <div className="flex">
            <select
              data-testid="enquiry-country-code-select"
              aria-label="Country code"
              className={`${inputCls} w-[116px] shrink-0 border-r-0`}
              value={form.country_code}
              onChange={set("country_code")}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input id="eq-phone" data-testid="enquiry-phone-input" required minLength={5} className={inputCls} placeholder="91680 07595" value={form.phone} onChange={set("phone")} />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="eq-country">Target Export Country *</label>
          <input id="eq-country" data-testid="enquiry-country-input" required minLength={2} className={inputCls} placeholder="United Arab Emirates" value={form.country} onChange={set("country")} />
        </div>
        <div>
          <label className={labelCls} htmlFor="eq-volume">Estimated Order Volume *</label>
          <select id="eq-volume" data-testid="enquiry-volume-select" required className={inputCls} value={form.volume} onChange={set("volume")}>
            <option value="" disabled>Select volume</option>
            {VOLUMES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className={compact ? "" : "sm:col-span-2"}>
          <span className={labelCls}>Product Selection *</span>
          <div className="flex flex-wrap gap-2.5" data-testid="enquiry-products-group">
            {PRODUCTS.map((p) => {
              const active = form.products.includes(p.name);
              return (
                <button
                  type="button"
                  key={p.id}
                  data-testid={`enquiry-product-${p.id}`}
                  onClick={() => toggleProduct(p.name)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-[background-color,color,border-color] duration-300 ${
                    active ? "border-palm bg-palm text-white" : "border-ink/15 bg-white text-ink/70 hover:border-palm/50 hover:text-palm"
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label className={labelCls} htmlFor="eq-message">Message / Custom Specifications</label>
          <textarea id="eq-message" data-testid="enquiry-message-input" rows={4} maxLength={2000} className={`${inputCls} resize-none`} placeholder="Packing preferences, port of discharge, target price, delivery timeline…" value={form.message} onChange={set("message")} />
        </div>
      </div>
      <button
        type="submit"
        data-testid="enquiry-submit-btn"
        disabled={submitting}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-palm px-8 py-4 text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-palm-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitting ? "Submitting…" : "Request Quote"}
        {!submitting && <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
      </button>
    </form>
  );
}
