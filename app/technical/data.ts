// app/technical/data.ts
export type Lang = "FA" | "EN" | "AR";

export interface StandardEntry {
  number: string;
  title: Record<Lang, string>;
  scope: Record<Lang, string>;
  appliesTo: string[];
}

export interface TableData {
  id: string;
  caption: Record<Lang, string>;
  headers: Record<Lang, string[]>;
  rows: string[][];
  note?: Record<Lang, string>;
}

export interface StandardSection {
  id: string;
  org: "IEC" | "INSO" | "DIN" | "EN" | "ASTM";
  color: string;
  accent: string;
  border: string;
  tag: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  standards: StandardEntry[];
  tables: TableData[];
  highlights: Record<Lang, string[]>;
}

// ── Color palettes per org ────────────────────────────────────────────────────
// IEC → blue, INSO → orange, DIN → emerald, EN → violet, ASTM → amber

export const STANDARD_SECTIONS: StandardSection[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // IEC
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "iec",
    org: "IEC",
    color: "text-sky-400",
    accent: "bg-sky-500/10",
    border: "border-sky-500/25",
    tag: "bg-sky-500/10 text-sky-300 border-sky-500/25",
    title: {
      FA: "استانداردهای IEC",
      EN: "IEC Standards",
      AR: "معايير IEC",
    },
    description: {
      FA: "کمیسیون بین‌المللی الکتروتکنیک (IEC) معتبرترین سازمان استانداردگذار جهانی در حوزه الکتروتکنیک است. استانداردهای IEC پایه اصلی تولید و آزمون کابل‌های برق در سراسر جهان می‌باشند.",
      EN: "The International Electrotechnical Commission (IEC) is the world's leading standards body for electrotechnology. IEC standards form the foundation for cable manufacturing and testing globally.",
      AR: "لجنة الكهرتقنية الدولية (IEC) هي الهيئة الدولية الرائدة لوضع معايير التكنولوجيا الكهربائية. تشكل معايير IEC الأساس لتصنيع الكابلات واختبارها على مستوى العالم.",
    },
    highlights: {
      FA: ["بیش از ۱۰۰ کشور عضو", "مرجع اصلی صنعت کابل جهان", "بازنگری منظم هر ۵ سال"],
      EN: ["Over 100 member countries", "Primary global cable industry reference", "Regular review every 5 years"],
      AR: ["أكثر من 100 دولة عضو", "المرجع الرئيسي لصناعة الكابلات عالمياً", "مراجعة منتظمة كل 5 سنوات"],
    },
    standards: [
      {
        number: "IEC 60228",
        title: { FA: "هادی‌های کابل‌های عایق‌دار", EN: "Conductors of insulated cables", AR: "موصلات الكابلات المعزولة" },
        scope: { FA: "تعریف و کلاس‌بندی هادی‌های مورد استفاده در کابل‌های برق بر اساس تعداد رشته و سطح مقطع", EN: "Defines and classifies conductors used in electrical cables by strand count and cross-section", AR: "يحدد ويصنف الموصلات المستخدمة في الكابلات الكهربائية" },
        appliesTo: ["NYY", "NAYY", "N2XY", "NA2XY", "همه کابل‌های قدرت"],
      },
      {
        number: "IEC 60502-1",
        title: { FA: "کابل‌های قدرت با عایق اکسترودشده – تا ۱kV", EN: "Power cables with extruded insulation – up to 1kV", AR: "كابلات الطاقة بعزل مبثوق – حتى 1kV" },
        scope: { FA: "الزامات طراحی، ساخت، آزمون و علامت‌گذاری کابل‌های قدرت فشار ضعیف", EN: "Requirements for design, construction, testing and marking of LV power cables", AR: "متطلبات تصميم وبناء واختبار وتحديد كابلات الطاقة منخفضة الجهد" },
        appliesTo: ["NYY", "NAYY", "N2XY", "NA2XY", "NYRY", "NYBY", "NYM"],
      },
      {
        number: "IEC 60502-2",
        title: { FA: "کابل‌های قدرت با عایق اکسترودشده – ۱ تا ۳۰kV", EN: "Power cables with extruded insulation – 1 to 30kV", AR: "كابلات الطاقة بعزل مبثوق – 1 إلى 30kV" },
        scope: { FA: "کابل‌های فشار متوسط با عایق XLPE یا EPR برای توزیع و انتقال", EN: "MV cables with XLPE or EPR insulation for distribution and transmission", AR: "كابلات الجهد المتوسط بعزل XLPE أو EPR للتوزيع والنقل" },
        appliesTo: ["CC 20kV", "CC 30kV", "CCT 20kV", "CCT 33kV"],
      },
      {
        number: "IEC 60227",
        title: { FA: "سیم و کابل با عایق PVC – ولتاژ نامی تا ۴۵۰/۷۵۰V", EN: "PVC insulated cables – rated voltage up to 450/750V", AR: "كابلات العزل PVC – جهد مقنن حتى 450/750V" },
        scope: { FA: "سیم‌های ساختمانی، انعطاف‌پذیر و کابل‌های خانگی با عایق PVC", EN: "Building wires, flexible cables and household cables with PVC insulation", AR: "أسلاك المباني والكابلات المرنة والمنزلية بعزل PVC" },
        appliesTo: ["NYM", "H07V-K", "H05V-K", "H05VV-F", "H07VV-F"],
      },
      {
        number: "IEC 60332-1",
        title: { FA: "آزمون انتشار شعله – تک کابل", EN: "Flame propagation test – single cable", AR: "اختبار انتشار اللهب – كابل واحد" },
        scope: { FA: "روش آزمون برای ارزیابی مقاومت کابل در برابر انتشار شعله در حالت نصب عمودی", EN: "Test method to evaluate cable resistance to flame spread in vertical installation", AR: "طريقة اختبار لتقييم مقاومة الكابل لانتشار اللهب عند التركيب العمودي" },
        appliesTo: ["همه انواع کابل"],
      },
      {
        number: "IEC 60332-3",
        title: { FA: "آزمون انتشار شعله – دسته کابل", EN: "Flame propagation test – bunched cables", AR: "اختبار انتشار اللهب – حزمة كابلات" },
        scope: { FA: "آزمون برای دسته‌ای از کابل‌ها در حالت نصب عمودی در شرایط آتش کنترل‌شده", EN: "Test for bunched cables in vertical installation under controlled fire conditions", AR: "اختبار لحزمة كابلات في التركيب العمودي في ظروف حريق محكومة" },
        appliesTo: ["کابل‌های صنعتی", "کابل‌های ساختمانی"],
      },
      {
        number: "IEC 60754",
        title: { FA: "گازهای حاصل از احتراق عایق کابل", EN: "Gases evolved during combustion of cable materials", AR: "الغازات المتطورة أثناء احتراق مواد الكابل" },
        scope: { FA: "اندازه‌گیری میزان هالوژن در گازهای حاصل از سوختن مواد عایق و روکش کابل", EN: "Measurement of halogen content in gases from burning insulation and sheath materials", AR: "قياس محتوى الهالوجين في الغازات الناتجة عن احتراق مواد العزل" },
        appliesTo: ["کابل‌های LSZH/LSHF"],
      },
      {
        number: "IEC 61089",
        title: { FA: "هادی‌های سیمی گرد برای خطوط هوایی", EN: "Round wire concentric lay overhead conductors", AR: "موصلات متحدة المركز للخطوط الهوائية" },
        scope: { FA: "الزامات هادی‌های AAC، AAAC، ACSR و HD برای خطوط انتقال و توزیع هوایی", EN: "Requirements for AAC, AAAC, ACSR and HD conductors for overhead transmission and distribution", AR: "متطلبات موصلات AAC وAAAC وACSR وHD للخطوط الهوائية" },
        appliesTo: ["AAC", "AAAC", "ACSR", "HD"],
      },
      {
        number: "IEC 60287",
        title: { FA: "محاسبه جریان مجاز کابل‌های برق", EN: "Calculation of current rating for power cables", AR: "حساب التيار المقنن لكابلات الطاقة" },
        scope: { FA: "روش‌های محاسبه ظرفیت جریان کابل‌ها در شرایط مختلف نصب و محیطی", EN: "Methods for calculating cable current capacity under various installation and environmental conditions", AR: "طرق حساب سعة التيار للكابلات في ظروف تركيب وبيئة مختلفة" },
        appliesTo: ["همه کابل‌های قدرت"],
      },
    ],
    tables: [
      {
        id: "iec-conductor-classes",
        caption: { FA: "جدول کلاس‌بندی هادی طبق IEC 60228", EN: "Conductor classification per IEC 60228", AR: "تصنيف الموصلات وفق IEC 60228" },
        headers: {
          FA: ["کلاس", "نوع", "تعداد رشته حداقل", "کاربرد", "مثال"],
          EN: ["Class", "Type", "Min Strands", "Application", "Example"],
          AR: ["الفئة", "النوع", "أدنى عدد أسلاك", "الاستخدام", "مثال"],
        },
        rows: [
          ["1", "Solid / جامد", "1", "Fixed installation / نصب ثابت", "H05V-U, H07V-U"],
          ["2", "Stranded / رشته‌ای", "7", "Fixed installation / نصب ثابت", "NYY, NAYY, N2XY"],
          ["5", "Flexible / انعطاف‌پذیر", "≥16", "Portable / متحرک", "H07V-K, H05VV-F"],
          ["6", "Extra-flex / فوق انعطاف", "≥32", "Special / خاص", "Welding cables"],
        ],
        note: {
          FA: "کلاس‌های ۳ و ۴ برای کابل‌های مخابراتی استفاده می‌شوند و در این جدول ذکر نشده‌اند.",
          EN: "Classes 3 and 4 are used for telecommunication cables and are not listed here.",
          AR: "تُستخدم الفئتان 3 و4 لكابلات الاتصالات ولم يتم ذكرهما هنا.",
        },
      },
      {
        id: "iec-voltage-grades",
        caption: { FA: "جدول گرادبندی ولتاژ استاندارد", EN: "Standard voltage grades", AR: "درجات الجهد القياسية" },
        headers: {
          FA: ["ولتاژ نامی U₀/U", "Um حداکثر", "سطح عایق‌بندی", "کابل نمونه"],
          EN: ["Rated Voltage U₀/U", "Max Um", "Insulation Level", "Example Cable"],
          AR: ["الجهد المقنن U₀/U", "الحد الأقصى Um", "مستوى العزل", "مثال كابل"],
        },
        rows: [
          ["300/500 V", "500 V", "0.5 kV", "H05VV-F, H05V-K"],
          ["450/750 V", "750 V", "0.7 kV", "H07V-K, H07V-R, NYM"],
          ["0.6/1 kV", "1.2 kV", "1 kV", "NYY, NAYY, N2XY, NA2XY"],
          ["1.8/3 kV", "3.6 kV", "3 kV", "MV cables (light)"],
          ["3.6/6 kV", "7.2 kV", "6 kV", "MV cables"],
          ["6/10 kV", "12 kV", "10 kV", "MV cables"],
          ["8.7/15 kV", "17.5 kV", "15 kV", "MV cables"],
          ["12/20 kV", "24 kV", "20 kV", "CC 20kV, CCT 20kV"],
          ["18/30 kV", "36 kV", "30 kV", "CC 30kV, CCT 33kV"],
          ["19/33 kV", "36 kV", "33 kV", "CCT 33kV"],
        ],
      },
      {
        id: "iec-insulation-compare",
        caption: { FA: "مقایسه فنی عایق‌های PVC و XLPE", EN: "Technical comparison of PVC and XLPE insulations", AR: "مقارنة فنية لعزل PVC وXLPE" },
        headers: {
          FA: ["ویژگی", "PVC", "XLPE", "برتری"],
          EN: ["Property", "PVC", "XLPE", "Better"],
          AR: ["الخاصية", "PVC", "XLPE", "الأفضل"],
        },
        rows: [
          ["Max operating temp / حداکثر دمای کاری", "70°C", "90°C", "XLPE"],
          ["Max short-circuit temp / دمای اتصال کوتاه", "160°C", "250°C", "XLPE"],
          ["Current capacity / ظرفیت جریان", "Baseline", "+15~20%", "XLPE"],
          ["Chemical resistance / مقاومت شیمیایی", "Moderate / متوسط", "Excellent / عالی", "XLPE"],
          ["Water resistance / مقاومت آب", "Good / خوب", "Excellent / عالی", "XLPE"],
          ["Flexibility / انعطاف‌پذیری", "Better / بهتر", "Less / کمتر", "PVC"],
          ["Low temp installation / نصب در سرما", "Min −5°C", "Min −10°C", "XLPE"],
          ["Relative cost / هزینه نسبی", "Lower / پایین‌تر", "Higher / بالاتر", "PVC"],
          ["Recyclability / قابلیت بازیافت", "Difficult / دشوار", "Moderate / متوسط", "XLPE"],
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // INSO
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "inso",
    org: "INSO",
    color: "text-orange-400",
    accent: "bg-orange-500/10",
    border: "border-orange-500/25",
    tag: "bg-orange-500/10 text-orange-300 border-orange-500/25",
    title: {
      FA: "استانداردهای INSO",
      EN: "INSO Standards",
      AR: "معايير INSO",
    },
    description: {
      FA: "سازمان ملی استاندارد ایران (INSO) استانداردهای ملی را بر اساس نیازهای صنعت کشور و با تطابق با استانداردهای بین‌المللی تدوین می‌کند. استانداردهای INSO در ایران الزامی بوده و محصولات کابل باید دارای نشان استاندارد ملی ایران باشند.",
      EN: "The Institute of Standards and Industrial Research of Iran (INSO) develops national standards based on the country's industrial needs and in alignment with international standards. INSO standards are mandatory in Iran.",
      AR: "تضع منظمة المعايير والبحوث الصناعية الإيرانية (INSO) معايير وطنية بناءً على احتياجات الصناعة المحلية وبما يتوافق مع المعايير الدولية.",
    },
    highlights: {
      FA: ["معادل استانداردهای IEC در ایران", "الزامی برای فروش در بازار ایران", "نشان استاندارد ملی اجباری"],
      EN: ["Iranian equivalents of IEC standards", "Mandatory for sales in Iranian market", "National standard mark required"],
      AR: ["المعادل الإيراني لمعايير IEC", "إلزامي للبيع في السوق الإيرانية", "علامة المعيار الوطني مطلوبة"],
    },
    standards: [
      {
        number: "INSO 607-1",
        title: { FA: "کابل‌های برق – قسمت ۱: الزامات کلی", EN: "Power cables – Part 1: General requirements", AR: "كابلات الطاقة – الجزء 1: المتطلبات العامة" },
        scope: { FA: "الزامات کلی طراحی، ساخت، آزمون و علامت‌گذاری کابل‌های برق", EN: "General requirements for design, construction, testing and marking of power cables", AR: "المتطلبات العامة لتصميم وبناء واختبار كابلات الطاقة" },
        appliesTo: ["همه کابل‌های قدرت"],
      },
      {
        number: "INSO 607-3",
        title: { FA: "سیم‌های نصب ثابت با عایق PVC", EN: "Fixed installation wires with PVC insulation", AR: "أسلاك التركيب الثابت بعزل PVC" },
        scope: { FA: "سیم‌های یک‌رشته و چند رشته با عایق PVC برای نصب ثابت در ساختمان‌ها و تأسیسات صنعتی با ولتاژ تا ۴۵۰/۷۵۰V", EN: "Single and multi-core PVC insulated wires for fixed installation in buildings and industrial facilities up to 450/750V", AR: "أسلاك PVC أحادية ومتعددة الأسلاك للتركيب الثابت في المباني والمنشآت الصناعية" },
        appliesTo: ["H05V-U", "H07V-U", "H05V-K", "H07V-K", "H0V-R", "H07V-R"],
      },
      {
        number: "INSO 607-5",
        title: { FA: "کابل‌های انعطاف‌پذیر با عایق PVC", EN: "Flexible cables with PVC insulation", AR: "الكابلات المرنة بعزل PVC" },
        scope: { FA: "کابل‌های انعطاف‌پذیر با عایق PVC برای وسایل خانگی، ابزار برقی و تجهیزات سیار", EN: "Flexible PVC insulated cables for household appliances, power tools and portable equipment", AR: "كابلات PVC مرنة للأجهزة المنزلية والأدوات الكهربائية والمعدات المتنقلة" },
        appliesTo: ["H03VV-F", "H05VV-F", "H07VV-F"],
      },
      {
        number: "INSO 3569-1",
        title: { FA: "کابل‌های قدرت فشار ضعیف – قسمت ۱", EN: "LV power cables – Part 1", AR: "كابلات طاقة منخفضة الجهد – الجزء 1" },
        scope: { FA: "الزامات کابل‌های قدرت با ولتاژ نامی ۰.۶/۱kV با عایق PVC یا XLPE برای توزیع برق", EN: "Requirements for 0.6/1kV power cables with PVC or XLPE insulation for power distribution", AR: "متطلبات كابلات الطاقة 0.6/1kV بعزل PVC أو XLPE لتوزيع الطاقة" },
        appliesTo: ["NYY", "NAYY", "N2XY", "NA2XY", "NYRY", "NYBY", "N2XRY"],
      },
      {
        number: "INSO 3569-2",
        title: { FA: "کابل‌های قدرت فشار ضعیف – قسمت ۲: آزمون‌ها", EN: "LV power cables – Part 2: Tests", AR: "كابلات طاقة منخفضة الجهد – الجزء 2: الاختبارات" },
        scope: { FA: "روش‌های آزمون برای کابل‌های قدرت فشار ضعیف شامل آزمون‌های الکتریکی، مکانیکی و حرارتی", EN: "Test methods for LV power cables including electrical, mechanical and thermal tests", AR: "طرق اختبار كابلات الطاقة منخفضة الجهد بما في ذلك الاختبارات الكهربائية والميكانيكية والحرارية" },
        appliesTo: ["همه کابل‌های INSO 3569-1"],
      },
      {
        number: "INSO 4377",
        title: { FA: "هادی‌های آلومینیومی برای خطوط هوایی – AAC", EN: "Aluminium conductors for overhead lines – AAC", AR: "موصلات الألومنيوم للخطوط الهوائية – AAC" },
        scope: { FA: "الزامات هادی‌های تمام آلومینیوم برای خطوط انتقال و توزیع هوایی", EN: "Requirements for all-aluminium conductors for overhead transmission and distribution lines", AR: "متطلبات موصلات الألومنيوم الكاملة للخطوط الهوائية" },
        appliesTo: ["AAC"],
      },
      {
        number: "INSO 4378",
        title: { FA: "هادی‌های ACSR برای خطوط هوایی", EN: "ACSR conductors for overhead lines", AR: "موصلات ACSR للخطوط الهوائية" },
        scope: { FA: "الزامات هادی‌های آلومینیومی با تقویت فولادی برای خطوط هوایی با دهانه‌های بلند", EN: "Requirements for aluminium conductors with steel reinforcement for long-span overhead lines", AR: "متطلبات موصلات الألومنيوم المقواة بالفولاذ للخطوط الهوائية طويلة المسافة" },
        appliesTo: ["ACSR"],
      },
      {
        number: "INSO 9466",
        title: { FA: "کابل‌های هوایی دسته‌ای فشار ضعیف – ABC", EN: "Low voltage aerial bundled cables – ABC", AR: "كابلات هوائية مجمعة منخفضة الجهد – ABC" },
        scope: { FA: "الزامات کابل‌های ABC برای توزیع برق هوایی در شبکه‌های شهری و روستایی", EN: "Requirements for ABC cables for aerial power distribution in urban and rural networks", AR: "متطلبات كابلات ABC لتوزيع الطاقة الهوائية في الشبكات الحضرية والريفية" },
        appliesTo: ["ABC"],
      },
    ],
    tables: [
      {
        id: "inso-607-5-table",
        caption: {
          FA: "جدول کابل‌های کد ۵۳ از INSO 607-5 (کابل‌های انعطاف‌پذیر PVC)",
          EN: "Table of Code 53 cables from INSO 607-5 (Flexible PVC cables)",
          AR: "جدول كابلات الكود 53 من INSO 607-5 (كابلات PVC مرنة)",
        },
        headers: {
          FA: ["نوع کابل", "ولتاژ نامی", "دمای کاری", "تعداد رشته", "سطح مقطع (mm²)", "کاربرد"],
          EN: ["Cable Type", "Rated Voltage", "Operating Temp", "Strands", "Section (mm²)", "Application"],
          AR: ["نوع الكابل", "الجهد المقنن", "درجة حرارة التشغيل", "الأسلاك", "المقطع (mm²)", "الاستخدام"],
        },
        rows: [
          ["H03VV-F", "300/300V", "60°C", "Class 5", "0.5 – 0.75", "لوازم خانگی سبک / Light appliances"],
          ["H03VVH2-F", "300/300V", "60°C", "Class 5", "0.5 – 0.75", "سیم تخت / Flat cord"],
          ["H05VV-F", "300/500V", "70°C", "Class 5", "0.75 – 4", "لوازم خانگی / Household appliances"],
          ["H05VVH2-F", "300/500V", "70°C", "Class 5", "0.75 – 2.5", "سیم تخت خانگی / Flat household"],
          ["H05BB-F", "300/500V", "90°C", "Class 5", "0.75 – 4", "دمای بالا / High temp appliances"],
          ["H07RN-F", "450/750V", "60°C", "Class 5", "1.5 – 50", "صنعتی سنگین / Heavy industrial"],
          ["H07VV-F", "450/750V", "70°C", "Class 5", "1.5 – 6", "ابزار برقی / Power tools"],
          ["H07BQ-F", "450/750V", "90°C", "Class 5", "1.5 – 50", "مقاوم UV / UV resistant"],
        ],
        note: {
          FA: "کد ۵۳ به کابل‌های PVC انعطاف‌پذیر با دو لایه PVC (عایق + روکش) اشاره دارد. حرف H نشان‌دهنده استاندارد هماهنگ اروپایی است.",
          EN: "Code 53 refers to flexible PVC cables with two PVC layers (insulation + sheath). The letter H indicates harmonized European standard.",
          AR: "يشير الكود 53 إلى كابلات PVC المرنة ذات طبقتي PVC (عزل + غلاف). الحرف H يشير إلى معيار أوروبي منسق.",
        },
      },
      {
        id: "inso-3569-table",
        caption: {
          FA: "جدول مشخصات کابل‌های فشار ضعیف طبق INSO 3569-1",
          EN: "LV cable specifications per INSO 3569-1",
          AR: "مواصفات كابلات الجهد المنخفض وفق INSO 3569-1",
        },
        headers: {
          FA: ["نوع کابل", "هادی", "عایق", "زره", "ولتاژ نامی", "دمای کاری", "سایز (mm²)"],
          EN: ["Cable Type", "Conductor", "Insulation", "Armour", "Rated V", "Max Temp", "Section (mm²)"],
          AR: ["نوع الكابل", "الموصل", "العزل", "الدرع", "الجهد", "أقصى حرارة", "المقطع"],
        },
        rows: [
          ["NYY", "Cu / مسی", "PVC", "—", "0.6/1 kV", "70°C", "0.5 – 500"],
          ["NAYY", "Al / آلومینیوم", "PVC", "—", "0.6/1 kV", "70°C", "16 – 500"],
          ["N2XY", "Cu / مسی", "XLPE", "—", "0.6/1 kV", "90°C", "1.5 – 500"],
          ["NA2XY", "Al / آلومینیوم", "XLPE", "—", "0.6/1 kV", "90°C", "16 – 500"],
          ["NYRY", "Cu / مسی", "PVC", "SWA سیم گرد", "0.6/1 kV", "70°C", "1.5 – 300"],
          ["NAYRY", "Al / آلومینیوم", "PVC", "SWA سیم گرد", "0.6/1 kV", "70°C", "16 – 300"],
          ["NYBY", "Cu / مسی", "PVC", "STA تسمه", "0.6/1 kV", "70°C", "1.5 – 300"],
          ["NAYBY", "Al / آلومینیوم", "PVC", "STA تسمه", "0.6/1 kV", "70°C", "16 – 300"],
          ["N2XRY", "Cu / مسی", "XLPE", "SWA سیم گرد", "0.6/1 kV", "90°C", "1.5 – 300"],
          ["NA2XRY", "Al / آلومینیوم", "XLPE", "SWA سیم گرد", "0.6/1 kV", "90°C", "16 – 300"],
          ["N2XYBY", "Cu / مسی", "XLPE", "STA تسمه", "0.6/1 kV", "90°C", "1.5 – 300"],
          ["NA2XYBY", "Al / آلومینیوم", "XLPE", "STA تسمه", "0.6/1 kV", "90°C", "16 – 300"],
          ["NYCY", "Cu + شیلد مسی", "PVC", "—", "0.6/1 kV", "70°C", "1.5 – 185"],
          ["NYCYRY", "Cu + شیلد مسی", "PVC", "SWA", "0.6/1 kV", "70°C", "1.5 – 185"],
          ["NYM", "Cu / مسی", "PVC", "—", "300/500 V", "70°C", "1.5 – 35"],
        ],
      },
      {
        id: "inso-aerial-table",
        caption: {
          FA: "جدول هادی‌های هوایی طبق INSO 4377 و 4378",
          EN: "Overhead conductors per INSO 4377 & 4378",
          AR: "موصلات هوائية وفق INSO 4377 و4378",
        },
        headers: {
          FA: ["نوع هادی", "ترکیب", "استاندارد", "سایز (mm²)", "استحکام کششی", "کاربرد"],
          EN: ["Conductor Type", "Composition", "Standard", "Section (mm²)", "Tensile Strength", "Application"],
          AR: ["نوع الموصل", "التركيب", "المعيار", "المقطع", "قوة الشد", "الاستخدام"],
        },
        rows: [
          ["HD", "مسی جامد / Solid Cu", "IEC 61089", "16 – 400", "بالا / High", "خطوط کوتاه / Short spans"],
          ["AAC", "تمام آلومینیوم / All Al", "INSO 4377", "16 – 500", "متوسط / Medium", "شهری / Urban distribution"],
          ["AAAC", "آلیاژ آلومینیوم / Al alloy", "IEC 61089", "16 – 500", "بالا / High", "ساحلی / Coastal, long spans"],
          ["ACSR", "Al + هسته فولادی / Steel core", "INSO 4378", "25 – 630", "بسیار بالا / Very high", "انتقال / Transmission"],
          ["ABC", "XLPE + Al دسته‌ای", "INSO 9466", "16 – 150", "متوسط / Medium", "توزیع شهری / Urban dist."],
          ["CC 20kV", "Al + عایق XLPE", "IEC 60502-2", "16 – 240", "متوسط / Medium", "هوایی MV / MV aerial"],
          ["CCT 20kV", "Al + XLPE پیچیده", "IEC 60502-2", "16 – 185", "متوسط / Medium", "هوایی MV / MV aerial"],
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DIN / EN
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "din-en",
    org: "EN",
    color: "text-emerald-400",
    accent: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    tag: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    title: {
      FA: "استانداردهای DIN / EN",
      EN: "DIN / EN Standards",
      AR: "معايير DIN / EN",
    },
    description: {
      FA: "استانداردهای DIN آلمان و EN اروپا پایه بسیاری از نام‌گذاری‌های کابل (مانند NYY، H07V-K) هستند. این استانداردها به طور گسترده در صنعت کابل ایران نیز مورد استفاده قرار می‌گیرند.",
      EN: "German DIN and European EN standards form the basis of many cable designations (such as NYY, H07V-K). These standards are also widely used in the Iranian cable industry.",
      AR: "تشكل معايير DIN الألمانية وEN الأوروبية أساس تسميات الكابلات الشائعة مثل NYY وH07V-K.",
    },
    highlights: {
      FA: ["پایه نام‌گذاری کابل‌های اروپایی", "هماهنگ با IEC", "مرجع صنعت کابل آلمان و اروپا"],
      EN: ["Basis for European cable designations", "Harmonized with IEC", "Reference for German and European cable industry"],
      AR: ["أساس تسمية الكابلات الأوروبية", "متناسق مع IEC", "مرجع صناعة الكابلات الأوروبية"],
    },
    standards: [
      {
        number: "DIN VDE 0250",
        title: { FA: "کابل‌های قدرت با عایق PVC", EN: "PVC insulated power cables", AR: "كابلات الطاقة بعزل PVC" },
        scope: { FA: "استاندارد پایه آلمانی برای کابل‌های قدرت با عایق PVC که پایه نام‌گذاری NYY، NYM و سایر انواع است", EN: "German base standard for PVC insulated power cables forming the basis of NYY, NYM and other type designations", AR: "المعيار الألماني الأساسي لكابلات الطاقة بعزل PVC" },
        appliesTo: ["NYY", "NAYY", "NYM", "NYRY", "NYBY"],
      },
      {
        number: "DIN VDE 0271",
        title: { FA: "کابل‌های قدرت با عایق XLPE", EN: "XLPE insulated power cables", AR: "كابلات الطاقة بعزل XLPE" },
        scope: { FA: "استاندارد آلمانی برای کابل‌های قدرت با عایق XLPE که پایه نام‌گذاری N2XY، NA2XY و مشابه است", EN: "German standard for XLPE insulated power cables forming the basis of N2XY, NA2XY designations", AR: "المعيار الألماني لكابلات الطاقة بعزل XLPE" },
        appliesTo: ["N2XY", "NA2XY", "N2XRY", "NA2XRY"],
      },
      {
        number: "EN 50525-2-31",
        title: { FA: "سیم‌های برق ساده با عایق PVC", EN: "Simple PVC insulated electric wires", AR: "أسلاك كهربائية بسيطة بعزل PVC" },
        scope: { FA: "سیم‌های H05V-U، H07V-U، H05V-K، H07V-K، H0V-R و H07V-R برای نصب ثابت و انعطاف‌پذیر", EN: "Wires H05V-U, H07V-U, H05V-K, H07V-K, H0V-R and H07V-R for fixed and flexible installation", AR: "أسلاك H05V-U وH07V-U وH05V-K وH07V-K للتركيب الثابت والمرن" },
        appliesTo: ["H05V-U", "H07V-U", "H05V-K", "H07V-K", "H0V-R", "H07V-R"],
      },
      {
        number: "EN 50525-2-11",
        title: { FA: "کابل‌های انعطاف‌پذیر PVC", EN: "Flexible PVC cables", AR: "كابلات PVC مرنة" },
        scope: { FA: "کابل‌های H03VV-F، H05VV-F و H07VV-F برای وسایل خانگی و تجهیزات سبک صنعتی", EN: "Cables H03VV-F, H05VV-F and H07VV-F for household appliances and light industrial equipment", AR: "كابلات H03VV-F وH05VV-F وH07VV-F للأجهزة المنزلية والمعدات الصناعية الخفيفة" },
        appliesTo: ["H03VV-F", "H05VV-F", "H07VV-F"],
      },
      {
        number: "EN 50182",
        title: { FA: "هادی‌های سیمی گرد برای خطوط هوایی", EN: "Conductors for overhead lines – round wire", AR: "موصلات الخطوط الهوائية – سلك دائري" },
        scope: { FA: "الزامات هادی‌های HD (مسی سخت‌کشیده) و سایر هادی‌های خطوط هوایی", EN: "Requirements for HD (hard drawn copper) and other overhead line conductors", AR: "متطلبات موصلات HD والموصلات الهوائية الأخرى" },
        appliesTo: ["HD", "AAC", "AAAC"],
      },
      {
        number: "HD 620",
        title: { FA: "کابل‌های توزیع با ولتاژ نامی ۱ تا ۳۰kV", EN: "Distribution cables rated 1 to 30kV", AR: "كابلات التوزيع من 1 إلى 30kV" },
        scope: { FA: "کابل‌های هوایی پوشش‌دار برای توزیع برق در ولتاژهای متوسط ۲۰ و ۳۰ کیلوولت", EN: "Covered aerial cables for power distribution at medium voltages 20 and 30kV", AR: "الكابلات الهوائية المغطاة لتوزيع الطاقة عند الجهود المتوسطة" },
        appliesTo: ["CC 20kV", "CC 30kV", "CCT 20kV", "CCT 33kV"],
      },
    ],
    tables: [
      {
        id: "din-designation-table",
        caption: {
          FA: "جدول کدگذاری نام‌گذاری کابل‌های DIN/VDE",
          EN: "DIN/VDE cable designation coding table",
          AR: "جدول ترميز تسمية كابلات DIN/VDE",
        },
        headers: {
          FA: ["کد حرف", "معنی (فارسی)", "Meaning (EN)", "مثال"],
          EN: ["Letter Code", "Meaning (FA)", "Meaning (EN)", "Example"],
          AR: ["رمز الحرف", "المعنى (FA)", "المعنى (EN)", "مثال"],
        },
        rows: [
          ["N", "استاندارد آلمانی / German std", "German standard (DIN)", "NYY, N2XY"],
          ["NA", "هادی آلومینیوم / Al conductor", "Aluminium conductor", "NAYY, NA2XY"],
          ["Y (عایق)", "عایق PVC / PVC insulation", "PVC insulation", "NYY"],
          ["2X (عایق)", "عایق XLPE / XLPE insulation", "XLPE insulation", "N2XY"],
          ["Y (روکش)", "روکش PVC / PVC sheath", "PVC outer sheath", "NYY"],
          ["R", "زره سیم گرد / Round wire armour", "Round wire armour (SWA)", "NYRY"],
          ["B", "زره تسمه / Tape armour", "Steel tape armour (STA)", "NYBY"],
          ["C", "شیلد مسی / Copper screen", "Copper wire screen", "NYCY"],
          ["M", "روکش مرکب / Compound sheath", "Compound sheath", "NYM"],
          ["H", "هماهنگ اروپا / Harmonized EU", "Harmonized EU standard", "H07V-K"],
          ["05 / 07", "ولتاژ ۳۰۰/۵۰۰ یا ۴۵۰/۷۵۰", "300/500V or 450/750V", "H05V-K"],
          ["V", "عایق PVC / PVC insulated", "PVC insulated", "H07V-K"],
          ["K", "هادی انعطاف‌پذیر / Flex conductor", "Flexible conductor (cl.5)", "H07V-K"],
          ["U", "هادی جامد / Solid conductor", "Solid conductor (cl.1)", "H07V-U"],
          ["R", "هادی رشته‌ای / Stranded conductor", "Stranded conductor (cl.2)", "H07V-R"],
          ["F (روکش)", "روکش PVC نرم / Soft PVC sheath", "Flexible PVC sheath", "H05VV-F"],
        ],
        note: {
          FA: "این کدگذاری سیستم نام‌گذاری استاندارد اروپایی را توضیح می‌دهد. با درک این کدها می‌توانید ساختار هر کابل را از روی نامش تشخیص دهید.",
          EN: "This coding explains the European standard naming system. Understanding these codes allows you to identify cable structure from its name.",
          AR: "يشرح هذا الترميز نظام التسمية الأوروبي. يتيح فهم هذه الرموز التعرف على بنية الكابل من اسمه.",
        },
      },
      {
        id: "flexible-cables-table",
        caption: {
          FA: "جدول مشخصات سیم‌های H (هماهنگ اروپایی) طبق EN 50525",
          EN: "H-designation wire specifications per EN 50525",
          AR: "مواصفات أسلاك H وفق EN 50525",
        },
        headers: {
          FA: ["نوع", "ولتاژ نامی", "دمای کاری", "کلاس هادی", "سطح مقطع (mm²)", "ساختار روکش", "کاربرد اصلی"],
          EN: ["Type", "Rated V", "Max Temp", "Cond. Class", "Section (mm²)", "Sheath", "Main Use"],
          AR: ["النوع", "الجهد", "أقصى حرارة", "فئة الموصل", "المقطع", "الغلاف", "الاستخدام"],
        },
        rows: [
          ["H05V-U", "300/500V", "70°C", "1 (Solid)", "0.5 – 6", "PVC بدون روکش", "سیم‌کشی ثابت"],
          ["H05V-K", "300/500V", "70°C", "5 (Flex)", "0.5 – 1", "PVC بدون روکش", "تابلو برق خانگی"],
          ["H07V-U", "450/750V", "70°C", "1 (Solid)", "1.5 – 16", "PVC بدون روکش", "سیم‌کشی ساختمانی"],
          ["H07V-K", "450/750V", "70°C", "5 (Flex)", "1.5 – 240", "PVC بدون روکش", "تابلو برق صنعتی"],
          ["H0V-R", "300/500V", "70°C", "2 (Strand)", "1.5 – 16", "PVC بدون روکش", "نصب ثابت"],
          ["H07V-R", "450/750V", "70°C", "2 (Strand)", "1.5 – 50", "PVC بدون روکش", "صنعتی ثابت"],
          ["H03VV-F", "300/300V", "60°C", "5 (Flex)", "0.5 – 0.75", "PVC + PVC", "لوازم سبک خانگی"],
          ["H05VV-F", "300/500V", "70°C", "5 (Flex)", "0.75 – 4", "PVC + PVC", "لوازم خانگی"],
          ["H07VV-F", "450/750V", "70°C", "5 (Flex)", "1.5 – 6", "PVC + PVC", "ابزار برقی صنعتی"],
        ],
      },
    ],
  },
];

// ── Comparison data ───────────────────────────────────────────────────────────
export const CABLE_COMPARE_TABLE: TableData = {
  id: "full-compare",
  caption: {
    FA: "مقایسه جامع کابل‌های فشار ضعیف پرکاربرد",
    EN: "Comprehensive comparison of common LV cables",
    AR: "مقارنة شاملة لكابلات الجهد المنخفض الشائعة",
  },
  headers: {
    FA: ["نوع کابل", "هادی", "عایق", "زره", "شیلد", "دمای کاری", "ولتاژ نامی", "سایز (mm²)", "کاربرد اصلی"],
    EN: ["Cable", "Conductor", "Insulation", "Armour", "Screen", "Max Temp", "Rated V", "Section (mm²)", "Main Use"],
    AR: ["الكابل", "الموصل", "العزل", "الدرع", "الغطاء", "أقصى حرارة", "الجهد", "المقطع", "الاستخدام"],
  },
  rows: [
    ["NYY",      "Cu مسی",   "PVC", "—",       "—",  "70°C", "0.6/1kV", "0.5–500",  "توزیع عمومی / General distribution"],
    ["NAYY",     "Al آلو",   "PVC", "—",       "—",  "70°C", "0.6/1kV", "16–500",   "توزیع اقتصادی / Economic distribution"],
    ["N2XY",     "Cu مسی",   "XLPE","—",       "—",  "90°C", "0.6/1kV", "1.5–500",  "صنعتی پرظرفیت / High-capacity industrial"],
    ["NA2XY",    "Al آلو",   "XLPE","—",       "—",  "90°C", "0.6/1kV", "16–500",   "صنعتی سبک / Lightweight industrial"],
    ["NYRY",     "Cu مسی",   "PVC", "SWA گرد", "—",  "70°C", "0.6/1kV", "1.5–300",  "دفن مستقیم / Direct burial"],
    ["NAYRY",    "Al آلو",   "PVC", "SWA گرد", "—",  "70°C", "0.6/1kV", "16–300",   "دفن اقتصادی / Economic burial"],
    ["NYBY",     "Cu مسی",   "PVC", "STA تسمه","—",  "70°C", "0.6/1kV", "1.5–300",  "کانال / Cable duct"],
    ["NAYBY",    "Al آلو",   "PVC", "STA تسمه","—",  "70°C", "0.6/1kV", "16–300",   "کانال اقتصادی / Economic duct"],
    ["N2XRY",    "Cu مسی",   "XLPE","SWA گرد", "—",  "90°C", "0.6/1kV", "1.5–300",  "صنعتی سنگین / Heavy industrial"],
    ["NA2XRY",   "Al آلو",   "XLPE","SWA گرد", "—",  "90°C", "0.6/1kV", "16–300",   "صنعتی سنگین آلو / Heavy Al industrial"],
    ["N2XYBY",   "Cu مسی",   "XLPE","STA تسمه","—",  "90°C", "0.6/1kV", "1.5–300",  "کارخانه / Factory"],
    ["NA2XYBY",  "Al آلو",   "XLPE","STA تسمه","—",  "90°C", "0.6/1kV", "16–300",   "کارخانه آلو / Al factory"],
    ["NYCY",     "Cu مسی",   "PVC", "—",       "CY", "70°C", "0.6/1kV", "1.5–185",  "کنترل ضد EMI / EMI control"],
    ["NAYCY",    "Al آلو",   "PVC", "—",       "CY", "70°C", "0.6/1kV", "16–185",   "کنترل آلو / Al control"],
    ["NYCYRY",   "Cu مسی",   "PVC", "SWA",     "CY", "70°C", "0.6/1kV", "1.5–185",  "نفت و گاز / Oil & gas"],
    ["N2XCY",    "Cu مسی",   "XLPE","—",       "CY", "90°C", "0.6/1kV", "1.5–185",  "ابزاردقیق / Instrumentation"],
    ["NA2XCY",   "Al آلو",   "XLPE","—",       "CY", "90°C", "0.6/1kV", "16–185",   "ابزاردقیق آلو / Al instrumentation"],
    ["NYM",      "Cu مسی",   "PVC", "—",       "—",  "70°C", "300/500V","1.5–35",   "ساختمانی / Building wiring"],
  ],
};

// ── Current capacity table ────────────────────────────────────────────────────
export const CURRENT_CAPACITY_TABLE: TableData = {
  id: "current-capacity",
  caption: {
    FA: "جدول ظرفیت جریان تقریبی کابل NYY مسی در هوا (دمای محیط ۳۰°C)",
    EN: "Approximate current capacity of NYY copper cable in air (ambient 30°C)",
    AR: "سعة التيار التقريبية لكابل NYY نحاسي في الهواء (درجة حرارة محيطية 30°C)",
  },
  headers: {
    FA: ["سطح مقطع (mm²)", "تک رشته (A)", "۳ رشته (A)", "۴ رشته (A)"],
    EN: ["Section (mm²)", "Single Core (A)", "3-Core (A)", "4-Core (A)"],
    AR: ["المقطع (mm²)", "أحادي اللب (A)", "ثلاثي الألباب (A)", "رباعي الألباب (A)"],
  },
  rows: [
    ["1.5",  "26",  "18",  "17"],
    ["2.5",  "34",  "24",  "23"],
    ["4",    "44",  "31",  "30"],
    ["6",    "56",  "39",  "38"],
    ["10",   "75",  "52",  "50"],
    ["16",   "99",  "68",  "65"],
    ["25",   "131", "89",  "86"],
    ["35",   "159", "108", "103"],
    ["50",   "189", "128", "123"],
    ["70",   "238", "162", "154"],
    ["95",   "284", "193", "184"],
    ["120",  "325", "220", "210"],
    ["150",  "368", "250", "238"],
    ["185",  "418", "283", "269"],
    ["240",  "485", "328", "312"],
    ["300",  "550", "371", "353"],
  ],
  note: {
    FA: "مقادیر فوق بر اساس IEC 60287 و برای نصب در هوای آزاد محاسبه شده‌اند. برای نصب زیرزمین ضریب تصحیح ۰.۸ اعمال کنید.",
    EN: "Values based on IEC 60287 for installation in free air. Apply correction factor 0.8 for underground installation.",
    AR: "القيم مستندة إلى IEC 60287 للتركيب في الهواء الطلق. طبّق عامل التصحيح 0.8 للتركيب تحت الأرض.",
  },
};
