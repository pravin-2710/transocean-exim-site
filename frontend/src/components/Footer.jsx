import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { Logo } from "./Navbar";
import { CONTACT, PRODUCTS } from "../data/site";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative overflow-hidden bg-ink text-white grain">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-2 md:px-10 lg:grid-cols-4 lg:py-24">
        <div>
          <Logo light />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
            Premium processor and exporter of semi husked coconuts, green tender coconuts and
            coconut copra — from the farms of South India to ports worldwide.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.28em] text-camel">Quick Links</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {[["/", "Home"], ["/products", "Products"], ["/about", "About Us"], ["/gallery", "Gallery"], ["/contact", "Contact Us"]].map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group inline-flex items-center gap-1.5 text-white/70 transition-colors duration-300 hover:text-camel"
                >
                  {label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.28em] text-camel">Our Products</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {PRODUCTS.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/products#${p.id}`}
                  data-testid={`footer-product-${p.id}`}
                  className="text-white/70 transition-colors duration-300 hover:text-camel"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.28em] text-camel">Corporate Office</h4>
          <ul className="mt-5 space-y-4 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-camel" />
              <a href={`tel:${CONTACT.phone}`} data-testid="footer-phone" className="transition-colors duration-300 hover:text-camel">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-camel" />
              <a href={`mailto:${CONTACT.email}`} data-testid="footer-email" className="break-all transition-colors duration-300 hover:text-camel">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-camel" />
              <span data-testid="footer-location">{CONTACT.location}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-3 px-5 py-6 text-xs text-white/40 md:flex-row md:items-center md:px-10">
          <p data-testid="footer-copyright">© {new Date().getFullYear()} Transocean EXIM Solutions. All rights reserved.</p>
          <p>Government of India Certified Exporter · Pune, India</p>
        </div>
      </div>
    </footer>
  );
}
