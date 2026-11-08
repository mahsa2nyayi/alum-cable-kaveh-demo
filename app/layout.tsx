import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import Footer from "./components/footer";
import { SITE } from "@/lib/site";

const SITE_URL = SITE.url;
const SITE_NAME = "آلوم کابل کاوه | Alum Cable Kaveh";
const SITE_TITLE_FA = "آلوم کابل کاوه | تولیدکننده سیم و کابل برق صنعتی";
const SITE_TITLE_EN = "Alum Cable Kaveh | Industrial Power Cable Manufacturer";
const SITE_DESC_FA =
  "آلوم کابل کاوه، تولیدکننده انواع کابل‌های فشار ضعیف، هوایی و انعطاف‌پذیر مطابق استانداردهای IEC و INSO. تأمین‌کننده شرکت‌های توزیع برق، آب و فاضلاب و صنایع سراسر ایران.";
const SITE_DESC_EN =
  "Alum Cable Kaveh manufactures low-voltage, aerial and flexible power cables to IEC and INSO standards. Trusted supplier to Iran's power distribution, water utility and industrial sectors.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE_FA,
    template: `%s | آلوم کابل کاوه`,
  },
  description: SITE_DESC_FA,

  keywords: [
    "کابل برق", "سیم و کابل", "کابل صنعتی", "کابل فشار ضعیف",
    "کابل هوایی", "کابل NYY", "کابل N2XY", "تولیدکننده کابل ایران",
    "آلوم کابل کاوه", "استاندارد INSO", "استاندارد IEC",
    "power cable manufacturer Iran", "Alum Cable Kaveh",
  ],

  authors: [{ name: "Mahsa Donyaei" }],
  creator: "Mahsa Donyaei",
  publisher: "Mahsa Donyaei",

  applicationName: SITE_NAME,
  category: "Manufacturing",

  // ── Open Graph ──────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: ["en_US", "ar_SA"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE_FA,
    description: SITE_DESC_FA,
    images: [
      {
        url: "/logo.png",
        alt: "Alum Cable Kaveh",
      },
    ],
  },

  // ── Twitter Card ────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_FA,
    description: SITE_DESC_FA,
    images: ["/logo.png"],
  },

  // ── Icons ───────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",

  // ── Robots ──────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // ── Multilingual alternates ─────────────────────────────────────────────
  alternates: {
    canonical: SITE_URL,
  },

  // ── Verification 
  verification: {
    // google: "your-google-site-verification-code",
  },

  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1a2f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <head>
        {/* JSON-LD structured data — Organization schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // escape "<" so the JSON can never close the <script> tag
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "آلوم کابل کاوه",
              alternateName: "Alum Cable Kaveh",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              description: SITE_DESC_FA,
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "چهارراه فرمانیه، نارنجستان هفتم، مرکز اداری و تجاری پارک سنتر، طبقه ۱۸، واحد ۱۸۰۳",
                addressLocality: "تهران",
                addressCountry: "IR",
              },
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+98-21-40228249", // keep in sync with lib/site.ts
                  contactType: "sales",
                  areaServed: "IR",
                  availableLanguage: ["Persian", "English", "Arabic"],
                },
              ],
              sameAs: [],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="scroll-smooth">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
