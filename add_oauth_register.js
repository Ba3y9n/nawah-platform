const fs = require('fs');

let code = fs.readFileSync('src/app/register/page.tsx', 'utf-8');

const oauthHtml = `
          <div className="relative flex items-center py-2 mt-4">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400">{dict.or}</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <div className="space-y-3 mt-4">
            <button 
              type="button"
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-3 text-sm shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {dict.continueWithGoogle}
            </button>
            <button 
              type="button"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-3 text-sm shadow-md"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.59 1.15c.19 1.25-.33 2.55-1.18 3.55-.83.98-2.12 1.63-3.26 1.54-.22-1.3.36-2.58 1.16-3.55.85-1.02 2.19-1.68 3.28-1.54zm-6.66 4.93c1.94-.13 3.63 1.05 4.54 1.05 1.05 0 2.81-1.34 4.88-1.08 2.08.26 3.98 1.35 5.06 3.25-4.32 2.5-3.64 8.7 1.25 10.66-1.03 2.53-2.17 5.06-4.66 5.06-2.08 0-2.88-1.32-5.1-1.32-2.17 0-3.08 1.27-4.99 1.32-2.31.05-4.07-2.64-5.63-5.21-2.99-4.83-4.95-12.01-2.26-16.14 1.38-2.11 3.66-3.4 5.92-3.47 2.04-.06 3.69 1.16 5.01 1.16z"/></svg>
              {dict.continueWithApple}
            </button>
          </div>
`;

// Insert after form closing tag
code = code.replace(/<\/form>/, '</form>\n' + oauthHtml);

fs.writeFileSync('src/app/register/page.tsx', code, 'utf-8');
console.log('Added OAuth to register');
