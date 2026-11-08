"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { useRef } from "react";
import Product from "./Product";

export default function About() {
  const { lang } = useLanguage();

  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);

  const texts = {
    fa: {
      title: "درباره آلوم کابل کاوه",
      body: "شرکت آلوم کابل کاوه با بهره‌گیری از فناوری‌های نوین و نیروی انسانی متخصص، تولیدکننده کابل‌های آلومینیومی و مسی با بالاترین استانداردهای جهانی است. تمرکز ما بر کیفیت، اعتماد و پایداری انرژی است.",
      button: "بیشتر بدانید",
    },
    en: {
      title: "About Alum Cable Kaveh",
      body: "Alum Cable Kaveh, powered by advanced technology and skilled experts, manufactures high-quality aluminum and copper cables that meet international standards. Our focus is on quality, trust, and energy sustainability.",
      button: "Learn more",
    },
    ar: {
      title: "حول شركة ألوم كابل كاوه",
      body: "تعمل شركة ألوم كابل كاوه بتقنيات متقدمة وكوادر مؤهلة لتصنيع كابلات الألمنيوم والنحاس وفق أعلى المعايير الدولية. نركز على الجودة والثقة واستدامة الطاقة.",
      button: "اعرف أكثر",
    },
  };

  return (
    <section className="relative" ref={ref}>
      <motion.section
        style={{ opacity, scale }}
        className="sticky top-0 flex flex-col md:flex-row h-screen items-center justify-between py-24 px-8 md:px-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/alum-bg.jpg"
            alt="factory background"
            fill
            className="object-cover"
          />
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative z-10 md:w-1/2 space-y-6 text-justify"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-orange-400"
            dir={lang === "ar" ? "rtl" : "auto"}
          >
            {texts[lang].title}
          </h2>
          <p
            className="text-lg text-gray-300 leading-relaxed"
            dir={lang === "ar" ? "rtl" : "auto"}
          >
            {texts[lang].body}
          </p>
          <Link
            href="/about"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-all duration-300"
          >
            {texts[lang].button}
          </Link>
        </motion.div>

        {/* Picture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative mx-2 z-10 md:w-1/2 mt-10 md:mt-0"
        >
          <Image
            src="/about-us.jpg"
            alt="About Alum Cable"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
          />
        </motion.div>
      </motion.section>
      {/* Products section */}
      <Product />
    </section>
  );
}
