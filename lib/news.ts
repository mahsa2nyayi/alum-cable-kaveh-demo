/**
 * Sample articles for the demo. Replace with a CMS / database table in a real
 * deployment. Content is intentionally general (no company-specific claims).
 */
import type { Lang } from "@/app/context/LanguageContext";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  body: string[];
  img: string;
}

export const DEMO_NOTE: Record<Lang, string> = {
  fa: "محتوای نمونه برای نسخه‌ی دمو",
  en: "Sample content for the demo version",
  ar: "محتوى تجريبي لنسخة العرض",
};

export const ARTICLES: Record<Lang, Article[]> = {
  fa: [
    {
      id: "n1",
      title: "نگاهی به استانداردهای کابل‌های قدرت",
      excerpt: "مروری بر استانداردهای IEC و INSO و اهمیت آن‌ها برای کابل‌های فشار ضعیف.",
      img: "/image/cable.jpg",
      body: [
        "استانداردهایی مانند IEC 60502 و INSO 3569 ساختار، مواد و آزمون‌های کابل‌های قدرت فشار ضعیف را تعریف می‌کنند.",
        "رعایت این استانداردها تضمین می‌کند کابل در برابر حرارت، رطوبت و تنش‌های مکانیکی در طول عمر مفید عملکرد پایدار داشته باشد.",
      ],
    },
    {
      id: "n2",
      title: "آلومینیوم یا مس؟ انتخاب هادی مناسب",
      excerpt: "مقایسه‌ای کلی میان هادی‌های آلومینیومی و مسی از نظر وزن، هزینه و ظرفیت جریان.",
      img: "/image/cable.jpg",
      body: [
        "هادی آلومینیومی سبک‌تر و اقتصادی‌تر است و در شبکه‌های توزیع و خطوط هوایی کاربرد گسترده دارد.",
        "هادی مسی رسانایی بالاتری دارد و برای سطح مقطع‌های کوچک‌تر و کاربردهای منعطف مناسب‌تر است. انتخاب نهایی به بار، مسیر و بودجه‌ی پروژه بستگی دارد.",
      ],
    },
    {
      id: "n3",
      title: "نقش اکسترود در کیفیت عایق کابل",
      excerpt: "چگونه کنترل فرایند اکسترود بر یکنواختی و دوام عایق اثر می‌گذارد.",
      img: "/image/cable.jpg",
      body: [
        "عایق PVC یا XLPE در فرایند اکسترود روی هادی قرار می‌گیرد و یکنواختی ضخامت آن در ایمنی کابل نقش مستقیم دارد.",
        "پایش دما، سرعت خط و آزمون‌های نمونه‌برداری از روش‌های رایج کنترل کیفیت در این مرحله است.",
      ],
    },
  ],
  en: [
    {
      id: "n1",
      title: "A Look at Power Cable Standards",
      excerpt: "An overview of IEC and INSO standards and why they matter for low-voltage cables.",
      img: "/image/cable.jpg",
      body: [
        "Standards such as IEC 60502 and INSO 3569 define the construction, materials and tests of low-voltage power cables.",
        "Following them helps ensure a cable keeps performing under heat, moisture and mechanical stress throughout its service life.",
      ],
    },
    {
      id: "n2",
      title: "Aluminum or Copper? Choosing the Right Conductor",
      excerpt: "A general comparison of aluminum and copper conductors: weight, cost and current capacity.",
      img: "/image/cable.jpg",
      body: [
        "Aluminum conductors are lighter and more economical, and are widely used in distribution networks and overhead lines.",
        "Copper offers higher conductivity and suits smaller cross-sections and flexible applications. The final choice depends on load, route and budget.",
      ],
    },
    {
      id: "n3",
      title: "How Extrusion Shapes Insulation Quality",
      excerpt: "How process control during extrusion affects insulation uniformity and durability.",
      img: "/image/cable.jpg",
      body: [
        "PVC or XLPE insulation is applied over the conductor by extrusion, and its thickness uniformity directly affects cable safety.",
        "Temperature monitoring, line-speed control and sample testing are common quality measures at this stage.",
      ],
    },
  ],
  ar: [
    {
      id: "n1",
      title: "نظرة على معايير كابلات الطاقة",
      excerpt: "استعراض لمعايير IEC وINSO وأهميتها للكابلات منخفضة الجهد.",
      img: "/image/cable.jpg",
      body: [
        "تحدد معايير مثل IEC 60502 وINSO 3569 بنية ومواد واختبارات كابلات الطاقة منخفضة الجهد.",
        "يساعد الالتزام بها على بقاء الكابل موثوقًا تحت الحرارة والرطوبة والإجهاد الميكانيكي طوال عمره التشغيلي.",
      ],
    },
    {
      id: "n2",
      title: "ألمنيوم أم نحاس؟ اختيار الموصل المناسب",
      excerpt: "مقارنة عامة بين موصلات الألمنيوم والنحاس من حيث الوزن والتكلفة وسعة التيار.",
      img: "/image/cable.jpg",
      body: [
        "موصلات الألمنيوم أخف وأكثر اقتصادية وتُستخدم على نطاق واسع في شبكات التوزيع والخطوط الهوائية.",
        "يتميز النحاس بموصلية أعلى ويناسب المقاطع الصغيرة والتطبيقات المرنة. ويعتمد الاختيار النهائي على الحمل والمسار والميزانية.",
      ],
    },
    {
      id: "n3",
      title: "دور البثق في جودة عزل الكابل",
      excerpt: "كيف يؤثر التحكم في عملية البثق على انتظام العزل ومتانته.",
      img: "/image/cable.jpg",
      body: [
        "يُطبَّق عزل PVC أو XLPE على الموصل بالبثق، ويؤثر انتظام سماكته مباشرة في سلامة الكابل.",
        "تُعد مراقبة الحرارة والتحكم بسرعة الخط واختبار العينات من إجراءات الجودة الشائعة في هذه المرحلة.",
      ],
    },
  ],
};
