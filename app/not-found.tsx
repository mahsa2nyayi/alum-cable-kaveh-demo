"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, Cable, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

type Lang = "fa" | "en" | "ar";

const TEXT: Record<Lang, {
  code: string; title: string; desc: string;
  home: string; products: string;
}> = {
  fa: {
    code: "۴۰۴",
    title: "این مسیر قطع شده",
    desc: "صفحه‌ای که دنبالش بودید پیدا نشد. ممکنه آدرس اشتباه باشه یا این صفحه جابجا شده باشه.",
    home: "بازگشت به خانه",
    products: "مشاهده محصولات",
  },
  en: {
    code: "404",
    title: "This line is disconnected",
    desc: "The page you're looking for doesn't exist. The address may be wrong, or this page has moved.",
    home: "Back to Home",
    products: "View Products",
  },
  ar: {
    code: "٤٠٤",
    title: "هذا المسار مقطوع",
    desc: "الصفحة التي تبحث عنها غير موجودة. قد يكون العنوان خاطئاً أو تم نقل الصفحة.",
    home: "العودة للرئيسية",
    products: "عرض المنتجات",
  },
};

export default function NotFound() {
  const { lang } = useLanguage();
  const t = TEXT[lang as Lang] ?? TEXT.fa;
  const isRTL = lang === "fa" || lang === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center text-white px-6"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, #1a0d00 0%, #050e1f 55%, #050810 100%)" }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-600/6 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative max-w-lg mx-auto text-center space-y-8">

        {/* Cut cable illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2"
        >
          <motion.div
            animate={{ x: [0, -4, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-500"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"
          />
          <span className="text-gray-700 text-2xl px-1">⚡</span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"
          />
          <motion.div
            animate={{ x: [0, 4, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-1.5 rounded-full bg-gradient-to-l from-orange-500/20 to-orange-500"
          />
        </motion.div>

        {/* Code */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-8xl md:text-9xl font-black tracking-tight"
        >
          <span className="bg-gradient-to-br from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
            {t.code}
          </span>
        </motion.h1>

        {/* Title + desc */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">{t.title}</h2>
          <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">{t.desc}</p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600
              hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3
              rounded-xl transition-all shadow-lg shadow-orange-500/20"
          >
            <Home className="w-4 h-4" />
            {t.home}
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 bg-white/[0.04] border border-white/10
              hover:bg-white/[0.08] text-gray-300 hover:text-white font-semibold px-6 py-3
              rounded-xl transition-all"
          >
            <Cable className="w-4 h-4" />
            {t.products}
            <ArrowIcon className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
