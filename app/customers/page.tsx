"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { Zap, Droplets, Building2, Truck, FlaskConical, MapPin, Search, Flame, Factory, GraduationCap, Landmark, Wheat } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

type Lang = "FA" | "EN" | "AR";
type Category = "all" | "electricity" | "water" | "oil" | "industry" | "other";

const UI: Record<Lang, Record<string, string>> = {
  FA: {
    eyebrow: "شبکه اعتماد",
    pageTitle: "مشتریانی که\nبه ما اعتماد کردند",
    pageSubtitle: "از صنعت نفت و پتروشیمی تا توزیع برق و زیرساخت — کابل‌های آلوم کاوه در قلب صنعت ایران",
    filterAll: "همه",
    filterElectricity: "توزیع برق",
    filterWater: "آب و فاضلاب",
    filterOil: "نفت و پتروشیمی",
    filterIndustry: "صنعت و معدن",
    filterOther: "سایر",
    search: "جستجو...",
    noResult: "موردی یافت نشد",
    s1val: "۲۰+", s1lab: "مشتری سازمانی",
    s2val: "۱۵+", s2lab: "استان تحت پوشش",
    s3val: "۱۵+", s3lab: "سال تجربه",
    s4val: "۱۰۰٪", s4lab: "استاندارد ملی",
  },
  EN: {
    eyebrow: "Trust Network",
    pageTitle: "Clients who\ntrust us",
    pageSubtitle: "From oil & petrochemical to power distribution and infrastructure — Alum Cable Kaveh at the heart of Iran's industry",
    filterAll: "All",
    filterElectricity: "Power Dist.",
    filterWater: "Water",
    filterOil: "Oil & Petrochem.",
    filterIndustry: "Industry",
    filterOther: "Other",
    search: "Search...",
    noResult: "No results found",
    s1val: "20+", s1lab: "Org. Clients",
    s2val: "15+", s2lab: "Provinces",
    s3val: "15+", s3lab: "Years Exp.",
    s4val: "100%", s4lab: "National Std.",
  },
  AR: {
    eyebrow: "شبكة الثقة",
    pageTitle: "عملاء يثقون\nبنا",
    pageSubtitle: "من النفط والبتروكيماويات إلى توزيع الكهرباء — كابلات آلوم كافيه في قلب صناعة إيران",
    filterAll: "الكل",
    filterElectricity: "توزيع الكهرباء",
    filterWater: "المياه",
    filterOil: "النفط والبتروكيماويات",
    filterIndustry: "الصناعة",
    filterOther: "أخرى",
    search: "بحث...",
    noResult: "لا توجد نتائج",
    s1val: "٢٠+", s1lab: "عميل مؤسسي",
    s2val: "١٥+", s2lab: "محافظة",
    s3val: "١٥+", s3lab: "سنة خبرة",
    s4val: "١٠٠٪", s4lab: "معيار وطني",
  },
};

interface Client {
  id: number;
  logo: string;
  name: Record<Lang, string>;
  province: Record<Lang, string>;
  category: Exclude<Category, "all">;
}

