// Mock REST API Service for Ubari - Ghat 360km Road Project
import { 
  fetchCloudProjects, 
  saveCloudProjects, 
  fetchCloudPhotos, 
  saveCloudPhotos, 
  fetchCloudNews,
  saveCloudNews,
  fetchCloudTickerNews,
  saveCloudTickerNews,
  fetchCloudHeroCard,
  saveCloudHeroCard,
  fetchCloudStoreItem,
  saveCloudStoreItem,
  isSupabaseConfigured 
} from './supabase.js';
import { safeStorageSet, safeStorageGet } from '../utils/imageCompressor.js';



const initialSectors = [
  {
    id: 'SEC-01',
    name: 'القطاع الأول: أوباري - الفيوات',
    lengthKm: 85,
    progress: 84,
    residentEngineer: 'م. عبد السلام الفزاني',
    status: 'متقدم جداً',
    statusColor: 'emerald',
    asphaltThicknessCm: 12,
    solarPolesInstalled: 640,
    activeWorkers: 115,
    notes: 'تم الانتهاء من الطبقة الرابطة وجاري استكمال الرصف النهائي للطبقة السطحية.',
    image: './road-paving-official.jpg'
  },
  {
    id: 'SEC-02',
    name: 'القطاع الثاني: الفيوات - العوينات',
    lengthKm: 95,
    progress: 72,
    residentEngineer: 'م. طارق المحجوب',
    status: 'جاري التنفيذ الميداني',
    statusColor: 'amber',
    asphaltThicknessCm: 10,
    solarPolesInstalled: 480,
    activeWorkers: 130,
    notes: 'أعمال دمك الأسفلت وتوسعة الأكتاف وقنوات تصريف مياه الأمطار في أودية العوينات.',
    image: './road-rollers-compaction.jpg'
  },
  {
    id: 'SEC-03',
    name: 'القطاع الثالث: العوينات - تهالة',
    lengthKm: 100,
    progress: 61,
    residentEngineer: 'م. سالم التواتي',
    status: 'جار الرصف والتأسيس',
    statusColor: 'blue',
    asphaltThicknessCm: 8,
    solarPolesInstalled: 320,
    activeWorkers: 98,
    notes: 'تسوية الأساس الحجري بالكاشطات الموتورية وإزالة الرمال الزاحفة وإعادة التأسيس.',
    image: './road-grader-earthwork.jpg'
  },
  {
    id: 'SEC-04',
    name: 'القطاع الرابع: البركت - غات (المدخل التاريخي)',
    lengthKm: 80,
    progress: 55,
    residentEngineer: 'م. علي الغاتي',
    status: 'تحت التنفيذ المكثف',
    statusColor: 'purple',
    asphaltThicknessCm: 7,
    solarPolesInstalled: 290,
    activeWorkers: 85,
    notes: 'تركيب الشواخص الإرشادية واللوحات المرورية واستكمال رصف المسارات المزدوجة بمدخل غات.',
    image: './road-grader-earthwork.jpg'
  }
];

const initialSummary = {
  projectTitle: 'مشروع صيانة طريق أوباري - غات',
  agency: 'جهاز تنفيذ مشروعات المواصلات',
  initiative: 'خطة عودة الحياة',
  totalLengthKm: 360,
  overallProgress: 68.5,
  plannedProgress: 70.0,
      totalWorkforce: 428,
  asphaltPavedKm: 246.6,
  solarPolesTotal: 1730,
  lastUpdated: new Date().toISOString()
};

const initialContractors = [];

const initialDocuments = [
  {
    id: 'DOC-2026-08',
    title: 'التقرير التنفيذي الشهري الشامل - أغسطس 2026',
    category: 'تقارير الإنجاز',
    date: '2026-08-10',
    size: '4.8 MB',
    author: 'إدارة المشروعات - جهاز تنفيذ مشروعات المواصلات',
    type: 'PDF'
  },
  {
    id: 'DOC-QA-04',
    title: 'محضر اختبارات الجودة وكثافة الأسفلت (اختبار مارشال)',
    category: 'ضبط الجودة المعملي',
    date: '2026-08-08',
    size: '2.3 MB',
    author: 'المختبر المركزي لاختبارات الطرق والجسور',
    type: 'PDF'
  },
  {
    id: 'DOC-ENV-02',
    title: 'خطة حماية الطريق من زحف الرمال والعواصف الترابية',
    category: 'الدراسات البيئية',
    date: '2026-07-28',
    size: '6.1 MB',
    author: 'اللجنة الفنية لحماية البيئة الصحراوية',
    type: 'PDF'
  },
  {
    id: 'DOC-FIN-Q2',
    title: 'جدول المستخلصات المالية المستحقة للشركات المنفذة Q2',
    category: 'المالية والمستخلصات',
    date: '2026-08-01',
    size: '1.9 MB',
    author: 'الإدارة المالية - الجهاز',
    type: 'PDF'
  }
];

const API_BASE_URL = '/api';

export const fetchProjectSummary = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/summary`);
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
  } catch (e) {
    // MySQL Server offline, use mock engine
  }
  return { success: true, data: initialSummary };
};

export const fetchSectors = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/sectors`);
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
  } catch (e) {
    // MySQL Server offline, use mock engine
  }
  return { success: true, data: initialSectors };
};

