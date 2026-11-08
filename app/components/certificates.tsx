"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const items = [
  {
    id: "iso9001",
    labelKey: { fa: "ISO 9001", en: "ISO 9001", ar: "ISO 9001" },
    src: "/ISO9001.jpg",
  },
  {
    id: "iso14001",
    labelKey: { fa: "ISO 14001", en: "ISO 14001", ar: "ISO 14001" },
    src: "/ISO14001.jpg",
  },
  {
    id: "iso45001",
    labelKey: { fa: "ISO 45001", en: "ISO 45001", ar: "ISO 45001" },
    src: "/ISO45001.jpg",
  },
  {
    id: "isiri",
    labelKey: {
      fa: "استاندارد ملی (ISIRI)",
      en: "ISIRI (National Std)",
      ar: "المعيار الوطني (ISIRI)",
    },
    src: "/ISIRI.png",
  },
  {
    id: "ce",
    labelKey: { fa: "CE (Europe)", en: "CE (Europe)", ar: "CE (أوروبا)" },
    src: "/ISO.jpg",
  },
];

export default function Certificates() {
  const { lang } = useLanguage();

  return (
    <section
      id="certificates"
      className="relative py-20 px-6 md:px-12 bg-gradient-to-b from-gray-800 via-gray-800 to-gray-600 text-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold my-4"
        >
          {lang === "fa"
            ? "گواهینامه‌ها و استانداردها"
            : lang === "ar"
              ? "الشهادات والمعايير"
              : "Certificates & Standards"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-gray-300 max-w-3xl mx-auto my-10"
        >
          {lang === "fa"
            ? "آلوم کابل کاوه با تکیه بر تجهیزات پیشرفته و کنترل کیفی دقیق، محصولات خود را مطابق استانداردهای ملی و بین‌المللی تولید می‌کند."
            : lang === "ar"
              ? "تنتج شركة ألوم كابل كاوه منتجاتها اعتمادًا على أجهزة متطورة ونظام صارم لمراقبة الجودة وفق المعايير الوطنية والدولية."
              : "Alum Cable Kaveh manufactures its products using advanced equipment and strict quality control in accordance with national and international standards."}
        </motion.p>

        {/* لوگو گرید */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-items-center">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: i * 0.12 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-28 h-38 flex items-center justify-center bg-white/6 backdrop-blur rounded-lg p-2 shadow-inner">
                <Image
                  src={it.src}
                  alt={it.labelKey[lang]}
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </div>
              <div className="text-xs text-gray-300">{it.labelKey[lang]}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href={`./about#certificate`}
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-full font-semibold shadow-lg transition"
          >
            {lang === "fa"
              ? "مشاهده همه گواهینامه‌ها"
              : lang === "ar"
                ? "عرض جميع الشهادات"
                : "View all certificates"}
          </Link>
        </div>
      </div>

      {/* optional subtle decorative gradient / highlight */}
      <div className="pointer-events-none absolute -left-40 -top-32 w-96 h-96 rounded-full bg-gradient-to-tr from-orange-500/10 to-transparent blur-3xl" />
    </section>
  );
}
