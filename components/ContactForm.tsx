"use client";

import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";

/* The contact form — shared by the home #contact section and /contact.
   Sends via EmailJS (the public key is passed per-send, so no init needed). */

const fieldClass =
  "rounded-lg bg-[#3A423D] p-3.5 text-base text-[#ECECEA] transition-shadow " +
  "placeholder:text-[#A6B0A8] focus:outline-none focus:ring-2 focus:ring-[#DB5461]";

export const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: false, message: "" });

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setFormStatus({
        submitting: false,
        success: true,
        error: false,
        message: "Message sent successfully! I will get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message:
          "An error occurred while sending your message. Please try again.",
      });
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your name…"
        required
        value={formData.name}
        onChange={handleInputChange}
        className={fieldClass}
      />
      <input
        type="email"
        name="email"
        placeholder="Your email…"
        required
        value={formData.email}
        onChange={handleInputChange}
        className={fieldClass}
      />
      <textarea
        name="message"
        placeholder="Your message…"
        required
        value={formData.message}
        onChange={handleInputChange}
        className={`${fieldClass} min-h-[140px] resize-y`}
      />
      <motion.button
        type="submit"
        className="rounded-lg px-4 py-3 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: c.accent, color: c.bg }}
        whileHover={formStatus.submitting ? undefined : { y: -2 }}
        whileTap={formStatus.submitting ? undefined : { scale: 0.98 }}
        disabled={formStatus.submitting}
        aria-busy={formStatus.submitting}
      >
        {formStatus.submitting ? "Sending…" : "Send Message"}
      </motion.button>

      {formStatus.message && (
        <motion.div
          role={formStatus.success ? "status" : "alert"}
          aria-live={formStatus.success ? "polite" : "assertive"}
          className="mt-1 flex items-center gap-2 rounded-lg border p-3 text-sm font-medium"
          style={{
            borderColor: formStatus.success ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)",
            background: formStatus.success ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
            color: formStatus.success ? "#4ade80" : "#F87171",
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE_SNAPPY }}
        >
          {formStatus.success ? (
            <FiCheckCircle className="shrink-0 text-base" aria-hidden />
          ) : (
            <FiAlertCircle className="shrink-0 text-base" aria-hidden />
          )}
          <span>{formStatus.message}</span>
        </motion.div>
      )}
    </form>
  );
};
