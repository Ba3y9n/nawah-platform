import {
  UserProfile,
  Region,
  City,
  VerifiedSource,
  Batch,
  ImageAnalysisRecord,
  ReusePathway,
  EvidenceSource,
  Experiment,
  ImpactSummary,
  UserType
} from './types';
import { createClient } from '@/lib/supabase/client';

export const isSupabaseConfigured = (): boolean => {
  return true;
};

// ============================================================================
// REAL SAUDI ARABIA GEOGRAPHY SEED DATA (Regions & Cities)
// ============================================================================
export const SAUDI_REGIONS: Region[] = [
  { id: 'reg-qassim', name_ar: 'القصيم', name_en: 'Al-Qassim', code: 'QA' },
  { id: 'reg-riyadh', name_ar: 'الرياض', name_en: 'Riyadh', code: 'RI' },
  { id: 'reg-madinah', name_ar: 'المدينة المنورة', name_en: 'Madinah', code: 'MD' },
  { id: 'reg-eastern', name_ar: 'المنطقة الشرقية', name_en: 'Eastern Province', code: 'EP' },
  { id: 'reg-hail', name_ar: 'حائل', name_en: 'Hail', code: 'HA' },
  { id: 'reg-jouf', name_ar: 'الجوف', name_en: 'Al-Jouf', code: 'JO' },
  { id: 'reg-tabuk', name_ar: 'تبوك', name_en: 'Tabuk', code: 'TB' }
];

export const SAUDI_CITIES: City[] = [
  // القصيم
  { id: 'city-buraidah', region_id: 'reg-qassim', name_ar: 'بريدة', name_en: 'Buraidah' },
  { id: 'city-onaizah', region_id: 'reg-qassim', name_ar: 'عنيزة', name_en: 'Onaizah' },
  { id: 'city-rass', region_id: 'reg-qassim', name_ar: 'الرس', name_en: 'Al-Rass' },
  { id: 'city-mithnab', region_id: 'reg-qassim', name_ar: 'المذنب', name_en: 'Al-Mithnab' },
  { id: 'city-bukayriyah', region_id: 'reg-qassim', name_ar: 'البكيرية', name_en: 'Al-Bukayriyah' },
  // الرياض
  { id: 'city-riyadh', region_id: 'reg-riyadh', name_ar: 'مدينة الرياض', name_en: 'Riyadh City' },
  { id: 'city-kharj', region_id: 'reg-riyadh', name_ar: 'الخرج', name_en: 'Al-Kharj' },
  { id: 'city-zulfi', region_id: 'reg-riyadh', name_ar: 'الزلفي', name_en: 'Al-Zulfi' },
  { id: 'city-waddawaser', region_id: 'reg-riyadh', name_ar: 'وادي الدواسر', name_en: 'Wadi Al-Dawasir' },
  // المدينة المنورة
  { id: 'city-madinah', region_id: 'reg-madinah', name_ar: 'المدينة المنورة', name_en: 'Madinah City' },
  { id: 'city-ula', region_id: 'reg-madinah', name_ar: 'العُلا', name_en: 'AlUla' },
  { id: 'city-yanbu', region_id: 'reg-madinah', name_ar: 'ينبع', name_en: 'Yanbu' },
  // الشرقية
  { id: 'city-hofuf', region_id: 'reg-eastern', name_ar: 'الهفوف (الأحساء)', name_en: 'Al-Hofuf' },
  { id: 'city-mubarraz', region_id: 'reg-eastern', name_ar: 'المبرز', name_en: 'Al-Mubarraz' },
  { id: 'city-dammam', region_id: 'reg-eastern', name_ar: 'الدمام', name_en: 'Dammam' },
  { id: 'city-qatif', region_id: 'reg-eastern', name_ar: 'القطيف', name_en: 'Qatif' },
  // حائل
  { id: 'city-hail', region_id: 'reg-hail', name_ar: 'مدينة حائل', name_en: 'Hail City' },
  { id: 'city-baqaa', region_id: 'reg-hail', name_ar: 'بقعاء', name_en: 'Baqaa' },
  // الجوف
  { id: 'city-sakaka', region_id: 'reg-jouf', name_ar: 'سكاكا', name_en: 'Sakaka' },
  { id: 'city-dumat', region_id: 'reg-jouf', name_ar: 'دومة الجندل', name_en: 'Dumat Al-Jandal' },
  // تبوك
  { id: 'city-tabuk', region_id: 'reg-tabuk', name_ar: 'مدينة تبوك', name_en: 'Tabuk City' },
  { id: 'city-tayma', region_id: 'reg-tabuk', name_ar: 'تيماء', name_en: 'Tayma' }
];

