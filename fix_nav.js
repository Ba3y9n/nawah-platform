const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

// 1. Move Pit Management dropdown AFTER mainLinks so "الرئيسية" is first on the right.
const pitDropdownMatch = code.match(/\{\/\* DROPDOWN MENU: إدارة النوى \*\/\}[\s\S]*?\{\/\* mainLinks \*\/\}/);
// Wait, I can just replace the whole Desktop Nav Links section.

const desktopNavRegex = /\{\/\* DESKTOP NAVIGATION LINKS \*\/\}[\s\S]*?(?=\{\/\* USER ACTIONS & AUTH \*\/)/;
const desktopNavStr = code.match(desktopNavRegex)[0];

// We reconstruct the Desktop Nav Links:
const newDesktopNav = `{/* DESKTOP NAVIGATION LINKS */}
            <div className="hidden xl:flex items-center gap-2">
              
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={\`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all \${
                      isActive 
                        ? "bg-emerald-50 text-emerald-800" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                    }\`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* DROPDOWN MENU: إدارة النوى */}
              <div 
                className="relative"
                onMouseEnter={() => setPitDropdown(true)}
                onMouseLeave={() => setPitDropdown(false)}
              >
                <Link
                  href="/pit-management/dashboard"
                  className={\`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all \${
                    isPitManagementActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                  }\`}
                >
                  <span>إدارة النوى</span>
                  <ChevronDown className={\`w-3.5 h-3.5 transition-transform \${pitDropdown ? 'rotate-180' : ''}\`} />
                </Link>

                {pitDropdown && (
                  <div className="absolute top-full right-0 w-56 pt-2 z-50">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-2 backdrop-blur-xl">
                      {pitSubMenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setPitDropdown(false)}
                          className={\`block px-3 py-2 rounded-xl text-sm transition-colors \${
                            pathname === item.href
                              ? "bg-emerald-50 text-emerald-800 font-bold"
                              : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                          }\`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>\n\n            `;

code = code.replace(desktopNavStr, newDesktopNav);

// 2. Add language switcher before Auth section
const authRegex = /\{\/\* USER ACTIONS & AUTH \*\/\}[\s\S]*?<div className="hidden xl:flex items-center gap-3">/;
const newAuthStart = `{/* LANGUAGE & AUTH */}
            <div className="hidden xl:flex items-center gap-3">
              
              {/* LANGUAGE SWITCHER */}
              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors px-2 py-1 bg-slate-50 rounded-lg border border-slate-200 hover:border-emerald-200">
                <span>EN</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-800">عربي</span>
              </button>
              
              <div className="h-5 w-px bg-slate-200 mx-1"></div>\n`;

code = code.replace(authRegex, newAuthStart);

fs.writeFileSync('src/components/Navbar.tsx', code, 'utf-8');
console.log("Navbar fixed");
