"use client";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";
import { ShieldCheck, DollarSign, UserCheck, Zap, Shield, Award } from "lucide-react";

export default function Why() {
  const { lang } = useLanguage();

  const texts = {
    fa: {
      title: "چرا آلوم کابل کاوه؟",
      items: [
        {
          icon: <Shield className="w-8 h-8 text-orange-400" />,
          title: "کیفیت بی‌رقیب",
          desc: "استفاده از بهترین مواد اولیه و کنترل دقیق کیفیت در تمام مراحل تولید.",
        },
        {
          icon: <Zap className="w-8 h-8 text-orange-400" />,
          title: "نوآوری در طراحی",
          desc: "به‌کارگیری فناوری‌های روز برای افزایش راندمان و ایمنی کابل‌ها.",
        },
        {
          icon: <Award className="w-8 h-8 text-orange-400" />,
          title: "تجربه و اعتبار",
          desc: "سال‌ها تجربه در صنعت سیم و کابل و همکاری با برندهای معتبر.",
        },
        {
          icon: <UserCheck className="w-8 h-8 text-orange-400" />,
          title: "مشتری در اولویت",
          desc: "تمرکز بر رضایت و خواسته های مشتری.",
        },
        {
          icon: <DollarSign className="w-8 h-8 text-orange-400" />,
          title: "ارزش و قیمت مناسب",
          desc: "کیفیت بالا با قیمتی منصفانه برای شما.",
        },
        {
          icon: <ShieldCheck className="w-8 h-8 text-orange-400" />,
          title: "امنیت و مسئولیت‌پذیری",
          desc: "تعهد ما حفظ ایمنی محصولات و پاسخ‌گویی در تمام مراحل تولید.",
        },
      ],
    },
    en: {
      title: "Why Alum Cable Kaveh?",
      items: [
        {
          icon: <Shield className="w-8 h-8 text-orange-400" />,
          title: "Unmatched Quality",
          desc: "High-grade materials and strict quality control in every stage.",
        },
        {
          icon: <Zap className="w-8 h-8 text-orange-400" />,
          title: "Innovative Design",
          desc: "Modern technologies for higher efficiency and safety.",
        },
        {
          icon: <Award className="w-8 h-8 text-orange-400" />,
          title: "Experience & Trust",
          desc: "Years of expertise and partnerships with trusted brands.",
        },
        {
          icon: <UserCheck className="w-8 h-8 text-orange-400" />,
          title: "Customer First",
          desc: "We always prioritize your satisfaction and needs.",
        },
        {
          icon: <DollarSign className="w-8 h-8 text-orange-400" />,
          title: "Best Value",
          desc: "High quality at a fair price for you.",
        },
        {
          icon: <ShieldCheck className="w-8 h-8 text-orange-400" />,
          title: "Safety & Responsibility",
          desc: "We ensure product safety and take full responsibility at every stage of production.",
        },
      ],
    },
    ar: {
      title: "لماذا ألوم کابل کاوه",
      items: [
        {
          icon: <Shield className="w-8 h-8 text-orange-400" />,
          title: "جودة لا مثيل لها",
          desc: "مواد خام عالية الجودة ورقابة صارمة على جميع مراحل الإنتاج.",
        },
        {
          icon: <Zap className="w-8 h-8 text-orange-400" />,
          title: "تصميم مبتكر",
          desc: "استخدام أحدث التقنيات لزيادة الكفاءة والسلامة.",
        },
        {
          icon: <Award className="w-8 h-8 text-orange-400" />,
          title: "خبرة وموثوقية",
          desc: "سنوات من الخبرة والتعاون مع علامات تجارية معروفة.",
        },
        {
          icon: <UserCheck className="w-8 h-8 text-orange-400" />,
          title: "العميل أولوية",
          desc: "نركز دائمًا على رضاك واحتياجاتك.",
        },
        {
          icon: <DollarSign className="w-8 h-8 text-orange-400" />,
          title: "أفضل قيمة",
          desc: "نقدم جودة عالية بسعر مناسب لك.",
        },
        {
          icon: <ShieldCheck className="w-8 h-8 text-orange-400" />,
          title: "الأمان والمسؤولية",
          desc: "نلتزم بسلامة المنتجات والمسؤولية في جميع مراحل الإنتاج.",
        },
      ],
    },
  };

  return (
    <section
      className="py-30 px-6 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600"
      id="why-alum"
    >
      <div className="max-w-6xl mx-auto text-gray-900 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-10"
        >
          {texts[lang].title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {texts[lang].items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/90 p-8 text-center"
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                border: "none",
                borderRadius: "1rem",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0, 0, 0, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.5)";
              }}
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-300 dark:text-orange-400">
                {item.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
