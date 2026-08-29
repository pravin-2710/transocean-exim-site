import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { FadeUp, MaskedLines, Overline } from "../components/Reveal";
import { PRODUCTS } from "../data/site";

export default function ProductsPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    }
  }, [hash]);

  return (
    <div data-testid="products-page">
      <section className="bg-bone pb-16 pt-40 md:pb-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Overline>Our Products</Overline>
          <MaskedLines
            lines={["Export-grade coconuts,", "specified to the gram."]}
            className="mt-4 font-display text-5xl font-black tracking-tighter text-palm md:text-7xl"
            animate={false}
          />
          <FadeUp delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/60 md:text-lg">
              Every consignment is graded, weighed and documented against the specifications below.
              Custom packing, private labelling and mixed-container programs available on request.
            </p>
          </FadeUp>
        </div>
      </section>

      {PRODUCTS.map((p, i) => (
        <section
          key={p.id}
          id={p.id}
          data-testid={`product-section-${p.id}`}
          className={`scroll-mt-24 py-20 lg:py-28 ${i % 2 === 1 ? "bg-palm-50" : "bg-white"}`}
        >
          <div className="mx-auto grid max-w-[1400px] items-start gap-12 px-5 md:px-10 lg:grid-cols-2">
            <FadeUp className={i % 2 === 1 ? "lg:order-2" : ""}>
              <div className="relative">
                <div className={`absolute h-full w-full border border-camel/50 ${i % 2 === 1 ? "-right-5 -top-5" : "-left-5 -top-5"}`} />
                <div className="group relative overflow-hidden">
                  <span className="absolute left-4 top-4 z-10 bg-palm px-3 py-1 font-display text-xs font-bold tracking-[0.2em] text-palm-100">
                    {p.number}
                  </span>
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[5/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </FadeUp>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <FadeUp delay={0.1}>
                <Overline>{p.tagline}</Overline>
                <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-palm md:text-5xl">{p.name}</h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/65">{p.description}</p>
              </FadeUp>
              <div className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {p.specs.map((s, j) => (
                  <FadeUp key={s} delay={0.1 + j * 0.05}>
                    <p className="flex items-start gap-3 text-sm leading-relaxed text-ink/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cocoa" strokeWidth={2.4} />
                      {s}
                    </p>
                  </FadeUp>
                ))}
              </div>
              <FadeUp delay={0.2}>
                <Link
                  to="/contact"
                  data-testid={`quote-btn-${p.id}`}
                  className="group mt-10 inline-flex items-center gap-2 rounded-full bg-palm px-7 py-3.5 text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-palm-800"
                >
                  Request Quote for {p.name}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </FadeUp>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
