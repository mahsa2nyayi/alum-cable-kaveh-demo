"use client";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Costumer() {
  const { lang } = useLanguage();

  const texts = {
    fa: {
      title: "پروژه‌ها و مشتریان ما",
      subtitle:
        "اعتماد سازمان‌ها و نهادهای معتبر سراسر ایران به کیفیت و عملکرد آلوم کابل کاوه",
      button: "مشاهده همه پروژه‌ها",
      clients: [
        { name: "شرکت‌های توزیع برق ایران", img: "/image/Bargh.png" },
        {
          name: "شرکت‌های آب و فاضلاب مراکز استان‌ها",
          img: "/image/AABB.png",
        },
        {
          name: "اداره کل راهداری و حمل‌ونقل جاده‌ای سیستان و بلوچستان",
          img: "/image/Rahdari.png",
        },
        { name: "اداره کل راه و شهرسازی لارستان", img: "/image/larestan.png" },
        {
          name: "اداره کل دامپزشکی استان قزوین",
          img: "/image/Dampezeshki.png",
        },
        { name: "شهرداری طبس", img: "/image/Tabas.png" },
      ],
    },
    en: {
      title: "Our Projects & Clients",
      subtitle: "Trusted by leading organizations and institutions across Iran",
      button: "View All Projects",
      clients: [
        {
          name: "Electricity Distribution Companies of Iran",
          img: "/image/Bargh.png",
        },
        {
          name: "Water & Wastewater Companies of Provincial Centers",
          img: "/image/AABB.png",
        },
        {
          name: "Road Maintenance and Transportation Department of Sistan and Baluchestan",
          img: "/image/Rahdari.png",
        },
        {
          name: "Road and Urban Development Department of Larestan",
          img: "/image/larestan.png",
        },
        {
          name: "Veterinary Department of Qazvin Province",
          img: "/image/Dampezeshki.png",
        },
        { name: "Tabas Municipality", img: "/image/Tabas.png" },
      ],
    },
    ar: {
      title: "مشاريعنا وعملاؤنا",
      subtitle: "موثوق من قبل المؤسسات الرائدة في جميع أنحاء إيران",
      button: "عرض جميع المشاريع",
      clients: [
        { name: "شركات توزيع الكهرباء في إيران", img: "/image/Bargh.png" },
        {
          name: "شركات المياه والصرف الصحي في مراكز المحافظات",
          img: "/image/AABB.png",
        },
        {
          name: "إدارة الطرق والنقل بمحافظة سيستان وبلوشستان",
          img: "/image/Rahdari.png",
        },
        { name: "إدارة الطرق والإسكان في لارستان", img: "/image/larestan.png" },
        {
          name: "إدارة البيطرة في محافظة قزوين",
          img: "/image/Dampezeshki.png",
        },
        { name: "بلدية طبس", img: "/image/Tabas.png" },
      ],
    },
  };

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts[lang].clients.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [lang]);

  return (
    <section className="relative flex flex-col items-center justify-center text-center py-24 px-4 bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 text-white overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        {texts[lang].title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="max-w-2xl text-gray-300 mb-12"
      >
        {texts[lang].subtitle}
      </motion.p>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 px-6 md:px-16">
        {texts[lang].clients.map((client, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 relative flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-3">
              <Image
                src={client.img}
                alt={client.name}
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-3 text-sm text-gray-300">{client.name}</p>
          </motion.div>
        ))}
      </div>

      <Link
        href={`./customers`}
        className="mt-10 px-6 py-3 bg-orange-600 hover:bg-orange-700 transition rounded-full font-semibold shadow-lg transition-all duration-300"
      >
        {texts[lang].button}
      </Link>
    </section>
  );
}
