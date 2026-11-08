"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  BookOpen,
  Table2,
  GitCompare,
  ChevronRight,
  ArrowUp,
  Award,
  Globe,
  Zap,
  Shield,
  Layers,
  Info,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Search,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  STANDARD_SECTIONS,
  CABLE_COMPARE_TABLE,
  CURRENT_CAPACITY_TABLE,
  type Lang,
  type TableData,
  type StandardSection,
} from "./data";

// ── Org icon map ──────────────────────────────────────────────────────────────
const ORG_ICONS: Record<string, React.ElementType> = {
  IEC: Globe,
  INSO: Award,
  DIN: Shield,
  EN: Layers,
  ASTM: Zap,
};

// ── UI strings ────────────────────────────────────────────────────────────────
const UI: Record<Lang, Record<string, string>> = {
  FA: {
    pageTitle: "اطلاعات فنی سیم و کابل",
    pageSubtitle:
      "مرجع جامع استانداردهای بین‌المللی، کدگذاری و مقایسه فنی کابل‌های برق",
    readTime: "۲۵ دقیقه مطالعه",
    toc: "فهرست مطالب",
    backToTop: "بازگشت به بالا",
    standards: "استانداردها",
    tables: "جداول فنی",
    cables: "مقایسه کابل‌ها",
    currentCap: "ظرفیت جریان",
    search: "جستجو در استانداردها...",
    noResult: "موردی یافت نشد",
    highlightsTitle: "نکات کلیدی",
    standardsCount: "استاندارد",
    tablesCount: "جدول فنی",
    note: "توجه",
    appliesTo: "کاربرد در",
    showTable: "نمایش جدول",
    hideTable: "پنهان کردن",
    fullCompare: "مقایسه جامع کابل‌ها",
    fullCompareDesc:
      "مقایسه کامل ۱۸ نوع کابل فشار ضعیف بر اساس هادی، عایق، زره و دما",
    currentCapTitle: "جدول ظرفیت جریان",
    currentCapDesc: "ظرفیت جریان مجاز کابل NYY در شرایط مختلف نصب",
  },
  EN: {
    pageTitle: "Cable Technical Reference",
    pageSubtitle:
      "Comprehensive guide to international standards, designation codes and technical comparisons",
    readTime: "25 min read",
    toc: "Table of Contents",
    backToTop: "Back to Top",
    standards: "Standards",
    tables: "Technical Tables",
    cables: "Cable Comparison",
    currentCap: "Current Capacity",
    search: "Search standards...",
    noResult: "No results found",
    highlightsTitle: "Key Highlights",
    standardsCount: "standards",
    tablesCount: "technical tables",
    note: "Note",
    appliesTo: "Applies to",
    showTable: "Show Table",
    hideTable: "Hide Table",
    fullCompare: "Full Cable Comparison",
    fullCompareDesc:
      "Complete comparison of 18 LV cable types by conductor, insulation, armour and temperature",
    currentCapTitle: "Current Capacity Table",
    currentCapDesc:
      "Allowable current capacity for NYY cable under various installation conditions",
  },
  AR: {
    pageTitle: "المرجع الفني للكابلات",
    pageSubtitle: "دليل شامل للمعايير الدولية ورموز التسمية والمقارنات الفنية",
    readTime: "٢٥ دقيقة قراءة",
    toc: "جدول المحتويات",
    backToTop: "العودة للأعلى",
    standards: "المعايير",
    tables: "الجداول الفنية",
    cables: "مقارنة الكابلات",
    currentCap: "سعة التيار",
    search: "بحث في المعايير...",
    noResult: "لا توجد نتائج",
    highlightsTitle: "النقاط الرئيسية",
    standardsCount: "معيار",
    tablesCount: "جداول فنية",
    note: "ملاحظة",
    appliesTo: "ينطبق على",
    showTable: "عرض الجدول",
    hideTable: "إخفاء الجدول",
    fullCompare: "مقارنة شاملة للكابلات",
    fullCompareDesc:
      "مقارنة كاملة لـ 18 نوع كابل JM حسب الموصل والعزل والدرع ودرجة الحرارة",
    currentCapTitle: "جدول سعة التيار",
    currentCapDesc: "سعة التيار المسموح لكابل NYY في ظروف التركيب المختلفة",
  },
};