export const fetchContractors = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/contractors`);
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
  } catch (e) {
    // MySQL Server offline, use mock engine
  }
  return { success: true, data: initialContractors };
};

const initialFieldPhotos = [
  {
    id: 'PH-06',
    title: 'مشهد جوي لمسار الطريق الصحراوي المعبد وأسطول الآليات',
    titleEn: 'Aerial View of Desert Highway Paving Corridor',
    sector: 'مسار طريق أوباري – غات الدولي (360 كم)',
    desc: 'توثيق جوي شامل لحركة قطار الرصف والآليات والشاحنات على امتداد الطريق بالجنوب الليبي.',
    src: './road-aerial-highway.jpg',
    category: 'توثيق جوي',
    date: '2026-08-05',
    author: 'ديوان جهاز المواصلات'
  }
];

export const nationalProjects = [
  {
    id: 'PRJ-UBG-360',
    title: 'مشروع صيانة ورصف طريق أوباري – غات (المسار الرئيسي)',
    titleEn: 'Ubari – Ghat Main Highway Paving & Upgrade',
    region: 'فزان (أوباري - غات 360 كم)',
    regionEn: 'Fezzan (Ubari – Ghat 360km)',
    lengthKm: 360,
    progress: 68.5,
    status: 'in_progress',
    statusLabel: 'جاري التنفيذ',
    statusLabelEn: 'In Progress',
    statusColor: 'emerald',
    contractor: 'ائتلاف شركات الطرق الوطنية وفزان',
    image: './road-aerial-highway.jpg',
    coords: { x: 22, y: 72 },
    realCoords: '26.5925,12.7803',
    desc: 'إعادة إعمار وتوسعة الشريان البري الاستراتيجي بطول 360 كم مقسم إلى 4 قطاعات رئيسية مع تطبيق أحدث معايير الرصف ومقاومة درجات الحرارة.'
  },
  {
    id: 'PRJ-UBG-SOL-1100',
    title: 'مشروع شواخص وتخطيط مسار أوباري – غات',
    titleEn: 'Ubari – Ghat Highway Traffic Signage & Route Markings',
    region: 'مسار الطريق (360 كم)',
    regionEn: 'Corridor Route (360km)',
    lengthKm: 360,
    progress: 69.1,
    status: 'in_progress',
    statusLabel: 'متقدم جداً',
    statusLabelEn: 'Advanced Stage',
    statusColor: 'emerald',
    contractor: 'الشركة الوطنية للسلامة المرورية والمقاولات',
    image: './road-grader-earthwork.jpg',
    coords: { x: 24, y: 74 },
    realCoords: '26.1200,12.1100',
    desc: 'توريد وتركيب الشواخص المرورية واللوحات الإرشادية وتخطيط المسارات والعواكس الأرضية لتأمين أعلى معايير السلامة عند المنحنيات ومداخل الواحات.'
  },
  {
    id: 'PRJ-UBG-CUL-028',
    title: 'مشروع عبّارات تصريف السيول وحماية مسار أوباري – غات',
    titleEn: 'Ubari – Ghat Flood Culverts & Drainage Protection',
    region: 'أودية العوينات ومخرات السيول',
    regionEn: 'Al Uwaynat Valleys',
    lengthKm: 95,
    progress: 75.0,
    status: 'in_progress',
    statusLabel: 'جاري التنفيذ',
    statusLabelEn: 'In Progress',
    statusColor: 'amber',
    contractor: 'شركة الهضبة للإنشاءات المائية والجسور',
    image: './road-rollers-compaction.jpg',
    coords: { x: 20, y: 76 },
    realCoords: '25.6800,11.5500',
    desc: 'إنشاء 28 عبارة خرسانية صندوقية وأنفاق تصريف هيدروليكية لحماية جسم الطريق من الانجراف والسيول الموسمية في حوض العوينات.'
  }
];

export const initialFieldDispatches = [
  {
    id: 'DISP-01',
    title: 'اكتمال صب العبارة الصندوقية بالمحطة 120+00',
    sector: 'القطاع الثاني (الفيوات - العوينات)',
    time: 'منذ 15 دقيقة',
    author: 'م. طارق المحجوب',
    status: 'معتمد ميدانياً',
    type: 'success'
  },
  {
    id: 'DISP-02',
    title: 'بدء فرد الطبقة الرابطة بالفرادة Vögele Super 1800',
    sector: 'القطاع الأول (أوباري - الفيوات)',
    time: 'منذ ساعتين',
    author: 'م. عبد السلام الفزاني',
    status: 'جاري التنفيذ',
    type: 'info'
  },
  {
    id: 'DISP-03',
    title: 'اجتياز اختبارات الكثافة لمارشال بنسبة نجاح 99.2%',
    sector: 'المختبر المركزي - أوباري',
    time: 'منذ 4 ساعات',
    author: 'المختبر الميداني',
    status: 'مطابق للمواصفات',
    type: 'success'
  },
  {
    id: 'DISP-04',
    title: 'تثبيت 45 شاخصة إرشادية ولوحة تحذيرية بمدخل البركت',
    sector: 'القطاع الرابع (البركت - غات)',
    time: 'منذ 6 ساعات',
    author: 'م. علي الغاتي',
    status: 'تم الإنجاز',
    type: 'info'
  }
];

export const initialFinancialReports = [
  {
    id: 'FIN-2026-Q2',
    title: 'تقرير الموقف المالي والمستخلصات الربع سنوي – Q2 2026',
    category: 'التقارير المالية',
    date: '2026-07-30',
    allocatedLyd: '145,000,000 د.ل',
    disbursedLyd: '99,325,000 د.ل',
    rate: '68.5%',
    author: 'الإدارة المالية – جهاز تنفيذ مشروعات المواصلات',
    size: '3.4 MB',
    type: 'PDF'
  },
  {
    id: 'FIN-AUD-01',
    title: 'محضر التدقيق المالي ومطابقة كميات الأسفلت الموردة',
    category: 'التدقيق المالي',
    date: '2026-06-25',
    allocatedLyd: '38,500,000 د.ل',
    disbursedLyd: '32,340,000 د.ل',
    rate: '84.0%',
    author: 'لجنة المراجعة والتدقيق المالي الفني',
    size: '2.1 MB',
    type: 'PDF'
  }
];

export { initialSectors, initialSummary, initialContractors, initialDocuments, initialFieldPhotos };

export const fetchFieldPhotos = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/photos`);
    if (res.ok) return await res.json();
  } catch (e) {
    // API offline fallback
  }
  const saved = localStorage.getItem('portal-field-photos-v2') || localStorage.getItem('portal-field-photos');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (err) {}
  }
  await new Promise(r => setTimeout(r, 120));
  return initialFieldPhotos;
};

