"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { SITE } from "@/lib/site";

const YEAR = new Date().getFullYear();
const [PHONE_1, PHONE_2] = SITE.phones;

const texts = {
  fa: {
    about:
      "آلوم کابل کاوه تولیدکننده انواع کابل‌های آلومینیومی و مسی با استانداردهای بین‌المللی است و به بیش از ۲۰۰ پروژه بزرگ ملی خدمات ارائه داده است.",
    navTitle: "دسترسی سریع",
    nav: [
      { label: "صفحه اصلی", href: "/" },
      { label: "درباره ما", href: "/about" },
      { label: "محصولات", href: "/products" },
      { label: "پروژه‌ها و مشتریان", href: "/customers" },
      { label: "تماس با ما", href: "/contactUs" },
    ],
    productsTitle: "محصولات",
    products: [
      { label: "کابل‌های قدرت", href: "/products#lowVoltage" },
      { label: "کابل‌های هوایی", href: "/products#aerial" },
      { label: "سیم‌های ساختمانی", href: "/products#flexible" },
      { label: "کابل های منعطف", href: "/products#flexible" },
    ],
    contactTitle: "تماس با ما",
    phone: `تلفن: ${PHONE_1} - ${PHONE_2}`,
    email: `ایمیل: ${SITE.email}`,
    address: "آدرس: تهران، چهارراه فرمانیه، نارنجستان هفتم، مرکز اداری و تجاری پارک سنتر، طبقه ۱۸، واحد ۱۸۰۳",
    copyright: `© ${YEAR} – Designed & Developed by Mahsa. All Rights Reserved`,
  },

  en: {
    about:
      "Alum Cable Kaveh is a leading manufacturer of aluminum and copper cables, providing solutions to more than 200 major national projects.",
    navTitle: "Quick Navigation",
    nav: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Products", href: "/products" },
      { label: "Projects & Clients", href: "/customers" },
      { label: "Contact Us", href: "/contactUs" },
    ],
    productsTitle: "Products",
    products: [
      { label: "Power Cables", href: "/products#lowVoltage" },
      { label: "Aerial Cables", href: "/products#aerial" },
      { label: "Building Wires", href: "/products#flexible" },
      { label: "Flexible Cables", href: "/products#flexible" },
    ],
    contactTitle: "Contact",
    phone: `Phone: ${PHONE_1} - ${PHONE_2}`,
    email: `Email: ${SITE.email}`,
    address: "Address: Unit 1803, 18th Floor, Park Center, 7th Narenjestan St., Farmanieh, Tehran",
    copyright: `© ${YEAR} – Designed & Developed by Mahsa. All Rights Reserved`,
  },

  ar: {
    about:
      "شركة ألوم كابل كاوه هي شركة رائدة في تصنيع كابلات الألمنيوم والنحاس وفقًا للمعايير الدولية، وقد خدمت أكثر من 200 مشروع وطني كبير.",
    navTitle: "روابط سريعة",
    nav: [
      { label: "الرئيسية", href: "/" },
      { label: "من نحن", href: "/about" },
      { label: "المنتجات", href: "/products" },
      { label: "المشاريع والعملاء", href: "/customers" },
      { label: "اتصل بنا", href: "/contactUs" },
    ],
    productsTitle: "المنتجات",
    products: [
      { label: "كابلات القدرة", href: "/products#lowVoltage" },
      { label: "كابلات هوائية", href: "/products#aerial" },
      { label: "أسلاك المباني", href: "/products#flexible" },
      { label: "الكابلات المرنة", href: "/products#flexible" },
    ],
    contactTitle: "اتصال",
    phone: `الهاتف: ${PHONE_1} - ${PHONE_2}`,
    email: `البريد: ${SITE.email}`,
    address: "العنوان: الوحدة 1803، الطابق 18، مجمع بارك سنتر، شارع نارنجستان السابع، فرمانيه، طهران",
    copyright: `© ${YEAR} – Designed & Developed by Mahsa. All Rights Reserved`,
  },
};
export default function Footer() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const t = texts[lang] || texts.fa;

  // Admin screens have their own chrome.
  if (pathname.startsWith("/admin")) return null;

  const socials = [
    { href: SITE.social.instagram, Icon: Instagram, label: "Instagram" },
    { href: SITE.social.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { href: SITE.social.facebook, Icon: Facebook, label: "Facebook" },
  ].filter((x) => x.href);

  return (
    <footer
      className="w-full bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-16 pb-8"
      dir={lang === "ar" ? "rtl" : "auto"}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Logo + About */}
        <div>
          <Image
            src="/Alum_Logo.png"
            alt="Alum Cable Kaveh"
            width={160}
            height={60}
            className="mb-4 h-auto w-40 opacity-90"
          />

          <p className="text-sm leading-6 text-gray-400 text-justify">
            {t.about}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.navTitle}
          </h3>
          <ul className="space-y-2 text-sm">
            {t.nav.map((item, i) => (
              <li key={i} className="hover:text-white transition-colors">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.productsTitle}
          </h3>
          <ul className="space-y-2 text-sm">
            {t.products.map((item, i) => (
              <li key={i} className="hover:text-white transition-colors">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.contactTitle}
          </h3>

          <p className="text-sm mb-2">{t.phone}</p>
          <p className="text-sm mb-2">{t.email}</p>
          <p className="text-sm mb-4">{t.address}</p>

          {socials.length > 0 && (
            <div className="flex gap-4 mt-3">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mt-14 pt-6">
        <p className="text-center text-gray-400 text-xs">{t.copyright}</p>
      </div>
    </footer>
  );
}
