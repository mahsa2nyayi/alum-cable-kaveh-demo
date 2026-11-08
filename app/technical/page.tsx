// app/technical/page.tsx
import type { Metadata } from "next";
import TechnicalPageClient from "./TechnicalPageClient";

export const metadata: Metadata = {
  title: {
    fa: "اطلاعات فنی کابل | آلوم کابل کاوه",
    en: "Cable Technical Data | Alum Cable Kaveh",
    ar: "البيانات الفنية للكابلات | آلوم كابل كافيه",
  } as any,
  description:
    "جداول استانداردهای بین‌المللی IEC، INSO، DIN و مقایسه انواع کابل‌های برق",
  keywords: [
    "کابل برق",
    "استاندارد IEC",
    "NYY",
    "N2XY",
    "NAYY",
    "مشخصات فنی کابل",
  ],
  openGraph: {
    title: "اطلاعات فنی کابل | آلوم کابل کاوه",
    description: "جداول استانداردهای بین‌المللی و مقایسه انواع کابل‌های برق",
    type: "article",
  },
};

export default function TechnicalPage() {
  return <TechnicalPageClient />;
}
