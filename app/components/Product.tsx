"use client";
import { useLanguage } from "../context/LanguageContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Product() {
  const { lang } = useLanguage();

  const texts = {
    fa: {
      title: "دسته بندی محصولات",
      button: "مشاهده محصولات",
      categories: [
        {
          name: "کابل‌های قدرت فشار ضعیف",
          desc: "توزیع برق در فضاى باز ، زیرزمین ، فضاى داخلی ، داکت ها ، نیروگاهها ، کارخانه های صنعتی و ..",
          img: "/image/cable.jpg",
          id: "1",
        },
        {
          name: "کابل های هوایی",
          desc: "تامین و توزیع برق خطوط هوایی با مصارف کارآمد",
          img: "/image/overheadCable.jpg",
          id: "2",
        },
        {
          name: "کابل‌های منعطف و افشان",
          desc: "استفاده در وسایل الکتریکی ، لوازم خانگی و ماشین آلت ، تابلو های فرمان، داکت های زیر زمین، داخل لوله.",
          img: "/image/flex-cable.jpg",
          id: "3",
        },
      ],
    },

    en: {
      title: "Main Product Categories",
      button: "View Products",
      categories: [
        {
          name: "Low Voltage Power Cables",
          desc: "Power distribution in outdoor areas, underground, indoor spaces, ducts, power plants, industrial factories, etc.",
          img: "/image/cable.jpg",
          id: "1",
        },
        {
          name: "Overhead Cables",
          desc: "Efficient supply and distribution of electricity through overhead lines",
          img: "/image/overheadCable.jpg",
          id: "2",
        },
        {
          name: "Flexible and Stranded Cables",
          desc: "Used in electrical appliances, household equipment and machinery, control panels, underground ducts, inside pipes",
          img: "/image/flex-cable.jpg",
          id: "3",
        },
      ],
    },

    ar: {
      title: "الفئات الرئيسية للمنتجات",
      button: "عرض المنتجات",
      categories: [
        {
          name: "كابلات الطاقة منخفضة الجهد ",
          desc: "توزيع الكهرباء في الأماكن الخارجية، تحت الأرض، المساحات الداخلية، القنوات، محطات الطاقة، المصانع الصناعية، إلخ",
          img: "/image/cable.jpg",
          id: "1",
        },
        {
          name: "الكابلات الهوائية",
          desc: "توفير وتوزيع الكهرباء عبر الخطوط الهوائية بكفاءة",
          img: "/image/overheadCable.jpg",
          id: "2",
        },
        {
          name: "الكابلات المرنة والمفروشة",
          desc: "تستخدم في الأجهزة الكهربائية، المعدات المنزلية والآلات، لوحات التحكم، القنوات تحت الأرض، داخل الأنابيب",
          img: "/image/flex-cable.jpg",
          id: "3",
        },
      ],
    },
  };

  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // ── ریسپانسیو واقعی: گوش‌دادن به resize ────────────────────────────────────
  useEffect(() => {
    function updateItemsPerView() {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    }
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const categories = texts[lang].categories;
  const maxIndex = Math.max(categories.length - itemsPerView, 0);

  // اگه itemsPerView تغییر کرد و index از رنج خارج شد، اصلاحش کن
  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [maxIndex, index]);

  const nextSlide = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // درصد جابجایی بر اساس تعداد آیتم در هر اسلاید
  const slidePercent = 35 / itemsPerView;

  return (
    <section
      id="products"
      className="relative py-15 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
          {texts[lang].title}
        </h2>

        <div className="relative max-w-6xl mx-auto">
          {/* Left button */}
          {categories.length > itemsPerView && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white z-10 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Cards */}
          <div className="overflow-hidden py-2 px-12">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${index * slidePercent}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ width: `${(categories.length / itemsPerView) * 100}%` }}
            >
              {categories.map((p) => (
                <motion.div
                  key={p.id}
                  className="overflow-hidden"
                  style={{
                    width: `${100 / categories.length}%`,
                    backgroundColor: "#ffffff",
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
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={600}
                    height={400}
                    className="object-cover w-full"
                  />
                  <div className="p-4 h-30" dir={lang === "ar" ? "rtl" : "auto"}>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {p.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{p.desc}</p>
                  </div>
                  <Link
                    href="/products"
                    className="inline-block bg-orange-600 text-white px-3 py-2 my-2 rounded-full hover:bg-orange-700 transition-all duration-300"
                  >
                    {texts[lang].button} →
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right button */}
          {categories.length > itemsPerView && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white z-10 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
