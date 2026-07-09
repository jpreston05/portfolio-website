import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Background } from "@/components/Background";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// The OG/Twitter image is the static app/opengraph-image.png (baked once with
// Satori, like app/icon.png) — Next wires og:image/twitter:image from the file
// convention; Vercel supplies the absolute URL base at deploy time.
export const metadata: Metadata = {
  title: "Jack Preston | Portfolio",
  description:
    "Aspiring Software Engineer. Software Engineering, Finance and Management student at the University of Auckland.",
  openGraph: {
    title: "Jack Preston | Portfolio",
    description:
      "Software Engineering, Finance and Management student at the University of Auckland.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the pre-paint script below sets data-intro-seen
    // on <html> before React hydrates — an expected, deliberate mismatch.
    <html
      lang="en"
      className={inter.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="font-sans">
        {/* Pre-paint intro gate: the SSR HTML contains the preloader (the server
            can't read sessionStorage), so a repeat visit would flash it until
            hydration. This blocking script hides it at first paint instead
            (see the [data-intro-seen] rules in globals.css). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(sessionStorage.getItem("introSeen"))document.documentElement.setAttribute("data-intro-seen","")}catch(e){}',
          }}
        />
        <Background />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
