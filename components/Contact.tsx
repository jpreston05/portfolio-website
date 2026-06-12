"use client";

import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useState, type ChangeEvent, type FormEvent } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const fieldClass =
  "rounded-lg border-2 border-line bg-card p-4 text-base text-ink shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all placeholder:text-muted focus:border-accent focus:shadow-[0_4px_12px_rgba(244,114,182,0.2)] focus:outline-none";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormStatus({
      submitting: true,
      success: false,
      error: false,
      message: "",
    });

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

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message:
          "An error occurred while sending your message. Please try again.",
      });
      return;
    }
  };

  return (
    <motion.section
      id="contact"
      className="relative bg-surface px-[5%] py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute left-0 right-0 top-0 h-px [background:linear-gradient(90deg,transparent,#72d1f4,transparent)]" />
      <motion.h2
        className="mb-12 text-center text-[2.5rem]"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        Get in Touch
      </motion.h2>

      <motion.div className="mx-auto max-w-[600px]" variants={fadeInUp}>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <motion.input
            type="text"
            name="name"
            placeholder="Your Name..."
            required
            value={formData.name}
            whileFocus={{ scale: 1.02 }}
            onChange={handleInputChange}
            className={fieldClass}
          />
          <motion.input
            type="email"
            name="email"
            placeholder="Your Email..."
            required
            value={formData.email}
            whileFocus={{ scale: 1.02 }}
            onChange={handleInputChange}
            className={fieldClass}
          />
          <motion.textarea
            name="message"
            placeholder="Your Message..."
            required
            value={formData.message}
            whileFocus={{ scale: 1.02 }}
            onChange={handleInputChange}
            className={`${fieldClass} min-h-[150px] resize-y`}
          />
          <motion.button
            type="submit"
            className="relative overflow-hidden rounded-lg bg-primary p-4 text-base font-semibold text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all disabled:opacity-70 before:absolute before:left-[-100%] before:top-0 before:h-full before:w-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] before:transition-all before:duration-500 before:content-[''] hover:before:left-[100%]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={formStatus.submitting}
          >
            {formStatus.submitting ? "Sending..." : "Send Message"}
          </motion.button>
          {formStatus.message && (
            <motion.div
              className={`mt-4 rounded-lg p-4 text-center font-medium ${
                formStatus.success
                  ? "border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.1)] text-[#4ade80]"
                  : "border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.2)] text-[#f87171]"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {formStatus.message}
            </motion.div>
          )}
        </form>
      </motion.div>
    </motion.section>
  );
};
