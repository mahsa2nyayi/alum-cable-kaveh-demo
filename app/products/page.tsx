"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Zap, Wind, Activity, ChevronDown, Search,
  ArrowLeft, ArrowRight, Cable, Thermometer,
  Layers, AlertCircle, SlidersHorizontal,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// ── Types ─────────────────────────────────────────────────────────────────────
type Lang = "FA" | "EN" | "AR";
type FamilyType = "LOW_VOLTAGE_POWER" | "AERIAL" | "FLEXIBLE";

interface Translation { language: Lang; name: string; features: string; usage: string; }
interface FamilyTranslation { language: Lang; name: string; }

interface Product {
  id: number;
  abbreviation: string;
  standard: string;
  ratedVoltage: string;
  maxOperatingTemp: string;
  conductorMaterial: "COPPER" | "ALUMINUM";
  conductorClasses: string[];
  minSection: number;
  maxSection: number;
  configurations: string[];
  translations: Translation[];
}

interface Family {
  id: number;
  type: FamilyType;
  translations: FamilyTranslation[];
  products: Product[];
}

// ── Static texts ──────────────────────────────────────────────────────────────
const UI: Record<Lang, Record<string, string>> = {
  FA: {
    pageTitle: "محصولات", pageSubtitle: "کابل‌های صنعتی با استاندارد جهانی",
    search: "جستجو در محصولات...", noResult: "محصولی یافت نشد",
    loading: "در حال بارگذاری...", items: "نوع",
    voltage: "ولتاژ", temp: "دما", section: "سایز",
    details: "جزئیات کامل", viewProduct: "مشاهده",
    copper: "مسی", aluminum: "آلومینیومی",
  },
  EN: {
    pageTitle: "Products", pageSubtitle: "Industrial cables meeting international standards",
    search: "Search products...", noResult: "No products found",
    loading: "Loading...", items: "types",
    voltage: "Voltage", temp: "Temp", section: "Section",
    details: "Full Details", viewProduct: "View",
    copper: "Copper", aluminum: "Aluminum",
  },
  AR: {
    pageTitle: "المنتجات", pageSubtitle: "كابلات صناعية وفق المعايير الدولية",
    search: "البحث في المنتجات...", noResult: "لا توجد منتجات",
    loading: "جار التحميل...", items: "أنواع",
    voltage: "الجهد", temp: "الحرارة", section: "المقطع",
    details: "التفاصيل الكاملة", viewProduct: "عرض",
    copper: "نحاسي", aluminum: "ألومنيوم",
  },
};

const FAMILY_META: Record<FamilyType, {
  Icon: React.ElementType; id: string; color: string; bg: string;
  border: string; tag: string; glow: string;
}> = {
  LOW_VOLTAGE_POWER: {
    Icon: Zap, id:"lowVoltage", color: "text-orange-400",
    bg: "bg-orange-500/10", border: "border-orange-500/25",
    tag: "bg-orange-500/10 text-orange-300 border-orange-500/25",
    glow: "hover:shadow-orange-500/10",
  },
  AERIAL: {
    Icon: Wind, id:"aerial", color: "text-sky-400",
    bg: "bg-sky-500/10", border: "border-sky-500/25",
    tag: "bg-sky-500/10 text-sky-300 border-sky-500/25",
    glow: "hover:shadow-sky-500/10",
  },
  FLEXIBLE: {
    Icon: Activity, id:"flexible", color: "text-emerald-400",
    bg: "bg-emerald-500/10", border: "border-emerald-500/25",
    tag: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    glow: "hover:shadow-emerald-500/10",
  },
};

const CFG_LABEL: Record<Lang, Record<string, string>> = {
  FA: { SINGLE_CORE: "تک‌رشته", MULTI_CORE_ROUND: "چندرشته گرد", MULTI_CORE_SECTOR: "سکتور" },
  EN: { SINGLE_CORE: "Single", MULTI_CORE_ROUND: "Multi Round", MULTI_CORE_SECTOR: "Sector" },
  AR: { SINGLE_CORE: "أحادي", MULTI_CORE_ROUND: "متعدد دائري", MULTI_CORE_SECTOR: "قطاعي" },
};

