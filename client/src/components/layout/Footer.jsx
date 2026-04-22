import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const links = ['Courses', 'Appointments', 'Dashboard', 'Contact'];

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.9fr] lg:px-8">
        <div>
          <p className="text-xl font-bold">NutriCare Pro</p>
          <p className="mt-4 max-w-md leading-7 text-slate-300">
            A premium nutrition healthcare platform for education, registered consultations,
            secure payments, and continuous patient support.
          </p>
          <div className="mt-6 flex gap-3">
            {[Linkedin, Facebook, Instagram].map((Icon, index) => (
              <a
                key={index}
                href="#social"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                aria-label="Social media link"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
            Platform
          </p>
          <div className="mt-5 grid gap-3">
            {links.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => onNavigate(link === 'Contact' ? 'home' : link.toLowerCase())}
                className="w-fit text-left text-slate-300 transition hover:text-white"
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
            Contact
          </p>
          <div className="mt-5 grid gap-4 text-slate-300">
            <span className="flex items-center gap-3">
              <MapPin size={18} className="text-accent" />
              Kigali Telehealth Center
            </span>
            <span className="flex items-center gap-3">
              <Mail size={18} className="text-accent" />
            ruthasifiwe@gmail.com
            </span>
            <span className="flex items-center gap-3">
              <Phone size={18} className="text-accent" />
            0787977326
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-slate-400">
        Copyright 2026 NutriCare Pro. All rights reserved.
      </div>
    </footer>
  );
}