const CLIENTS: Client[] = [
  // ── توزیع برق ──────────────────────────────────────────────────────────────
  {
    id: 1, logo: "/image/Bargh.png", category: "electricity",
    name: { FA: "برق منطقه‌ای فارس", EN: "Fars Regional Power Co.", AR: "كهرباء منطقة فارس" },
    province: { FA: "فارس", EN: "Fars", AR: "فارس" },
  },
  {
    id: 2, logo: "/image/Bargh.png", category: "electricity",
    name: { FA: "توزیع نیروی برق کردستان", EN: "Kurdistan Power Distribution", AR: "توزيع كهرباء كردستان" },
    province: { FA: "کردستان", EN: "Kurdistan", AR: "كردستان" },
  },
  {
    id: 3, logo: "/image/Bargh.png", category: "electricity",
    name: { FA: "توزیع نیروی برق کرمانشاه", EN: "Kermanshah Power Distribution", AR: "توزيع كهرباء كرمانشاه" },
    province: { FA: "کرمانشاه", EN: "Kermanshah", AR: "كرمانشاه" },
  },
  {
    id: 4, logo: "/image/Bargh.png", category: "electricity",
    name: { FA: "توزیع نیروی برق خراسان رضوی", EN: "Khorasan Razavi Power Distribution", AR: "توزيع كهرباء خراسان رضوي" },
    province: { FA: "خراسان رضوی", EN: "Khorasan Razavi", AR: "خراسان رضوي" },
  },
  {
    id: 5, logo: "/image/Bargh.png", category: "electricity",
    name: { FA: "توزیع نیروی برق سیستان و بلوچستان", EN: "Sistan & Baluchestan Power Distribution", AR: "توزيع كهرباء سيستان وبلوچستان" },
    province: { FA: "سیستان و بلوچستان", EN: "Sistan & Baluchestan", AR: "سيستان وبلوچستان" },
  },
  {
    id: 6, logo: "/image/Bargh.png", category: "electricity",
    name: { FA: "توزیع نیروی برق لرستان", EN: "Lorestan Power Distribution", AR: "توزيع كهرباء لرستان" },
    province: { FA: "لرستان", EN: "Lorestan", AR: "لرستان" },
  },
  {
    id: 7, logo: "/image/Bargh.png", category: "electricity",
    name: { FA: "توزیع نیروی برق چهارمحال و بختیاری", EN: "Chaharmahal & Bakhtiari Power Distribution", AR: "توزيع كهرباء چهارمحال وبختياري" },
    province: { FA: "چهارمحال و بختیاری", EN: "Chaharmahal & Bakhtiari", AR: "چهارمحال وبختياري" },
  },
  {
    id: 8, logo: "/image/Bargh.png", category: "electricity",
    name: { FA: "توزیع نیروی برق گیلان", EN: "Gilan Power Distribution", AR: "توزيع كهرباء جيلان" },
    province: { FA: "گیلان", EN: "Gilan", AR: "جيلان" },
  },

  // ── آب و فاضلاب ────────────────────────────────────────────────────────────
  {
    id: 9, logo: "/image/AABB.png", category: "water",
    name: { FA: "آب و فاضلاب شهری استان کردستان", EN: "Kurdistan Urban Water & Wastewater", AR: "مياه وصرف صحي كردستان" },
    province: { FA: "کردستان", EN: "Kurdistan", AR: "كردستان" },
  },
  {
    id: 10, logo: "/image/kiish.png", category: "water",
    name: { FA: "آب و برق کیش", EN: "Kish Water & Power", AR: "مياه وكهرباء كيش" },
    province: { FA: "هرمزگان (کیش)", EN: "Hormozgan (Kish)", AR: "هرمزجان (كيش)" },
  },

  // ── نفت و پتروشیمی ─────────────────────────────────────────────────────────
  {
    id: 11, logo: "/image/Naft.png", category: "oil",
    name: { FA: "شرکت بهره‌برداری نفت و گاز گچساران", EN: "Gachsaran Oil & Gas Exploitation Co.", AR: "شركة استغلال النفط والغاز گچساران" },
    province: { FA: "کهگیلویه و بویراحمد", EN: "Kohgiluyeh & Boyer-Ahmad", AR: "كهكيلويه وبويراحمد" },
  },
  {
    id: 12, logo: "/image/Petroshimi.png", category: "oil",
    name: { FA: "پتروشیمی گچساران", EN: "Gachsaran Petrochemical", AR: "بتروكيماويات گچساران" },
    province: { FA: "کهگیلویه و بویراحمد", EN: "Kohgiluyeh & Boyer-Ahmad", AR: "كهكيلويه وبويراحمد" },
  },

  // ── صنعت و معدن ────────────────────────────────────────────────────────────
  {
    id: 13, logo: "/image/zobnavard.png", category: "industry",
    name: { FA: "مجتمع ذوب‌آهن و نورد کرمان", EN: "Kerman Steel Smelting & Rolling Complex", AR: "مجمع صهر الحديد والدرفلة كرمان" },
    province: { FA: "کرمان", EN: "Kerman", AR: "كرمان" },
  },
  {
    id: 14, logo: "/image/sormeco.png", category: "industry",
    name: { FA: "شرکت معدنی و فراوری سرمه فیروزآباد", EN: "Firoozabad Antimony Mining & Processing", AR: "شركة تعدين ومعالجة الأنتيمون فيروزآباد" },
    province: { FA: "فارس", EN: "Fars", AR: "فارس" },
  },
  {
    id: 15, logo: "/image/makran.png", category: "industry",
    name: { FA: "کشت و صنعت مکران", EN: "Makran Agriculture & Industry", AR: "الزراعة والصناعة مكران" },
    province: { FA: "سیستان و بلوچستان", EN: "Sistan & Baluchestan", AR: "سيستان وبلوچستان" },
  },

  // ── سایر ───────────────────────────────────────────────────────────────────
  {
    id: 16, logo: "/image/larestan.png", category: "other",
    name: { FA: "اداره کل راه و شهرسازی لارستان", EN: "Larestan Roads & Urban Development", AR: "طرق وتطوير حضري لارستان" },
    province: { FA: "فارس", EN: "Fars", AR: "فارس" },
  },
  {
    id: 17, logo: "/image/Rahdari.png", category: "other",
    name: { FA: "اداره کل راهداری و حمل‌ونقل سیستان و بلوچستان", EN: "Sistan & Baluchestan Roads & Transport", AR: "الطرق والنقل سيستان وبلوچستان" },
    province: { FA: "سیستان و بلوچستان", EN: "Sistan & Baluchestan", AR: "سيستان وبلوچستان" },
  },
  {
    id: 18, logo: "/image/birjandUni.png", category: "other",
    name: { FA: "دانشگاه علوم پزشکی بیرجند", EN: "Birjand University of Medical Sciences", AR: "جامعة العلوم الطبية بيرجند" },
    province: { FA: "خراسان جنوبی", EN: "South Khorasan", AR: "خراسان الجنوبية" },
  },
  {
    id: 19, logo: "/image/farhang.png", category: "other",
    name: { FA: "اداره کل میراث فرهنگی و گردشگری چابهار", EN: "Chabahar Cultural Heritage & Tourism", AR: "التراث الثقافي والسياحة چابهار" },
    province: { FA: "سیستان و بلوچستان", EN: "Sistan & Baluchestan", AR: "سيستان وبلوچستان" },
  },
  {
    id: 20, logo: "/image/web.png", category: "other",
    name: { FA: "های وب", EN: "HighWeb", AR: "هاي ويب" },
    province: { FA: "تهران", EN: "Tehran", AR: "طهران" },
  },
];

