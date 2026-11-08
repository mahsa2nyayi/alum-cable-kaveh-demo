"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { ARTICLES } from "@/lib/news";

const articles = ARTICLES;

export default function NewsSection() {
  const { lang } = useLanguage();

  const list = articles[lang];

  const cardVariant: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-600 via-gray-900 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            {lang === "fa"
              ? "تازه‌های صنعت برق"
              : lang === "ar"
              ? "أحدث أخبار الطاقة"
              : "Industry Insights & News"}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mt-3">
            {lang === "fa"
              ? "آخرین تحلیل‌ها، استانداردها و گزارش‌های فنی حوزه سیم و کابل"
              : lang === "ar"
              ? "أحدث التحليلات والمعايير والتقارير الفنية في مجال الأسلاك والكابلات"
              : "Latest analyses, standards updates and technical reports in the wire & cable industry"}
          </p>
        </motion.div>

        {/* desktop grid / mobile horizontal scroll */}
        <div className="mb-6">
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {list.map((a, i) => (
              <motion.article
                key={a.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariant}
                className="bg-white/5 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={a.img}
                    alt={a.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6" dir={lang === "ar" ? "rtl" : "auto"}>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {a.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">{a.excerpt}</p>
                  <Link
                    href={`/news/${a.id}`}
                    className="inline-block text-orange-400 font-medium hover:underline"
                  >
                    {lang === "fa"
                      ? "مطالعه کامل"
                      : lang === "ar"
                      ? "اقرأ المزيد"
                      : "Read full"}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* mobile: horizontal snap scroll */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4 snap-x snap-mandatory flex gap-4">
            {list.map((a, i) => (
              <motion.article
                key={a.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariant}
                className="snap-center max-w-[100%] bg-white/5 rounded-2xl overflow-hidden shadow-md flex-shrink-0"
              >
                <div className="relative w-full h-44">
                  <Image
                    src={a.img}
                    alt={a.title}
                    fill
                    className="max-w-[100%] max-h-[100%]"
                  />
                </div>
                <div className="max-w-[80%] p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {a.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">{a.excerpt}</p>
                  <Link
                    href={`/news/${a.id}`}
                    className="inline-block text-orange-400 font-medium hover:underline"
                  >
                    {lang === "fa"
                      ? "مطالعه کامل"
                      : lang === "ar"
                      ? "اقرأ المزيد"
                      : "Read full"}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/news"
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-full font-semibold shadow-lg transition"
          >
            {lang === "fa"
              ? "مشاهده همه مقالات"
              : lang === "ar"
              ? "عرض جميع المقالات"
              : "View All Articles"}
          </Link>
        </div>
      </div>
    </section>
  );
}