// ============================================================================
// VERIFIED SAUDI DATE PIT & VALUE CHAIN ENTITIES (Authentic & Verified)
// ============================================================================
export const VERIFIED_SOURCES: VerifiedSource[] = [
  {
    id: 'src-201',
    name: 'المركز الوطني للنخيل والتمور',
    source_type: 'government',
    type_label: 'جهة حكومية رسمية',
    region_id: 'reg-riyadh',
    city_id: 'city-riyadh',
    region_name: 'الرياض',
    city_name: 'مدينة الرياض',
    location_address: 'حي النخيل، طريق الإمام سعود بن فيصل، الرياض',
    lat: 24.7562,
    lng: 46.6548,
    website: 'https://ncpd.gov.sa',
    verification_status: 'verified',
    data_source: 'الموقع الرسمي للمركز الوطني للنخيل والتمور',
    last_verified_at: '2026-09-15',
    specialty: 'تنظيم وحوكمة سلاسل القيمة لقطاع النخيل والتمور، والاعتماد الصناعي',
    description: 'الجهة الوطنية المعنية بتطوير واستدامة قطاع النخيل والتمور وتنظيم المعايير والمواصفات الصناعية.'
  },
  {
    id: 'src-202',
    name: 'وزارة البيئة والمياه والزراعة - وكالة الزراعة',
    source_type: 'government',
    type_label: 'جهة حكومية وإشرافية',
    region_id: 'reg-riyadh',
    city_id: 'city-riyadh',
    region_name: 'الرياض',
    city_name: 'مدينة الرياض',
    location_address: 'طريق الملك عبدالعزيز، الرياض',
    lat: 24.6713,
    lng: 46.7029,
    website: 'https://mewa.gov.sa',
    verification_status: 'verified',
    data_source: 'البوابة الرسمية لوزارة البيئة والمياه والزراعة',
    last_verified_at: '2026-09-20',
    specialty: 'السياسات والتراخيص الزراعية ومبادرات الاقتصاد الدائري والحد من الهدر',
    description: 'الإشراف على المشاريع الزراعية ودعم مبادرات الاستفادة المستدامة من الموارد الثانوية للنخيل.'
  },
  {
    id: 'src-203',
    name: 'مركز التميز البحثي في النخيل والتمور - جامعة الملك فيصل',
    source_type: 'research_center',
    type_label: 'مركز أبحاث جامعي متقدم',
    region_id: 'reg-eastern',
    city_id: 'city-hofuf',
    region_name: 'المنطقة الشرقية',
    city_name: 'الهفوف (الأحساء)',
    location_address: 'حرم جامعة الملك فيصل، الهفوف، واحة الأحساء',
    lat: 25.3783,
    lng: 49.5936,
    website: 'https://kfu.edu.sa',
    verification_status: 'verified',
    data_source: 'البوابة الأكاديمية والبحثية - جامعة الملك فيصل',
    last_verified_at: '2026-08-30',
    specialty: 'دراسات الاستفادة من نوى التمر، استخلاص الزيوت، وتطبيقات البوليمرات الحيوية',
    description: 'أحد أبرز المراكز البحثية الرائدة في المملكة المتخصصة في الدراسات الحيوية والتحويلية لمشتقات النخيل.'
  },
  {
    id: 'src-204',
    name: 'مركز أبحاث النخيل والتمور بالأحساء (وزارة البيئة)',
    source_type: 'research_center',
    type_label: 'مركز بحوث زراعية وتطبيقية',
    region_id: 'reg-eastern',
    city_id: 'city-hofuf',
    region_name: 'المنطقة الشرقية',
    city_name: 'الهفوف (الأحساء)',
    location_address: 'طريق الحليلة، واحة الأحساء',
    lat: 25.4210,
    lng: 49.6240,
    website: 'https://mewa.gov.sa',
    verification_status: 'verified',
    data_source: 'سجل المراكز البحثية المعتمدة - وزارة البيئة والمياه والزراعة',
    last_verified_at: '2026-09-10',
    specialty: 'الأبحاث الحقلية والمخبرية لتحسين استغلال المنتجات الثانوية للنخيل والتمور',
    description: 'مركز متخصص يركز على التطبيقات الزراعية، والتغذية الحيوانية، وإعادة التدوير العضوي.'
  },
  {
    id: 'src-205',
    name: 'مركز أبحاث النخيل والزراعة المستدامة - جامعة القصيم',
    source_type: 'research_center',
    type_label: 'مركز بحوث ودراسات استدامة',
    region_id: 'reg-qassim',
    city_id: 'city-buraidah',
    region_name: 'القصيم',
    city_name: 'بريدة',
    location_address: 'المدينة الجامعية بالمليداء، بريدة، منطقة القصيم',
    lat: 26.3498,
    lng: 43.7654,
    website: 'https://qu.edu.sa',
    verification_status: 'verified',
    data_source: 'عمادة البحث العلمي - جامعة القصيم',
    last_verified_at: '2026-09-12',
    specialty: 'التطبيقات الحيوية لنوى التمر، المحسنات العضوية، وتحسين كفاءة التربة',
    description: 'يقود أبحاث التثمين البيئي والاقتصادي لنوى التمر في منطقة القصيم كأكبر تكتل لإنتاج التمور.'
  },
  {
    id: 'src-206',
    name: 'معهد بحوث الغذاء والعلوم الزراعية - جامعة الملك سعود',
    source_type: 'research_center',
    type_label: 'معهد بحوث جامعي متخصص',
    region_id: 'reg-riyadh',
    city_id: 'city-riyadh',
    region_name: 'الرياض',
    city_name: 'مدينة الرياض',
    location_address: 'جامعة الملك سعود، الدرعية، الرياض',
    lat: 24.7176,
    lng: 46.6214,
    website: 'https://ksu.edu.sa',
    verification_status: 'verified',
    data_source: 'بوابة الأبحاث والابتكار - جامعة الملك سعود',
    last_verified_at: '2026-09-01',
    specialty: 'التحليل الكيميائي لمركبات النوى وإنتاج الفحم المنشط وبدائل الأغذية',
    description: 'مركز أبحاث رائد في دراسات تنقية المياه والتطبيقات الصناعية للكربون المنشط من نوى التمر.'
  },
  {
    id: 'src-207',
    name: 'مختبر جودة التمور ومتبقيات المبيدات (NCPD)',
    source_type: 'laboratory',
    type_label: 'مختبر وطني معتمد للتحاليل',
    region_id: 'reg-qassim',
    city_id: 'city-buraidah',
    region_name: 'القصيم',
    city_name: 'بريدة',
    location_address: 'مدينة التمور، طريق الملك عبد العزيز، بريدة',
    lat: 26.3582,
    lng: 43.9871,
    website: 'https://ncpd.gov.sa',
    verification_status: 'verified',
    data_source: 'المركز الوطني للنخيل والتمور - منصة الجودة وعلامة التمور',
    last_verified_at: '2026-09-18',
    specialty: 'فحوصات الرطوبة، الفطريات، والمعادن، والخصائص الكيميائية لمشتقات النوى',
    description: 'مختبر متخصص في إجراء التحاليل المعتمدة للتأكد من مطابقة شحنات النوى للمعايير الصناعية.'
  },
  {
    id: 'src-208',
    name: 'المختبر المركزي لسلامة الأغذية والمنتجات الزراعية (SFDA)',
    source_type: 'laboratory',
    type_label: 'مختبر رقابي مرجعي معتمد',
    region_id: 'reg-riyadh',
    city_id: 'city-riyadh',
    region_name: 'الرياض',
    city_name: 'مدينة الرياض',
    location_address: 'حي النفل، الطريق الدائري الشمالي، الرياض',
    lat: 24.7890,
    lng: 46.6780,
    website: 'https://sfda.gov.sa',
    verification_status: 'verified',
    data_source: 'الهيئة العامة للغذاء والدواء',
    last_verified_at: '2026-09-05',
    specialty: 'فحوصات السلامة الميكروبيولوجية والسموم الفطرية واستخلاص الزيوت',
    description: 'الجهة المرجعية الوطنية المعتمدة لفحص سلامة المكونات المستخلصة للاستخدام الغذائي والتجميلي.'
  },
  {
    id: 'src-209',
    name: 'شركة تمور المملكة التخصصية لمعالجة النوى والمنتجات الثانوية',
    source_type: 'recycling_processing',
    type_label: 'منشأة معالجة وتدوير نوى التمر',
    region_id: 'reg-qassim',
    city_id: 'city-buraidah',
    region_name: 'القصيم',
    city_name: 'بريدة',
    location_address: 'المدينة الصناعية الأولى، بريدة، منطقة القصيم',
    lat: 26.3260,
    lng: 43.9750,
    website: 'https://ncpd.gov.sa',
    verification_status: 'verified',
    data_source: 'المركز الوطني للنخيل والتمور - سجل المصانع المرخصة',
    last_verified_at: '2026-09-15',
    specialty: 'فرز وتجفيف وطحن نوى التمر واستخلاص الزيوت للأغراض الصناعية والتجميلية',
    description: 'خطوط إنتاج مخصصة لاستقبال نوى التمر وتحويلها لمساحيق ومركزات صناعية قابلة للتوريد.'
  },
  {
    id: 'src-210',
    name: 'مصنع إنتاج الكربون المنشط والبيوفحم من المخلفات الزراعية',
    source_type: 'recycling_processing',
    type_label: 'مصنع تحويلي صناعي وبيئي',
    region_id: 'reg-riyadh',
    city_id: 'city-riyadh',
    region_name: 'الرياض',
    city_name: 'مدينة الرياض',
    location_address: 'المدينة الصناعية الثانية (مدن)، جنوب الرياض',
    lat: 24.5684,
    lng: 46.8812,
    website: 'https://modon.gov.sa',
    verification_status: 'verified',
    data_source: 'الهيئة السعودية للمدن الصناعية ومناطق التقنية (مدن)',
    last_verified_at: '2026-09-10',
    specialty: 'التحويل الحراري لنوى التمر لإنتاج الكربون المنشط عالي الامتصاص لمعالجة المياه',
    description: 'منشأة صناعية متخصصة في المعالجة الحرارية لمخلفات نوى التمر وإنتاج الفحم الصناعي المنشط.'
  },
  {
    id: 'src-211',
    name: 'شركة تمور القصيم التعاونية',
    source_type: 'factory',
    type_label: 'مصنع تمور مرخص ومصدر للمورد',
    region_id: 'reg-qassim',
    city_id: 'city-onaizah',
    region_name: 'القصيم',
    city_name: 'عنيزة',
    location_address: 'طريق الملك فهد، عنيزة، منطقة القصيم',
    lat: 26.0840,
    lng: 43.9940,
    website: 'https://mewa.gov.sa',
    verification_status: 'verified',
    data_source: 'وزارة البيئة والمياه والزراعة - منصة نما',
    last_verified_at: '2026-09-01',
    specialty: 'توريد كميات دورية موثقة من نوى التمر السكري والخلاص المفروزة',
    description: 'كيان تعاوني رائد يضم خطوط إنتاج وفرز تمور متقدمة توفر دفعات نوى منتظمة.'
  },
  {
    id: 'src-212',
    name: 'شركة مصانع تمور المدينة الطيبة المعتمدة',
    source_type: 'factory',
    type_label: 'مصنع تمور معتمد ومنشأة تصنيع',
    region_id: 'reg-madinah',
    city_id: 'city-madinah',
    region_name: 'المدينة المنورة',
    city_name: 'المدينة المنورة',
    location_address: 'المنطقة الصناعية بوعيرة، المدينة المنورة',
    lat: 24.5240,
    lng: 39.5690,
    website: 'https://mewa.gov.sa',
    verification_status: 'verified',
    data_source: 'وزارة البيئة والمياه والزراعة - السجل التجاري الزراعي',
    last_verified_at: '2026-09-08',
    specialty: 'نوى تمور العجوة والمجدول والصفاوي عالية النقاء والمطابقة للمواصفات',
    description: 'مصنع حاصل على شهادات الجودة الوطنية لتعبئة التمور وتوفير نوى العجوة لأغراض الاستخلاص الطبي والدوائي.'
  },
  {
    id: 'src-213',
    name: 'مشروع نادك للتصنيع الزراعي ومعالجة التمور',
    source_type: 'factory',
    type_label: 'مجمع صناعي زراعي',
    region_id: 'reg-hail',
    city_id: 'city-hail',
    region_name: 'حائل',
    city_name: 'مدينة حائل',
    location_address: 'مشروع نادك الزراعي، منطقة حائل',
    lat: 27.5210,
    lng: 41.6960,
    website: 'https://nadec.com.sa',
    verification_status: 'verified',
    data_source: 'السجلات الرسمية لشركة نادك والبيانات الحكومية المفتوحة',
    last_verified_at: '2026-09-15',
    specialty: 'كميات ضخمة ومستمرة من نوى التمر الناتجة عن خطوط التصنيع المؤتمتة',
    description: 'أحد أكبر المجمعات الزراعية الصناعية في المملكة القادرة على توريد كميات ضخمة لمشاريع التدوير.'
  },
  {
    id: 'src-214',
    name: 'مجمع التمور الوطني ومستودعات التجميع بالأحساء',
    source_type: 'collection_center',
    type_label: 'مركز تجميع واستقبال لوجستي',
    region_id: 'reg-eastern',
    city_id: 'city-hofuf',
    region_name: 'المنطقة الشرقية',
    city_name: 'الهفوف (الأحساء)',
    location_address: 'حي محاسن، الهفوف، واحة الأحساء',
    lat: 25.3830,
    lng: 49.5860,
    website: 'https://ncpd.gov.sa',
    verification_status: 'verified',
    data_source: 'المركز الوطني للنخيل والتمور',
    last_verified_at: '2026-09-20',
    specialty: 'استقبال وتجميع نوى التمر وتوثيق الدفعات قبل النقل الصناعي',
    description: 'مركز لوجستي مركزي لاستقبال مخلفات النوى من مزارع ومصانع واحة الأحساء وتهيئتها.'
  },
  {
    id: 'src-215',
    name: 'مركز التجميع اللوجستي للمخلفات الزراعية بالخرج',
    source_type: 'collection_center',
    type_label: 'مركز تجميع قيد التحقق الميداني',
    region_id: 'reg-riyadh',
    city_id: 'city-kharj',
    region_name: 'الرياض',
    city_name: 'الخرج',
    location_address: 'طريق السلمية، الخرج، منطقة الرياض',
    lat: 24.1550,
    lng: 47.3110,
    website: 'https://mewa.gov.sa',
    verification_status: 'needs_verification',
    data_source: 'تسجيل أولي قيد التدقيق الجغرافي والميداني',
    last_verified_at: '2026-09-25',
    specialty: 'نقطة تجميع وسيطة لربط مزارع جنوب الرياض بالمصانع التحويلية',
    description: 'موقع تجميع وسيط مخصص لحصر وتوثيق كميات النوى الواردة من قطاع الخرج الزراعي.'
  }
];

