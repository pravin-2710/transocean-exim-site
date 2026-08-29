import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, BadgeCheck, Clock3, Leaf, Quote, ShieldCheck } from "lucide-react";
import CertMarquee from "../components/CertMarquee";
import EnquiryForm from "../components/EnquiryForm";
import { FadeUp, MaskedLines, Overline } from "../components/Reveal";
import { CLIENTS, CONTACT, PRODUCTS, TESTIMONIALS } from "../data/site";

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section ref={ref} data-testid="hero-section" className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-palm">
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <img
          src="/images/hero.png"
          alt="Freshly graded semi-husked coconuts inside the Transocean processing facility"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-palm via-palm/55 to-palm/20" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-14 pt-40 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-6 inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-camel"
        >
          <span className="h-px w-10 bg-camel" />
          Premium Coconut Exports · Pune, India
        </motion.p>

        <MaskedLines
          data-testid="hero-heading"
          lines={["Bridging Borders,", "Building Opportunities:", "Bringing India's Finest", "Coconuts to the World."]}
          className="font-display text-[11vw] font-black leading-[0.98] tracking-tighter text-white sm:text-[8vw] lg:text-[4.6rem] xl:text-[5.4rem]"
          delay={0.3}
        />

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="max-w-md text-base leading-relaxed text-palm-100/85 md:text-lg"
          >
            Hygienically processed, government-certified coconuts — graded, packed and shipped
            from India to ports across the globe.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="/contact"
              data-testid="hero-quote-btn"
              className="group inline-flex items-center gap-2 rounded-full bg-camel px-8 py-4 text-sm font-semibold text-ink transition-[background-color,transform] duration-300 hover:-translate-y-1 hover:bg-sand"
            >
              Request a Quote
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/products"
              data-testid="hero-products-btn"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white transition-[background-color,border-color] duration-300 hover:border-white/60 hover:bg-white/10"
            >
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.25 }}
          className="mt-14 grid grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4"
          data-testid="hero-stats"
        >
          {[["15+", "Export countries"], ["500 MT", "Monthly capacity"], ["45–60 days", "Natural shelf life"], ["100%", "Certified compliance"]].map(([v, l]) => (
            <div key={l}>
              <p className="font-display text-3xl font-bold text-white md:text-4xl">{v}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-palm-100/60">{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Hygienic Processing Compliance",
    text: "Food-grade facility with automated washing, grading and packing lines. Every lot is handled under HACCP protocols by trained, uniformed staff.",
  },
  {
    icon: Clock3,
    title: "Long Natural Shelf Life",
    text: "Precision de-husking keeps the nut naturally sealed — 45 to 60 days of shelf life without cold chain, and up to 12 months for copra.",
  },
  {
    icon: Leaf,
    title: "High Nutritional Value",
    text: "Mature nuts sourced from single-origin farms, rich in lauric acid, electrolytes and dietary fibre — tested lot by lot before dispatch.",
  },
];

function Trust() {
  return (
    <section data-testid="trust-section" className="relative overflow-hidden bg-bone py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 md:px-10 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <FadeUp>
            <div className="relative">
              <div className="absolute -left-5 -top-5 h-full w-full border border-camel/50" />
              <div className="relative overflow-hidden">
                <img src="/images/facility.png" alt="Coconut plantations we source from, at golden hour" className="aspect-[4/5] w-full object-cover" loading="lazy" />
              </div>
              <div className="absolute -bottom-8 -right-4 bg-palm p-6 text-white shadow-[0_8px_32px_rgba(11,59,36,0.25)] md:-right-8">
                <p className="font-display text-4xl font-black">Govt.</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-palm-100/70">Certified Operations</p>
              </div>
            </div>
          </FadeUp>
        </div>
        <div className="lg:col-span-7 lg:pl-10">
          <FadeUp>
            <Overline>Core Services & Trust</Overline>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-tight text-palm md:text-5xl text-balance">
              Processing standards your port authorities will love.
            </h2>
          </FadeUp>
          <div className="mt-12 space-y-0 divide-y divide-ink/10 border-y border-ink/10">
            {TRUST_FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.1}>
                <div className="group flex gap-6 py-8">
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-camel/40 text-cocoa transition-[background-color,color] duration-300 group-hover:bg-palm group-hover:text-palm-100">
                    <f.icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-ink md:text-2xl">{f.title}</h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/60 md:text-base">{f.text}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              {["APEDA", "FSSAI", "ISO 22000", "HACCP"].map((c) => (
                <span key={c} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-palm">
                  <BadgeCheck className="h-4 w-4 text-cocoa" /> {c}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <section data-testid="product-preview-section" className="bg-white py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <FadeUp>
            <Overline>Export Product Range</Overline>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-tight text-palm md:text-5xl text-balance">
              Three products. One uncompromising standard.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link to="/products" data-testid="view-all-products-link" className="group inline-flex items-center gap-2 text-sm font-semibold text-cocoa transition-colors duration-300 hover:text-palm">
              View full specifications
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </FadeUp>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {PRODUCTS.map((p, i) => (
            <FadeUp key={p.id} delay={i * 0.12} className={i === 1 ? "md:mt-14" : ""}>
              <article data-testid={`product-card-${p.id}`} className="group">
                <div className="relative overflow-hidden">
                  <span className="absolute left-4 top-4 z-10 bg-white/90 px-3 py-1 font-display text-xs font-bold tracking-[0.2em] text-palm backdrop-blur">
                    {p.number}
                  </span>
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-palm/0 transition-colors duration-500 group-hover:bg-palm/15" />
                </div>
                <div className="border-x border-b border-ink/10 p-7 transition-[box-shadow,transform] duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(11,59,36,0.10)]">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{p.name}</h3>
                  <p className="mt-1 text-sm italic text-cocoa">{p.tagline}</p>
                  <ul className="mt-5 space-y-2.5">
                    {p.specs.slice(0, 4).map((s) => (
                      <li key={s} className="flex gap-2.5 text-sm leading-relaxed text-ink/65">
                        <span className="mt-[9px] h-1 w-4 shrink-0 bg-camel" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/products#${p.id}`}
                    data-testid={`learn-more-${p.id}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-palm transition-colors duration-300 hover:text-cocoa"
                  >
                    Learn More
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section data-testid="testimonials-section" className="grain relative overflow-hidden bg-palm py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <FadeUp>
          <Overline light>Trusted Across Borders</Overline>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl text-balance">
            Importers who reorder, season after season.
          </h2>
        </FadeUp>
        <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.12}>
              <figure data-testid={`testimonial-${i}`} className="flex h-full flex-col justify-between bg-palm p-8 md:p-12">
                <div>
                  <Quote className="h-8 w-8 text-camel" strokeWidth={1.4} />
                  <blockquote className="mt-6 text-lg leading-relaxed text-palm-100/90 md:text-xl">“{t.quote}”</blockquote>
                </div>
                <figcaption className="mt-8 flex items-center gap-4">
                  <img src={t.image} alt={t.name} loading="lazy" className="h-12 w-12 rounded-full border border-camel/50 object-cover" />
                  <div>
                    <p className="font-display font-bold">{t.name}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-palm-100/60">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-8" data-testid="client-strip">
            <span className="text-xs uppercase tracking-[0.28em] text-palm-100/50">Serving</span>
            {CLIENTS.map((c) => (
              <span key={c} className="font-display text-lg font-medium tracking-tight text-white/75">{c}</span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function EnquiryCTA() {
  return (
    <section data-testid="enquiry-section" className="bg-bone py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:px-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <FadeUp>
            <Overline>Customer Enquiry & Request Quote</Overline>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-palm md:text-5xl text-balance">
              Tell us your volume. We'll quote within 24 hours.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">
              Share your target country, product mix and estimated volume — our export desk will
              revert with pricing, packing options and the earliest sailing schedule.
            </p>
            <div className="mt-10 space-y-4 text-sm">
              <p className="flex items-center gap-3 text-ink/70">
                <span className="h-px w-8 bg-camel" /> Call us: <strong className="text-palm">{CONTACT.phone}</strong>
              </p>
              <p className="flex items-center gap-3 text-ink/70">
                <span className="h-px w-8 bg-camel" /> Email: <strong className="text-palm">{CONTACT.email}</strong>
              </p>
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.12} className="lg:col-span-3">
          <EnquiryForm />
        </FadeUp>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div data-testid="home-page">
      <Hero />
      <CertMarquee />
      <Trust />
      <ProductPreview />
      <Testimonials />
      <EnquiryCTA />
    </div>
  );
}
