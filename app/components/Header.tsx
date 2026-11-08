"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLanguage, type Lang } from "../context/LanguageContext";

const menuItems: Record<Lang, { name: string; path: string }[]> = {
  fa: [
    { name: "صفحه اصلی", path: "/" },
    { name: "درباره ما", path: "/about" },
    { name: "محصولات", path: "/products" },
    { name: "اطلاعات فنی", path: "/technical" },
    { name: "تازه‌های صنعت برق", path: "/news" },
    { name: "پروژه‌ها و مشتریان", path: "/customers" },
    { name: "تماس با ما", path: "/contactUs" },
  ],
  en: [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Technical Info", path: "/technical" },
    { name: "News", path: "/news" },
    { name: "Projects & Clients", path: "/customers" },
    { name: "Contact Us", path: "/contactUs" },
  ],
  ar: [
    { name: "الصفحة الرئيسية", path: "/" },
    { name: "من نحن", path: "/about" },
    { name: "المنتجات", path: "/products" },
    { name: "المعلومات الفنية", path: "/technical" },
    { name: "أخبار", path: "/news" },
    { name: "المشاريع والعملاء", path: "/customers" },
    { name: "اتصل بنا", path: "/contactUs" },
  ],
};

const LANGS: Lang[] = ["fa", "en", "ar"];
const ARIA: Record<Lang, { menu: string; lang: string; nav: string }> = {
  fa: { menu: "منو", lang: "زبان", nav: "منوی اصلی" },
  en: { menu: "Menu", lang: "Language", nav: "Main navigation" },
  ar: { menu: "القائمة", lang: "اللغة", nav: "القائمة الرئيسية" },
};

const Header = () => {
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const rtl = lang !== "en";

  // glass effect gets stronger once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu after navigating
  useEffect(() => setMenuOpen(false), [pathname]);

  // close with Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const fontClass = lang === "fa" ? "font-vazirmatn" : lang === "ar" ? "font-cairo" : "font-sans";
  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);

  // Admin screens have their own chrome.
  if (pathname.startsWith("/admin")) return null;

  const LangSwitch = ({ className = "" }: { className?: string }) => (
    <div
      role="group"
      aria-label={ARIA[lang].lang}
      dir="ltr"
      className={`inline-flex rounded-full border border-white/10 bg-white/5 p-0.5 ${className}`}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            lang === l ? "bg-orange-500 text-white shadow" : "text-gray-300 hover:text-white"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <header
      dir={rtl ? "rtl" : "ltr"}
      className={`fixed inset-x-0 top-0 z-50 border-b text-white transition-all duration-300 ${fontClass} ${
        scrolled
          ? "border-white/10 bg-[#0a1a2f]/90 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "border-transparent bg-[#0a1a2f]/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Alum Cable Kaveh">
          <Image src="/logo.png" alt="" width={44} height={44} priority className="h-11 w-11 object-contain" />
          <span className="hidden text-lg font-bold tracking-wide text-orange-500 sm:inline" dir="ltr">
            ALUM CABLE KAVEH
          </span>
        </Link>

        {/* Desktop menu */}
        <nav aria-label={ARIA[lang].nav} className="hidden items-center gap-x-1 lg:flex">
          {menuItems[lang].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              aria-current={isActive(item.path) ? "page" : undefined}
              className={`relative rounded-full px-3 py-2 text-sm transition ${
                isActive(item.path)
                  ? "bg-white/10 font-semibold text-orange-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <LangSwitch />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-200 hover:bg-white/10 lg:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={ARIA[lang].menu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="flex flex-col gap-1 border-t border-white/10 bg-[#0a1a2f]/95 px-6 py-4 backdrop-blur-xl lg:hidden"
        >
          {menuItems[lang].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              aria-current={isActive(item.path) ? "page" : undefined}
              className={`rounded-lg px-3 py-3 text-base ${
                isActive(item.path)
                  ? "bg-white/10 font-semibold text-orange-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-2 flex justify-center border-t border-white/10 pt-4">
            <LangSwitch />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