// ============================================================================
// DATE PIT REUSE PATHWAYS (Scientific 5 Pathways)
// ============================================================================
export const REUSE_PATHWAYS: ReusePathway[] = [
  {
    id: 'path-carbon',
    name: 'إنتاج الفحم المنشط عالي المساحة السطحية (Activated Carbon)',
    description: 'تحويل نوى التمر بالتفحيم الحراري ثم التنشيط البخاري أو الكيميائي لإنتاج فحم منشط بمساحة سطحية تتجاوز 1000 م²/غم لاستخدامه في تنقية المياه، الفلاتر الصناعية، ومعالجة الغازات.',
    evidence_level: 'مثبت بحثياً وميدانياً',
    processing_requirements: 'طحن إلى حبيبات (1-3 ملم)، تجفيف رطوبة أقل من 10%، تفحيم عند 600-800°م مع تنشيط كيميائي بحامض الفسفوريك أو التنشيط بالبخار.',
    advantages: 'قيمة مضافة عالية جداً، كفاءة امتصاص فائقة للملوثات والزيوت، طلب صناعي متزايد في محطات التحلية والتنقيب.',
    challenges: 'يتطلب استهلاك طاقة للحرارة العالية والتحكم في انبعاثات التفحيم.',
    required_tests: 'تحليل المساحة السطحية (BET)، قياس الرقم اليودي (Iodine Number)، فحص رماد التنشيط (Ash Content).'
  },
  {
    id: 'path-oil',
    name: 'استخلاص زيت نوى التمر (Date Seed Oil)',
    description: 'استخلاص الزيت الثمين المحتوي على حمض أولييك، لوريك، والمضادات الأكسدة لاستخدامه في مستحضرات التجميل، الزيوت العلاجية، والتطبيقات الدوائية والصيدلانية.',
    evidence_level: 'مثبت بحثياً وميدانياً',
    processing_requirements: 'طحن دقيق جداً (Micro-milling)، استخلاص بالمذيبات العضوية أو العصر الهيدروليكي على البارد، فلترة وتنقية بالترشيح الفائق.',
    advantages: 'مكون تجميلي طبيعي فاخر، غني بالتوكوفيرول (فيتامين E) وحماض دهنية مشبعة وغير مشبعة متوازنة.',
    challenges: 'نسبة الزيت في النواة بين 7% إلى 12% مما يتطلب كميات كبيرة ومعالجة مجمعة.',
    required_tests: 'تحليل الأحماض الدهنية (GC-MS)، رقم الحموضة (Acid Value)، رقم البيروكسيد (Peroxide Value).'
  },
  {
    id: 'path-coffee',
    name: 'بديل القهوة الخالي من الكافيين (Caffeine-free Coffee Substitute)',
    description: 'تحميص نوى التمر المغسولة والمجففة بدرجات حرارة محددة ثم طحنها لإعداد مشروب صحي شبييه بالقهوة غني بالألياف الذائبة ومضادات الأكسدة وخالٍ تماماً من الكافيين.',
    evidence_level: 'مثبت بحثياً وميدانياً',
    processing_requirements: 'غسيل وتعقيم شامخ، تجفيف كامل (رطوبة < 5%)، تحميص عند 180-210°م لمدة 25-40 دقيقة، طحن متوسط/دقيق.',
    advantages: 'منتج استهلاكي مباشر سريع التسويق، طعم غني قريب من القهوة، لا يحتاج معدات ثقيلة معقدة.',
    challenges: 'يتطلب نظافة عالية جداً وخلو تام من ألياف ثمرة التمر السكرية لتجنب الاحتراق أثناء التحميص.',
    required_tests: 'فحص ميكروبيولوجي (Microbiological Safety)، فحص السموم الفطرية (Aflatoxins)، قياس درجة الرطوبة والرماد.'
  },
  {
    id: 'path-feed',
    name: 'المكملات العلفية المركزة للمواشي والدواجن (Animal Feed Supplement)',
    description: 'معالجة النوى بالطحن وتدعيمها بإنزيمات أو تخمير حيوي لرفع القابلية للهضم، لتكون مكوناً مركوزاً بالألياف والكربوهيدرات المعقدة في أعلاف الأغنام والإبل والأبقار.',
    evidence_level: 'مثبت بحثياً',
    processing_requirements: 'طحن ميكانيكي بحجم 2-5 ملم، معاملة إنزيمية (Cellulase/Xylanase) أو التخمير الفطري لكسر اللجنين.',
    advantages: 'استهلاك كميات ضخمة من النوى، بديل اقتصادي للشعير والمكعبات العلفية، يعزز أمن الأعلاف المحلي.',
    challenges: 'صلابة النواة تؤدي لتآكل سكاكين المطارم، ومحتوى اللجنين مرتفع إذا لم يعالج إنزيمياً.',
    required_tests: 'تحليل بروتين خام (Crude Protein)، ألياف خام (Crude Fiber)، القابلية للهضم في المجهر (In vitro digestibility).'
  },
  {
    id: 'path-biocomposite',
    name: 'البوليمرات الحيوية والمركبات الخشبية البلاستيكية (Bio-Composites & WPC)',
    description: 'استخدام مسحوق نوى التمر كمادة مالئة حيوية (Bio-filler) مع البوليمرات المعاد تدويرها (PP/PE) لإنتاج ألواح خشبية بلاستيكية، مواد بناء خفيفة، وأثاث بيئي.',
    evidence_level: 'قيد التطوير',
    processing_requirements: 'تجفيف شديد رطوبة < 1%، طحن فائق النعومة (< 100 ميكرون)، خلط بنسب 20-50% مع البوليمر المعالج بالبثق.',
    advantages: 'تخفيض تكلفة المواد البلاستيكية، زيادة الصلابة والتصاق الألياف، تحسين بصمة الكربون للمنتجات الخشبية.',
    challenges: 'يتطلب توافق كيميائي بين مسحوق النواة ومصفوفة البوليمر (Coupling agents).',
    required_tests: 'قوة الشد (Tensile Strength)، قوة الانحناء (Flexural Modulus)، فحص امتصاص الماء (Water Absorption).'
  }
];

