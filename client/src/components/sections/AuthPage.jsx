import { ArrowRight, CheckCircle2, Eye, LockKeyhole, Mail, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import SectionHeader from '../ui/SectionHeader.jsx';
import { imageLibrary } from '../../data/platformData.js';

const roles = ['User/Patient', 'Doctor ASIFIWE Ruth', 'Admin'];

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState(roles[0]);

  return (
    <main className="bg-surface">
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Secure authentication"
            title="Role-aware access for patients, ASIFIWE Ruth, and administrators."
            description="The authentication flow supports registration, login, forgot password, profile management, JWT-backed sessions, and dashboards for patients, the doctor, and admins."
          />
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
            <img
              src={imageLibrary.clinic}
              alt="Modern healthcare clinic"
              className="h-72 w-full object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-ink">Trusted account security</h2>
              <div className="mt-5 grid gap-3">
                {[
                  'JWT authentication with refresh-ready session structure',
                  'Bcrypt password hashing on the backend',
                  'Role permissions for admin, ASIFIWE Ruth, and patient workflows',
                  'Forgot password and profile update endpoints',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 size={19} className="mt-1 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
            <div className="mb-6 grid grid-cols-3 rounded-lg bg-slate-100 p-1">
              {[
                ['login', 'Login'],
                ['register', 'Register'],
                ['forgot', 'Reset'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                    mode === value ? 'bg-white text-primary shadow-card' : 'text-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink">
                {mode === 'login'
                  ? 'Welcome back'
                  : mode === 'register'
                    ? 'Create your account'
                    : 'Reset your password'}
              </h2>
              <p className="mt-2 leading-6 text-slate-600">
                {mode === 'forgot'
                  ? 'Enter your email address to receive a secure password reset link.'
                  : 'Choose your role to preview the dashboard and access level for your account.'}
              </p>
            </div>

            {mode !== 'forgot' && (
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                {roles.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`rounded-lg border p-3 text-left text-sm font-bold transition ${
                      role === item
                        ? 'border-primary bg-emerald-50 text-primary'
                        : 'border-slate-200 text-slate-600 hover:border-primary'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            <form className="grid gap-4">
              {mode === 'register' && (
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-slate-700">Full name</span>
                  <div className="relative">
                    <Users
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className="focus-ring w-full rounded-lg border border-slate-200 py-3 pl-12 pr-4"
                      placeholder="Jane Patient"
                    />
                  </div>
                </label>
              )}

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Email address</span>
                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    className="focus-ring w-full rounded-lg border border-slate-200 py-3 pl-12 pr-4"
                    placeholder="jane@example.com"
                  />
                </div>
              </label>

              {mode !== 'forgot' && (
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-slate-700">Password</span>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="password"
                      className="focus-ring w-full rounded-lg border border-slate-200 py-3 pl-12 pr-12"
                      placeholder="Enter secure password"
                    />
                    <Eye
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </label>
              )}

              {mode === 'register' && role === 'Doctor ASIFIWE Ruth' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    className="focus-ring rounded-lg border border-slate-200 px-4 py-3"
                    placeholder="License number"
                  />
                  <input
                    className="focus-ring rounded-lg border border-slate-200 px-4 py-3"
                    placeholder="Specialty"
                  />
                </div>
              )}

              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                {mode === 'login' ? (
                  <>
                    <ShieldCheck size={18} />
                    Login securely
                  </>
                ) : mode === 'register' ? (
                  <>
                    <UserPlus size={18} />
                    Create account
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Send reset link
                  </>
                )}
                <ArrowRight size={18} />
              </button>
            </form>

            {mode !== 'forgot' && (
              <div className="mt-6 rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-700">Selected role</p>
                <p className="mt-1 text-lg font-bold text-primary">{role}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
