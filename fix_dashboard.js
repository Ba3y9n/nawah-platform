const fs = require('fs');
let code = fs.readFileSync('src/app/pit-management/dashboard/page.tsx', 'utf-8');

// 1. Remove the redirect
code = code.replace(
  "  if (!user) {\n    redirect('/login');\n  }",
  "  // Guest mode allowed"
);
code = code.replace("import { redirect } from \"next/navigation\";\n", "");

// 2. Adjust data fetching logic if user is null
const oldFetch = `
  // Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch User Batches only (RLS also enforces this)
  const { data: batches } = await supabase
    .from('batches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch User Experiments only (RLS also enforces this)
  const { data: experiments } = await supabase
    .from('experiments')
    .select('*')
    .eq('user_id', user.id);
`;

const newFetch = `
  // Data for logged-in users, empty for guests
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
`;

code = code.replace(oldFetch, newFetch);

// 3. Adjust User name
code = code.replace(
  "const userName = profile?.full_name || user.user_metadata?.full_name || 'المستخدم';",
  "const userName = user ? (profile?.full_name || user?.user_metadata?.full_name || 'المستخدم') : 'زائرنا الكريم';"
);

// 4. Add Guest Banner
code = code.replace(
  '<div className="space-y-6">',
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

fs.writeFileSync('src/app/pit-management/dashboard/page.tsx', code, 'utf-8');
console.log("Dashboard auth removed");