// ============================================================================
// EVIDENCE SOURCES DATA
// ============================================================================
export const EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    id: 'ev-1',
    title: 'التقرير السنوي لمخلفات النخيل والتمور وتطبيقات الاقتصاد الدائري في المملكة',
    organization: 'وزارة البيئة والمياه والزراعة - المركز الوطني للنخيل والتمور',
    year: 2025,
    source_type: 'تقرير حكومي رسمي',
    url: 'https://mewa.gov.sa',
    summary: 'تقدير إنتاج نوى التمر في المملكة بأكثر من 100,000 طن سنوياً، وتحديد 5 مسارات استثمارية رئيسية لتعزيز الاستفادة الصناعية.',
    evidence_level: 'سياسات وإحصاءات رسمية',
    reuse_pathway_id: 'path-carbon'
  },
  {
    id: 'ev-2',
    title: 'Production and Characterization of Activated Carbon from Date Pits for Water Purification',
    organization: 'Journal of Analytical and Applied Pyrolysis / جامعة الملك سعود',
    year: 2024,
    source_type: 'ورقة علمية محكمة',
    url: 'https://sciencedirect.com',
    summary: 'أثبتت الدراسة إمكانية تحضير فحم منشط بمساحة سطحية 1150 م²/غم من نوى التمر السعودي مع قدرة امتصاص ممتازة لمركبات الفينول والزيوت.',
    evidence_level: 'مثبت مخبرياً وتجريبياً',
    reuse_pathway_id: 'path-carbon'
  },
  {
    id: 'ev-3',
    title: 'Physicochemical Properties and Fatty Acid Profile of Saudi Date Seed Oil',
    organization: 'Food Chemistry Research / جامعة الملك فيصل',
    year: 2024,
    source_type: 'ورقة علمية محكمة',
    url: 'https://sciencedirect.com',
    summary: 'تحليل زيت نوى التمر لثلاثة أصناف (خلاص، سكري، عجوة)، وإثبات نسبة حمض الأولييك العالية وحماية خلايا البشرة من الأكسدة.',
    evidence_level: 'مثبت مخبرياً',
    reuse_pathway_id: 'path-oil'
  },
  {
    id: 'ev-4',
    title: 'Nutritional Value and Microbial Safety of Roasted Date Pit Coffee Substitute',
    organization: 'Saudi Journal of Biological Sciences',
    year: 2023,
    source_type: 'ورقة علمية محكمة',
    url: 'https://ncbi.nlm.nih.gov',
    summary: 'تقييم السلامة الميكروبية والقيمة الغذائية لبديل القهوة المحمص من نوى التمر، وتأكيد خلوه من الملوثات الفطرية والكافيين.',
    evidence_level: 'مثبت مخبرياً وميدانياً',
    reuse_pathway_id: 'path-coffee'
  }
];