// ── ProductCard ───────────────────────────────────────────────────────────────
function ProductCard({ product, lang, t, type }: {
  product: Product; lang: Lang;
  t: Record<string, string>; type: FamilyType;
}) {
  const m = FAMILY_META[type];
  const tr = product.translations.find((x) => x.language === lang) ?? product.translations[0];
  const ArrowIcon = lang === "FA" || lang === "AR" ? ArrowLeft : ArrowRight;

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={`group relative h-full bg-white/[0.03] border ${m.border} rounded-2xl p-5
          cursor-pointer transition-all duration-300 hover:bg-white/[0.06]
          hover:shadow-lg ${m.glow}`}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span className={`font-mono font-bold text-base tracking-widest ${m.color}`}>
            {product.abbreviation}
          </span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${m.tag}`} dir="ltr">
            {product.ratedVoltage}
          </span>
        </div>

        {/* Name */}
        {tr && (
          <p className="text-sm text-gray-300 leading-snug mb-4 line-clamp-2 min-h-[2.5rem]">
            {tr.name}
          </p>
        )}

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Thermometer className="w-3 h-3 shrink-0" />
            <span>{product.maxOperatingTemp}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500" dir="ltr">
            <Layers className="w-3 h-3 shrink-0" />
            <span>{product.minSection}–{product.maxSection} mm²</span>
          </div>
          <div className="col-span-2 flex items-center gap-1.5 text-gray-600 truncate">
            <SlidersHorizontal className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {product.conductorMaterial === "COPPER" ? t.copper : t.aluminum}
              {" · "}
              {product.conductorClasses.map((c) => `cl.${c}`).join(", ")}
            </span>
          </div>
        </div>

        {/* Configs */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.configurations.map((c) => (
            <span key={c} className={`text-[10px] px-1.5 py-0.5 rounded border ${m.tag}`}>
              {CFG_LABEL[lang][c] ?? c}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className={`flex items-center gap-1 text-xs font-semibold ${m.color}
          opacity-0 group-hover:opacity-100 transition-all duration-200 mt-auto`}>
          {t.details} <ArrowIcon className="w-3.5 h-3.5" />
        </div>
      </motion.div>
    </Link>
  );
}

// ── FamilySection ─────────────────────────────────────────────────────────────
function FamilySection({ family, lang, t, query }: {
  family: Family; lang: Lang;
  t: Record<string, string>; query: string;
}) {
  const [open, setOpen] = useState(true);
  const m = FAMILY_META[family.type];
  const { Icon } = m;

  const familyName = family.translations.find((x) => x.language === lang)?.name ?? family.type;

  const filtered = useMemo(() => {
    if (!query.trim()) return family.products;
    const q = query.toLowerCase();
    return family.products.filter(
      (p) =>
        p.abbreviation.toLowerCase().includes(q) ||
        p.translations.some((tr) =>
          tr.name.toLowerCase().includes(q) ||
          tr.usage?.toLowerCase().includes(q)
        )
    );
  }, [family.products, query]);

  if (filtered.length === 0) return null;

  return (
    <section id={`${m.id}`} className="mb-10">
      {/* Family header - clickable accordion toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 mb-5 group"
      >
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center
          ${m.bg} border ${m.border} transition-all group-hover:scale-105`}>
          <Icon className={`w-5 h-5 ${m.color}`} />
        </div>

        {/* Title + count */}
        <div className="relative">
          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
            {familyName}
          </h2>
          <p className={`text-justify text-sm ${m.color}`}>
            {filtered.length} {t.items}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown className={`w-5 h-5 text-gray-500 group-hover:text-gray-300
          transition-all duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Divider */}
      <div className={`h-px w-full mb-6 ${m.bg} opacity-60`} />

      {/* Products grid */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-2">
              {filtered.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                >
                  <ProductCard
                    product={product}
                    lang={lang}
                    t={t}
                    type={family.type}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { lang } = useLanguage();
  const apiLang: Lang = lang === "fa" ? "FA" : lang === "ar" ? "AR" : "EN";
  const isRTL = lang === "fa" || lang === "ar";
  const t = UI[apiLang];

  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/products/families")
      .then((r) => { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
      .then((data) => { setFamilies(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const anyResults = families.some((f) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return f.products.some(
      (p) =>
        p.abbreviation.toLowerCase().includes(q) ||
        p.translations.some((tr) => tr.name.toLowerCase().includes(q))
    );
  });

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-b from-[#051123] to-[#0a1a2f] text-white"
    >
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-16 px-6">
        {/* BG decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
            bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-px h-full
            bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center space-y-5">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/60" />
            <Cable className="w-4 h-4 text-orange-400" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/60" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              {t.pageTitle}
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">{t.pageSubtitle}</p>

          {/* Family summary badges */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
            >
              {families.map((f) => {
                const m = FAMILY_META[f.type];
                const { Icon } = m;
                const name = f.translations.find((x) => x.language === apiLang)?.name ?? f.type;
                return (
                  <div key={f.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${m.tag}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{name}</span>
                    <span className="opacity-60">·</span>
                    <span>{f.products.length}</span>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-md mx-auto mt-2"
          >
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500
              pointer-events-none ${isRTL ? "right-4" : "left-4"}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              dir={isRTL ? "rtl" : "ltr"}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-sm
                text-white placeholder-gray-600 transition-all
                focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20
                ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"}`}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Products ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-32 text-gray-400">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            {t.loading}
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-32">
            <div className="flex items-center gap-3 text-red-400 bg-red-500/10
              border border-red-500/20 px-5 py-4 rounded-xl">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {families.map((family) => (
              <FamilySection
                key={family.id}
                family={family}
                lang={apiLang}
                t={t}
                query={query}
              />
            ))}

            {!anyResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 text-gray-500 text-lg"
              >
                {t.noResult}
              </motion.div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
