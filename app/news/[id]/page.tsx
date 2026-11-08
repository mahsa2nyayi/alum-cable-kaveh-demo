"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { ARTICLES, DEMO_NOTE } from "@/lib/news";

const BACK = { fa: "بازگشت به اخبار", en: "Back to news", ar: "العودة إلى الأخبار" };

export default function ArticlePage() {
  const { lang } = useLanguage();
  const params = useParams<{ id: string }>();
  const article = ARTICLES[lang].find((a) => a.id === params.id);
  if (!article) notFound();

  const rtl = lang !== "en";
  const Back = rtl ? ArrowRight : ArrowLeft;

  return (
    <main dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-gradient-to-b from-[#051123] to-[#0a1a2f] px-6 pb-24 pt-32 text-white">
      <article className="mx-auto max-w-3xl">
        <Link href="/news" className="inline-flex items-center gap-2 text-sm text-orange-400 hover:underline">
          <Back className="h-4 w-4" /> {BACK[lang]}
        </Link>
        <h1 className="mt-6 text-3xl font-black leading-snug md:text-5xl">{article.title}</h1>
        <p className="mt-2 text-sm text-orange-300">{DEMO_NOTE[lang]}</p>
        <div className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl md:h-80">
          <Image src={article.img} alt="" fill sizes="768px" className="object-cover" priority />
        </div>
        <div className="mt-8 space-y-5 text-lg leading-8 text-gray-200">
          {article.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