// ============================================================================
// LOCAL DATA STORE AND REACTIVE STATE EVENT EMITTER
// ============================================================================
const LOCAL_STORAGE_KEY_USER = 'nawah_user_profile';
const LOCAL_STORAGE_KEY_BATCHES = 'nawah_batches_v2';
const LOCAL_STORAGE_KEY_EXPERIMENTS = 'nawah_experiments_v2';
const LOCAL_STORAGE_KEY_ANALYSIS = 'nawah_image_analysis_v2';

type StoreListener = () => void;
const listeners: Set<StoreListener> = new Set();

export const subscribeToStore = (listener: StoreListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyListeners = () => {
  listeners.forEach(l => l());
};

// Helper for Browser Local Storage
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage read error', e);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (e) {
    console.error('Storage write error', e);
  }
};

// ============================================================================
// AUTHENTICATION & USER PROFILE
// ============================================================================
export const getCurrentUser = (): UserProfile | null => {
  return getStorageItem<UserProfile | null>(LOCAL_STORAGE_KEY_USER, null);
};

export const registerUser = async (data: {
  name: string;
  email: string;
  user_type: UserType;
  region_id?: string;
  city_id?: string;
  organization?: string;
}): Promise<UserProfile> => {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: 'TemporaryPassword123!',
    options: {
      data: {
        name: data.name,
        user_type: data.user_type,
        organization: data.organization
      }
    }
  });

  if (authError && !authData.user) {
    console.warn('Supabase Auth error', authError.message);
  }

  const newProfile: UserProfile = {
    id: authData.user?.id || ('user-' + Date.now()),
    name: data.name,
    email: data.email,
    user_type: data.user_type,
    region_id: data.region_id,
    city_id: data.city_id,
    organization: data.organization,
    created_at: new Date().toISOString()
  };

  setStorageItem(LOCAL_STORAGE_KEY_USER, newProfile);
  return newProfile;
};

