import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Palmtree, X, ArrowUpRight } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home", id: "home" },
  { to: "/products", label: "Products", id: "products" },
  { to: "/about", label: "About Us", id: "about" },
  { to: "/gallery", label: "Gallery", id: "gallery" },
  { to: "/contact", label: "Contact Us", id: "contact" },
];

export function Logo({ light = false }) {
  return (
    <Link to="/" data-testid="logo-link" className="flex items-center gap-3 group">
      <span className="grid h-10 w-10 place-items-center bg-palm text-palm-100 transition-colors duration-300 group-hover:bg-palm-800">
        <Palmtree className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <span className="leading-none">
        <span className={`block font-display font-800 tracking-tight text-lg font-extrabold ${light ? "text-white" : "text-palm"}`}>
          TRANSOCEAN
        </span>
        <span className={`block text-[10px] uppercase tracking-[0.32em] ${light ? "text-palm-100/70" : "text-cocoa"}`}>
          EXIM Solutions
        </span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      data-testid="main-nav"
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-500 backdrop-blur-xl ${
        scrolled ? "bg-white/85 border-sand shadow-[0_8px_32px_rgba(11,59,36,0.08)]" : "bg-white/60 border-white/20"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.id}
              to={l.to}
              data-testid={`nav-link-${l.id}`}
              className={({ isActive }) =>
                `relative text-sm font-medium tracking-wide transition-colors duration-300 hover:text-palm ${
                  isActive ? "text-palm after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-camel" : "text-ink/70"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            data-testid="nav-quote-btn"
            className="group hidden items-center gap-2 rounded-full bg-palm px-6 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-palm-800 sm:inline-flex"
          >
            Request Quote
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            data-testid="mobile-menu-btn"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-sand bg-white/70 text-palm lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-sand bg-white/95 backdrop-blur-xl lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-6 py-5">
              {LINKS.map((l) => (
                <NavLink
                  key={l.id}
                  to={l.to}
                  data-testid={`mobile-nav-link-${l.id}`}
                  className={({ isActive }) =>
                    `py-3 text-base font-medium ${isActive ? "text-palm" : "text-ink/70"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                data-testid="mobile-nav-quote-btn"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-palm px-6 py-3.5 text-sm font-semibold text-white"
              >
                Request Quote <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
