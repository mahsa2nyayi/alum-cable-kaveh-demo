"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { ARTICLES, DEMO_NOTE } from "@/lib/news";

const TITLE = { fa: "تازه‌های صنعت برق", en: "Industry Insights & News", ar: "أحدث أخبار الطاقة" };
const MORE = { fa: "مطالعه کامل", en: "Read full article", ar: "اقرأ المزيد" };

export default function NewsPage() {
  const { lang } = useLanguage();
  const rtl = lang !== "en";

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-gradient-to-b from-[#051123] to-[#0a1a2f] px-6 pb-24 pt-32 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black md:text-5xl">{TITLE[lang]}</h1>
        <p className="mt-2 text-sm text-orange-300">{DEMO_NOTE[lang]}</p>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {ARTICLES[lang].map((a) => (
            <article key={a.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10">
              <div className="relative h-48 w-full">
                <Image src={a.img} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="p-6">
                <h2 className="mb-2 text-xl font-semibold">{a.title}</h2>
                <p className="mb-4 text-sm text-gray-300">{a.excerpt}</p>
                <Link href={`/news/${a.id}`} className="font-medium text-orange-400 hover:underline">
                  {MORE[lang]}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
