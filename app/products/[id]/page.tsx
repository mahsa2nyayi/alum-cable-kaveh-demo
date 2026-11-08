"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Wind,
  Activity,
  Thermometer,
  Layers,
  BookOpen,
  Cable,
  CheckCircle2,
  AlertCircle,
  Send,
  ChevronLeft,
  SlidersHorizontal,
  Boxes,
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

// ── Types ─────────────────────────────────────────────────────────────────────
type Lang = "FA" | "EN" | "AR";
type FamilyType = "LOW_VOLTAGE_POWER" | "AERIAL" | "FLEXIBLE";

interface Translation {
  language: Lang;
  name: string;
  features: string;
  usage: string;
  description?: string;
}
interface FamilyTranslation {
  language: Lang;
  name: string;
}

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
  singleCoreLayers?: string;
  multiCoreRoundLayers?: string;
  multiCoreSectorLayers?: string;
  translations: Translation[];
  family: { type: FamilyType; translations: FamilyTranslation[] };
}

// ── Texts ─────────────────────────────────────────────────────────────────────
const UI: Record<Lang, Record<string, string>> = {
  FA: {
    back: "بازگشت به محصولات",
    loading: "در حال بارگذاری...",
    notFound: "محصول یافت نشد",
    standard: "استاندارد",
    voltage: "ولتاژ نامی",
    temp: "حداکثر دمای کاری",
    conductor: "جنس هادی",
    classes: "کلاس هادی",
    section: "رنج سایز",
    configurations: "شکل‌های تولید",
    layers: "لایه‌های ساختاری",
    singleCore: "تک رشته",
    multiRound: "چند رشته گرد",
    multiSector: "چند رشته سکتور",
    features: "ویژگی‌ها",
    usage: "کاربرد",
    description: "توضیحات",
    copper: "مسی (Copper)",
    aluminum: "آلومینیومی (Aluminum)",
    datasheetTitle: "درخواست دیتاشیت",
    datasheetDesc:
      "مشخصات مورد نیاز خود را وارد کنید تا دیتاشیت برای شما ارسال شود.",
    specLabel: "سایز / مشخصات مورد نیاز",
    specPlaceholder: "مثال: 3×95+50 mm²",
    nameLabel: "نام و نام خانوادگی",
    companyLabel: "شرکت (اختیاری)",
    emailLabel: "ایمیل",
    phoneLabel: "تلفن (اختیاری)",
    messageLabel: "توضیحات بیشتر (اختیاری)",
    submit: "ارسال درخواست",
    submitting: "در حال ارسال...",
    successTitle: "درخواست ثبت شد!",
    successMsg: "کارشناسان ما در اسرع وقت با شما تماس می‌گیرند.",
    errorMsg: "خطا در ارسال. لطفاً دوباره امتحان کنید.",
    required: "این فیلد الزامی است",
    technicalSpecs: "مشخصات فنی",
    productInfo: "اطلاعات محصول",
  },
  EN: {
    back: "Back to Products",
    loading: "Loading...",
    notFound: "Product not found",
    standard: "Standard",
    voltage: "Rated Voltage",
    temp: "Max Operating Temp",
    conductor: "Conductor Material",
    classes: "Conductor Classes",
    section: "Section Range",
    configurations: "Configurations",
    layers: "Layer Structure",
    singleCore: "Single Core",
    multiRound: "Multi-Core Round",
    multiSector: "Multi-Core Sector",
    features: "Features",
    usage: "Usage",
    description: "Description",
    copper: "Copper",
    aluminum: "Aluminum",
    datasheetTitle: "Request Datasheet",
    datasheetDesc:
      "Enter your required specifications and we'll send you the datasheet.",
    specLabel: "Required Size / Specifications",
    specPlaceholder: "e.g. 3×95+50 mm²",
    nameLabel: "Full Name",
    companyLabel: "Company (optional)",
    emailLabel: "Email",
    phoneLabel: "Phone (optional)",
    messageLabel: "Additional Notes (optional)",
    submit: "Send Request",
    submitting: "Sending...",
    successTitle: "Request Submitted!",
    successMsg: "Our team will contact you shortly.",
    errorMsg: "Failed to send. Please try again.",
    required: "This field is required",
    technicalSpecs: "Technical Specifications",
    productInfo: "Product Information",
  },
  AR: {
    back: "العودة إلى المنتجات",
    loading: "جار التحميل...",
    notFound: "المنتج غير موجود",
    standard: "المعيار",
    voltage: "الجهد المقنن",
    temp: "درجة الحرارة القصوى",
    conductor: "مادة الموصل",
    classes: "فئات الموصل",
    section: "نطاق المقطع",
    configurations: "التشكيلات",
    layers: "طبقات البنية",
    singleCore: "أحادي اللب",
    multiRound: "متعدد دائري",
    multiSector: "متعدد قطاعي",
    features: "المميزات",
    usage: "الاستخدام",
    description: "الوصف",
    copper: "نحاسي",
    aluminum: "ألومنيوم",
    datasheetTitle: "طلب ورقة البيانات",
    datasheetDesc: "أدخل المواصفات المطلوبة وسنرسل لك ورقة البيانات.",
    specLabel: "المقطع / المواصفات المطلوبة",
    specPlaceholder: "مثال: 3×95+50 mm²",
    nameLabel: "الاسم الكامل",
    companyLabel: "الشركة (اختياري)",
    emailLabel: "البريد الإلكتروني",
    phoneLabel: "الهاتف (اختياري)",
    messageLabel: "ملاحظات إضافية (اختياري)",
    submit: "إرسال الطلب",
    submitting: "جار الإرسال...",
    successTitle: "تم إرسال الطلب!",
    successMsg: "سيتصل بك فريقنا قريباً.",
    errorMsg: "فشل الإرسال. يرجى المحاولة مجدداً.",
    required: "هذا الحقل مطلوب",
    technicalSpecs: "المواصفات الفنية",
    productInfo: "معلومات المنتج",
  },
};

