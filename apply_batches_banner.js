const fs = require('fs');

const path = 'src/app/pit-management/batches/page.tsx';
let code = fs.readFileSync(path, 'utf-8');

if (!code.includes('isGuest')) {
  // Add state for isGuest
  code = code.replace(
    'const [loading, setLoading] = useState(true);',
    'const [loading, setLoading] = useState(true);\n  const [isGuest, setIsGuest] = useState(false);'
  );

  // Update loadBatches to set isGuest
  const oldLoad = `    if (user) {
      const { data } = await supabase
        .from('batches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setBatches(data || []);
    } else {
      setBatches([]);
    }`;

  const newLoad = `    if (user) {
      setIsGuest(false);
      const { data } = await supabase
        .from('batches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setBatches(data || []);
    } else {
      setIsGuest(true);
      setBatches([]);
    }`;

  code = code.replace(oldLoad, newLoad);

  // Add guest banner before the Search/Filter bar
  const banner = `
      {isGuest && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-amber-900 font-bold flex items-center gap-2">
              وضع الزائر
            </h3>
            <p className="text-sm text-amber-800/80 mt-1">
              هذه الصفحة مخصصة لعرض دفعات النوى الخاصة بك. قم بتسجيل الدخول لإنشاء وتتبع دفعاتك.
            </p>
          </div>
          <Link href="/login" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors text-center shrink-0">
            تسجيل الدخول
          </Link>
        </div>
      )}`;

  code = code.replace(
    '{/* SEARCH AND FILTER BAR */}',
    `${banner}\n\n      {/* SEARCH AND FILTER BAR */}`
  );

  fs.writeFileSync(path, code, 'utf-8');
  console.log("Updated Batches page to show Guest Banner");
}
