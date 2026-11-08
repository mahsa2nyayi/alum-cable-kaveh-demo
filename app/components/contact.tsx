"use client";

import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";
import { Phone, FileText } from "lucide-react";

export default function QuickContact() {
  const { lang } = useLanguage();

  const texts = {
    fa: {
      title: "تماس فوری با کارشناسان ما",
      desc: "برای دریافت پیش‌فاکتور یا استعلام فوری، همین حالا با ما در ارتباط باشید.",
      quote: "درخواست پیش‌فاکتور",
      call: "تماس با کارشناس",
    },

    en: {
      title: "Instant Contact With Our Experts",
      desc: "For quotations or immediate inquiries, get in touch with us right now.",
      quote: "Request a Quote",
      call: "Call Expert",
    },

    ar: {
      title: "اتصال فوري مع خبرائنا",
      desc: "للحصول على عرض سعر أو استعلام عاجل، تواصل معنا الآن.",
      quote: "طلب عرض سعر",
      call: "الاتصال بالخبير",
    },
  };
  return (
    <section className="w-full py-20 bg-gradient-to-b from-gray-900 via-gray-750 to-gray-600">
      <div className="max-w-4xl mx-auto p-8 text-center bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold text-white"
        >
          {texts[lang].title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-3 text-gray-300 text-lg"
        >
          {texts[lang].desc}
        </motion.p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10">
          {/* درخواست پیش‌فاکتور */}
          <motion.a
            href="/contactUs#contactForm"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 
              bg-orange-500 hover:bg-orange-600 
              text-white px-7 py-3 rounded-full
              font-medium
              shadow-md"
          >
            <FileText className="w-6 h-6" />
            {texts[lang].quote}
          </motion.a>

          {/* تماس با کارشناس */}
          <motion.a
            href="/contactUs"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 
              bg-white/10 hover:bg-white/20
              backdrop-blur-md
              text-white px-7 py-3 rounded-full 
              font-medium
              shadow-md
              border border-white/10"
          >
            <Phone className="w-6 h-6" />
            {texts[lang].call}
          </motion.a>
        </div>
      </div>
    </section>
  );
}