// ── DataTable component ───────────────────────────────────────────────────────
function DataTable({
  table,
  lang,
  accent,
  border,
}: {
  table: TableData;
  lang: Lang;
  accent: string;
  border: string;
}) {
  const headers = table.headers[lang];
  const caption = table.caption[lang];
  const note = table.note?.[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 rounded-2xl border ${border} overflow-hidden`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-max">
          <caption
            className={`text-xs px-4 pt-3 pb-2 text-justify italic opacity-70 ${accent.replace("bg-", "text-").replace("/10", "")}`}
          >
            {caption}
          </caption>
          <thead>
            <tr className="bg-white/5 border-b border-white/8">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-justify text-xs font-semibold
                  text-gray-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr
                key={ri}
                className={`border-b border-white/5 transition-colors
                ${ri % 2 === 0 ? "bg-white/[0.015]" : ""}
                hover:bg-orange-500/5`}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-4 py-2.5 text-gray-300 whitespace-nowrap
                    ${ci === 0 ? `font-mono font-bold ${accent.replace("bg-", "text-").replace("/10", "")}` : ""}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && (
        <div
          className={`px-4 py-3 border-t border-white/5 flex items-start gap-2
          text-xs text-gray-500 ${accent} bg-opacity-50`}
        >
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {note}
        </div>
      )}
    </motion.div>
  );
}

// ── StandardCard ──────────────────────────────────────────────────────────────
function StandardCard({
  std,
  lang,
  section,
}: {
  std: (typeof STANDARD_SECTIONS)[0]["standards"][0];
  lang: Lang;
  section: StandardSection;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className={`border ${section.border} rounded-xl overflow-hidden
        transition-colors hover:bg-white/[0.03]`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <span
          className={`font-mono text-xs font-bold px-2 py-1 rounded-lg border
          ${section.tag} shrink-0 mt-0.5`}
        >
          {std.number}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-snug">
            {std.title[lang]}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 shrink-0 transition-transform mt-0.5
          ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                {std.scope[lang]}
              </p>
              {std.appliesTo.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {std.appliesTo.map((cable) => (
                    <span
                      key={cable}
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${section.tag}`}
                    >
                      {cable}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── OrgSection ────────────────────────────────────────────────────────────────
function OrgSection({
  section,
  lang,
  t,
}: {
  section: StandardSection;
  lang: Lang;
  t: Record<string, string>;
}) {
  const [activeTab, setActiveTab] = useState<"standards" | "tables">(
    "standards",
  );
  const [search, setSearch] = useState("");
  const OrgIcon = ORG_ICONS[section.org] ?? Globe;

  const filteredStandards = section.standards.filter(
    (s) =>
      !search ||
      s.number.toLowerCase().includes(search.toLowerCase()) ||
      s.title[lang].toLowerCase().includes(search.toLowerCase()) ||
      s.appliesTo.some((a) => a.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      id={section.id}
      className="scroll-mt-24"
    >
      {/* Org header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center
          ${section.accent} border ${section.border} shrink-0`}
        >
          <OrgIcon className={`w-7 h-7 ${section.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              {section.title[lang]}
            </h2>
            <span
              className={`text-xs px-2.5 py-1 rounded-full border font-mono ${section.tag}`}
            >
              {section.org}
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {section.description[lang]}
          </p>
        </div>
      </div>

      {/* Highlights */}
      <div
        className={`${section.accent} border ${section.border} rounded-2xl p-4 mb-6`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-widest mb-3 ${section.color}`}
        >
          <Sparkles className="w-3.5 h-3.5 inline me-1.5" />
          {t.highlightsTitle}
        </p>
        <div className="flex flex-wrap gap-3">
          {section.highlights[lang].map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-gray-300"
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${section.color}`} />
              {h}
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div
          className={`${section.accent} border ${section.border} rounded-xl p-3 text-center`}
        >
          <p className={`text-2xl font-black ${section.color}`}>
            {section.standards.length}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{t.standardsCount}</p>
        </div>
        <div
          className={`${section.accent} border ${section.border} rounded-xl p-3 text-center`}
        >
          <p className={`text-2xl font-black ${section.color}`}>
            {section.tables.length}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{t.tablesCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-white/8 pb-0">
        {(["standards", "tables"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all
              border-b-2 -mb-px
              ${
                activeTab === tab
                  ? `${section.color} border-current bg-white/5`
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
          >
            {tab === "standards" ? (
              <>
                <BookOpen className="w-3.5 h-3.5 inline me-1.5" />
                {t.standards}
              </>
            ) : (
              <>
                <Table2 className="w-3.5 h-3.5 inline me-1.5" />
                {t.tables}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "standards" && (
          <motion.div
            key="standards"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                className="w-full bg-white/5 border border-white/10 rounded-xl
                  pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600
                  focus:outline-none focus:border-white/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              {filteredStandards.length > 0 ? (
                filteredStandards.map((std) => (
                  <StandardCard
                    key={std.number}
                    std={std}
                    lang={lang}
                    section={section}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">{t.noResult}</p>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "tables" && (
          <motion.div
            key="tables"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {section.tables.map((table) => (
              <DataTable
                key={table.id}
                table={table}
                lang={lang}
                accent={section.accent}
                border={section.border}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TechnicalPageClient() {
  const { lang } = useLanguage();
  const apiLang: Lang = lang === "fa" ? "FA" : lang === "ar" ? "AR" : "EN";
  const isRTL = lang === "fa" || lang === "ar";
  const t = UI[apiLang];

  const [activeSection, setActiveSection] = useState(STANDARD_SECTIONS[0].id);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    [
      ...STANDARD_SECTIONS.map((s) => s.id),
      "full-compare",
      "current-capacity",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => setShowTopBtn(window.scrollY > 500);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollTo(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // All TOC items
  const tocItems = [
    ...STANDARD_SECTIONS.map((s) => ({
      id: s.id,
      label: s.title[apiLang],
      icon: ORG_ICONS[s.org] ?? Globe,
      color: s.color,
      count: s.standards.length,
    })),
    {
      id: "full-compare",
      label: t.fullCompare,
      icon: GitCompare,
      color: "text-violet-400",
      count: null,
    },
    {
      id: "current-capacity",
      label: t.currentCapTitle,
      icon: Zap,
      color: "text-amber-400",
      count: null,
    },
  ];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#050e1f] text-white"
    >
      {/* Progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: isRTL ? "right" : "left" }}
        className="fixed top-0 left-0 right-0 h-0.5 z-50
          bg-gradient-to-r from-sky-500 via-orange-500 to-emerald-500"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/8 rounded-full blur-3xl
            animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute top-10 right-1/4 w-80 h-80 bg-orange-500/8 rounded-full blur-3xl
            animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-64 h-64 bg-emerald-500/6 rounded-full blur-3xl
            animate-pulse"
            style={{ animationDuration: "5s", animationDelay: "1s" }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Dots */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-gradient-to-r from-sky-500/15 to-orange-500/15
                border border-white/10 text-sm text-gray-300"
            >
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>{t.readTime}</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-400">
                {STANDARD_SECTIONS.reduce(
                  (s, sec) => s + sec.standards.length,
                  0,
                )}
                + {t.standardsCount}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              <span
                className="bg-gradient-to-br from-white via-gray-200 to-gray-500
                bg-clip-text text-transparent"
              >
                {t.pageTitle}
              </span>
            </h1>

            <p className="text-gray-400 text-xl max-w-3xl leading-relaxed">
              {t.pageSubtitle}
            </p>

            {/* Org badges */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              {STANDARD_SECTIONS.map((sec) => {
                const Icon = ORG_ICONS[sec.org] ?? Globe;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border
                      ${sec.tag} transition-all hover:scale-105 text-sm font-semibold`}
                  >
                    <Icon className={`w-4 h-4 ${sec.color}`} />
                    {sec.org}
                    <span className="opacity-60 text-xs">
                      {sec.standards.length}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="flex gap-10 items-start">
          {/* ── TOC Sidebar ── */}
          <aside className="hidden xl:block w-60 shrink-0 sticky top-24 self-start">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-3 font-semibold px-2">
              {t.toc}
            </p>
            <nav className="space-y-1">
              {tocItems.map(({ id, label, icon: Icon, color, count }) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                      text-sm transition-all duration-200 text-left group
                      ${
                        isActive
                          ? "bg-white/8 text-white border border-white/10"
                          : "text-gray-600 hover:text-gray-300 hover:bg-white/4"
                      }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${isActive ? color : ""}`}
                    />
                    <span className="flex-1 truncate text-xs font-medium">
                      {label}
                    </span>
                    {count !== null && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full
                        ${isActive ? "bg-white/15 text-white" : "bg-white/5 text-gray-600"}`}
                      >
                        {count}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3 h-3 shrink-0" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── Content ── */}
          <main className="flex-1 min-w-0 space-y-20">
            {/* Standard sections */}
            {STANDARD_SECTIONS.map((section, idx) => (
              <div key={section.id}>
                <OrgSection section={section} lang={apiLang} t={t} />
                {idx < STANDARD_SECTIONS.length - 1 && (
                  <div className="mt-20 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                )}
              </div>
            ))}

            {/* Full comparison divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

            {/* Full comparison table */}
            <motion.section
              id="full-compare"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-24"
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center
                  bg-violet-500/10 border border-violet-500/25 shrink-0"
                >
                  <GitCompare className="w-7 h-7 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
                    {t.fullCompare}
                  </h2>
                  <p className="text-gray-400 text-sm">{t.fullCompareDesc}</p>
                </div>
              </div>
              <DataTable
                table={CABLE_COMPARE_TABLE}
                lang={apiLang}
                accent="bg-violet-500/10"
                border="border-violet-500/25"
              />
            </motion.section>

            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            {/* Current capacity table */}
            <motion.section
              id="current-capacity"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-24"
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center
                  bg-amber-500/10 border border-amber-500/25 shrink-0"
                >
                  <Zap className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
                    {t.currentCapTitle}
                  </h2>
                  <p className="text-gray-400 text-sm">{t.currentCapDesc}</p>
                </div>
              </div>
              <DataTable
                table={CURRENT_CAPACITY_TABLE}
                lang={apiLang}
                accent="bg-amber-500/10"
                border="border-amber-500/25"
              />
            </motion.section>
          </main>
        </div>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 end-8 w-11 h-11 rounded-xl
              bg-gradient-to-br from-sky-500/20 to-orange-500/20
              border border-white/15 flex items-center justify-center
              text-white hover:scale-110 transition-transform z-40
              backdrop-blur-sm shadow-xl"
            title={t.backToTop}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