const FAMILY_META: Record<
  FamilyType,
  {
    Icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    tag: string;
  }
> = {
  LOW_VOLTAGE_POWER: {
    Icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    tag: "bg-orange-500/10 text-orange-300 border-orange-500/25",
  },
  AERIAL: {
    Icon: Wind,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    tag: "bg-sky-500/10 text-sky-300 border-sky-500/25",
  },
  FLEXIBLE: {
    Icon: Activity,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    tag: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  },
};

const CFG_LABEL: Record<Lang, Record<string, string>> = {
  FA: {
    SINGLE_CORE: "تک رشته",
    MULTI_CORE_ROUND: "چند رشته گرد",
    MULTI_CORE_SECTOR: "چند رشته سکتور",
  },
  EN: {
    SINGLE_CORE: "Single Core",
    MULTI_CORE_ROUND: "Multi-Core Round",
    MULTI_CORE_SECTOR: "Multi-Core Sector",
  },
  AR: {
    SINGLE_CORE: "أحادي",
    MULTI_CORE_ROUND: "متعدد دائري",
    MULTI_CORE_SECTOR: "متعدد قطاعي",
  },
};

// ── Spec Row ──────────────────────────────────────────────────────────────────
function SpecRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color} bg-white/5 mt-0.5">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm text-gray-200 font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