// ── Category config ───────────────────────────────────────────────────────────
const CAT: Record<string, {
  icon: React.ElementType;
  wire: string; glow: string; pill: string;
  cardBorder: string; cardBg: string;
}> = {
  all:         { icon: Zap,          wire: "text-white",       glow: "shadow-white/5",        pill: "bg-white/10 border-white/20 text-white",                cardBorder: "border-white/10",       cardBg: "bg-white/[0.04]"       },
  electricity: { icon: Zap,          wire: "text-amber-400",   glow: "shadow-amber-500/25",   pill: "bg-amber-500/15 border-amber-400/40 text-amber-300",    cardBorder: "border-amber-500/30",   cardBg: "bg-amber-500/[0.06]"   },
  water:       { icon: Droplets,     wire: "text-cyan-400",    glow: "shadow-cyan-500/25",    pill: "bg-cyan-500/15 border-cyan-400/40 text-cyan-300",       cardBorder: "border-cyan-500/30",    cardBg: "bg-cyan-500/[0.06]"    },
  oil:         { icon: Flame,        wire: "text-orange-400",  glow: "shadow-orange-500/25",  pill: "bg-orange-500/15 border-orange-400/40 text-orange-300", cardBorder: "border-orange-500/30",  cardBg: "bg-orange-500/[0.06]"  },
  industry:    { icon: Factory,      wire: "text-violet-400",  glow: "shadow-violet-500/25",  pill: "bg-violet-500/15 border-violet-400/40 text-violet-300", cardBorder: "border-violet-500/30",  cardBg: "bg-violet-500/[0.06]"  },
  other:       { icon: Landmark,     wire: "text-emerald-400", glow: "shadow-emerald-500/25", pill: "bg-emerald-500/15 border-emerald-400/40 text-emerald-300",cardBorder: "border-emerald-500/30",cardBg: "bg-emerald-500/[0.06]" },
};

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-white/10
        bg-white/[0.03] p-5 text-center group hover:border-orange-500/30
        hover:bg-orange-500/[0.04] transition-all duration-500"
    >
      <div className="absolute top-0 start-0 w-6 h-6 border-t-2 border-s-2 border-orange-500/50 rounded-tl-2xl" />
      <div className="absolute bottom-0 end-0 w-6 h-6 border-b-2 border-e-2 border-orange-500/20 rounded-br-2xl" />
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: delay + 0.1, type: "spring", stiffness: 200 }}
        className="text-3xl font-black text-white tracking-tight mb-1"
      >
        {value}
      </motion.p>
      <p className="text-xs text-gray-500">{label}</p>
    </motion.div>
  );
}

