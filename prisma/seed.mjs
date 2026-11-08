
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function upsertProduct(data) {
  const { translations, ...rest } = data;
  return prisma.cableProduct.upsert({
    where: { abbreviation: rest.abbreviation },
    update: {},
    create: {
      ...rest,
      translations: { create: translations },
    },
  });
}

async function seedDemo() {
  // Optional demo admin (never created unless both variables are provided).
  const email = process.env.DEMO_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.DEMO_ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 12) throw new Error("DEMO_ADMIN_PASSWORD must be at least 12 characters");
    await prisma.admin.upsert({
      where: { email },
      update: {},
      create: { email, name: "Demo Admin", password: await bcrypt.hash(password, 12) },
    });
    console.log("✅ Demo admin ready:", email);
  }

  // Optional sample inbox so the dashboard is not empty in a demo.
  if (process.env.SEED_DEMO_DATA === "true" && (await prisma.contactMessage.count()) === 0) {
    await prisma.contactMessage.createMany({
      data: [
        { name: "Sample Customer", email: "customer@example.com", phone: "+98 21 0000 0000", lang: "en", read: false,
          message: "Hello, we need a quotation for 2,000 m of NYY 4x16 mm² cable for an industrial project." },
        { name: "نمونه مشتری", email: "buyer@example.org", phone: "021 0000 0000", lang: "fa", read: false,
          message: "سلام، برای پروژه توزیع برق به کابل هوایی خودنگهدار نیاز داریم. لطفاً دیتاشیت و قیمت ارسال کنید." },
        { name: "Demo Contractor", email: "contractor@example.net", lang: "ar", read: true,
          message: "نحتاج إلى معلومات عن الكابلات المرنة المناسبة للوحات التحكم." },
      ],
    });
    console.log("✅ Sample contact messages added");
  }
}