// ── Datasheet Form ────────────────────────────────────────────────────────────
function DatasheetForm({
  productId,
  lang,
  t,
  isRTL,
  accentColor,
}: {
  productId: number;
  lang: Lang;
  t: Record<string, string>;
  isRTL: boolean;
  accentColor: string;
}) {
  const [form, setForm] = useState({
    requestedSpec: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.requestedSpec.trim()) e.requestedSpec = t.required;
    if (!form.name.trim()) e.name = t.required;
    if (!form.email.trim()) e.email = t.required;
    return e;
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/datasheet-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId, lang }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function Field({
    name,
    label,
    placeholder,
    required,
    type = "text",
    textarea,
  }: {
    name: keyof typeof form;
    label: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    textarea?: boolean;
  }) {
    const El = textarea ? "textarea" : "input";
    return (
      <div className="space-y-1.5">
        <label className="text-sm text-gray-300">
          {label}
          {required && <span className="text-orange-400 ms-1">*</span>}
        </label>
        <El
          type={type}
          value={form[name]}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          placeholder={placeholder}
          rows={textarea ? 3 : undefined}
          className='w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-all resize-none
            ${errors[name]
              ? "border-red-500/50 focus:border-red-500"
              : "border-white/10 focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20"
            }'
        />
        {errors[name] && <p className="text-xs text-red-400">{errors[name]}</p>}
      </div>
    );
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-12 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white">{t.successTitle}</h3>
        <p className="text-gray-400 text-sm max-w-xs">{t.successMsg}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        name="requestedSpec"
        label={t.specLabel}
        placeholder={t.specPlaceholder}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field name="name" label={t.nameLabel} required />
        <Field name="company" label={t.companyLabel} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field name="email" label={t.emailLabel} type="email" required />
        <Field name="phone" label={t.phoneLabel} type="tel" />
      </div>
      <Field name="message" label={t.messageLabel} textarea />

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {t.errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {status === "loading" ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t.submitting}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            {t.submit}
          </>
        )}
      </button>
    </form>
  );
}
// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { lang } = useLanguage();
  const apiLang: Lang = lang === "fa" ? "FA" : lang === "ar" ? "AR" : "EN";
  const isRTL = lang === "fa" || lang === "ar";
  const t = UI[apiLang];
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#051123] to-[#0a1a2f] flex items-center justify-center gap-3 text-gray-400">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        {t.loading}
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#051123] to-[#0a1a2f] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-gray-400">{t.notFound}</p>
        <Link
          href="/products"
          className="text-orange-400 hover:underline text-sm"
        >
          {t.back}
        </Link>
      </div>
    );

  const tr =
    product.translations.find((x) => x.language === apiLang) ??
    product.translations[0];
  const familyType = product.family.type as FamilyType;
  const m = FAMILY_META[familyType];
  const { Icon } = m;
  const familyName =
    product.family.translations.find((x) => x.language === apiLang)?.name ?? "";

  const layerRows = [
    product.singleCoreLayers && {
      label: t.singleCore,
      value: product.singleCoreLayers,
    },
    product.multiCoreRoundLayers && {
      label: t.multiRound,
      value: product.multiCoreRoundLayers,
    },
    product.multiCoreSectorLayers && {
      label: t.multiSector,
      value: product.multiCoreSectorLayers,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-b from-[#051123] to-[#0a1a2f] text-white"
    >
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 bg-[#051123]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <BackIcon className="w-4 h-4" />
            {t.back}
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center ${m.bg} border ${m.border}">
              <Icon className="w-3.5 h-3.5 ${m.color}" />
            </div>
            <span className="text-xs text-gray-500">{familyName}</span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-10 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className='bsolute top-0 ${isRTL ? "right-0" : "left-0"} w-1/2 h-full bg-gradient-to-${isRTL ? "l" : "r"} ${m.bg.replace("bg-", "from-")} to-transparent opacity-30' />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Cable className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-widest">
                {familyName}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">
              <span className={m.color}>{product.abbreviation}</span>
            </h1>
            {tr && (
              <p className="text-gray-300 text-xl max-w-2xl leading-relaxed">
                {tr.name}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left col: specs + info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Technical specs card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-6"
            >
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                <SlidersHorizontal className="w-4 h-4" />
                {t.technicalSpecs}
              </h2>

              <div className="divide-y divide-white/5">
                <SpecRow
                  icon={BookOpen}
                  label={t.standard}
                  value={product.standard}
                  color={m.color}
                />
                <SpecRow
                  icon={Zap}
                  label={t.voltage}
                  value={product.ratedVoltage}
                  color={m.color}
                />
                <SpecRow
                  icon={Thermometer}
                  label={t.temp}
                  value={product.maxOperatingTemp}
                  color={m.color}
                />
                <SpecRow
                  icon={Cable}
                  label={t.conductor}
                  value={`${product.conductorMaterial === "COPPER" ? t.copper : t.aluminum} · ${t.classes}: ${product.conductorClasses.join(", ")}`}
                  color={m.color}
                />
                <SpecRow
                  icon={Layers}
                  label={t.section}
                  value={`${product.minSection} – ${product.maxSection} mm²`}
                  color={m.color}
                />
              </div>
            </motion.div>

            {/* Configurations */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-6"
            >
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                <Boxes className="w-4 h-4" />
                {t.configurations}
              </h2>
              <div className="flex flex-wrap gap-2 mb-5">
                {product.configurations.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 rounded-xl border text-sm font-medium ${m.tag}"
                  >
                    {CFG_LABEL[apiLang][c] ?? c}
                  </span>
                ))}
              </div>

              {layerRows.length > 0 && (
                <>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                    {t.layers}
                  </p>
                  <div className="space-y-2">
                    {layerRows.map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3"
                      >
                        <span className="text-xs text-gray-500 shrink-0 w-32">
                          {label}
                        </span>
                        <span className="font-mono text-xs text-gray-300 break-all">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Product info */}
            {tr && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-5"
              >
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-widest">
                  <Cable className="w-4 h-4" />
                  {t.productInfo}
                </h2>

                {tr.features && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                      {t.features}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {tr.features}
                    </p>
                  </div>
                )}
                {tr.usage && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                      {t.usage}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {tr.usage}
                    </p>
                  </div>
                )}
                {tr.description && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                      {t.description}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {tr.description}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right col: Datasheet form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="sticky top-20 bg-white/[0.03] border border-white/8 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center ${m.bg} border ${m.border}">
                  <Send className="w-4 h-4 ${m.color}" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  {t.datasheetTitle}
                </h2>
              </div>
              <p className="text-sm text-gray-400 mb-5">{t.datasheetDesc}</p>

              <DatasheetForm
                productId={product.id}
                lang={apiLang}
                t={t}
                isRTL={isRTL}
                accentColor={m.color}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