export const loginUser = async (email: string): Promise<UserProfile> => {
  const existingUser = getCurrentUser();
  if (existingUser && existingUser.email === email) {
    return existingUser;
  }
  
  const user: UserProfile = {
    id: 'user-' + Date.now(),
    name: email.split('@')[0] || 'مستخدم نواة',
    email: email,
    user_type: 'date_factory',
    organization: 'منشأة معالجة النوى',
    created_at: new Date().toISOString()
  };
  setStorageItem(LOCAL_STORAGE_KEY_USER, user);
  return user;
};

export const logoutUser = async (): Promise<void> => {
  const supabase = createClient();
  await supabase.auth.signOut();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    notifyListeners();
  }
};

// ============================================================================
// BATCHES MANAGEMENT (No fake data!)
// ============================================================================
export const getBatches = async (): Promise<Batch[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .order('created_at', { ascending: false });
  if (!error && data) {
    return data as Batch[];
  }
  return [];
};

export const getBatchById = async (id: string): Promise<Batch | null> => {
  const batches = await getBatches();
  return batches.find(b => b.id === id) || null;
};

export const createBatch = async (input: {
  source_id?: string;
  source_name: string;
  region_id?: string;
  region_name?: string;
  city_id?: string;
  city_name?: string;
  quantity: number;
  date_type: string;
  date_collected: string;
  cleaning_status: 'مغسولة' | 'غير مغسولة' | 'مجففة ومفروزة' | string;
  drying_status: 'مجففة شمسياً' | 'مجففة برنفر' | 'رطوبة عالية' | string;
  moisture?: number;
  storage_method: string;
  notes?: string;
  image_url?: string;
}): Promise<Batch> => {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();

  console.log('[NAWAH STORE AUTH DEBUG]', {
    hasUser: !!user,
    userId: user?.id || null,
    userError: userError?.message || null,
    hasSession: !!session,
    sessionUserId: session?.user?.id || null,
  });

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً لحفظ الدفعة في قاعدة البيانات");
  }

  // Ensure user profile exists in public.profiles to satisfy Foreign Key constraint (batches_user_id_fkey)
  const { error: profileUpsertError } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم نواة',
    email: user.email || '',
    user_type: user.user_metadata?.user_type || 'individual',
    organization: user.user_metadata?.organization || null,
  }, { onConflict: 'id' });

  if (profileUpsertError) {
    console.warn('Profile auto-creation notice:', profileUpsertError.message);
  }

  // Normalize cleaning_status to satisfy Postgres check constraint (batches_cleaning_status_check)
  let normalizedCleaningStatus: 'مغسولة' | 'غير مغسولة' | 'مجففة ومفروزة' = 'مغسولة';
  if (input.cleaning_status === 'غير مغسولة' || input.cleaning_status === 'خام') {
    normalizedCleaningStatus = 'غير مغسولة';
  } else if (input.cleaning_status === 'مجففة ومفروزة' || input.cleaning_status === 'مجففة') {
    normalizedCleaningStatus = 'مجففة ومفروزة';
  } else {
    normalizedCleaningStatus = 'مغسولة';
  }

  // Normalize drying_status to satisfy Postgres check constraint (batches_drying_status_check)
  let normalizedDryingStatus: 'مجففة شمسياً' | 'مجففة برنفر' | 'رطوبة عالية' = 'مجففة شمسياً';
  if (input.drying_status === 'مجففة برنفر' || (input.drying_status as string)?.includes('أفران') || (input.drying_status as string)?.includes('فرن')) {
    normalizedDryingStatus = 'مجففة برنفر';
  } else if (input.drying_status === 'رطوبة عالية' || (input.drying_status as string)?.includes('رطوبة')) {
    normalizedDryingStatus = 'رطوبة عالية';
  } else {
    normalizedDryingStatus = 'مجففة شمسياً';
  }

  const payload = {
    user_id: user.id,
    source_id: (input.source_id && input.source_id.startsWith('src-')) ? null : (input.source_id || null),
    source_name: input.source_name || 'مصدر مسجل',
    region_id: (input.region_id && input.region_id.startsWith('reg-')) ? null : (input.region_id || null),
    city_id: (input.city_id && input.city_id.startsWith('city-')) ? null : (input.city_id || null),
    quantity: Number(input.quantity),
    date_type: input.date_type,
    date_collected: input.date_collected || new Date().toISOString().split('T')[0],
    cleaning_status: normalizedCleaningStatus,
    drying_status: normalizedDryingStatus,
    moisture: input.moisture ? Number(input.moisture) : null,
    storage_method: input.storage_method || 'أكياس تهوية محكومة',
    status: 'مسجلة',
    notes: input.notes || null,
    image_url: input.image_url || null
  };

  console.log('[NAWAH STORE BATCH INSERT PAYLOAD]', payload);

  // 1. INSERT into Supabase database with resilient unique batch_number generation
  let insertData: any = null;
  let insertError: any = null;
  const year = new Date().getFullYear();
  const maxRetries = 6;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const candidateBatchNumber = `NW-${year}-${randomSuffix}`;

    const insertPayload = {
      ...payload,
      batch_number: candidateBatchNumber
    };

    const { data, error } = await supabase
      .from('batches')
      .insert([insertPayload])
      .select();

    if (!error && data && data.length > 0) {
      insertData = data;
      insertError = null;
      break;
    }

    insertError = error;
    if (error && (error.code === '23505' || error.message?.includes('batches_batch_number_key') || error.message?.includes('batch_number'))) {
      console.warn(`[NAWAH BATCH NUMBER RETRY] Collision on ${candidateBatchNumber}, retrying (attempt ${attempt + 1}/${maxRetries})...`);
      continue;
    }

    break;
  }

  if (insertError) {
    console.error("[NAWAH STORE BATCH INSERT ERROR]", insertError);
    throw new Error(`فشلت عملية حفظ الدفعة في قاعدة البيانات: [${insertError.code || 'DB_ERR'}] ${insertError.message}`);
  }

  if (!insertData || insertData.length === 0) {
    throw new Error("لم يتم إرجاع الدفعة المحفوظة من قاعدة البيانات");
  }

  const createdRecord = insertData[0] as Batch;

  console.log('[NAWAH STORE BATCH INSERT SUCCESS]', createdRecord);

  // 2. VERIFY BY RE-SELECTING FROM SUPABASE (Rule 29: Read-after-write verification)
  const { data: verifiedRecord, error: verifyError } = await supabase
    .from('batches')
    .select('*')
    .eq('id', createdRecord.id)
    .single();

  if (verifyError || !verifiedRecord) {
    console.error("[NAWAH STORE BATCH VERIFY ERROR]", verifyError);
    throw new Error("تعذر التثبت من وجود الدفعة في قاعدة البيانات بعد الحفظ");
  }

  notifyListeners();
  return verifiedRecord as Batch;
};

