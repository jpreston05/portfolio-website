"use client";

import { SectionCard } from "@/components/SectionCard";
import { ContactForm } from "@/components/ContactForm";

/* Home-page contact section — the shared form in the section-card shell.
   Titled "Let's talk" to match the nav CTA and /contact (one name per action). */
export const Contact = () => (
  <SectionCard id="contact" title="Let's talk">
    <ContactForm />
  </SectionCard>
);
