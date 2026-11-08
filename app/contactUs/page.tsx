"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Send, Phone, MapPin, Building2, Factory,
  CheckCircle2, AlertCircle, Mail, MessageSquare,
  User, ChevronRight, ExternalLink,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import Lottie from "lottie-react";
import animationData from "public/animation/ROBOT.json";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type Lang = "fa" | "en" | "ar";
type FormField = "name" | "email" | "phone" | "message";

const OFFICE_LAT = 35.799822873276526;
const OFFICE_LNG = 51.47806885147219;
const FACTORY_LAT = 35.113688413597174;
const FACTORY_LNG = 50.396759170309;

const TEXT = {
  fa: {
    eyebrow: "ارتباط با ما",
    title: "تماس با آلوم کابل کاوه",
    subtitle: "برای مشاوره، استعلام قیمت یا همکاری با ما در تماس باشید.",
    name: "نام و نام خانوادگی", email: "ایمیل", phone: "شماره تماس", message: "پیام شما",
    submit: "ارسال پیام", sending: "در حال ارسال...",
    required: "این فیلد اجباری است", invalidEmail: "ایمیل صحیح نیست",
    success: "پیام شما با موفقیت ارسال شد. به زودی با شما تماس می‌گیریم.",
    error: "ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
    office: "دفتر مرکزی", factory: "کارخانه",
    officeAddress: "چهارراه فرمانیه، نارنجستان هفتم، مرکز اداری و تجاری پارک سنتر، طبقه ۱۸، واحد ۱۸۰۳",
    factoryAddress: "اتوبان ساوه، شهر صنعتی کاوه، بعد از میدان جانبازان، خیابان آزادگان جنوبی، شرکت آلوم کابل کاوه",
    officePhones: ["021-40228249", "021-40228832", "021-40228897", "021-91090503"],
    factoryPhones: ["086-42341276"],
    viewOnMap: "مشاهده در نقشه",
    formTitle: "فرم تماس",
    formSubtitle: "پیام خود را برای ما بنویسید",
  },
  en: {
    eyebrow: "Get in touch",
    title: "Contact Alum Cable Kaveh",
    subtitle: "Get in touch with us for inquiries, pricing, or cooperation.",
    name: "Full Name", email: "Email", phone: "Phone Number", message: "Your Message",
    submit: "Send Message", sending: "Sending...",
    required: "This field is required", invalidEmail: "Invalid email address",
    success: "Your message has been sent successfully. We'll contact you soon.",
    error: "Failed to send message. Please try again.",
    office: "Head Office", factory: "Factory",
    officeAddress: "Unit 1803, 18th Floor, Park Center, 7th Narenjestan St., Farmanieh, Tehran",
    factoryAddress: "Alum Cable Kaveh Co., South Azadegan St., after Janbazan Square, Kaveh Industrial City, Saveh Highway",
    officePhones: ["021-40228249", "021-40228832", "021-40228897", "021-91090503"],
    factoryPhones: ["086-42341276"],
    viewOnMap: "View on Map",
    formTitle: "Contact Form",
    formSubtitle: "Write us a message",
  },
  ar: {
    eyebrow: "تواصل معنا",
    title: "اتصل بشركة ألوم كابل كاوه",
    subtitle: "تواصل معنا للاستعلام أو التعاون.",
    name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف", message: "رسالتك",
    submit: "إرسال", sending: "جاري الإرسال...",
    required: "هذا الحقل مطلوب", invalidEmail: "بريد إلكتروني غير صالح",
    success: "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.",
    error: "حدث خطأ أثناء الإرسال. يرجى المحاولة مجدداً.",
    office: "المكتب الرئيسي", factory: "المصنع",
    officeAddress: "الوحدة 1803، الطابق 18، مجمع بارك سنتر، شارع نارنجستان السابع، فرمانيه، طهران",
    factoryAddress: "شركة ألوم كابل كاوه، شارع آزادگان الجنوبي، بعد ميدان جانبازان، المدينة الصناعية كاوه، طريق ساوه",
    officePhones: ["021-40228249", "021-40228832", "021-40228897", "021-91090503"],
    factoryPhones: ["086-42341276"],
    viewOnMap: "عرض على الخريطة",
    formTitle: "نموذج الاتصال",
    formSubtitle: "اكتب لنا رسالة",
  },
};