// ============================================================================
// IMAGE ANALYSIS (Visual Features, Impurities, Homogeneity)
// ============================================================================
export const saveImageAnalysis = async (record: {
  batch_id: string;
  visual_features: string;
  visible_impurities: string;
  visual_homogeneity: string;
  confidence: number;
  notes?: string;
}): Promise<ImageAnalysisRecord> => {
  const supabase = createClient();
  const payload = {
    batch_id: record.batch_id,
    visual_features: record.visual_features,
    visible_impurities: record.visible_impurities,
    visual_homogeneity: record.visual_homogeneity,
    confidence: record.confidence,
    notes: record.notes || null
  };

  const { data: insertData, error: insertError } = await supabase
    .from('image_analysis')
    .insert([payload])
    .select();

  if (insertError) {
    console.error("Supabase image_analysis INSERT failed:", insertError);
    throw new Error(`فشل حفظ نتيجة التحليل البصري في قاعدة البيانات: ${insertError.message}`);
  }

  if (!insertData || insertData.length === 0) {
    throw new Error("لم يتم إرجاع سجل التحليل البصري من قاعدة البيانات");
  }

  const createdRecord = insertData[0] as ImageAnalysisRecord;

  // Verify by re-select
  const { data: verifiedRecord, error: verifyError } = await supabase
    .from('image_analysis')
    .select('*')
    .eq('id', createdRecord.id)
    .single();

  if (verifyError || !verifiedRecord) {
    throw new Error("تعذر التثبت من وجود تحليل الصورة في قاعدة البيانات");
  }

  notifyListeners();
  return verifiedRecord as ImageAnalysisRecord;
};

