const fs = require('fs');
const path = 'src/app/pit-management/dashboard/page.tsx';
let code = fs.readFileSync(path, 'utf-8');

// Use regex to remove redirect to handle CRLF/LF issues
code = code.replace(/if\s*\(!user\)\s*\{\s*redirect\('\/login'\);\s*\}/g, "// Guest mode allowed");

// Adjust data fetching logic
code = code.replace(/\/\/ Fetch Profile[\s\S]*?\.eq\('user_id', user\.id\);/g, `
  // Data for logged-in users, empty for guests
  let profile = null;
  let batches = [];
  let experiments = [];

  if (user) {
    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = p;

    const { data: b } = await supabase
      .from('batches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    batches = b || [];

    const { data: e } = await supabase
      .from('experiments')
      .select('*')
      .eq('user_id', user.id);
    experiments = e || [];
  }
`);

// Adjust User name safely
code = code.replace(
  "const userName = profile?.full_name || user.user_metadata?.full_name || 'المستخدم';",
  "const userName = user ? (profile?.full_name || user?.user_metadata?.full_name || 'المستخدم') : 'زائرنا الكريم';"
);
// In case the replace above failed previously, let's also do a regex replace
code = code.replace(/const userName = profile\?\.full_name \|\| user\.user_metadata\?\.full_name \|\| 'المستخدم';/g, 
  "const userName = user ? (profile?.full_name || user?.user_metadata?.full_name || 'المستخدم') : 'زائرنا الكريم';"
);

// Add Guest Banner if not already added
if (!code.includes('تتصفح المنصة كزائر')) {
  code = code.replace(
    /<div className="space-y-6">/g,
    `<div className="space-y-6">
      {!user && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-amber-900 font-bold flex items-center gap-2">
              تتصفح المنصة كزائر
            </h3>
            <p className="text-sm text-amber-800/80 mt-1">
              يمكنك استكشاف جميع أقسام المنصة، ولكن لتسجيل الدفعات وحفظ التجارب وإنشاء بياناتك الخاصة، نرجو تسجيل الدخول.
            </p>
          </div>
          <Link href="/login" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors text-center shrink-0">
            تسجيل الدخول / إنشاء حساب
          </Link>
        </div>
      )}`
  );
}

fs.writeFileSync(path, code, 'utf-8');
console.log("Fixed dashboard properly.");
