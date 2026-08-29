import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export function FadeUp({ children, delay = 0, className = "", y = 36 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MaskedLines({ lines, className = "", lineClassName = "", delay = 0, animate = true }) {
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClassName}`}
            initial={{ y: "112%" }}
            animate={animate ? { y: 0 } : undefined}
            whileInView={animate ? undefined : { y: 0 }}
            viewport={animate ? undefined : { once: true }}
            transition={{ duration: 0.95, delay: delay + i * 0.13, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export function Overline({ children, light = false, className = "" }) {
  return (
    <p
      className={`text-xs uppercase tracking-[0.28em] font-semibold ${
        light ? "text-camel" : "text-cocoa"
      } ${className}`}
    >
      {children}
    </p>
  );
}
