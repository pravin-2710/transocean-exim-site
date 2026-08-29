import Marquee from "react-fast-marquee";
import { Sprout } from "lucide-react";
import { CERTIFICATIONS } from "../data/site";

export default function CertMarquee() {
  return (
    <div data-testid="certifications-marquee" className="border-y border-palm/10 bg-palm-100/60 py-5">
      <Marquee speed={32} gradient={false} pauseOnHover>
        {CERTIFICATIONS.map((cert) => (
          <span key={cert} className="mx-12 inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.22em] text-palm/80">
            <Sprout className="h-4 w-4 text-cocoa" strokeWidth={1.8} />
            {cert}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