function LocationCard({
  icon: Icon, title, address, phones, lat, lng, viewOnMap, color, delay,
}: {
  icon: React.ElementType; title: string; address: string;
  phones: string[]; lat: number; lng: number;
  viewOnMap: string; color: "orange" | "sky"; delay: number;
}) {
  const a = color === "orange"
    ? { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/25", glow: "hover:shadow-orange-500/10", dot: "bg-orange-500" }
    : { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/25", glow: "hover:shadow-sky-500/10", dot: "bg-sky-500" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-3xl border ${a.border}
        bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-500
        hover:shadow-2xl ${a.glow}`}
    >
      <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r
        from-transparent via-current to-transparent ${a.text} opacity-40`} />
      <div className={`absolute top-4 end-4 w-20 h-20 rounded-full ${a.bg} blur-2xl`} />

      <div className="relative p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl ${a.bg} border ${a.border}
            flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${a.text}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${a.dot} animate-pulse`} />
              <span className="text-xs text-gray-500">Iran</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className={`flex gap-3 p-3 rounded-xl ${a.bg} border ${a.border}`}>
          <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${a.text}`} />
          <p className="text-sm text-gray-300 leading-relaxed">{address}</p>
        </div>

        {/* Phones */}
        <div className="space-y-1.5">
          {phones.map((phone, i) => (
            <a key={i} href={`tel:${phone.replace(/-/g, "")}`}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5
                transition-all duration-200 group">
              <div className={`w-7 h-7 rounded-lg ${a.bg} border ${a.border}
                flex items-center justify-center shrink-0`}>
                <Phone className={`w-3.5 h-3.5 ${a.text}`} />
              </div>
              <span className="text-sm text-gray-300 font-mono group-hover:text-white transition-colors">
                {phone}
              </span>
              <ChevronRight className={`w-3.5 h-3.5 ms-auto ${a.text}
                opacity-0 group-hover:opacity-100 transition-opacity`} />
            </a>
          ))}
        </div>

        {/* Map */}
        <div className="relative">
          <Map lat={lat} lng={lng} label={title} color={color} />
          <a
            href={`https://neshan.org/maps/places?lat=${lat}&lng=${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute bottom-3 end-3 z-10 flex items-center gap-1.5 px-3 py-1.5
              rounded-full text-xs font-semibold backdrop-blur-md
              ${a.bg} border ${a.border} ${a.text}
              hover:brightness-125 transition-all shadow-lg`}
          >
            <ExternalLink className="w-3 h-3" />
            {viewOnMap}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, value, onChange, error, type = "text", textarea, icon: Icon }: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; textarea?: boolean; icon?: React.ElementType;
}) {
  const El = textarea ? "textarea" : "input";
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-orange-400" />}
        {label} <span className="text-orange-400 text-xs">*</span>
      </label>
      <El
        type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 4 : undefined}
        className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-white
          placeholder-gray-600 transition-all outline-none resize-none
          focus:ring-2 focus:ring-offset-0
          ${error
            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
            : "border-white/10 focus:border-orange-500/50 focus:ring-orange-500/10 hover:border-white/20"
          }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = TEXT[lang as Lang];
  const isRTL = lang === "fa" || lang === "ar";

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);

  function validate() {
    const e: Partial<Record<FormField, string>> = {};
    if (!form.name.trim()) e.name = t.required;
    if (!form.phone.trim()) e.phone = t.required;
    if (!form.email.trim()) e.email = t.required;
    else if (!/^\S+@\S+\.\S+$/.test(form.email) || form.email.length > 254) e.email = t.invalidEmail;
    if (!form.message.trim()) e.message = t.required;
    else if (form.message.length > 5000) e.message = t.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setStatus(null);
    try {
      const r = await fetch("/api/contactUs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      setStatus(r.ok ? "success" : "error");
      if (r.ok) setForm({ name: "", email: "", phone: "", message: "", website: "" });
    } catch { setStatus("error"); }
    setLoading(false);
  }

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen text-white"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, #1a0d00 0%, #050e1f 55%, #050810 100%)" }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-orange-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-sky-600/6 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/60" />
            <span className="text-xs font-bold tracking-[0.2em] text-orange-400 uppercase">{t.eyebrow}</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/60" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">{t.subtitle}</p>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Location cards */}
          <div className="space-y-6">
            <LocationCard
              icon={Building2} title={t.office} address={t.officeAddress}
              phones={t.officePhones} lat={OFFICE_LAT} lng={OFFICE_LNG}
              viewOnMap={t.viewOnMap} color="orange" delay={0.1}
            />
            <LocationCard
              icon={Factory} title={t.factory} address={t.factoryAddress}
              phones={t.factoryPhones} lat={FACTORY_LAT} lng={FACTORY_LNG}
              viewOnMap={t.viewOnMap} color="sky" delay={0.2}
            />
          </div>

          {/* Form + Lottie */}
          <motion.div
            id="contactForm"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="lg:sticky lg:top-24 space-y-6"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="absolute -top-10 -end-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl" />
              <div className="relative space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/25
                    flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{t.formTitle}</h2>
                    <p className="text-xs text-gray-500">{t.formSubtitle}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={t.name} value={form.name}
                      onChange={(v) => setForm({ ...form, name: v })}
                      error={errors.name} icon={User} />
                    <Field label={t.phone} value={form.phone}
                      onChange={(v) => setForm({ ...form, phone: v })}
                      error={errors.phone} icon={Phone} type="tel" />
                  </div>
                  <Field label={t.email} value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    error={errors.email} icon={Mail} type="email" />
                  <Field label={t.message} value={form.message}
                    onChange={(v) => setForm({ ...form, message: v })}
                    error={errors.message} textarea />

                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2
                      bg-gradient-to-r from-orange-500 to-orange-600
                      hover:from-orange-600 hover:to-orange-700
                      disabled:opacity-50 disabled:cursor-not-allowed
                      text-white font-semibold py-3.5 rounded-xl
                      transition-all shadow-lg shadow-orange-500/20">
                    {loading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t.sending}</>
                      : <><Send className="w-4 h-4" />{t.submit}</>
                    }
                  </motion.button>

                  <AnimatePresence>
                    {status === "success" && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/25
                          text-emerald-400 text-sm px-4 py-3 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {t.success}
                      </motion.div>
                    )}
                    {status === "error" && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25
                          text-red-400 text-sm px-4 py-3 rounded-xl">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {t.error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>

            <div className="flex justify-center">
              <Lottie animationData={animationData} loop className="w-64 h-64 opacity-80" />
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
