import { createClient } from "@/lib/supabase/server";
import DashboardClientView from "./DashboardClientView";

export const dynamic = 'force-dynamic';

export default async function PitDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let batches: any[] = [];
  let experiments: any[] = [];

  if (user) {
    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = p;

    const { data: b } = await supabase
      .from('batches')
      .select('*, image_analysis(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    batches = b || [];

    const { data: e } = await supabase
      .from('experiments')
      .select('*')
      .eq('user_id', user.id);
    experiments = e || [];
  }

  const userName = user ? (profile?.full_name || user?.user_metadata?.full_name || 'المستخدم') : 'زائرنا الكريم';
  const totalBatches = batches?.length || 0;
  const totalExperiments = experiments?.length || 0;
  const totalQuantityKg = batches?.reduce((acc, b) => acc + (Number(b.quantity) || 0), 0) || 0;
  const totalQuantityTon = (totalQuantityKg / 1000).toFixed(1);
  const analyzedCount = batches?.filter(b => b.image_analysis && b.image_analysis.length > 0).length || 0;
  const latestBatch = batches?.[0] || null;

  return (
    <DashboardClientView
      userName={userName}
      totalBatches={totalBatches}
      totalExperiments={totalExperiments}
      totalQuantityTon={totalQuantityTon}
      totalQuantityKg={totalQuantityKg}
      analyzedCount={analyzedCount}
      latestBatch={latestBatch}
      batches={batches}
    />
  );
}
