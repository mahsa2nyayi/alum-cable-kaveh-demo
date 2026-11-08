"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Shield,
  Zap,
  MapPin,
  Calendar,
  HardDrive,
  FileText,
  Users,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function AboutPage() {
  const { lang } = useLanguage();

  const texts = useMemo(
    () => ({
      fa: {
        title: "درباره آلوم کابل کاوه",
        subtitle:
          "تولیدکننده تخصصی کابل‌های آلومینیومی و مسی؛ ترکیب دانش مهندسی، کیفیت و نوآوری.",
        heroKicker: "بیش از یک دهه تجربه • صادرات به منطقه",
        historyTitle: "تاریخچه ما",
        history:
          "آلوم کابل کاوه در سال ۱۳۹۰ توسط زنده‌یاد مهندس داوود رحمانی و تیمی از مهندسان باتجربه بنیان‌گذاری شد. مجموعه در زمینی به مساحت ۲۰٬۰۰۰ مترمربع در استان مرکزی مستقر شده و از ابتدا با سرمایه‌گذاری در ماشین‌آلات اروپایی و سیستم‌های کنترل کیفیت پیشرفته، مسیر کیفی خود را آغاز کرد.",
        timeline: [
          { year: "۱۳۹۰", label: "تأسیس شرکت" },
          { year: "۱۳۹۲", label: "راه‌اندازی خطوط اکسترودر و تولید" },
          { year: "۱۳۹۷", label: "انتخاب مدیران به‌عنوان کارآفرینان برتر ملی" },
          { year: "۲۰۱۸", label: "شروع صادرات به کشورهای منطقه" },
          { year: "۱۴۰۲", label: "گسترش خطوط و به‌روزرسانی فنی" },
        ],
        stats: [
          { label: "مساحت کارخانه", value: "20,000 m²", icon: MapPin },
          { label: "سال فعالیت", value: "10+ سال", icon: Calendar },
          { label: "کشورهای مقصد", value: "IR, IQ, AF, TM", icon: Users },
          {
            label: "گواهی‌های ISO",
            value: "ISO 9001 / 14001 / 45001",
            icon: Award,
          },
        ],
        techTitle: "تجهیزات و فناوری",
        techList: [
          {
            title: "خطوط اکسترودر پیشرفته",
            desc: "اکسترودرهای اروپایی با کنترل دقیق ضخامت و کیفیت عایق.",
            icon: HardDrive,
          },
          {
            title: "آزمایشگاه کنترل کیفیت",
            desc: "تست‌های ولتاژ بالا، تست مقاومت و آنالیز مواد اولیه مطابق IEC.",
            icon: Shield,
          },
          {
            title: "اتوماسیون تولید",
            desc: "سیستم‌های پایش و کنترل آنلاین برای ثبات فرایند تولید.",
            icon: Zap,
          },
        ],
        certificatesTitle: "گواهی‌ها و استانداردها",
        certificatesDesc:
          "محصولات مطابق با استانداردهای ملی ایران و استانداردهای بین‌المللی تولید می‌شوند. شرکت دارای مجموعه‌ای از گواهی‌های ISO می‌باشد.",
        missionTitle: "ماموریت ما",
        mission:
          "تأمین کابل‌های ایمن، پایدار و مقرون‌به‌صرفه برای زیرساخت‌های برق با تمرکز بر کیفیت و خدمات مشتری محور.",
        visionTitle: "چشم‌انداز",
        vision:
          "ارتقاء به‌عنوان یکی از تأمین‌کنندگان اصلی کابل در منطقه با محوریت نوآوری و توسعه پایدار.",
        valuesTitle: "ارزش‌های ما",
        values: [
          "تعهد به کیفیت",
          "نوآوری مداوم",
          "شفافیت و مسئولیت‌پذیری",
          "مشتری‌مداری حرفه‌ای",
        ],
        team: "تیم آلوم کابل کاوه",
        studies: "نمونه پروژه ها",
        contact: "تماس با ما",
        catalog: "دانلود کاتالوگ",
        rahmani: "مهندس داوود رحمانی",
      },
      en: {
        title: "About Alum Cable Kaveh",
        subtitle:
          "Specialized manufacturer of aluminum & copper cables - combining engineering, quality and innovation.",
        heroKicker: "10+ years of experience • Regional exports",
        historyTitle: "Our History",
        history:
          "Founded in 2011 by the late Eng. Davood Rahmani and a team of seasoned engineers, Alum Cable Kaveh started operations on a 20,000 m² site in Markazi province. From day one the company invested in modern European machinery and advanced QC systems to deliver high-quality cable products.",
        timeline: [
          { year: "2011", label: "Company founded" },
          { year: "2013", label: "Production lines commissioned" },
          { year: "2018", label: "Management recognized as top entrepreneurs" },
          { year: "2018", label: "First regional exports" },
          { year: "2023", label: "Capacity expansion & modernization" },
        ],
        stats: [
          { label: "Factory area", value: "20,000 m²", icon: MapPin },
          { label: "Years in operation", value: "10+ years", icon: Calendar },
          { label: "Export countries", value: "IR, IQ, AF, TM", icon: Users },
          {
            label: "ISO Certificates",
            value: "ISO 9001 / 14001 / 45001",
            icon: Award,
          },
        ],
        techTitle: "Technology & Capacity",
        techList: [
          {
            title: "Advanced Extrusion Lines",
            desc: "European extrusion machines with precise thickness & insulation control.",
            icon: HardDrive,
          },
          {
            title: "Quality Control Laboratory",
            desc: "High-voltage, resistance and materials testing fully compliant with IEC.",
            icon: Shield,
          },
          {
            title: "Production Automation",
            desc: "Online monitoring systems to ensure process stability and repeatability.",
            icon: Zap,
          },
        ],
        certificatesTitle: "Certificates & Standards",
        certificatesDesc:
          "Products are manufactured to Iranian national and recognized international standards. The company holds multiple ISO certifications.",
        missionTitle: "Our Mission",
        mission:
          "Deliver safe, durable and cost-effective cables for critical energy infrastructure with a customer-first approach.",
        visionTitle: "Our Vision",
        vision:
          "Become a leading regional cable supplier through innovation and sustainable growth.",
        valuesTitle: "Our Values",
        values: [
          "Commitment to quality",
          "Continuous innovation",
          "Transparency & responsibility",
          "Customer-first professionalism",
        ],
        team: "Our Team",
        studies: "Case Studies",
        contact: "Contact Us",
        catalog: "Download Catalog",
        rahmani: "Eng. Davood Rahmani",
      },
      ar: {
        title: "من نحن",
        subtitle:
          "شركة متخصصة في تصنيع كابلات الألومنيوم والنحاس تجمع بين الهندسة والجودة والابتكار.",
        heroKicker: "أكثر من 10 سنوات خبرة • صادرات إقليمية",
        historyTitle: "مسيرة الشركة",
        history:
          "تأسست شركة ألوم كابل كاوه في عام 2011 على يد المرحوم المهندس داوود رحماني وفريق من المهندسين، وبدأت العمل على مساحة 20,000 متر مربع في محافظة مركزي. استثمرت الشركة منذ البداية في آلات أوروبية حديثة وأنظمة مراقبة جودة متقدمة.",
        timeline: [
          { year: "2011", label: "تأسيس الشركة" },
          { year: "2013", label: "تشغيل خطوط الإنتاج" },
          { year: "2018", label: "تكريم الإدارة كرائد أعمال" },
          { year: "2018", label: "بداية الصادرات الإقليمية" },
          { year: "2023", label: "توسيع الطاقة والتهيئة الحديثة" },
        ],
        stats: [
          { label: "مساحة المصنع", value: "20,000 m²", icon: MapPin },
          { label: "سنوات التشغيل", value: "أكثر من 10 سنوات", icon: Calendar },
          { label: "دول التصدير", value: "IR, IQ, AF, TM", icon: Users },
          {
            label: "شهادات ISO",
            value: "ISO 9001 / 14001 / 45001",
            icon: Award,
          },
        ],
        techTitle: "التقنية والطاقة الإنتاجية",
        techList: [
          {
            title: "خطوط بثق متقدمة",
            desc: "آلات بثق أوروبية مع تحكم دقيق في السماكة والعزل.",
            icon: HardDrive,
          },
          {
            title: "مختبر مراقبة الجودة",
            desc: "اختبارات الجهد العالي، المقاومة وتحليل المواد وفق IEC.",
            icon: Shield,
          },
          {
            title: "أتمتة الإنتاج",
            desc: "أنظمة مراقبة عبر الإنترنت لضمان استقرار العملية.",
            icon: Zap,
          },
        ],
        certificatesTitle: "الشهادات والمعايير",
        certificatesDesc:
          "تُصنع المنتجات وفقًا للمعايير الوطنية الإيرانية والمعايير الدولية المعترف بها. تمتلك الشركة عدة شهادات ISO.",
        missionTitle: "مهمتنا",
        mission:
          "توفير كابلات آمنة ومتينة وفعالة من حيث التكلفة للبنى التحتية الحيوية مع نهج يركز على العميل.",
        visionTitle: "رؤيتنا",
        vision:
          "أن نصبح من الموردين الإقليميين الرائدين من خلال الابتكار والنمو المستدام.",
        valuesTitle: "قیمنا",
        values: [
          "الالتزام بالجودة",
          "الابتكار المستمر",
          "الشفافية والمسؤولية",
          "الاحترافية وخدمة العملاء",
        ],
        team: "فريقنا",
        studies: "نماذج من المشاريع",
        contact: "اتصل بنا",
        catalog: "تحميل الكتالوج",
        rahmani: "المهندس داوود رحماني",
      },
    }),
    [lang],
  );

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (d = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: d, duration: 0.7 },
    }),
  };

  const sectionFade = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-[#051123] to-[#0a1a2f] text-white px-6 py-20"
      dir={lang === "ar" ? "rtl" : "auto"}
    >
      {/* HERO */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={heroVariants}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 bg-white/50 px-3 py-1 rounded-full text-sm text-gray-200 w-max">
            <span className="text-orange-400 font-semibold">
              {texts[lang].heroKicker || texts.fa.heroKicker}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            {texts[lang].title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg text-gray-300 max-w-2xl"
          >
            {texts[lang].subtitle}
          </motion.p>

          <div className="flex gap-4 mt-4 flex-wrap">
            <Link
              href="/catalog.pdf"
              className="inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-lg font-semibold shadow"
            >
              <FileText className="w-4 h-4" />
              {texts[lang].catalog}
            </Link>

            <Link
              href="/contact-us"
              className="inline-flex items-center gap-1 border border-white/10 px-5 py-3 rounded-lg hover:bg-white/5 transition"
            >
              <MapPin className="w-4 h-4" />
              {texts[lang].contact}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/pic1.jpg"
              alt="Alum Cable Factory"
              width={900}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* HISTORY + TIMELINE */}
        <motion.section
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          <div className="lg:col-span-2 text-justify bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
            <h3 className="text-2xl font-semibold mb-3">
              {texts[lang].historyTitle}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {texts[lang].history}
            </p>
            <Image
              src="/pic3.jpg"
              alt="Alum Cable"
              width={900}
              height={80}
              className="object-contain rounded-lg mt-3"
            />
          </div>

          <div className="bg-white/4 border border-white/10 rounded-2xl p-6">
            <h4 className="text-xl font-semibold mb-4">Timeline</h4>
            <ul className="space-y-6">
              {texts[lang].timeline.map((item: any, idx: number) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500 text-white font-semibold">
                    {item.year}
                  </div>
                  <div>
                    <div className="text-gray-100 font-medium">
                      {item.label}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* STATS */}
        <motion.section
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {texts[lang].stats.map((s: any, idx: number) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-semibold">{s.value}</div>
                  <div className="text-gray-300 text-sm">{s.label}</div>
                </div>
              </div>
            );
          })}
        </motion.section>

        {/* TECHNOLOGY / CAPACITY */}
        <motion.section
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-semibold mb-4">
              {texts[lang].techTitle}
            </h3>
            <p className="text-gray-300 mb-6">{texts[lang].certificatesDesc}</p>
            <div className="flex gap-3 items-center">
              <Link
                href=""
                className="text-orange-400 font-semibold hover:underline"
              >
                {texts[lang].studies}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {texts[lang].techList.map((titem: any, idx: number) => {
              const Icon = titem.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold">{titem.title}</h4>
                  </div>
                  <p className="text-gray-300 text-sm">{titem.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* CERTIFICATES */}
        <motion.section
          id="certificate"
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">
              {texts[lang].certificatesTitle}
            </h3>
            <div className="text-gray-300 text-sm">
              {texts[lang].certificatesDesc}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
            <div className="p-4 bg-white/6 rounded-lg flex items-center justify-center">
              <Image
                src="/ISO9001.jpg"
                alt="ISO 9001"
                width={120}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="p-4 bg-white/6 rounded-lg flex items-center justify-center">
              <Image
                src="/ISO14001.jpg"
                alt="ISO 14001"
                width={120}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="p-4 bg-white/6 rounded-lg flex items-center justify-center">
              <Image
                src="/ISO45001.jpg"
                alt="ISO 45001"
                width={120}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="p-4 bg-white/6 rounded-lg flex items-center justify-center">
              <Image
                src="/ISIRI.png"
                alt="ISIRI"
                width={120}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="p-4 bg-white/6 rounded-lg flex items-center justify-center">
              <Image
                src="/ISO.jpg"
                alt="CE"
                width={120}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </motion.section>

        {/* MISSION / VISION / VALUES */}
        <motion.section
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-xl font-semibold mb-3">
              {texts[lang].missionTitle}
            </h4>
            <p className="text-gray-300 text-sm">{texts[lang].mission}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-xl font-semibold mb-3">
              {texts[lang].visionTitle}
            </h4>
            <p className="text-gray-300 text-sm">{texts[lang].vision}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-xl font-semibold mb-3">
              {texts[lang].valuesTitle}
            </h4>
            <ul className="text-gray-300 text-sm space-y-2">
              {texts[lang].values.map((v: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* FOUNDER / MANAGEMENT */}
        <motion.section
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-white/4 border border-white/10 rounded-2xl p-6"
        >
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold mb-3">
              {texts[lang].rahmani}
            </h3>
            <p className="text-gray-300 mb-4">
              {lang === "fa"
                ? "بنیان‌گذار آلوم کابل کاوه که با دیدی راهبردی و التزام به کیفیت، پایه‌های این مجموعه را بنا نهاد."
                : lang === "ar"
                  ? "مؤسس الشركة الذي وضع أسسها برؤية استراتيجية والتزام بالجودة."
                  : "Founder who established the company on a strategic vision and deep commitment to quality."}
            </p>

            <div className="flex gap-3">
              <Link
                href="/about/team"
                className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-lg font-semibold shadow"
              >
                {texts[lang].team}
              </Link>
              <Link
                href="/projects"
                className="border border-white/10 px-5 py-3 rounded-lg hover:bg-white/5 transition"
              >
                {texts[lang].studies}
              </Link>
            </div>
          </div>

          <div className="relative w-43 h-50 mx-auto rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/founder.png"
              alt="Founder"
              fill
              className="object-cover"
            />
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-800 to-orange-900/20 p-8 rounded-2xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-2xl font-semibold mb-2">
                {lang === "fa"
                  ? "برای همکاری و استعلام قیمت"
                  : lang === "ar"
                    ? "للتعاون والاستعلام عن الأسعار"
                    : "For collaboration & quotation"}
              </h4>
              <p className="text-gray-300">
                {lang === "fa"
                  ? "کاتالوگ محصولات و اطلاعات فنی را هم‌اکنون درخواست کنید."
                  : lang === "ar"
                    ? "اطلب الكتالوج والمواصفات الفنية الآن."
                    : "Request product catalog and technical data now."}
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-1 border border-white/10 px-5 py-3 rounded-lg hover:bg-white/5 transition"
              >
                <MapPin className="w-4 h-4" />
                {texts[lang].contact}
              </Link>
              <Link
                href="/catalog.pdf"
                className="inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-lg font-semibold shadow"
              >
                <FileText className="w-4 h-4" />
                {texts[lang].catalog}
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
