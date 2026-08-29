import { Link } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, ClipboardCheck, FileCheck2, MessageSquareQuote, PackageCheck, Ship, Truck } from "lucide-react";
import CertMarquee from "../components/CertMarquee";
import { FadeUp, MaskedLines, Overline } from "../components/Reveal";
import { CERTIFICATIONS } from "../data/site";

const CHAPTERS = [
  {
    no: "01",
    title: "Single-origin sourcing",
    text: "We buy directly from farmer collectives across Tamil Nadu, Kerala and coastal Maharashtra. Nuts are selected at the farm gate for size, weight and husk integrity — never from open mandis.",
  },
  {
    no: "02",
    title: "Hygienic processing",
    text: "Our Pune facility runs automated washing, grading and de-husking lines under HACCP protocols. Uniformed staff, food-grade surfaces, and batch traceability from farm to container.",
  },
  {
    no: "03",
    title: "Compliance without excuses",
    text: "APEDA registration, FSSAI licensing, ISO 22000 and phytosanitary certification for every shipment. Documentation arrives before your vessel does.",
  },
  {
    no: "04",
    title: "Logistics that respect the product",
    text: "Moisture-controlled warehousing, reefer coordination for tender coconuts, and stuffing supervision at Nhava Sheva and Tuticorin ports. Your cargo arrives as it left us.",
  },
];

const PROCESS = [
  { icon: MessageSquareQuote, title: "Enquiry & Quotation", text: "Share volume and destination; receive a detailed quote within 24 hours." },
  { icon: ClipboardCheck, title: "Quality Inspection", text: "Lot-wise grading, weight calibration and pre-shipment lab checks." },
  { icon: FileCheck2, title: "Documentation", text: "Phytosanitary certificate, certificate of origin, fumigation and COA." },
  { icon: PackageCheck, title: "Packing & Stuffing", text: "Mesh bags, cartons or PP bags; supervised container stuffing with photos." },
  { icon: Ship, title: "Customs & Shipment", text: "CFA handling at Nhava Sheva / Tuticorin with live tracking updates." },
  { icon: Truck, title: "Delivery & Support", text: "Post-arrival quality confirmation and standing reorder programs." },
];

export default function AboutPage() {
  return (
    <div data-testid="about-page">
      <section className="grain relative overflow-hidden bg-palm pb-20 pt-40 text-white md:pb-28">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Overline light>About Transocean EXIM</Overline>
          <MaskedLines
            lines={["An Indian farm story,", "told at global ports."]}
            className="mt-4 font-display text-5xl font-black tracking-tighter md:text-7xl"
            animate={false}
          />
          <FadeUp delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-palm-100/85 md:text-lg">
              Transocean EXIM Solutions was founded in Pune with a simple conviction: Indian
              coconuts deserve world-class processing. Today we bridge smallholder farms in the
              South with importers across the Gulf, Europe and Asia-Pacific.
            </p>
          </FadeUp>
        </div>
      </section>

      <CertMarquee />

      <section data-testid="manifesto-section" className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <FadeUp>
            <Overline>The Manifesto</Overline>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-tight text-palm md:text-5xl text-balance">
              Four chapters. Zero shortcuts.
            </h2>
          </FadeUp>
          <div className="mt-14 grid gap-px bg-ink/10 md:grid-cols-2">
            {CHAPTERS.map((c, i) => (
              <FadeUp key={c.no} delay={i * 0.08}>
                <article data-testid={`chapter-${c.no}`} className="group h-full bg-white p-8 transition-colors duration-500 hover:bg-bone md:p-12">
                  <span className="font-display text-5xl font-black tracking-tighter text-sand transition-colors duration-500 group-hover:text-camel">
                    {c.no}
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60 md:text-base">{c.text}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section data-testid="export-process-section" className="grain relative overflow-hidden bg-palm py-24 text-white lg:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <FadeUp>
            <Overline light>Export Process</Overline>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl text-balance">
              From your enquiry to your port — six supervised steps.
            </h2>
          </FadeUp>
          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.07}>
                <div data-testid={`process-step-${i + 1}`} className="group h-full bg-palm p-8 transition-colors duration-500 hover:bg-palm-800">
                  <div className="flex items-center justify-between">
                    <s.icon className="h-7 w-7 text-camel" strokeWidth={1.5} />
                    <span className="font-display text-sm font-bold tracking-[0.2em] text-palm-100/40">
                      STEP {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-palm-100/70">{s.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section data-testid="certifications-section" className="bg-bone py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <FadeUp>
            <Overline>Certifications & Registrations</Overline>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-tight text-palm md:text-5xl text-balance">
              Sealed, certified, audit-ready.
            </h2>
          </FadeUp>
          <div className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {CERTIFICATIONS.map((c, i) => (
              <FadeUp key={c} delay={i * 0.05}>
                <div data-testid={`cert-${i}`} className="flex h-full items-start gap-3 bg-bone p-7 transition-colors duration-500 hover:bg-sand/40">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-cocoa" strokeWidth={1.8} />
                  <p className="text-sm font-semibold leading-snug text-ink/80">{c}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.15}>
            <Link
              to="/contact"
              data-testid="about-quote-btn"
              className="group mt-12 inline-flex items-center gap-2 rounded-full bg-palm px-8 py-4 text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-palm-800"
            >
              Start an export conversation
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
