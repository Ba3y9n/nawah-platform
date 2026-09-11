export type UserType = 'date_factory' | 'farmer' | 'waste_collector' | 'researcher' | 'recycler' | 'individual';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  user_type: UserType;
  region_id?: string;
  city_id?: string;
  organization?: string;
  created_at: string;
}

export interface Region {
  id: string;
  name_ar: string;
  name_en: string;
  code: string;
}

export interface City {
  id: string;
  region_id: string;
  name_ar: string;
  name_en: string;
}

export interface VerifiedSource {
  id: string;
  name: string;
  source_type: 'factory' | 'farm' | 'collection_center' | 'market';
  region_id: string;
  city_id: string;
  region_name?: string;
  city_name?: string;
  location_address: string;
  lat?: number;
  lng?: number;
  website?: string;
  verification_status: 'verified' | 'needs_verification';
  data_source: string;
  last_verified_at: string;
}

export interface Batch {
  id: string;
  user_id: string;
  batch_number: string;
  source_id?: string;
  source_name: string;
  region_id?: string;
  region_name?: string;
  city_id?: string;
  city_name?: string;
  quantity: number; // in KG
  date_type: string; // خلاص, سكري, عجوة, صقعي, مكتومي, نبوت سيف, مشكل
  date_collected: string;
  cleaning_status: 'مغسولة' | 'غير مغسولة' | 'مجففة ومفروزة';
  drying_status: 'مجففة شمسياً' | 'مجففة برنفر' | 'رطوبة عالية';
  moisture?: number; // %
  storage_method: string;
  status: 'مسجلة' | 'قيد التحليل' | 'متاحة للاستخدام' | 'تم إعادة استخدامها بالكامل';
  notes?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ImageAnalysisRecord {
  id: string;
  batch_id: string;
  visual_features: string;
  visible_impurities: string;
  visual_homogeneity: string;
  confidence: number;
  notes?: string;
  created_at: string;
}

export interface ReusePathway {
  id: string;
  name: string;
  description: string;
  evidence_level: 'مثبت بحثياً وميدانياً' | 'مثبت بحثياً' | 'قيد التطوير';
  processing_requirements: string;
  advantages: string;
  challenges: string;
  required_tests: string;
}

export interface EvidenceSource {
  id: string;
  title: string;
  organization: string;
  year: number;
  source_type: string;
  url?: string;
  summary: string;
  evidence_level: string;
  reuse_pathway_id?: string;
}

export interface Experiment {
  id: string;
  user_id: string;
  batch_id: string;
  batch_number: string;
  experiment_number: string;
  objective: string;
  quantity_used: number; // in KG
  processing_method: string;
  duration: string;
  observations?: string;
  result: string;
  status: 'قيد التنفيذ' | 'مكتملة بنجاح' | 'مكتملة بملاحظات' | 'غير ناجحة';
  created_at: string;
  updated_at: string;
}

export interface ImpactSummary {
  total_registered_kg: number;
  total_batches_count: number;
  total_experiments_count: number;
  total_sources_count: number;
  total_reused_kg: number;
  landfill_diverted_ton: number;
  estimated_co2_reduction_ton: number;
}
