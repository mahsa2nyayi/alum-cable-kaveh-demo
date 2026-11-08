"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, RotateCcw, AlertTriangle } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

type Lang = "fa" | "en" | "ar";

const TEXT: Record<Lang, {
  code: string; title: string; desc: string;
  retry: string; home: string;
}> = {
  fa: {
    code: "۵۰۰",
    title: "اتصال قطع شد",
    desc: "یه خطای غیرمنتظره رخ داد. تیم فنی ما در جریان قرار گرفت. لطفاً دوباره تلاش کنید.",
    retry: "تلاش دوباره",
    home: "بازگشت به خانه",
  },
  en: {
    code: "500",
    title: "Connection interrupted",
    desc: "An unexpected error occurred. Our technical team has been notified. Please try again.",
    retry: "Try Again",
    home: "Back to Home",
  },
  ar: {
    code: "٥٠٠",
    title: "انقطع الاتصال",
    desc: "حدث خطأ غير متوقع. تم إخطار فريقنا الفني. يرجى المحاولة مرة أخرى.",
    retry: "إعادة المحاولة",
    home: "العودة للرئيسية",
  },
};

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang } = useLanguage();
  const t = TEXT[lang as Lang] ?? TEXT.fa;
  const isRTL = lang === "fa" || lang === "ar";

  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center text-white px-6"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, #1a0a0a 0%, #050e1f 55%, #050810 100%)" }}
    >
      {/* Ambient — red-tinted for error state */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/6 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative max-w-lg mx-auto text-center space-y-8">

        {/* Spark/short-circuit icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px 0px rgba(239,68,68,0.3)",
                "0 0 40px 8px rgba(239,68,68,0.15)",
                "0 0 20px 0px rgba(239,68,68,0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30
              flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            >
              <AlertTriangle className="w-9 h-9 text-red-400" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Code */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-7xl md:text-8xl font-black tracking-tight"
        >
          <span className="bg-gradient-to-br from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            {t.code}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">{t.title}</h2>
          <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">{t.desc}</p>
          {error?.digest && (
            <p className="text-xs text-gray-700 font-mono pt-1">ref: {error.digest}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
        >
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600
              hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3
              rounded-xl transition-all shadow-lg shadow-orange-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            {t.retry}
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white/[0.04] border border-white/10
              hover:bg-white/[0.08] text-gray-300 hover:text-white font-semibold px-6 py-3
              rounded-xl transition-all"
          >
            <Home className="w-4 h-4" />
            {t.home}
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