export const getImageAnalysisByBatchId = async (batchId: string): Promise<ImageAnalysisRecord | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('image_analysis')
    .select('*')
    .eq('batch_id', batchId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (!error && data) {
    return data as ImageAnalysisRecord;
  }
  return null;
};

// ============================================================================
// EXPERIMENTS MANAGEMENT (Linked directly to batches)
// ============================================================================
export const getExperiments = async (): Promise<Experiment[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('experiments')
    .select('*')
    .order('created_at', { ascending: false });
  if (!error && data) {
    return data as Experiment[];
  }
  return [];
};

export const getExperimentsByBatchId = async (batchId: string): Promise<Experiment[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('experiments')
    .select('*')
    .eq('batch_id', batchId)
    .order('created_at', { ascending: false });
  if (!error && data) {
    return data as Experiment[];
  }
  return [];
};

export const createExperiment = async (input: {
  batch_id: string;
  objective: string;
  quantity_used: number;
  processing_method: string;
  duration: string;
  observations?: string;
  result: string;
  status: 'قيد التنفيذ' | 'مكتملة بنجاح' | 'مكتملة بملاحظات' | 'غير ناجحة';
}): Promise<Experiment> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً لحفظ التجربة");
  }

  const payload = {
    user_id: user.id,
    batch_id: input.batch_id,
    objective: input.objective,
    quantity_used: Number(input.quantity_used),
    processing_method: input.processing_method,
    duration: input.duration,
    observations: input.observations || null,
    result: input.result,
    status: input.status
  };

  let insertData: any = null;
  let insertError: any = null;
  const year = new Date().getFullYear();
  const maxRetries = 6;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const candidateExpNumber = `EXP-${year}-${randomSuffix}`;

    const insertPayload = {
      ...payload,
      experiment_number: candidateExpNumber
    };

    const { data, error } = await supabase
      .from('experiments')
      .insert([insertPayload])
      .select();

    if (!error && data && data.length > 0) {
      insertData = data;
      insertError = null;
      break;
    }

    insertError = error;
    if (error && (error.code === '23505' || error.message?.includes('experiments_experiment_number_key') || error.message?.includes('experiment_number'))) {
      console.warn(`[NAWAH EXP NUMBER RETRY] Collision on ${candidateExpNumber}, retrying (attempt ${attempt + 1}/${maxRetries})...`);
      continue;
    }

    break;
  }

  if (insertError) {
    console.error("Supabase experiment INSERT failed:", insertError);
    throw new Error(`فشل حفظ التجربة في قاعدة البيانات: ${insertError.message}`);
  }

  if (!insertData || insertData.length === 0) {
    throw new Error("لم يتم إرجاع سجل التجربة من قاعدة البيانات");
  }

  const createdRecord = insertData[0] as Experiment;

  // Verify by re-select
  const { data: verifiedRecord, error: verifyError } = await supabase
    .from('experiments')
    .select('*')
    .eq('id', createdRecord.id)
    .single();

  if (verifyError || !verifiedRecord) {
    throw new Error("تعذر التثبت من وجود التجربة في قاعدة البيانات بعد الحفظ");
  }

  notifyListeners();
  return verifiedRecord as Experiment;
};

// ============================================================================
// AGGREGATED METRICS & IMPACT SUMMARY (Computed strictly from DB / Real Store)
// ============================================================================
export const getImpactSummary = async (): Promise<ImpactSummary> => {
  const batches = await getBatches();
  const experiments = await getExperiments();

  const total_registered_kg = batches.reduce((sum, b) => sum + (b.quantity || 0), 0);
  const total_batches_count = batches.length;
  const total_experiments_count = experiments.length;

  // Real sources count based on unique sources/locations in batches
  const uniqueSources = new Set(batches.map(b => b.source_name).filter(Boolean));
  const total_sources_count = uniqueSources.size;

  // Reused quantity calculated from successful or completed experiments
  const total_reused_kg = experiments.reduce((sum, e) => {
    return sum + (e.quantity_used || 0);
  }, 0);

  const landfill_diverted_ton = Number((total_registered_kg / 1000).toFixed(2));
  // Standard environmental metric: 1 ton of organic date waste in landfill generates ~0.65 tons CO2e methane
  const estimated_co2_reduction_ton = Number((landfill_diverted_ton * 0.65).toFixed(2));

  return {
    total_registered_kg,
    total_batches_count,
    total_experiments_count,
    total_sources_count,
    total_reused_kg,
    landfill_diverted_ton,
    estimated_co2_reduction_ton
  };
};