async function main() {
  const lvFamily = await prisma.cableFamily.upsert({
    where: { type: "LOW_VOLTAGE_POWER" },
    update: {},
    create: {
      type: "LOW_VOLTAGE_POWER",
      translations: { create: [
        { language: "FA", name: "کابل‌های قدرت فشار ضعیف" },
        { language: "EN", name: "Low Voltage Power Cables" },
        { language: "AR", name: "كابلات طاقة منخفضة الجهد" },
      ]},
    },
  });

  const aerialFamily = await prisma.cableFamily.upsert({
    where: { type: "AERIAL" },
    update: {},
    create: {
      type: "AERIAL",
      translations: { create: [
        { language: "FA", name: "کابل‌های هوایی" },
        { language: "EN", name: "Aerial Cables" },
        { language: "AR", name: "الكابلات الهوائية" },
      ]},
    },
  });

  const flexFamily = await prisma.cableFamily.upsert({
    where: { type: "FLEXIBLE" },
    update: {},
    create: {
      type: "FLEXIBLE",
      translations: { create: [
        { language: "FA", name: "کابل‌های منعطف" },
        { language: "EN", name: "Flexible Cables" },
        { language: "AR", name: "الكابلات المرنة" },
      ]},
    },
  });

  // ── LOW VOLTAGE ──────────────────────────────────────────────────────────
  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NYY", standard: "INSO 3569-1, IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 0.5, maxSection: 500, configurations: ["SINGLE_CORE","MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], singleCoreLayers: "CU/PVC.A/PVC.ST1", multiCoreRoundLayers: "CU/PVC.A/FILLER/PVC.ST1", multiCoreSectorLayers: "CU/PVC.A/PP/PVC.ST1", translations: [
    { language: "FA", name: "NYY – کابل قدرت فشار ضعیف", features: "مقاوم در برابر آب و هوا، مقاوم در برابر شعله، مقاوم در برابر روغن", usage: "توزیع برق در فضای باز، زیر زمین، فضای داخلی، داکت‌ها، کارخانه‌های صنعتی" },
    { language: "EN", name: "NYY – Low Voltage Power Cable", features: "Weather resistant, flame retardant, oil resistant", usage: "Power distribution in open areas, underground, indoors, cable ducts, industrial plants" },
    { language: "AR", name: "NYY – كابل طاقة منخفض الجهد", features: "مقاوم للطقس، مقاوم للاشتعال، مقاوم للزيت", usage: "توزيع الطاقة في المناطق المكشوفة، تحت الأرض، داخل المباني، المصانع الصناعية" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NAYY", standard: "INSO 3569-1, IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 500, configurations: ["SINGLE_CORE","MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], singleCoreLayers: "AL/PVC.A/PVC.ST1", multiCoreRoundLayers: "AL/PVC.A/FILLER/PVC.ST1", multiCoreSectorLayers: "AL/PVC.A/PP/PVC.ST1", translations: [
    { language: "FA", name: "NAYY – کابل قدرت فشار ضعیف با هادی آلومینیوم", features: "سبک‌وزن، مقرون‌به‌صرفه، مقاوم در برابر آب و هوا", usage: "توزیع برق در شبکه‌های زیرزمینی، فضای باز، داکت‌ها" },
    { language: "EN", name: "NAYY – Aluminum Conductor Low Voltage Cable", features: "Lightweight, cost-effective, weather resistant", usage: "Underground power distribution, open air, cable ducts" },
    { language: "AR", name: "NAYY – كابل منخفض الجهد بموصل ألومنيوم", features: "خفيف الوزن، اقتصادي، مقاوم للطقس", usage: "توزيع الطاقة تحت الأرض، الهواء الطلق، المجاري الكابلية" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "N2XY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 500, configurations: ["SINGLE_CORE","MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], singleCoreLayers: "CU/XLPE/PVC.ST1", multiCoreRoundLayers: "CU/XLPE/FILLER/PVC.ST1", multiCoreSectorLayers: "CU/XLPE/PP/PVC.ST1", translations: [
    { language: "FA", name: "N2XY – کابل XLPE فشار ضعیف مسی", features: "عایق XLPE با ظرفیت جریان بالاتر، مقاوم در برابر حرارت، مقاوم در برابر شعله", usage: "توزیع برق صنعتی، نیروگاه‌ها، مناطقی با بار حرارتی بالا" },
    { language: "EN", name: "N2XY – XLPE Insulated Copper Low Voltage Cable", features: "XLPE insulation with higher current capacity, heat resistant, flame retardant", usage: "Industrial power distribution, power plants, high thermal load areas" },
    { language: "AR", name: "N2XY – كابل نحاسي منخفض الجهد بعزل XLPE", features: "عزل XLPE بسعة تيار أعلى، مقاوم للحرارة، مقاوم للاشتعال", usage: "توزيع الطاقة الصناعي، محطات الطاقة، المناطق ذات الحمل الحراري العالي" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NA2XY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 500, configurations: ["SINGLE_CORE","MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], singleCoreLayers: "AL/XLPE/PVC.ST1", multiCoreRoundLayers: "AL/XLPE/FILLER/PVC.ST1", multiCoreSectorLayers: "AL/XLPE/PP/PVC.ST1", translations: [
    { language: "FA", name: "NA2XY – کابل XLPE فشار ضعیف آلومینیومی", features: "عایق XLPE، سبک‌وزن، ظرفیت جریان بالا، مقاوم در برابر حرارت", usage: "شبکه‌های توزیع برق، صنایع سنگین، نیروگاه‌ها" },
    { language: "EN", name: "NA2XY – XLPE Insulated Aluminum Low Voltage Cable", features: "XLPE insulation, lightweight, high current capacity, heat resistant", usage: "Power distribution networks, heavy industries, power plants" },
    { language: "AR", name: "NA2XY – كابل ألومنيوم منخفض الجهد بعزل XLPE", features: "عزل XLPE، خفيف الوزن، سعة تيار عالية، مقاوم للحرارة", usage: "شبكات توزيع الطاقة، الصناعات الثقيلة، محطات الطاقة" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NAYRY", standard: "INSO 3569-1, IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 300, configurations: ["MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], multiCoreRoundLayers: "AL/PVC.A/FILLER/SWA/PVC.ST1", multiCoreSectorLayers: "AL/PVC.A/PP/SWA/PVC.ST1", translations: [
    { language: "FA", name: "NAYRY – کابل زره‌دار آلومینیومی با سیم گرد فولادی", features: "زره‌دار با سیم گرد فولادی، مقاوم در برابر ضربه مکانیکی", usage: "نصب مستقیم در زمین، مناطق صنعتی با خطر آسیب مکانیکی" },
    { language: "EN", name: "NAYRY – Armoured Aluminum Cable with Round Steel Wire", features: "Round steel wire armoured, resistant to mechanical impact", usage: "Direct burial, industrial areas with mechanical damage risk" },
    { language: "AR", name: "NAYRY – كابل ألومنيوم مدرع بأسلاك فولاذية دائرية", features: "مدرع بأسلاك فولاذية دائرية، مقاوم للصدمات الميكانيكية", usage: "الدفن المباشر في الأرض، المناطق الصناعية ذات خطر التلف الميكانيكي" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NYRY", standard: "INSO 3569-1, IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 300, configurations: ["SINGLE_CORE","MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], singleCoreLayers: "CU/PVC.A/SWA/PVC.ST1", multiCoreRoundLayers: "CU/PVC.A/FILLER/SWA/PVC.ST1", multiCoreSectorLayers: "CU/PVC.A/PP/SWA/PVC.ST1", translations: [
    { language: "FA", name: "NYRY – کابل زره‌دار مسی با سیم گرد فولادی", features: "زره سیم گرد فولادی، محافظت مکانیکی بالا", usage: "نصب مستقیم در زمین، کانال‌ها، مناطق صنعتی" },
    { language: "EN", name: "NYRY – Copper Armoured Cable with Round Steel Wire", features: "Round steel wire armour, high mechanical protection", usage: "Direct burial, cable ducts, industrial areas" },
    { language: "AR", name: "NYRY – كابل نحاسي مدرع بأسلاك فولاذية دائرية", features: "تدريع بأسلاك فولاذية دائرية، حماية ميكانيكية عالية", usage: "الدفن المباشر، قنوات الكابلات، المناطق الصناعية" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "N2XRY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 300, configurations: ["SINGLE_CORE","MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], singleCoreLayers: "CU/XLPE/SWA/PVC.ST1", multiCoreRoundLayers: "CU/XLPE/FILLER/SWA/PVC.ST1", multiCoreSectorLayers: "CU/XLPE/PP/SWA/PVC.ST1", translations: [
    { language: "FA", name: "N2XRY – کابل XLPE مسی زره‌دار", features: "عایق XLPE، زره سیم گرد فولادی، ظرفیت جریان بالا", usage: "نصب زیرزمینی در مناطق صنعتی، نیروگاه‌ها، محیط‌های سخت" },
    { language: "EN", name: "N2XRY – XLPE Copper Armoured Cable", features: "XLPE insulation, round steel wire armour, high current capacity", usage: "Underground in industrial zones, power plants, harsh environments" },
    { language: "AR", name: "N2XRY – كابل نحاسي XLPE مدرع", features: "عزل XLPE، تدريع بأسلاك فولاذية، سعة تيار عالية", usage: "الطمر تحت الأرض في المناطق الصناعية، محطات الطاقة" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NA2XRY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 300, configurations: ["SINGLE_CORE","MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], singleCoreLayers: "AL/XLPE/SWA/PVC.ST1", multiCoreRoundLayers: "AL/XLPE/FILLER/SWA/PVC.ST1", multiCoreSectorLayers: "AL/XLPE/PP/SWA/PVC.ST1", translations: [
    { language: "FA", name: "NA2XRY – کابل XLPE آلومینیومی زره‌دار", features: "عایق XLPE، زره سیم گرد، سبک‌وزن", usage: "شبکه‌های توزیع زیرزمینی، صنایع سنگین" },
    { language: "EN", name: "NA2XRY – XLPE Aluminum Armoured Cable", features: "XLPE insulation, round wire armour, lightweight", usage: "Underground distribution networks, heavy industries" },
    { language: "AR", name: "NA2XRY – كابل ألومنيوم XLPE مدرع", features: "عزل XLPE، تدريع بأسلاك، خفيف الوزن", usage: "شبكات التوزيع تحت الأرض، الصناعات الثقيلة" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NYBY", standard: "INSO 3569-1, IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 300, configurations: ["SINGLE_CORE","MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], singleCoreLayers: "CU/PVC.A/STA/PVC.ST1", multiCoreRoundLayers: "CU/PVC.A/FILLER/STA/PVC.ST1", multiCoreSectorLayers: "CU/PVC.A/PP/STA/PVC.ST1", translations: [
    { language: "FA", name: "NYBY – کابل زره‌دار مسی با تسمه فولادی", features: "زره تسمه فولادی، محافظت مکانیکی مناسب، هزینه کمتر", usage: "مسیرهای کابل‌کشی داخلی، داکت‌ها، فضاهای صنعتی" },
    { language: "EN", name: "NYBY – Copper Cable with Steel Tape Armour", features: "Steel tape armour, good mechanical protection, cost-effective", usage: "Indoor cable routes, cable ducts, industrial spaces" },
    { language: "AR", name: "NYBY – كابل نحاسي بدرع شريط فولاذي", features: "تدريع بشريط فولاذي، حماية ميكانيكية جيدة، اقتصادي", usage: "مسارات الكابلات الداخلية، مجاري الكابلات، الفضاءات الصناعية" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NAYBY", standard: "INSO 3569-1, IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 300, configurations: ["MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], multiCoreRoundLayers: "AL/PVC.A/FILLER/STA/PVC.ST1", multiCoreSectorLayers: "AL/PVC.A/PP/STA/PVC.ST1", translations: [
    { language: "FA", name: "NAYBY – کابل آلومینیومی زره‌دار با تسمه فولادی", features: "زره تسمه فولادی، سبک‌وزن، مقرون‌به‌صرفه", usage: "مسیرهای کابل‌کشی، داکت‌ها، شبکه‌های توزیع" },
    { language: "EN", name: "NAYBY – Aluminum Cable with Steel Tape Armour", features: "Steel tape armour, lightweight, cost-effective", usage: "Cable routes, cable ducts, distribution networks" },
    { language: "AR", name: "NAYBY – كابل ألومنيوم بدرع شريط فولاذي", features: "تدريع بشريط فولاذي، خفيف الوزن، اقتصادي", usage: "مسارات الكابلات، مجاري الكابلات، شبكات التوزيع" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "N2XYBY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 300, configurations: ["SINGLE_CORE","MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], singleCoreLayers: "CU/XLPE/STA/PVC.ST1", multiCoreRoundLayers: "CU/XLPE/FILLER/STA/PVC.ST1", multiCoreSectorLayers: "CU/XLPE/PP/STA/PVC.ST1", translations: [
    { language: "FA", name: "N2XYBY – کابل XLPE مسی زره‌دار تسمه‌ای", features: "عایق XLPE، زره تسمه فولادی، دمای کاری بالا", usage: "کارخانه‌ها، پست‌های برق، محیط‌های صنعتی" },
    { language: "EN", name: "N2XYBY – XLPE Copper Cable with Steel Tape Armour", features: "XLPE insulation, steel tape armour, high operating temperature", usage: "Factories, substations, industrial environments" },
    { language: "AR", name: "N2XYBY – كابل نحاسي XLPE بدرع شريط فولاذي", features: "عزل XLPE، تدريع بشريط فولاذي، درجة حرارة تشغيل عالية", usage: "المصانع، محطات التحويل، البيئات الصناعية" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NA2XYBY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 300, configurations: ["MULTI_CORE_ROUND","MULTI_CORE_SECTOR"], multiCoreRoundLayers: "AL/XLPE/FILLER/STA/PVC.ST1", multiCoreSectorLayers: "AL/XLPE/PP/STA/PVC.ST1", translations: [
    { language: "FA", name: "NA2XYBY – کابل XLPE آلومینیومی زره‌دار تسمه‌ای", features: "عایق XLPE، زره تسمه، سبک‌وزن، دمای کاری بالا", usage: "شبکه‌های توزیع برق، محیط‌های صنعتی" },
    { language: "EN", name: "NA2XYBY – XLPE Aluminum Cable with Steel Tape Armour", features: "XLPE insulation, tape armour, lightweight, high operating temp", usage: "Power distribution networks, industrial environments" },
    { language: "AR", name: "NA2XYBY – كابل ألومنيوم XLPE بدرع شريط فولاذي", features: "عزل XLPE، تدريع بشريط، خفيف الوزن، درجة حرارة عالية", usage: "شبكات توزيع الطاقة، البيئات الصناعية" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NYCYRY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "CU/PVC.A/CU-SCREEN/SWA/PVC.ST1", translations: [
    { language: "FA", name: "NYCYRY – کابل مسی با شیلد مسی و زره", features: "شیلد مسی، زره سیم فولادی، حفاظت در برابر امواج الکترومغناطیسی", usage: "تأسیسات حساس به تداخل الکترومغناطیسی، صنایع نفت و گاز" },
    { language: "EN", name: "NYCYRY – Copper Screened & Armoured Cable", features: "Copper screen, steel wire armour, EMI shielding", usage: "EMI-sensitive installations, oil & gas industry" },
    { language: "AR", name: "NYCYRY – كابل نحاسي مع درع ومحاط نحاسي", features: "درع نحاسي، تدريع بأسلاك فولاذية، حماية من التداخل الكهرومغناطيسي", usage: "المنشآت الحساسة للتداخل الكهرومغناطيسي، صناعة النفط والغاز" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NYCY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "CU/PVC.A/CU-SCREEN/PVC.ST1", translations: [
    { language: "FA", name: "NYCY – کابل مسی با شیلد مسی", features: "شیلد مسی، حفاظت الکترومغناطیسی، بدون زره", usage: "سیستم‌های کنترل و ابزاردقیق، پست‌های برق" },
    { language: "EN", name: "NYCY – Copper Screened Cable", features: "Copper screen, EMI protection, without armour", usage: "Control & instrumentation systems, electrical substations" },
    { language: "AR", name: "NYCY – كابل نحاسي محاط", features: "درع نحاسي، حماية كهرومغناطيسية، بدون تدريع", usage: "أنظمة التحكم والأجهزة، محطات الكهرباء" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NAYCYRY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "AL/PVC.A/CU-SCREEN/SWA/PVC.ST1", translations: [
    { language: "FA", name: "NAYCYRY – کابل آلومینیومی با شیلد مسی و زره", features: "شیلد مسی، زره سیم فولادی، آلومینیومی سبک‌وزن", usage: "شبکه‌های صنعتی حساس به EMI، نصب زیرزمینی" },
    { language: "EN", name: "NAYCYRY – Aluminum Screened & Armoured Cable", features: "Copper screen, steel wire armour, lightweight aluminum", usage: "EMI-sensitive industrial networks, underground installation" },
    { language: "AR", name: "NAYCYRY – كابل ألومنيوم مع درع نحاسي وتدريع فولاذي", features: "درع نحاسي، تدريع بأسلاك فولاذية، ألومنيوم خفيف الوزن", usage: "الشبكات الصناعية الحساسة للتداخل، التركيب تحت الأرض" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NAYCY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "AL/PVC.A/CU-SCREEN/PVC.ST1", translations: [
    { language: "FA", name: "NAYCY – کابل آلومینیومی با شیلد مسی", features: "شیلد مسی، حفاظت EMI، سبک‌وزن", usage: "پست‌های برق، سیستم‌های کنترل صنعتی" },
    { language: "EN", name: "NAYCY – Aluminum Cable with Copper Screen", features: "Copper screen, EMI protection, lightweight", usage: "Substations, industrial control systems" },
    { language: "AR", name: "NAYCY – كابل ألومنيوم مع درع نحاسي", features: "درع نحاسي، حماية كهرومغناطيسية، خفيف الوزن", usage: "محطات التحويل، أنظمة التحكم الصناعي" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "N2XCYRY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "CU/XLPE/CU-SCREEN/SWA/PVC.ST1", translations: [
    { language: "FA", name: "N2XCYRY – کابل XLPE مسی با شیلد و زره", features: "عایق XLPE، شیلد مسی، زره سیم فولادی، دمای کاری 90°C", usage: "صنایع نفت، پتروشیمی، پست‌های فشار قوی" },
    { language: "EN", name: "N2XCYRY – XLPE Copper Screened & Armoured Cable", features: "XLPE insulation, copper screen, SWA, 90°C rating", usage: "Oil industry, petrochemical, HV substations" },
    { language: "AR", name: "N2XCYRY – كابل نحاسي XLPE مع درع نحاسي وتدريع", features: "عزل XLPE، درع نحاسي، تدريع بأسلاك فولاذية، 90°C", usage: "صناعة النفط، البتروكيماويات، محطات الجهد العالي" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NA2XCYRY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "AL/XLPE/CU-SCREEN/SWA/PVC.ST1", translations: [
    { language: "FA", name: "NA2XCYRY – کابل XLPE آلومینیومی با شیلد و زره", features: "عایق XLPE، شیلد مسی، زره، آلومینیوم سبک‌وزن", usage: "شبکه‌های صنعتی، پست‌های برق، محیط‌های خورنده" },
    { language: "EN", name: "NA2XCYRY – XLPE Aluminum Screened & Armoured Cable", features: "XLPE insulation, copper screen, armour, lightweight aluminum", usage: "Industrial networks, substations, corrosive environments" },
    { language: "AR", name: "NA2XCYRY – كابل ألومنيوم XLPE مع درع نحاسي وتدريع", features: "عزل XLPE، درع نحاسي، تدريع، ألومنيوم خفيف", usage: "الشبكات الصناعية، محطات التحويل، البيئات المسببة للتآكل" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "N2XCY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "CU/XLPE/CU-SCREEN/PVC.ST1", translations: [
    { language: "FA", name: "N2XCY – کابل XLPE مسی با شیلد مسی", features: "عایق XLPE، شیلد مسی، حفاظت EMI، بدون زره", usage: "سیستم‌های کنترل، ابزاردقیق، پست‌های برق" },
    { language: "EN", name: "N2XCY – XLPE Copper Screened Cable", features: "XLPE insulation, copper screen, EMI protection, no armour", usage: "Control systems, instrumentation, substations" },
    { language: "AR", name: "N2XCY – كابل نحاسي XLPE محاط", features: "عزل XLPE، درع نحاسي، حماية كهرومغناطيسية، بدون تدريع", usage: "أنظمة التحكم، الأجهزة الدقيقة، محطات التحويل" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NA2XCY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "AL/XLPE/CU-SCREEN/PVC.ST1", translations: [
    { language: "FA", name: "NA2XCY – کابل XLPE آلومینیومی با شیلد مسی", features: "عایق XLPE، شیلد مسی، سبک‌وزن", usage: "سیستم‌های کنترل صنعتی، پست‌های برق" },
    { language: "EN", name: "NA2XCY – XLPE Aluminum Screened Cable", features: "XLPE insulation, copper screen, lightweight", usage: "Industrial control systems, substations" },
    { language: "AR", name: "NA2XCY – كابل ألومنيوم XLPE محاط", features: "عزل XLPE، درع نحاسي، خفيف الوزن", usage: "أنظمة التحكم الصناعي، محطات التحويل" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NYCYBY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "CU/PVC.A/CU-SCREEN/STA/PVC.ST1", translations: [
    { language: "FA", name: "NYCYBY – کابل مسی شیلددار با زره تسمه‌ای", features: "شیلد مسی، زره تسمه فولادی، حفاظت مضاعف", usage: "کارخانه‌های صنعتی، تأسیسات نفت و گاز" },
    { language: "EN", name: "NYCYBY – Copper Screened Cable with Steel Tape Armour", features: "Copper screen, steel tape armour, double protection", usage: "Industrial plants, oil & gas installations" },
    { language: "AR", name: "NYCYBY – كابل نحاسي محاط بدرع شريط فولاذي", features: "درع نحاسي، تدريع بشريط فولاذي، حماية مضاعفة", usage: "المصانع الصناعية، منشآت النفط والغاز" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NAYCYBY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "AL/PVC.A/CU-SCREEN/STA/PVC.ST1", translations: [
    { language: "FA", name: "NAYCYBY – کابل آلومینیومی شیلددار با زره تسمه‌ای", features: "شیلد مسی، زره تسمه، سبک‌وزن", usage: "شبکه‌های صنعتی، داکت‌های کابل" },
    { language: "EN", name: "NAYCYBY – Aluminum Screened Cable with Steel Tape Armour", features: "Copper screen, tape armour, lightweight", usage: "Industrial networks, cable ducts" },
    { language: "AR", name: "NAYCYBY – كابل ألومنيوم محاط بدرع شريط فولاذي", features: "درع نحاسي، تدريع بشريط، خفيف الوزن", usage: "الشبكات الصناعية، مجاري الكابلات" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "N2XCYBY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "CU/XLPE/CU-SCREEN/STA/PVC.ST1", translations: [
    { language: "FA", name: "N2XCYBY – کابل XLPE مسی شیلددار با زره تسمه‌ای", features: "عایق XLPE، شیلد مسی، زره تسمه، 90°C", usage: "پتروشیمی، صنایع سنگین، پست‌های برق" },
    { language: "EN", name: "N2XCYBY – XLPE Copper Screened Cable with Tape Armour", features: "XLPE insulation, copper screen, tape armour, 90°C", usage: "Petrochemical, heavy industries, substations" },
    { language: "AR", name: "N2XCYBY – كابل نحاسي XLPE محاط بدرع شريط فولاذي", features: "عزل XLPE، درع نحاسي، تدريع بشريط، 90°C", usage: "البتروكيماويات، الصناعات الثقيلة، محطات التحويل" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NA2XCYBY", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["1","2"], minSection: 16, maxSection: 185, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "AL/XLPE/CU-SCREEN/STA/PVC.ST1", translations: [
    { language: "FA", name: "NA2XCYBY – کابل XLPE آلومینیومی شیلددار با زره تسمه‌ای", features: "عایق XLPE، شیلد مسی، زره تسمه، آلومینیوم", usage: "شبکه‌های توزیع صنعتی، محیط‌های خورنده" },
    { language: "EN", name: "NA2XCYBY – XLPE Aluminum Screened Cable with Tape Armour", features: "XLPE insulation, copper screen, tape armour, aluminum", usage: "Industrial distribution networks, corrosive environments" },
    { language: "AR", name: "NA2XCYBY – كابل ألومنيوم XLPE محاط بدرع شريط فولاذي", features: "عزل XLPE، درع نحاسي، تدريع بشريط، ألومنيوم", usage: "شبكات التوزيع الصناعي، البيئات المسببة للتآكل" },
  ]});

  await upsertProduct({ familyId: lvFamily.id, abbreviation: "NYM", standard: "DIN VDE 0250, IEC 60227", ratedVoltage: "300/500 V", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 1.5, maxSection: 35, configurations: ["SINGLE_CORE","MULTI_CORE_ROUND"], singleCoreLayers: "CU/PVC.A/PVC.ST1", multiCoreRoundLayers: "CU/PVC.A/FILLER/PVC.ST1", translations: [
    { language: "FA", name: "NYM – کابل برق ساختمانی", features: "مقاوم در برابر شعله، انعطاف‌پذیر، مناسب فضای داخلی", usage: "سیم‌کشی ساختمان، برق‌رسانی خانگی و اداری، روشنایی" },
    { language: "EN", name: "NYM – Building Power Cable", features: "Flame retardant, flexible, suitable for indoor use", usage: "Building wiring, residential & office power, lighting" },
    { language: "AR", name: "NYM – كابل طاقة للمباني", features: "مقاوم للاشتعال، مرن، مناسب للاستخدام الداخلي", usage: "أسلاك المباني، الطاقة السكنية والمكتبية، الإضاءة" },
  ]});

  console.log("✅ Low Voltage cables seeded (25/25)");

  // ── AERIAL ───────────────────────────────────────────────────────────────
  await upsertProduct({ familyId: aerialFamily.id, abbreviation: "HD", standard: "EN 50182, IEC 61089", ratedVoltage: "–", maxOperatingTemp: "75°C", conductorMaterial: "COPPER", conductorClasses: ["1","2"], minSection: 16, maxSection: 400, configurations: ["SINGLE_CORE"], translations: [
    { language: "FA", name: "HD – هادی مسی سخت‌کشیده", features: "استحکام مکانیکی بالا، هدایت الکتریکی عالی", usage: "خطوط انتقال هوایی، شبکه‌های توزیع" },
    { language: "EN", name: "HD – Hard Drawn Copper Conductor", features: "High mechanical strength, excellent conductivity", usage: "Overhead transmission lines, distribution networks" },
    { language: "AR", name: "HD – موصل نحاسي مسحوب", features: "متانة ميكانيكية عالية، توصيل ممتاز", usage: "خطوط النقل الهوائية، شبكات التوزيع" },
  ]});

  await upsertProduct({ familyId: aerialFamily.id, abbreviation: "AAC", standard: "IEC 61089, ASTM B231", ratedVoltage: "–", maxOperatingTemp: "75°C", conductorMaterial: "ALUMINUM", conductorClasses: ["2"], minSection: 16, maxSection: 500, configurations: ["SINGLE_CORE"], translations: [
    { language: "FA", name: "AAC – هادی تمام آلومینیوم", features: "سبک‌وزن، مقاومت خوردگی بالا، مناسب دهانه‌های کوتاه", usage: "خطوط هوایی شهری، شبکه‌های توزیع محلی" },
    { language: "EN", name: "AAC – All Aluminium Conductor", features: "Lightweight, high corrosion resistance, suitable for short spans", usage: "Urban overhead lines, local distribution networks" },
    { language: "AR", name: "AAC – موصل الألومنيوم الكلي", features: "خفيف الوزن، مقاومة عالية للتآكل، مناسب للمسافات القصيرة", usage: "خطوط هوائية حضرية، شبكات التوزيع المحلية" },
  ]});

  await upsertProduct({ familyId: aerialFamily.id, abbreviation: "AAAC", standard: "IEC 61089, ASTM B399", ratedVoltage: "–", maxOperatingTemp: "75°C", conductorMaterial: "ALUMINUM", conductorClasses: ["2"], minSection: 16, maxSection: 500, configurations: ["SINGLE_CORE"], translations: [
    { language: "FA", name: "AAAC – هادی تمام آلیاژ آلومینیوم", features: "استحکام کششی بالاتر از AAC، مقاوم در برابر خوردگی", usage: "خطوط انتقال هوایی با دهانه‌های بلند، مناطق ساحلی" },
    { language: "EN", name: "AAAC – All Aluminium Alloy Conductor", features: "Higher tensile strength than AAC, corrosion resistant", usage: "Long-span overhead transmission, coastal areas" },
    { language: "AR", name: "AAAC – موصل سبيكة الألومنيوم الكلي", features: "قوة شد أعلى من AAC، مقاوم للتآكل", usage: "النقل الهوائي طويل المدى، المناطق الساحلية" },
  ]});

  await upsertProduct({ familyId: aerialFamily.id, abbreviation: "ACSR", standard: "IEC 61089, ASTM B232", ratedVoltage: "–", maxOperatingTemp: "75°C", conductorMaterial: "ALUMINUM", conductorClasses: ["2"], minSection: 25, maxSection: 630, configurations: ["SINGLE_CORE"], translations: [
    { language: "FA", name: "ACSR – هادی آلومینیومی با هسته فولادی", features: "استحکام کششی بسیار بالا، مناسب دهانه‌های بلند", usage: "خطوط انتقال فشار قوی، دهانه‌های عبور از رودخانه و دره" },
    { language: "EN", name: "ACSR – Aluminium Conductor Steel Reinforced", features: "Very high tensile strength, suitable for long spans", usage: "HV transmission lines, river & valley crossings" },
    { language: "AR", name: "ACSR – موصل ألومنيوم مقوى بالفولاذ", features: "قوة شد عالية جداً، مناسب للمسافات الطويلة", usage: "خطوط نقل الجهد العالي، عبور الأنهار والوديان" },
  ]});

  await upsertProduct({ familyId: aerialFamily.id, abbreviation: "CC 20kV", standard: "IEC 60502-2, HD 620", ratedVoltage: "12/20 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["2"], minSection: 16, maxSection: 240, configurations: ["SINGLE_CORE"], translations: [
    { language: "FA", name: "CC 20kV – کابل هوایی با روکش عایق 20kV", features: "عایق XLPE، مقاوم در برابر UV، مناسب نصب هوایی روی دکل", usage: "شبکه‌های توزیع هوایی 20kV" },
    { language: "EN", name: "CC 20kV – Covered Aerial Cable 20kV", features: "XLPE insulation, UV resistant, suitable for pole installation", usage: "20kV aerial distribution networks" },
    { language: "AR", name: "CC 20kV – كابل هوائي مغطى 20kV", features: "عزل XLPE، مقاوم للأشعة فوق البنفسجية، مناسب للتركيب الهوائي", usage: "شبكات التوزيع الهوائية 20kV" },
  ]});

  await upsertProduct({ familyId: aerialFamily.id, abbreviation: "CC 30kV", standard: "IEC 60502-2", ratedVoltage: "18/30 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["2"], minSection: 25, maxSection: 240, configurations: ["SINGLE_CORE"], translations: [
    { language: "FA", name: "CC 30kV – کابل هوایی عایق 30kV", features: "عایق XLPE، ولتاژ بالا، مقاوم در برابر UV", usage: "شبکه‌های توزیع هوایی 30kV" },
    { language: "EN", name: "CC 30kV – Covered Aerial Cable 30kV", features: "XLPE insulation, high voltage, UV resistant", usage: "30kV aerial distribution networks" },
    { language: "AR", name: "CC 30kV – كابل هوائي مغطى 30kV", features: "عزل XLPE، جهد عالٍ، مقاوم للأشعة فوق البنفسجية", usage: "شبكات التوزيع الهوائية 30kV" },
  ]});

  await upsertProduct({ familyId: aerialFamily.id, abbreviation: "CCT 20kV", standard: "IEC 60502-2", ratedVoltage: "12/20 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["2"], minSection: 16, maxSection: 185, configurations: ["SINGLE_CORE"], translations: [
    { language: "FA", name: "CCT 20kV – کابل هوایی پیچیده 20kV", features: "پیچیده شده، مقاوم در برابر UV، عایق XLPE", usage: "شبکه‌های هوایی توزیع میانی" },
    { language: "EN", name: "CCT 20kV – Twisted Covered Aerial Cable 20kV", features: "Twisted design, UV resistant, XLPE insulation", usage: "Medium voltage aerial distribution" },
    { language: "AR", name: "CCT 20kV – كابل هوائي ملفوف مغطى 20kV", features: "تصميم ملفوف، مقاوم للأشعة فوق البنفسجية، عزل XLPE", usage: "التوزيع الهوائي متوسط الجهد" },
  ]});

  await upsertProduct({ familyId: aerialFamily.id, abbreviation: "CCT 33kV", standard: "IEC 60502-2", ratedVoltage: "19/33 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["2"], minSection: 25, maxSection: 185, configurations: ["SINGLE_CORE"], translations: [
    { language: "FA", name: "CCT 33kV – کابل هوایی پیچیده 33kV", features: "پیچیده شده، عایق XLPE، مقاوم UV، ولتاژ بالا", usage: "شبکه‌های هوایی توزیع با ولتاژ 33kV" },
    { language: "EN", name: "CCT 33kV – Twisted Covered Aerial Cable 33kV", features: "Twisted, XLPE insulation, UV resistant, high voltage", usage: "33kV aerial distribution networks" },
    { language: "AR", name: "CCT 33kV – كابل هوائي ملفوف مغطى 33kV", features: "ملفوف، عزل XLPE، مقاوم للأشعة فوق البنفسجية، جهد عالٍ", usage: "شبكات التوزيع الهوائية 33kV" },
  ]});

  await upsertProduct({ familyId: aerialFamily.id, abbreviation: "ABC", standard: "IEC 60502-1, NF C33-209", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "90°C", conductorMaterial: "ALUMINUM", conductorClasses: ["2"], minSection: 16, maxSection: 150, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "AL/XLPE (bundled, with neutral messenger)", translations: [
    { language: "FA", name: "ABC – کابل هوایی دسته‌ای فشار ضعیف", features: "مجموعه رشته‌های عایق‌دار، امنیت بالا، نصب آسان روی تیر", usage: "شبکه‌های توزیع هوایی روستایی و شهری، اتصال سرویس مشترکین" },
    { language: "EN", name: "ABC – Aerial Bundled Cable LV", features: "Insulated bundled conductors, high safety, easy pole installation", usage: "Rural & urban aerial distribution, service connections" },
    { language: "AR", name: "ABC – كابل هوائي مجمع منخفض الجهد", features: "موصلات مجمعة معزولة، أمان عالٍ، سهل التركيب", usage: "شبكات التوزيع الهوائية الريفية والحضرية، توصيلات الخدمة" },
  ]});

  await upsertProduct({ familyId: aerialFamily.id, abbreviation: "TWISTED", standard: "IEC 60502-1", ratedVoltage: "0.6/1 kV", maxOperatingTemp: "70°C", conductorMaterial: "ALUMINUM", conductorClasses: ["2"], minSection: 16, maxSection: 120, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "AL/PVC (twisted)", translations: [
    { language: "FA", name: "TWISTED – کابل هوایی پیچیده PVC", features: "طراحی پیچیده، عایق PVC، مناسب توزیع فشار ضعیف", usage: "شبکه‌های هوایی فشار ضعیف، اتصال مشترکین" },
    { language: "EN", name: "TWISTED – Twisted PVC Aerial Cable", features: "Twisted design, PVC insulation, LV distribution", usage: "LV aerial networks, subscriber connections" },
    { language: "AR", name: "TWISTED – كابل هوائي ملفوف PVC", features: "تصميم ملفوف، عزل PVC، توزيع منخفض الجهد", usage: "الشبكات الهوائية منخفضة الجهد، توصيلات المشتركين" },
  ]});

  console.log("✅ Aerial cables seeded (10/10)");

  // ── FLEXIBLE ─────────────────────────────────────────────────────────────
  await upsertProduct({ familyId: flexFamily.id, abbreviation: "H07V-K", standard: "EN 50525-2-31, IEC 60227", ratedVoltage: "450/750 V", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["5"], minSection: 1.5, maxSection: 240, configurations: ["SINGLE_CORE"], singleCoreLayers: "CU-flexible/PVC", translations: [
    { language: "FA", name: "H07V-K – سیم انعطاف‌پذیر تابلو برق", features: "هادی کلاس 5 بسیار انعطاف‌پذیر، رنگ‌بندی متنوع", usage: "سیم‌کشی داخل تابلوهای برق، پانل‌های کنترل، تجهیزات صنعتی" },
    { language: "EN", name: "H07V-K – Flexible Panel Wire", features: "Class 5 highly flexible conductor, various colour options", usage: "Internal wiring of control panels, switchboards, industrial equipment" },
    { language: "AR", name: "H07V-K – سلك لوحات مرن", features: "موصل مرن فئة 5، خيارات ألوان متعددة", usage: "الأسلاك الداخلية للوحات التحكم، الألواح الكهربائية، المعدات الصناعية" },
  ]});

  await upsertProduct({ familyId: flexFamily.id, abbreviation: "H05V-K", standard: "EN 50525-2-31, IEC 60227", ratedVoltage: "300/500 V", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["5"], minSection: 0.5, maxSection: 1, configurations: ["SINGLE_CORE"], singleCoreLayers: "CU-flexible/PVC", translations: [
    { language: "FA", name: "H05V-K – سیم انعطاف‌پذیر کم‌ولتاژ", features: "هادی کلاس 5، ولتاژ پایین، بسیار ظریف", usage: "تجهیزات خانگی کوچک، تابلوهای برق خانگی" },
    { language: "EN", name: "H05V-K – Flexible Low Voltage Wire", features: "Class 5 conductor, low voltage, very fine", usage: "Small household appliances, domestic control panels" },
    { language: "AR", name: "H05V-K – سلك مرن منخفض الجهد", features: "موصل فئة 5، جهد منخفض، رفيع جداً", usage: "الأجهزة المنزلية الصغيرة، لوحات التحكم المنزلية" },
  ]});

  await upsertProduct({ familyId: flexFamily.id, abbreviation: "H05VV-F", standard: "EN 50525-2-11, IEC 60227", ratedVoltage: "300/500 V", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["5"], minSection: 0.75, maxSection: 4, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "CU-flexible/PVC/FILLER/PVC", translations: [
    { language: "FA", name: "H05VV-F – کابل انعطاف‌پذیر چندرشته خانگی", features: "سبک، انعطاف‌پذیر، مناسب لوازم خانگی", usage: "لوازم خانگی، دستگاه‌های الکتریکی قابل‌حمل، تمدیدسیم" },
    { language: "EN", name: "H05VV-F – Flexible Multi-Core Household Cable", features: "Lightweight, flexible, suitable for household appliances", usage: "Household appliances, portable electrical devices, extension cords" },
    { language: "AR", name: "H05VV-F – كابل منزلي مرن متعدد الأسلاك", features: "خفيف الوزن، مرن، مناسب للأجهزة المنزلية", usage: "الأجهزة المنزلية، الأجهزة الكهربائية المحمولة، أسلاك التمديد" },
  ]});

  await upsertProduct({ familyId: flexFamily.id, abbreviation: "H07VV-F", standard: "EN 50525-2-11, IEC 60227", ratedVoltage: "450/750 V", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["5"], minSection: 1.5, maxSection: 6, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "CU-flexible/PVC/FILLER/PVC", translations: [
    { language: "FA", name: "H07VV-F – کابل انعطاف‌پذیر صنعتی", features: "ولتاژ بالاتر، انعطاف‌پذیر، مناسب محیط‌های صنعتی", usage: "ابزار برقی صنعتی، ماشین‌آلات، تجهیزات سیار" },
    { language: "EN", name: "H07VV-F – Industrial Flexible Cable", features: "Higher voltage, flexible, suitable for industrial use", usage: "Industrial power tools, machinery, portable equipment" },
    { language: "AR", name: "H07VV-F – كابل مرن صناعي", features: "جهد أعلى، مرن، مناسب للاستخدام الصناعي", usage: "الأدوات الكهربائية الصناعية، الآلات، المعدات المتنقلة" },
  ]});

  await upsertProduct({ familyId: flexFamily.id, abbreviation: "H03VV-F", standard: "EN 50525-2-11, IEC 60227", ratedVoltage: "300/300 V", maxOperatingTemp: "60°C", conductorMaterial: "COPPER", conductorClasses: ["5"], minSection: 0.5, maxSection: 0.75, configurations: ["MULTI_CORE_ROUND"], multiCoreRoundLayers: "CU-flexible/PVC/PVC", translations: [
    { language: "FA", name: "H03VV-F – کابل انعطاف‌پذیر سبک خانگی", features: "بسیار سبک، انعطاف‌پذیری بالا، مخصوص بار سبک", usage: "لوازم روشنایی، وسایل آشپزخانه کوچک، چراغ‌های رومیزی" },
    { language: "EN", name: "H03VV-F – Light Duty Flexible Cable", features: "Very lightweight, highly flexible, for light loads", usage: "Lighting fixtures, small kitchen appliances, desk lamps" },
    { language: "AR", name: "H03VV-F – كابل مرن خفيف الحمل", features: "خفيف جداً، مرونة عالية، للأحمال الخفيفة", usage: "تركيبات الإضاءة، الأجهزة المطبخية الصغيرة، مصابيح المكتب" },
  ]});

  await upsertProduct({ familyId: flexFamily.id, abbreviation: "H05V-U", standard: "EN 50525-2-31, IEC 60227", ratedVoltage: "300/500 V", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["1"], minSection: 1.5, maxSection: 6, configurations: ["SINGLE_CORE"], singleCoreLayers: "CU-solid/PVC", translations: [
    { language: "FA", name: "H05V-U – سیم یک‌رشته تک‌لایه", features: "هادی جامد کلاس 1، مناسب نصب ثابت", usage: "سیم‌کشی ثابت ساختمانی در لوله‌کشی" },
    { language: "EN", name: "H05V-U – Solid Building Wire", features: "Solid Class 1 conductor, suitable for fixed installation", usage: "Fixed building wiring in conduits" },
    { language: "AR", name: "H05V-U – سلك بناء صلب", features: "موصل صلب فئة 1، مناسب للتركيب الثابت", usage: "أسلاك المباني الثابتة في القنوات" },
  ]});

  await upsertProduct({ familyId: flexFamily.id, abbreviation: "H0V-R", standard: "EN 50525-2-31, IEC 60227", ratedVoltage: "300/500 V", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["2"], minSection: 1.5, maxSection: 16, configurations: ["SINGLE_CORE"], singleCoreLayers: "CU-stranded/PVC", translations: [
    { language: "FA", name: "H0V-R – سیم رشته‌ای ساختمانی", features: "هادی رشته‌ای کلاس 2، سهولت نصب", usage: "سیم‌کشی ساختمانی، کانال‌های کابل، توزیع خانگی" },
    { language: "EN", name: "H0V-R – Stranded Building Wire", features: "Class 2 stranded conductor, easier installation", usage: "Building wiring, cable conduits, residential distribution" },
    { language: "AR", name: "H0V-R – سلك بناء متعدد الأسلاك", features: "موصل متعدد الأسلاك فئة 2، تركيب أسهل", usage: "أسلاك المباني، قنوات الكابلات، التوزيع السكني" },
  ]});

  await upsertProduct({ familyId: flexFamily.id, abbreviation: "H07V-U", standard: "EN 50525-2-31, IEC 60227", ratedVoltage: "450/750 V", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["1"], minSection: 1.5, maxSection: 16, configurations: ["SINGLE_CORE"], singleCoreLayers: "CU-solid/PVC", translations: [
    { language: "FA", name: "H07V-U – سیم یک‌رشته ساختمانی ولتاژ بالاتر", features: "هادی جامد، ولتاژ 450/750V، نصب ثابت", usage: "سیم‌کشی ثابت در لوله‌ها و داکت‌ها" },
    { language: "EN", name: "H07V-U – Solid Building Wire 450/750V", features: "Solid conductor, 450/750V, fixed installation", usage: "Fixed wiring in conduits and trunking" },
    { language: "AR", name: "H07V-U – سلك بناء صلب 450/750V", features: "موصل صلب، 450/750V، تركيب ثابت", usage: "الأسلاك الثابتة في الأنابيب والقنوات" },
  ]});

  await upsertProduct({ familyId: flexFamily.id, abbreviation: "H07V-R", standard: "EN 50525-2-31, IEC 60227", ratedVoltage: "450/750 V", maxOperatingTemp: "70°C", conductorMaterial: "COPPER", conductorClasses: ["2"], minSection: 1.5, maxSection: 50, configurations: ["SINGLE_CORE"], singleCoreLayers: "CU-stranded/PVC", translations: [
    { language: "FA", name: "H07V-R – سیم رشته‌ای ساختمانی ولتاژ بالاتر", features: "هادی رشته‌ای کلاس 2، ولتاژ 450/750V", usage: "سیم‌کشی داخل لوله‌کشی، تابلوهای برق ساختمانی" },
    { language: "EN", name: "H07V-R – Stranded Building Wire 450/750V", features: "Class 2 stranded conductor, 450/750V", usage: "Conduit wiring, building electrical panels" },
    { language: "AR", name: "H07V-R – سلك بناء متعدد الأسلاك 450/750V", features: "موصل متعدد الأسلاك فئة 2، 450/750V", usage: "الأسلاك في الأنابيب، لوحات البناء الكهربائية" },
  ]});

  console.log("✅ Flexible cables seeded (9/9)");
  console.log("\n🎉 All 44 cables seeded successfully!");
  await seedDemo();
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
