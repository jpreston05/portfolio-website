"use client";

import { SectionCard } from "@/components/SectionCard";
import { ContactForm } from "@/components/ContactForm";

/* Home-page contact section — the shared form in the section-card shell. */
export const Contact = () => (
  <SectionCard id="contact" title="Get in Touch">
    <ContactForm />
  </SectionCard>
);
