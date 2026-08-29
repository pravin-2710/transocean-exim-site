import { FadeUp, MaskedLines, Overline } from "../components/Reveal";
import { GALLERY } from "../data/site";

export default function GalleryPage() {
  return (
    <div data-testid="gallery-page">
      <section className="bg-bone pb-14 pt-40 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Overline>Gallery</Overline>
          <MaskedLines
            lines={["Inside the facility,", "inside the shipment."]}
            className="mt-4 font-display text-5xl font-black tracking-tighter text-palm md:text-7xl"
            animate={false}
          />
          <FadeUp delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/60 md:text-lg">
              A look at our farms, processing lines and export packing — the everyday reality
              behind every container we ship.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-white pb-24 pt-6 lg:pb-32">
        <div className="mx-auto max-w-[1400px] columns-1 gap-6 px-5 sm:columns-2 md:px-10 lg:columns-3">
          {GALLERY.map((g, i) => (
            <FadeUp key={g.src + i} delay={(i % 3) * 0.08} className="mb-6 break-inside-avoid">
              <figure data-testid={`gallery-item-${i}`} className="group relative overflow-hidden">
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                    g.span === "tall" ? "aspect-[3/4]" : g.span === "wide" ? "aspect-[16/10]" : "aspect-[4/3]"
                  }`}
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-palm/90 to-transparent p-5 pt-14 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm font-semibold text-white">{g.caption}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-palm-100/70">Transocean EXIM · Pune</p>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  );
}
