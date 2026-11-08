"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft, FileText, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import CableCanvas from "./CableCanvas";
import About from "./about";

const translations = {
  fa: {
    kicker: "تولیدکننده کابل آلومینیومی و مسی",
    title: "آلوم کابل کاوه",
    subtitle: "پایداری جریان، میراث کیفیت ماست",
    button: "محصولات ما",
    quote: "درخواست پیش‌فاکتور",
    stats: [
      { value: "+۲۰۰", label: "پروژه ملی" },
      { value: "ISO 9001 · 14001 · 45001", label: "گواهینامه‌ها" },
      { value: "IEC · INSO · EN", label: "استانداردها" },
    ],
  },
  en: {
    kicker: "Aluminum & copper cable manufacturer",
    title: "Alum Cable Kaveh",
    subtitle: "Reliable current, our mark of quality",
    button: "Our Products",
    quote: "Request a Quote",
    stats: [
      { value: "200+", label: "National projects" },
      { value: "ISO 9001 · 14001 · 45001", label: "Certifications" },
      { value: "IEC · INSO · EN", label: "Standards" },
    ],
  },
  ar: {
    kicker: "مصنّع كابلات الألمنيوم والنحاس",
    title: "ألوم كابل كاوه",
    subtitle: "التيار الموثوق، علامتنا للجودة",
    button: "منتجاتنا",
    quote: "طلب عرض سعر",
    stats: [
      { value: "+200", label: "مشروع وطني" },
      { value: "ISO 9001 · 14001 · 45001", label: "الشهادات" },
      { value: "IEC · INSO · EN", label: "المعايير" },
    ],
  },
};

export default function Hero() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const rtl = lang !== "en";
  const sectionRef = useRef<HTMLElement>(null);
  const Arrow = rtl ? ArrowLeft : ArrowRight;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);

  return (
    <section ref={sectionRef} className="relative">
      <motion.section
        style={{ opacity, scale }}
        dir={rtl ? "rtl" : "ltr"}
        className="sticky top-0 h-screen overflow-hidden bg-[#050e1f] text-white"
      >
        {/* 3D cable animation (decorative) */}
        <CableCanvas mirror={rtl} />

        {/* Readability scrim: darkens the side that carries the text */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${
            rtl ? "bg-gradient-to-l" : "bg-gradient-to-r"
          } from-[#050e1f] via-[#050e1f]/70 to-transparent md:via-[#050e1f]/55 md:to-transparent`}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050e1f] to-transparent"
        />
        {/* subtle grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at 30% 40%, #000 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 30% 40%, #000 20%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pb-28 pt-28 md:pb-16">
          <div className="max-w-xl md:max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-orange-300 backdrop-blur-sm md:text-sm"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
              {t.kicker}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="mt-6 bg-gradient-to-br from-white via-white to-orange-200 bg-clip-text text-5xl font-black leading-[1.15] text-transparent md:text-7xl"
            >
              {t.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-5 max-w-lg text-lg text-slate-300 md:text-2xl"
            >
              {t.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
              >
                {t.button}
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </a>
              <Link
                href="/contactUs#contactForm"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3 font-medium text-white backdrop-blur-md transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <FileText className="h-4 w-4" />
                {t.quote}
              </Link>
            </motion.div>
          </div>

          {/* Key facts */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="absolute inset-x-6 bottom-8 hidden gap-10 border-t border-white/10 pt-5 md:flex"
          >
            {t.stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs uppercase tracking-wider text-slate-400">{s.label}</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{s.value}</dd>
              </div>
            ))}
          </motion.dl>

          <ChevronDown
            aria-hidden="true"
            className="absolute bottom-6 left-1/2 h-6 w-6 -translate-x-1/2 animate-bounce text-white/50 md:hidden"
          />
        </div>
      </motion.section>

      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-b from-transparent to-gray-50" />

      {/* About section */}
      <About />
    </section>
  );
}
