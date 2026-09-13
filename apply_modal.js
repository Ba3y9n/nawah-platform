const fs = require('fs');

function updatePage(path, title) {
  let code = fs.readFileSync(path, 'utf-8');
  
  if (code.includes('import AuthModal')) return;

  // Insert AuthModal import
  code = code.replace(
    'import { createClient } from "@/lib/supabase/client";',
    'import { createClient } from "@/lib/supabase/client";\nimport AuthModal from "@/components/AuthModal";'
  );

  // Add state for auth modal
  code = code.replace(
    'const [isSubmitting, setIsSubmitting] = useState(false);',
    'const [isSubmitting, setIsSubmitting] = useState(false);\n  const [showAuthModal, setShowAuthModal] = useState(false);'
  );

  // Replace router.push('/login') with modal logic
  const oldAuthFail = `      if (!user) {
        setErrorMsg("جلسة العمل منتهية. يرجى تسجيل الدخول مجدداً.");
        setIsSubmitting(false);
        router.push('/login');
        return;
      }`;
  
  const newAuthFail = `      if (!user) {
        setIsSubmitting(false);
        setShowAuthModal(true);
        // Save form state to local storage to persist after login
        if (typeof window !== 'undefined') {
          try {
            // Save basic form fields if needed
            localStorage.setItem('nawah_pending_action', '${title}');
          } catch(e) {}
        }
        return;
      }`;

  code = code.replace(oldAuthFail, newAuthFail);

  // Add AuthModal component to the return block
  // We'll place it right before the last closing </div>
  const modalHTML = `
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        returnUrl={typeof window !== 'undefined' ? window.location.pathname : ""}
      />
    </div>
  );
}`;

  code = code.replace(/\s*<\/div>\s*\);\s*}\s*$/, modalHTML);

  fs.writeFileSync(path, code, 'utf-8');
  console.log("Updated " + path);
}

try {
  updatePage('src/app/pit-management/batches/new/page.tsx', 'new_batch');
  updatePage('src/app/pit-management/experiments/new/page.tsx', 'new_experiment');
} catch(e) {
  console.log(e);
}
