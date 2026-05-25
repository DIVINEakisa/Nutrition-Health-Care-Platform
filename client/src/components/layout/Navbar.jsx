import { CalendarCheck, Menu, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'courses', label: 'Courses' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'auth', label: 'Login' },
];

export default function Navbar({ activePage, onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="flex items-center gap-3 focus-ring"
          onClick={() => handleNavigate('home')}
          aria-label="Go to homepage"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white shadow-card">
            <ShieldCheck size={23} />
          </span>
          <span className="text-left">
            <span className="block text-lg font-bold leading-5 text-ink">NutriCare Pro</span>
            <span className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Clinical Nutrition
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activePage === item.id
                  ? 'bg-emerald-50 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleNavigate('appointments')}
          className="hidden items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-slate-950 shadow-card transition hover:-translate-y-0.5 hover:bg-[#ff9d2d] lg:flex"
        >
          <CalendarCheck size={18} />
          Book Consultation
        </button>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-card lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`rounded-lg px-4 py-3 text-left text-sm font-semibold ${
                  activePage === item.id
                    ? 'bg-emerald-50 text-primary'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