// ── ClientCard ────────────────────────────────────────────────────────────────
function ClientCard({ client, lang, idx }: { client: Client; lang: Lang; idx: number }) {
  const cfg = CAT[client.category];
  const Icon = cfg.icon;
  const [imgErr, setImgErr] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: (idx % 6) * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.03 }}
      className={`group relative ${cfg.cardBg} border ${cfg.cardBorder}
        rounded-2xl p-5 flex flex-col items-center gap-3 text-center
        cursor-default transition-all duration-300 hover:shadow-xl ${cfg.glow}`}
    >
      {/* Glowing top edge */}
      <div className={`absolute inset-x-0 top-0 h-0.5 rounded-t-2xl
        bg-gradient-to-r from-transparent via-current to-transparent
        ${cfg.wire} opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />

      {/* Logo */}
      <div className={`relative w-20 h-20 rounded-xl border ${cfg.cardBorder}
        flex items-center justify-center overflow-hidden bg-white/5
        group-hover:bg-white/10 transition-colors duration-300`}>
        {!imgErr ? (
          <Image
            src={client.logo} alt={client.name[lang]}
            width={60} height={60}
            className="object-contain w-14 h-14
              saturate-0 group-hover:saturate-100
              brightness-90 group-hover:brightness-110
              transition-all duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <Icon className={`w-8 h-8 ${cfg.wire} opacity-50 group-hover:opacity-100 transition-opacity`} />
        )}
        {/* Shine sweep */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0
          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-gray-300 leading-snug line-clamp-2
        group-hover:text-white transition-colors duration-200 min-h-[2.5rem]">
        {client.name[lang]}
      </p>

      {/* Province */}
      <div className={`flex items-center gap-1.5 text-xs ${cfg.wire} opacity-50 group-hover:opacity-90 transition-opacity`}>
        <MapPin className="w-3 h-3 shrink-0" />
        <span>{client.province[lang]}</span>
      </div>

      {/* Category chip */}
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${cfg.pill}`}>
        <Icon className="w-2.5 h-2.5" />
      </span>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const { lang } = useLanguage();
  const apiLang: Lang = lang === "fa" ? "FA" : lang === "ar" ? "AR" : "EN";
  const isRTL = lang === "fa" || lang === "ar";
  const t = UI[apiLang];

  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const cats: { key: Category; labelKey: string }[] = [
    { key: "all",         labelKey: "filterAll"         },
    { key: "electricity", labelKey: "filterElectricity" },
    { key: "water",       labelKey: "filterWater"       },
    { key: "oil",         labelKey: "filterOil"         },
    { key: "industry",    labelKey: "filterIndustry"    },
    { key: "other",       labelKey: "filterOther"       },
  ];

  const filtered = useMemo(() =>
    CLIENTS.filter((c) => {
      const matchCat = activeCategory === "all" || c.category === activeCategory;
      const q = search.toLowerCase();
      return matchCat && (!q ||
        c.name[apiLang].toLowerCase().includes(q) ||
        c.province[apiLang].toLowerCase().includes(q));
    }), [activeCategory, search, apiLang]);

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen text-white"
      style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, #1a1000 0%, #050e1f 60%, #050810 100%)" }}>

      {/* ── Ambient decoration ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wires" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <line x1="0" y1="60" x2="120" y2="60" stroke="#f97316" strokeWidth="0.5"/>
              <line x1="60" y1="0" x2="60" y2="120" stroke="#06b6d4" strokeWidth="0.5"/>
              <circle cx="60" cy="60" r="3" fill="none" stroke="#f97316" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wires)"/>
        </svg>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-[500px] h-[300px] bg-amber-600/6 rounded-full blur-3xl" />
      </div>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-end">

            {/* Headline */}
            <div className="flex-1 space-y-5">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-1">
                  <span className="w-8 h-px bg-orange-500" />
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="w-16 h-px bg-gradient-to-r from-orange-500 to-transparent" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] text-orange-400 uppercase">
                  {t.eyebrow}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight"
              >
                {t.pageTitle.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {i === 0
                      ? <span className="text-white">{line}</span>
                      : <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">{line}</span>
                    }
                  </span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-base max-w-lg leading-relaxed"
              >
                {t.pageSubtitle}
              </motion.p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-72 shrink-0">
              <StatCard value={t.s1val} label={t.s1lab} delay={0.3} />
              <StatCard value={t.s2val} label={t.s2lab} delay={0.4} />
              <StatCard value={t.s3val} label={t.s3lab} delay={0.5} />
              <StatCard value={t.s4val} label={t.s4lab} delay={0.6} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <section className="sticky top-0 z-20 px-6 py-4 backdrop-blur-xl border-b border-white/5"
        style={{ background: "rgba(5,14,31,0.85)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex flex-wrap gap-2 flex-1">
            {cats.map(({ key, labelKey }) => {
              const c = CAT[key];
              const Icon = c.icon;
              const isActive = activeCategory === key;
              const count = key === "all" ? CLIENTS.length : CLIENTS.filter((cl) => cl.category === key).length;
              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold
                    transition-all duration-200
                    ${isActive
                      ? `${c.pill} shadow-lg ${c.glow}`
                      : "bg-white/[0.04] border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20"}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t[labelKey]}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px]
                    ${isActive ? "bg-white/20" : "bg-white/8 text-gray-600"}`}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="relative shrink-0 w-full sm:w-52">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none
              ${isRTL ? "right-3" : "left-3"}`} />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search} dir={isRTL ? "rtl" : "ltr"}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-2
                text-xs text-white placeholder-gray-600
                focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all
                ${isRTL ? "pr-8 pl-3" : "pl-8 pr-3"}`}
            />
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-28">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {filtered.map((client, idx) => (
                <ClientCard key={client.id} client={client} lang={apiLang} idx={idx} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 gap-4 text-gray-600"
            >
              <div className="w-16 h-16 rounded-2xl border border-white/8 bg-white/[0.03] flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm">{t.noResult}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
