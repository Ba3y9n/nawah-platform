-- ====================================================================
-- NAWAH Platform Schema Migration Script for Supabase PostgreSQL
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Regions Table
CREATE TABLE IF NOT EXISTS public.regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Cities Table
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID NOT NULL REFERENCES public.regions(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(region_id, name_ar)
);

-- 4. User Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    user_type TEXT NOT NULL CHECK (user_type IN ('date_factory', 'farmer', 'waste_collector', 'researcher', 'recycler', 'individual')),
    region_id UUID REFERENCES public.regions(id),
    city_id UUID REFERENCES public.cities(id),
    organization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Verified Sources Table
CREATE TABLE IF NOT EXISTS public.sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('factory', 'farm', 'collection_center', 'market')),
    region_id UUID REFERENCES public.regions(id),
    city_id UUID REFERENCES public.cities(id),
    location_address TEXT,
    lat NUMERIC(10, 7),
    lng NUMERIC(10, 7),
    website TEXT,
    verification_status TEXT NOT NULL DEFAULT 'needs_verification' CHECK (verification_status IN ('verified', 'needs_verification')),
    data_source TEXT DEFAULT 'وزارة البيئة والمياه والزراعة',
    last_verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Batches Table
CREATE TABLE IF NOT EXISTS public.batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    batch_number TEXT UNIQUE NOT NULL,
    source_id UUID REFERENCES public.sources(id),
    source_name TEXT,
    region_id UUID REFERENCES public.regions(id),
    city_id UUID REFERENCES public.cities(id),
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity >= 0),
    date_type TEXT NOT NULL, -- خلاص, سكري, عجوة, صقعي, مكتومي, نبوت سيف, مشكل
    date_collected DATE NOT NULL DEFAULT CURRENT_DATE,
    cleaning_status TEXT NOT NULL DEFAULT 'مغسولة' CHECK (cleaning_status IN ('مغسولة', 'غير مغسولة', 'مجففة ومفروزة')),
    drying_status TEXT NOT NULL DEFAULT 'مجففة شمسياً' CHECK (drying_status IN ('مجففة شمسياً', 'مجففة برنفر', 'رطوبة عالية')),
    moisture NUMERIC(5, 2), -- %
    storage_method TEXT DEFAULT 'أكياس خيش تهوية محكومة',
    status TEXT NOT NULL DEFAULT 'مسجلة' CHECK (status IN ('مسجلة', 'قيد التحليل', 'متاحة للاستخدام', 'تم إعادة استخدامها بالكامل')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Batch Images Table
CREATE TABLE IF NOT EXISTS public.batch_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Image Analysis Table
CREATE TABLE IF NOT EXISTS public.image_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    visual_features TEXT,
    visible_impurities TEXT,
    visual_homogeneity TEXT,
    confidence NUMERIC(5, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Reuse Pathways Table
CREATE TABLE IF NOT EXISTS public.reuse_pathways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_level TEXT NOT NULL, -- مثبت بحثياً وميدانياً, مثبت بحثياً, قيد التطوير
    processing_requirements TEXT NOT NULL,
    advantages TEXT NOT NULL,
    challenges TEXT NOT NULL,
    required_tests TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Evidence Sources Table
CREATE TABLE IF NOT EXISTS public.evidence_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    year INT NOT NULL,
    source_type TEXT NOT NULL, -- ورقة علمية, تقرير حكومي, مواصفة قياسية
    url TEXT,
    summary TEXT NOT NULL,
    evidence_level TEXT NOT NULL,
    reuse_pathway_id UUID REFERENCES public.reuse_pathways(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Experiments Table
CREATE TABLE IF NOT EXISTS public.experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    experiment_number TEXT UNIQUE NOT NULL,
    objective TEXT NOT NULL,
    quantity_used NUMERIC(10, 2) NOT NULL CHECK (quantity_used >= 0),
    processing_method TEXT NOT NULL,
    duration TEXT NOT NULL,
    observations TEXT,
    result TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'قيد التنفيذ' CHECK (status IN ('قيد التنفيذ', 'مكتملة بنجاح', 'مكتملة بملاحظات', 'غير ناجحة')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Impact Logs Table
CREATE TABLE IF NOT EXISTS public.impact_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE SET NULL,
    reused_quantity NUMERIC(10, 2) NOT NULL CHECK (reused_quantity >= 0),
    pathway_id UUID REFERENCES public.reuse_pathways(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- AUTO BATCH & EXPERIMENT NUMBER GENERATION TRIGGERS
-- ====================================================================

CREATE OR REPLACE FUNCTION generate_batch_number()
RETURNS TRIGGER AS $$
DECLARE
    seq_num INT;
    new_batch_num TEXT;
BEGIN
    SELECT COUNT(*) + 1 INTO seq_num FROM public.batches;
    new_batch_num := 'NW-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(seq_num::TEXT, 4, '0');
    
    WHILE EXISTS (SELECT 1 FROM public.batches WHERE batch_number = new_batch_num) LOOP
        seq_num := seq_num + 1;
        new_batch_num := 'NW-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(seq_num::TEXT, 4, '0');
    END LOOP;

    NEW.batch_number := new_batch_num;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_batch_number
BEFORE INSERT ON public.batches
FOR EACH ROW
WHEN (NEW.batch_number IS NULL OR NEW.batch_number = '')
EXECUTE FUNCTION generate_batch_number();

CREATE OR REPLACE FUNCTION generate_experiment_number()
RETURNS TRIGGER AS $$
DECLARE
    seq_num INT;
    new_exp_num TEXT;
BEGIN
    SELECT COUNT(*) + 1 INTO seq_num FROM public.experiments;
    new_exp_num := 'EXP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(seq_num::TEXT, 4, '0');
    
    WHILE EXISTS (SELECT 1 FROM public.experiments WHERE experiment_number = new_exp_num) LOOP
        seq_num := seq_num + 1;
        new_exp_num := 'EXP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(seq_num::TEXT, 4, '0');
    END LOOP;

    NEW.experiment_number := new_exp_num;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_experiment_number
BEFORE INSERT ON public.experiments
FOR EACH ROW
WHEN (NEW.experiment_number IS NULL OR NEW.experiment_number = '')
EXECUTE FUNCTION generate_experiment_number();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reuse_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Public read cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public read sources" ON public.sources FOR SELECT USING (true);
CREATE POLICY "Public read pathways" ON public.reuse_pathways FOR SELECT USING (true);
CREATE POLICY "Public read evidence" ON public.evidence_sources FOR SELECT USING (true);

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users view own batches" ON public.batches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own batches" ON public.batches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own batches" ON public.batches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own batches" ON public.batches FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users view images of own batches" ON public.batch_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.batches WHERE id = batch_images.batch_id AND user_id = auth.uid())
);
CREATE POLICY "Users insert images to own batches" ON public.batch_images FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.batches WHERE id = batch_images.batch_id AND user_id = auth.uid())
);

CREATE POLICY "Users view analysis of own batches" ON public.image_analysis FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.batches WHERE id = image_analysis.batch_id AND user_id = auth.uid())
);
CREATE POLICY "Users insert analysis for own batches" ON public.image_analysis FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.batches WHERE id = image_analysis.batch_id AND user_id = auth.uid())
);

CREATE POLICY "Users view own experiments" ON public.experiments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own experiments" ON public.experiments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own experiments" ON public.experiments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own experiments" ON public.experiments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users view impact logs for own batches" ON public.impact_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.batches WHERE id = impact_logs.batch_id AND user_id = auth.uid())
);
CREATE POLICY "Users insert impact logs for own batches" ON public.impact_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.batches WHERE id = impact_logs.batch_id AND user_id = auth.uid())
);

-- Storage buckets setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('nawah-storage', 'nawah-storage', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access for Storage" ON storage.objects FOR SELECT USING (bucket_id = 'nawah-storage');
CREATE POLICY "Authenticated Users Upload Storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'nawah-storage' AND auth.role() = 'authenticated');
