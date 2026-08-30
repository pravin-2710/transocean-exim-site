import { motion } from "framer-motion";
import { MessageCircleMore } from "lucide-react";
import { CONTACT } from "../data/site";

const message = "Hello Transocean EXIM Solutions, I would like to discuss a coconut export requirement.";
const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

export const WhatsAppButton = () => (
  <motion.a
    href={whatsappUrl}
    target="_blank"
    rel="noreferrer"
    data-testid="floating-whatsapp-button"
    aria-label="Chat with the Transocean export desk on WhatsApp"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: 1.1 }}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    className="fixed bottom-5 right-5 z-[60] inline-flex min-h-14 items-center gap-3 rounded-full border border-white/30 bg-[#25D366] px-4 text-white shadow-[0_12px_36px_rgba(11,59,36,0.28)] transition-[background-color,box-shadow] duration-300 hover:bg-[#1FB95A] hover:shadow-[0_16px_42px_rgba(11,59,36,0.34)] sm:bottom-7 sm:right-7 sm:px-5"
  >
    <MessageCircleMore className="h-6 w-6 shrink-0" strokeWidth={2.1} />
    <span className="hidden pr-1 text-sm font-bold sm:inline">WhatsApp export desk</span>
  </motion.a>
);