export const fetchMonthlyProgressHistory = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/progress-history`);
    if (res.ok) return await res.json();
  } catch (e) {
    // MySQL Server offline, use mock engine
  }
  return [
    { month: 'يناير', planned: 15, actual: 12, plannedProgress: 15, actualProgress: 12 },
    { month: 'فبراير', planned: 25, actual: 23, plannedProgress: 25, actualProgress: 23 },
    { month: 'مارس', planned: 36, actual: 35, plannedProgress: 36, actualProgress: 35 },
    { month: 'أبريل', planned: 48, actual: 46, plannedProgress: 48, actualProgress: 46 },
    { month: 'مايو', planned: 58, actual: 56, plannedProgress: 58, actualProgress: 56 },
    { month: 'يونيو', planned: 64, actual: 63, plannedProgress: 64, actualProgress: 63 },
    { month: 'يوليو', planned: 70, actual: 68.5, plannedProgress: 70, actualProgress: 68.5 }
  ];
};

export const initialTickerNews = [
  { 
    id: 'NEWS-01', 
    text: 'مشروع صيانة ورصف طريق أوباري – غات الاستراتيجي بطول 360 كم', 
    textEn: 'Maintenance & Paving of the Strategic 360km Ubari – Ghat Highway',
    tag: 'مشروع وطني', 
    tagEn: 'National Project',
    active: true, 
    date: '2026-08-20' 
  },
  { 
    id: 'NEWS-02', 
    text: 'نسبة الإنجاز الفعلي الإجمالية تتجاوز 68.5% على امتداد مسار الطريق', 
    textEn: 'Overall project execution progress surpasses 68.5% across corridor',
    tag: 'متابعة دورية', 
    tagEn: 'Progress Update',
    active: true, 
    date: '2026-08-19' 
  },
  { 
    id: 'NEWS-03', 
    text: 'تواصل أعمال طبقات الرصف والأسفلت بأعلى معايير الجودة المعتمدة', 
    textEn: 'Ongoing asphalt paving works adhering to certified quality standards',
    tag: 'سير الأعمال', 
    tagEn: 'Operations',
    active: true, 
    date: '2026-08-18' 
  },
  { 
    id: 'NEWS-04', 
    text: 'توريد وتركيب الشواخص المرورية واللوحات الإرشادية والسياج الواقي', 
    textEn: 'Supplying and installing traffic safety signs, guideboards and guardrails',
    tag: 'السلامة المرورية', 
    tagEn: 'Road Safety',
    active: true, 
    date: '2026-08-17' 
  },
  { 
    id: 'NEWS-05', 
    text: 'فحص جودة خلطات الأسفلت والدمك عبر المعامل الجيوتقنية المعتمدة', 
    textEn: 'Testing asphalt mix quality and compaction density at certified labs',
    tag: 'ضبط الجودة', 
    tagEn: 'Quality Control',
    active: true, 
    date: '2026-08-16' 
  },
  { 
    id: 'NEWS-06', 
    text: 'إشراف هندسي ميداني متواصل ومتابعة مستمرة لمعايير السلامة المرورية', 
    textEn: 'Continuous on-site engineering supervision and traffic safety monitoring',
    tag: 'الإشراف الهندسي', 
    tagEn: 'Site Supervision',
    active: true, 
    date: '2026-08-15' 
  }
];

export const getSavedTickerNews = () => {
  try {
    const saved = localStorage.getItem('portal_ticker_news');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return initialTickerNews;
};

export const initialNewsPosts = [
  {
    id: 'POST-5458',
    title: 'دخول اعمال الرصف طريق اوباري-غات الي بلدية العوينات.',
    titleEn: 'Asphalt Paving Operations on Ubari - Ghat Corridor Reach Al-Awaynat Municipality',
    desc: 'من خلال المتابعة المستمرة لطريق منذو الانطلاق من مدينة أوباري في إتجاه منطقة غات_الكبري بفضل من الله عز وجل اليوم أعمال رصف طبقة الأسفلت تدخل الي بلدية #العوينات ومن ثم باقي المناطق #نطمن أهلنا في جميع مناطق غات بأن الأعمال جارية علي قدم وساق من قبل الإئتلاف الشركات المصرية تستمر أعمالها في جميع المراحل الأخيرة من الطريق تحت إشراف جهاز تنفيذ المشروعات والمواصلات الليبيةلم يتبقى إلا القليل من المشروع الضخم والإستراتيجي في الجنوب بطول 360 كيلوا متر يعتبر من أطول الطرق في الجنوب الليبي والذي يخفف من معاناة المواطنين .\nمكتب المتابعة لمشروع طريق اوباري غات',
    descEn: 'Through ongoing field monitoring of the Ubari - Ghat strategic highway project since its launch from Ubari Fortress towards Greater Ghat, asphalt paving layers have officially entered the Municipality of Al-Awaynat, progressing towards remaining sectors. We reassure our citizens across Ghat that operations are proceeding at full speed by the Egyptian Contracting Consortium in the final project phases under direct supervision of the Libyan Transport Projects Implementation Authority. Over 360 km of this vital corridor are being completed to alleviate travel hardships and connect southern communities.',
    category: 'تقرير ميداني معتمد',
    categoryEn: 'Official Field Report',
    image: './post-5458-alawaynat.jpg',
    timeAgo: 'الآن',
    timeAgoEn: 'Just now',
    location: 'طريق أوباري – غات',
    locationEn: 'Ubari – Ghat Highway Route',
    author: 'المكتب الإعلامي لمتابعة لمشروع طريق اوباري غات',
    authorEn: 'Media Office – Transport Projects Authority',
    viewsCount: '1,200'
  },
  {
    id: 'POST-5474',
    title: 'متابعة ميدانية',
    titleEn: 'Field Inspection & Operational Progress Update',
    desc: 'في إطار المتابعة الميدانية المستمرة لتنفيذ مشروع طريق أوباري–غات، تتواصل أعمال التنفيذ بوتيرة متقدمة، حيث بلغت نسبة الإنجاز الإجمالية للمشروع 68.5%، ووصلت أعمال تنفيذ المسار إلى مشارف مدينة العوينات.\n\nوتأتي هذه النسبة نتيجة الجهود المبذولة من الشركات المنفذة والفرق الفنية، رغم التحديات والصعوبات التي تواجه سير العمل في بعض مواقع المشروع، والتي تتطلب مواصلة التنسيق وتوفير الإمكانيات اللازمة لضمان استمرار الأعمال.\n\nويواصل جهاز مشروعات المواصلات متابعة مراحل التنفيذ ميدانياً، والوقوف على معدلات الإنجاز ومعالجة المعوقات، بهدف استكمال المشروع وفق المواصفات الفنية المعتمدة.',
    descEn: 'Within continuous field oversight of the Ubari - Ghat corridor execution, works continue at an accelerated pace, with total project progress reaching 68.5% and pavement operations reaching the outskirts of Al-Awaynat city. This achievement reflects intensive efforts by contracting firms and technical teams to overcome field challenges and maintain momentum. The Transportation Projects Implementation Authority continues close daily on-site supervision to guarantee adherence to certified engineering specifications.',
    category: 'بيانات صحفية',
    categoryEn: 'Press Statements',
    image: './post-5474-field-followup.jpg',
    timeAgo: 'الآن',
    timeAgoEn: 'Just now',
    location: 'مسار طريق أوباري – غات',
    locationEn: 'Ubari – Ghat Highway Corridor',
    author: 'المكتب الإعلامي - جهاز مشروعات المواصلات',
    authorEn: 'Media Office – Transportation Projects Authority',
    viewsCount: '1,200'
  },
  {
    id: 'POST-06',
    title: 'مشهد جوي يوثق تقدم رصف الشريان البري الاستراتيجي بالجنوب',
    titleEn: 'Panoramic Aerial Drone View of Progress Across Desert Corridor',
    desc: 'تُبرز الصورة امتداد طريق اوباري -غات وتوضح الصورة نسبة كبيرة من انجاز المشروع وسط الطبيعة الصحراوية، في مشهد يعكس أهمية مشاريع الطرق في ربط المناطق وتسهيل الوصول إليها، بما يسهم في دعم النشاط الاقتصادي والاجتماعي وتعزيز التنمية بالمنطقة.\n\nويأتي الاهتمام بقطاع الطرق والمواصلات ضمن الجهود الرامية إلى تطوير البنية التحتية وتحسين جودة الخدمات المقدمة للمواطنين.\n\nجهاز المواصلات طريق أوباري – غات\nطريق يربط المناطق.. وخطوة نحو مستقبل أفضل.',
    descEn: 'Aerial drone view capturing the expansive Ubari – Ghat strategic corridor cutting through the desert landscape, highlighting major progress in connecting Libyan southern communities and driving regional economic development.',
    category: 'توثيق جوي 4K',
    categoryEn: '4K Aerial Drone',
    image: './road-aerial-highway.jpg',
    timeAgo: 'منذ 4 أيام',
    timeAgoEn: '4 days ago',
    location: 'مسار الـ 360 كم',
    locationEn: '360km Highway Route',
    author: 'وحدة التوثيق والإنتاج الإعلامي',
    authorEn: 'Media Production & Drone Unit',
    viewsCount: '2,100'
  }
];

export const sanitizeNewsItem = (p) => {
  if (!p) return p;
  let img = p.image || '';
  if (typeof img === 'string' && img.startsWith('/') && !img.startsWith('//')) {
    img = '.' + img;
  }
  return {
    ...p,
    image: img
  };
};

export const getDeletedNewsIds = () => {
  try {
    const ids = safeStorageGet('portal-deleted-news-ids', []);
    return Array.isArray(ids) ? ids : [];
  } catch (e) {
    return [];
  }
};

export const addDeletedNewsId = async (id) => {
  if (!id) return;
  const current = getDeletedNewsIds();
  if (!current.includes(id)) {
    const updated = [...current, id];
    safeStorageSet('portal-deleted-news-ids', updated);
    if (isSupabaseConfigured()) {
      try {
        await saveCloudStoreItem('portal-deleted-news-ids', updated);
      } catch (_) {}
    }
  }
};

export const mergeNewsPostsResiliently = (incoming = [], existing = []) => {
  const deletedIds = new Set(getDeletedNewsIds());
  const map = new Map();

  // 1. Seed with initial posts (excluding deleted)
  (Array.isArray(initialNewsPosts) ? initialNewsPosts : [])
    .filter(p => p && p.id && !deletedIds.has(p.id))
    .forEach(p => map.set(p.id, sanitizeNewsItem(p)));

  // 2. Overlay incoming cloud posts (excluding deleted) - high authoritative priority
  if (Array.isArray(incoming)) {
    incoming
      .filter(p => p && p.id && !deletedIds.has(p.id))
      .forEach(p => {
        if (p && p.id) {
          map.set(p.id, sanitizeNewsItem(p));
        }
      });
  }

  // 3. Preserve any local existing posts that are not deleted (e.g. newly published posts)
  if (Array.isArray(existing)) {
    existing
      .filter(p => p && p.id && !deletedIds.has(p.id))
      .forEach(p => {
        if (p && p.id && !map.has(p.id)) {
          map.set(p.id, sanitizeNewsItem(p));
        }
      });
  }

  return Array.from(map.values()).filter(p => !deletedIds.has(p.id));
};

export const getSavedNewsPosts = () => {
  const deletedIds = new Set(getDeletedNewsIds());
  try {
    const saved = localStorage.getItem('portal-news-posts');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed
          .filter(p => p && p.id && !deletedIds.has(p.id))
          .map(sanitizeNewsItem);
        return cleaned;
      }
    }
  } catch (e) {}
  return initialNewsPosts.filter(p => !deletedIds.has(p.id));
};

export const saveNewsPosts = async (posts) => {
  const deletedIds = new Set(getDeletedNewsIds());
  const filtered = (Array.isArray(posts) ? posts : [])
    .filter(p => p && p.id && !deletedIds.has(p.id))
    .map(sanitizeNewsItem);

  try {
    localStorage.setItem('portal-news-posts', JSON.stringify(filtered));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('cloud_news_updated', { detail: filtered }));
  } catch (e) {}

  if (isSupabaseConfigured()) {
    try {
      await saveCloudNews(filtered);
    } catch (err) {
      console.warn('[Supabase] فشل حفظ الأخبار سحابياً:', err);
    }
  }
  return filtered;
};

export const syncNewsFromCloud = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    // Sync deleted news IDs from cloud first
    try {
      const cloudDeleted = await fetchCloudStoreItem('portal-deleted-news-ids');
      if (Array.isArray(cloudDeleted) && cloudDeleted.length > 0) {
        const localDeleted = getDeletedNewsIds();
        const mergedDeleted = Array.from(new Set([...localDeleted, ...cloudDeleted]));
        safeStorageSet('portal-deleted-news-ids', mergedDeleted);
      }
    } catch (_) {}

    const cloudNews = await fetchCloudNews();
    if (cloudNews && Array.isArray(cloudNews)) {
      const localCurrent = getSavedNewsPosts();
      const merged = mergeNewsPostsResiliently(cloudNews, localCurrent);
      safeStorageSet('portal-news-posts', merged);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('cloud_news_updated', { detail: merged }));
      return merged;
    }
  } catch (e) {
    console.warn('[Supabase Sync] خطأ في مزامنة الأخبار:', e);
  }
  return null;
};

export const saveFieldPhotos = (photos) => {
  try {
    localStorage.setItem('portal-field-photos-v2', JSON.stringify(photos));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('cloud_photos_updated', { detail: photos }));
  } catch (e) {}

  if (isSupabaseConfigured()) {
    saveCloudPhotos(photos).catch(err => {
      console.warn('[Supabase] فشل حفظ الصور سحابياً:', err);
    });
  }
};

export const saveTickerNews = (news) => {
  try {
    localStorage.setItem('portal_ticker_news', JSON.stringify(news));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('cloud_ticker_updated', { detail: news }));
  } catch (e) {}

  if (isSupabaseConfigured()) {
    saveCloudTickerNews(news).catch(err => {
      console.warn('[Supabase] فشل حفظ شريط الأخبار سحابياً:', err);
    });
  }
};

export const syncTickerNewsFromCloud = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const cloudTicker = await fetchCloudTickerNews();
    if (cloudTicker && Array.isArray(cloudTicker) && cloudTicker.length > 0) {
      localStorage.setItem('portal_ticker_news', JSON.stringify(cloudTicker));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('cloud_ticker_updated', { detail: cloudTicker }));
      return cloudTicker;
    }
  } catch (e) {
    console.warn('[Supabase Sync] خطأ في مزامنة شريط الأخبار:', e);
  }
  return null;
};

export const getDeletedProjectIds = () => {
  return safeStorageGet('portal-deleted-project-ids', ['PRJ-UBG-DUN-120', 'PRJ-GHT-ENT-045', 'PRJ-UBG-RST-004', 'PRJ-EXEC-1463']);
};

export const addDeletedProjectId = (id) => {
  if (!id) return;
  const current = getDeletedProjectIds();
  if (!current.includes(id)) {
    const updated = [...current, id];
    safeStorageSet('portal-deleted-project-ids', updated);
    if (isSupabaseConfigured()) {
      saveCloudStoreItem('portal-deleted-project-ids', updated).catch(() => {});
    }
  }
};

export const getDeletedPhotoIds = () => {
  return safeStorageGet('portal-deleted-photo-ids', ['PH-01', 'PH-02', 'PH-03', 'PH-04', 'PH-05']);
};

export const addDeletedPhotoId = (id) => {
  if (!id) return;
  const current = getDeletedPhotoIds();
  if (!current.includes(id)) {
    const updated = [...current, id];
    safeStorageSet('portal-deleted-photo-ids', updated);
    if (isSupabaseConfigured()) {
      saveCloudStoreItem('portal-deleted-photo-ids', updated).catch(() => {});
    }
  }
};

export const getSavedExecutiveProjects = () => {
  const deletedIds = new Set(getDeletedProjectIds());
  try {
    const saved = safeStorageGet('portal-national-projects', null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved.filter(p => !deletedIds.has(p.id));
    }
  } catch (e) {}
  return nationalProjects.filter(p => !deletedIds.has(p.id));
};

export const syncExecutiveProjectsFromCloud = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const cloudDeleted = await fetchCloudStoreItem('portal-deleted-project-ids');
    if (Array.isArray(cloudDeleted) && cloudDeleted.length > 0) {
      const current = getDeletedProjectIds();
      const mergedDeleted = Array.from(new Set([...current, ...cloudDeleted]));
      safeStorageSet('portal-deleted-project-ids', mergedDeleted);
    }

    const deletedIds = new Set(getDeletedProjectIds());
    const cloudProjects = await fetchCloudProjects();
    if (cloudProjects && Array.isArray(cloudProjects) && cloudProjects.length > 0) {
      const filtered = cloudProjects.filter(p => !deletedIds.has(p.id));
      safeStorageSet('portal-national-projects', filtered);
      window.dispatchEvent(new CustomEvent('cloud_projects_updated', { detail: filtered }));
      return filtered;
    }
  } catch (e) {
    console.warn('[Supabase Sync] خطأ في مزامنة المشروعات:', e);
  }
  return null;
};

export const syncFieldPhotosFromCloud = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const cloudDeleted = await fetchCloudStoreItem('portal-deleted-photo-ids');
    if (Array.isArray(cloudDeleted) && cloudDeleted.length > 0) {
      const current = getDeletedPhotoIds();
      const mergedDeleted = Array.from(new Set([...current, ...cloudDeleted]));
      safeStorageSet('portal-deleted-photo-ids', mergedDeleted);
    }

    const deletedPhotoIds = new Set(getDeletedPhotoIds());
    const cloudPhotos = await fetchCloudPhotos();
    if (cloudPhotos && Array.isArray(cloudPhotos) && cloudPhotos.length > 0) {
      const filtered = cloudPhotos.filter(p => !deletedPhotoIds.has(p.id));
      safeStorageSet('portal-field-photos-v2', filtered);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('cloud_photos_updated', { detail: filtered }));
      return filtered;
    }
  } catch (e) {
    console.warn('[Supabase Sync] خطأ في مزامنة الصور:', e);
  }
  return null;
};

export const syncHeroCardFromCloud = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const cloudHero = await fetchCloudHeroCard();
    if (cloudHero && typeof cloudHero === 'object') {
      safeStorageSet('portal-hero-showcase-card', cloudHero);
      window.dispatchEvent(new Event('storage'));
      return cloudHero;
    }
  } catch (e) {
    console.warn('[Supabase Sync] خطأ في مزامنة بطاقة العرض:', e);
  }
  return null;
};

export const syncMapLocationsFromCloud = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const cloudLocs = await fetchCloudStoreItem('portal-map-locations');
    if (cloudLocs && Array.isArray(cloudLocs) && cloudLocs.length > 0) {
      safeStorageSet('portal_map_locations', cloudLocs);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('cloud_map_locations_updated', { detail: cloudLocs }));
      return cloudLocs;
    }
  } catch (e) {
    console.warn('[Supabase Sync] خطأ في مزامنة محطات الخريطة:', e);
  }
  return null;
};

export const syncSelectedWorkItemsFromCloud = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const cloudWork = await fetchCloudStoreItem('portal-selected-work-items');
    if (cloudWork && Array.isArray(cloudWork) && cloudWork.length > 0) {
      safeStorageSet('portal_selected_work_items', cloudWork);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('cloud_road_sectors_updated', { detail: cloudWork }));
      return cloudWork;
    }
  } catch (e) {
    console.warn('[Supabase Sync] خطأ في مزامنة قطاعات المسار:', e);
  }
  return null;
};

/**
 * مزامنة سحابية شاملة ثنائية الاتجاه:
 * 1. تسحب أحدث الأخبار والصور والمشروعات ومحطات الخريطة والقطاعات من سوبابيس لجميع الأجهزة
 * 2. إذا كان هذا الجهاز يحتوي على بيانات محلية جديدة لم ترفع بعد، يرفعها تلقائياً
 */
export const syncAllPortalData = async () => {
  if (!isSupabaseConfigured()) return { success: false, message: 'سوبابيس غير مهيأ' };

  try {
    // جلب أحدث الحالات السحابية
    const [cloudProjects, cloudPhotos, cloudNews, cloudTicker, cloudHero, cloudMapLocs, cloudSectorsWork, cloudHeroBg] = await Promise.allSettled([
      syncExecutiveProjectsFromCloud(),
      syncFieldPhotosFromCloud(),
      syncNewsFromCloud(),
      syncTickerNewsFromCloud(),
      syncHeroCardFromCloud(),
      syncMapLocationsFromCloud(),
      syncSelectedWorkItemsFromCloud(),
      syncHeroBackgroundFromCloud()
    ]);

    // تحقق من وجود بيانات محلية تحتاج إلى رفع إلى السحابة
    try {
      const localProjects = safeStorageGet('portal-national-projects', null);
      if (localProjects && Array.isArray(localProjects) && localProjects.length > 0) {
        const cloudProjectsVal = cloudProjects.status === 'fulfilled' ? cloudProjects.value : null;
        if (!cloudProjectsVal || localProjects.length > cloudProjectsVal.length) {
          const deletedIds = new Set(getDeletedProjectIds());
          const cloudArr = Array.isArray(cloudProjectsVal) ? cloudProjectsVal : [];
          const mergedMap = new Map();
          cloudArr.filter(p => !deletedIds.has(p.id)).forEach(p => mergedMap.set(p.id, p));
          localProjects.filter(p => !deletedIds.has(p.id)).forEach(p => mergedMap.set(p.id, p));
          await saveCloudProjects(Array.from(mergedMap.values()));
        }
      }

      const localNews = safeStorageGet('portal-news-posts', null);
      if (localNews && Array.isArray(localNews) && localNews.length > 0) {
        const cloudNewsVal = cloudNews.status === 'fulfilled' ? cloudNews.value : null;
        if (!cloudNewsVal || localNews.length > cloudNewsVal.length) {
          await saveCloudNews(localNews);
        }
      }

      const localPhotos = safeStorageGet('portal-field-photos-v2', null);
      if (localPhotos && Array.isArray(localPhotos) && localPhotos.length > 0) {
        const cloudPhotosVal = cloudPhotos.status === 'fulfilled' ? cloudPhotos.value : null;
        if (!cloudPhotosVal || localPhotos.length > cloudPhotosVal.length) {
          await saveCloudPhotos(localPhotos);
        }
      }
    } catch (ePush) {
      console.warn('[Supabase SyncAll] خطأ في التحقق من رفع البيانات المحلية:', ePush);
    }

    return { success: true };
  } catch (err) {
    console.warn('[Supabase SyncAll] خطأ في المزامنة الشاملة:', err);
    return { success: false, error: err };
  }
};

// تشغيل المزامنة السحابية التلقائية فوراً وبشكل اقتصادي للموارد
if (typeof window !== 'undefined') {
  let lastSyncTime = 0;
  let isSyncing = false;

  const triggerInitialSync = async (force = false) => {
    const now = Date.now();
    // تجنب التكرار والتهنيج (فاصل دقيقتين كحد أدنى إلا إذا تم الفرض يدوياً)
    if (!force && (isSyncing || now - lastSyncTime < 120000)) {
      return;
    }
    if (isSupabaseConfigured()) {
      try {
        isSyncing = true;
        lastSyncTime = now;
        await syncAllPortalData();
      } catch (e) {
        // Fallback silently
      } finally {
        isSyncing = false;
      }
    }
  };

  // إطلاق المزامنة السريعة فور تحميل المستند
  setTimeout(() => triggerInitialSync(false), 80);
  window.addEventListener('online', () => triggerInitialSync(false));
  window.addEventListener('supabase_config_changed', () => triggerInitialSync(true));
}

export const saveExecutiveProjects = (projects) => {
  safeStorageSet('portal-national-projects', projects);
  window.dispatchEvent(new CustomEvent('cloud_projects_updated', { detail: projects }));

  if (isSupabaseConfigured()) {
    saveCloudProjects(projects).catch(err => {
      console.warn('[Supabase] فشل حفظ المشروعات سحابياً:', err);
    });
  }
};

// ── Hero 3D Showcase Card State Management ──
export const initialHeroCard = {
  tag: 'الموقف التنفيذي الميداني المعتمد',
  tagEn: 'Field Operations Status',
  title: 'أعمال رصف وتأهيل مسار 360 كم',
  titleEn: '360km Highway Paving Operations',
  image: './road-paving-official.jpg',
  progress: 68.5,
  distance: '360 كيلومتراً',
  distanceEn: '360 km',
  supervisor: 'مشروعات المواصلات',
  supervisorEn: 'Transport Projects',
        };

export const getSavedHeroCard = () => {
  try {
    const saved = localStorage.getItem('portal-hero-showcase-card');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const img = parsed.image;
        const normalizedImg = (img && img.startsWith('/') && !img.startsWith('//')) ? '.' + img : img;
        return { ...initialHeroCard, ...parsed, image: normalizedImg || initialHeroCard.image };
      }
    }
  } catch (e) {}
  return initialHeroCard;
};

export const saveHeroCard = (heroCard) => {
  try {
    localStorage.setItem('portal-hero-showcase-card', JSON.stringify(heroCard));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cloud_hero_updated'));
  } catch (e) {}

  if (isSupabaseConfigured()) {
    saveCloudHeroCard(heroCard).catch(err => {
      console.warn('[Supabase] فشل حفظ بطاقة الهيرو سحابياً:', err);
    });
  }
};

// ── Hero 4K Background State Management (التحكم في خلفية البوابة الرئيسية بدقة 4K) ──
export const initialHeroBackground = {
  image: './hero-desert-road.jpg',
  mobileImage: './road-hero-mobile.jpg',
  overlayOpacity: 70, // percentage for text contrast
  filter: 'none',
  objectPosition: 'center',
  isCustom: false
};

export const getSavedHeroBackground = () => {
  try {
    const saved = localStorage.getItem('portal_hero_bg_image');
    if (saved) {
      if (saved.startsWith('{')) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...initialHeroBackground, ...parsed, isCustom: true };
        }
      } else if (typeof saved === 'string' && saved.length > 5) {
        return { ...initialHeroBackground, image: saved, mobileImage: saved, isCustom: true };
      }
    }
  } catch (e) {}
  return initialHeroBackground;
};

export const saveHeroBackground = (bgConfig) => {
  try {
    const payload = typeof bgConfig === 'string'
      ? { ...initialHeroBackground, image: bgConfig, mobileImage: bgConfig, isCustom: true }
      : { ...initialHeroBackground, ...bgConfig, isCustom: true };
    localStorage.setItem('portal_hero_bg_image', JSON.stringify(payload));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cloud_hero_bg_updated'));
  } catch (e) {
    console.warn('[SafeStorage] Quota exceeded saving hero bg:', e);
  }

  if (isSupabaseConfigured()) {
    saveCloudStoreItem('portal_hero_bg_image', typeof bgConfig === 'object' ? bgConfig : { image: bgConfig }).catch(err => {
      console.warn('[Supabase] فشل حفظ خلفية الواجهة سحابياً:', err);
    });
  }
};

export const resetHeroBackground = () => {
  try {
    localStorage.removeItem('portal_hero_bg_image');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cloud_hero_bg_updated'));
  } catch (e) {}
  if (isSupabaseConfigured()) {
    saveCloudStoreItem('portal_hero_bg_image', null).catch(() => {});
  }
};

export const syncHeroBackgroundFromCloud = async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const cloudBg = await fetchCloudStoreItem('portal_hero_bg_image');
    if (cloudBg) {
      const payload = typeof cloudBg === 'string'
        ? { ...initialHeroBackground, image: cloudBg, mobileImage: cloudBg, isCustom: true }
        : { ...initialHeroBackground, ...cloudBg, isCustom: true };
      localStorage.setItem('portal_hero_bg_image', JSON.stringify(payload));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('cloud_hero_bg_updated'));
      return payload;
    }
  } catch (e) {}
  return null;
};

// ── Interactive Map Locations & Telemetry HUD State ──
export const initialMapLocations = [
  {
    id: 'ubari',
    title: 'أوباري (نقطة الانطلاق)',
    titleEn: 'Ubari (Starting Point)',
    coords: '26.5925,12.7803',
    mapQuery: '26.5925,12.7803(أوباري)',
    sector: 'المحطة 000+00',
    stage: 'طبقة الرصف السطحية وأعمال الأكتاف',
    progress: 82,
    zoom: 12,
    desc: 'منطقة انطلاق المشروع والمجمع الإداري الرئيسي لجهاز تنفيذ مشروعات المواصلات.'
  },
  {
    id: 'aluwaynat_city',
    title: 'العوينات',
    titleEn: 'Al-Uwaynat',
    coords: '25.7766,10.5630',
    mapQuery: '25.7766,10.5630(العوينات)',
    sector: 'المحطة 120+00',
    stage: 'طبقة الأساس والعبّارات الخرسانية',
    progress: 74,
    zoom: 12,
    desc: 'أعمال طبقة الأسفلت الرابطة ورفع كفاءة وتأهيل العبارات الخرسانية الموجودة بمسار العوينات.'
  },
  {
    id: 'aluwaynat_tahala',
    title: 'قطاع العوينات - تهالة',
    titleEn: 'Al-Uwaynat – Tahala Sector',
    coords: '25.4076,10.3522',
    mapQuery: '25.4076,10.3522(قطاع+تهالة)',
    sector: 'المحطة 215+00',
    stage: 'أعمال التوسعة وتخطيط وعلامات المسار',
    progress: 65,
    zoom: 12,
    desc: 'إنجاز أعمال التوسعة والفرش والتجهيز لعلامات المسار والشواخص المرورية بقطاع تهالة.'
  },
  {
    id: 'ghat',
    title: 'غات (نهاية الطريق 360 كم)',
    titleEn: 'Ghat (Route End 360 km)',
    coords: '24.9647,10.1764',
    mapQuery: '24.9647,10.1764(غات)',
    sector: 'المحطة 360+00',
    stage: 'تأهيل المداخل واللوحات المرورية',
    progress: 58,
    zoom: 12,
    desc: 'المنفذ الحدودي الجنوبي الغربي وتأهيل المداخل التاريخية.'
  }
];

export const getSavedMapLocations = () => {
  try {
    const saved = localStorage.getItem('portal_map_locations');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed.map(item => ({
          ...item,
          title: (item.title || '')
            .replace(/مدينة\s*/g, '')
            .replace(/\(مدينة\s*/g, '(')
            .trim(),
          desc: (item.desc || '')
            .replace(/مدينة\s*/g, '')
            .replace(/المدينة/g, 'المنطقة')
            .trim()
        }));
        if (saved.includes('مدينة')) {
          localStorage.setItem('portal_map_locations', JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch (e) {}
  return initialMapLocations.map(item => ({
    ...item,
    title: (item.title || '').replace(/مدينة\s*/g, '').replace(/\(مدينة\s*/g, '(').trim(),
    desc: (item.desc || '').replace(/مدينة\s*/g, '').replace(/المدينة/g, 'المنطقة').trim()
  }));
};

export const saveMapLocations = (locations) => {
  try {
    localStorage.setItem('portal_map_locations', JSON.stringify(locations));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('cloud_map_locations_updated', { detail: locations }));
  } catch (e) {}

  if (isSupabaseConfigured()) {
    saveCloudStoreItem('portal-map-locations', locations).catch(err => {
      console.warn('[Supabase] فشل حفظ محطات الخريطة سحابياً:', err);
    });
  }
};

// ── Selected Work & Road Sectors Ticker Items ──
export const initialSelectedWorkItems = [
  { id: 'SEC-01', title: 'القطاع 01: أوباري - تين أوباو (90 كم)', stat: '78% منجز', badge: 'رصف الطبقة الرابطة', icon: 'zap' },
  { id: 'SEC-02', title: 'القطاع 02: تين أوباو - العوينات (110 كم)', stat: '65% منجز', badge: 'طبقة الأساس والعبّارات', icon: 'flame' },
  { id: 'SEC-03', title: 'القطاع 03: العوينات - تهالة (85 كم)', stat: '72% منجز', badge: 'تثبيت الأكتاف وتخطيط المسار', icon: 'shield' },
  { id: 'SEC-04', title: 'القطاع 04: تهالة - غات (75 كم)', stat: '59% منجز', badge: 'أعمال التوسعة والسلامة', icon: 'activity' },
  { id: 'SEC-05', title: 'منظومة السلامة والشواخص الإرشادية', stat: '100% مطابقة', badge: 'معايير هندسية معتمدة', icon: 'award' },
  { id: 'SEC-06', title: 'مختبرات الفحص الهندسي الميداني', stat: 'ISO 9001', badge: 'معايير دولية', icon: 'shield' }
];

export const getSavedSelectedWorkItems = () => {
  try {
    const saved = localStorage.getItem('portal_selected_work_items');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return initialSelectedWorkItems;
};

export const saveSelectedWorkItems = (items) => {
  try {
    localStorage.setItem('portal_selected_work_items', JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('cloud_road_sectors_updated', { detail: items }));
  } catch (e) {}

  if (isSupabaseConfigured()) {
    saveCloudStoreItem('portal-selected-work-items', items).catch(err => {
      console.warn('[Supabase] فشل حفظ قطاعات المسار سحابياً:', err);
    });
  }
};
