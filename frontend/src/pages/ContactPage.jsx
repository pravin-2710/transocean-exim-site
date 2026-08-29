import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import EnquiryForm from "../components/EnquiryForm";
import { FadeUp, MaskedLines, Overline } from "../components/Reveal";
import { CONTACT } from "../data/site";

const INFO = [
  { icon: Phone, label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phone}`, testid: "contact-phone" },
  { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, testid: "contact-email" },
  { icon: MapPin, label: "Head Office", value: CONTACT.location, testid: "contact-location" },
  { icon: Clock3, label: "Export Desk Hours", value: "Mon–Sat · 9:00–19:00 IST", testid: "contact-hours" },
];

export default function ContactPage() {
  return (
    <div data-testid="contact-page">
      <section className="grain relative overflow-hidden bg-palm pb-20 pt-40 text-white md:pb-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Overline light>Contact Us</Overline>
          <MaskedLines
            lines={["Let's talk coconuts.", "Serious volumes only."]}
            className="mt-4 font-display text-5xl font-black tracking-tighter md:text-7xl"
            animate={false}
          />
          <FadeUp delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-palm-100/85 md:text-lg">
              Fill in the enquiry form and our export desk will respond with pricing, packing
              options and sailing schedules within 24 hours.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-bone py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:px-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <FadeUp>
              <Overline>Corporate Information</Overline>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-palm md:text-4xl text-balance">
                Transocean EXIM Solutions
              </h2>
            </FadeUp>
            <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {INFO.map((item, i) => (
                <FadeUp key={item.label} delay={i * 0.07}>
                  <div className="flex items-start gap-4 py-6">
                    <span className="grid h-11 w-11 shrink-0 place-items-center border border-camel/40 text-cocoa">
                      <item.icon className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-ink/45">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} data-testid={item.testid} className="mt-1 block font-display text-lg font-bold text-ink transition-colors duration-300 hover:text-palm">
                          {item.value}
                        </a>
                      ) : (
                        <p data-testid={item.testid} className="mt-1 font-display text-lg font-bold text-ink">{item.value}</p>
                      )}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
          <FadeUp delay={0.12} className="lg:col-span-3">
            <EnquiryForm />
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
