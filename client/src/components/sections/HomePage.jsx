import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  HeartPulse,
  MessageSquareText,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Video,
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader.jsx';
import MetricCard from '../ui/MetricCard.jsx';
import {
  categories,
  courses,
  featuredVideos,
  imageLibrary,
  nutritionists,
  testimonials,
} from '../../data/platformData.js';

const heroStats = [
  { label: 'Patient satisfaction', value: '98%' },
  { label: 'Registered nutritionists', value: '126+' },
  { label: 'Course learners', value: '14K+' },
];

const aboutCards = [
  {
    icon: Stethoscope,
    title: 'Registered consultation',
    copy: 'Patients meet verified nutritionists for disease-aware nutrition care and ongoing support.',
  },
  {
    icon: GraduationCap,
    title: 'Clinical education',
    copy: 'Courses, lessons, videos, and materials help patients understand nutrition choices.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure operations',
    copy: 'Role-based dashboards support payments, appointments, moderation, and patient history.',
  },
];

export default function HomePage({ onNavigate, onCourseSelect }) {
  const featuredCourses = courses.slice(0, 3);

  return (
    <main>
      <section className="hero-image relative min-h-[580px] overflow-hidden">
        <div className="mx-auto flex max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:min-h-[650px] lg:px-8">
          <div className="max-w-3xl animate-fade-up text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold backdrop-blur">
              <HeartPulse size={18} />
              Nutrition healthcare, education, and teleconsultation
            </div>
            <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Premium nutrition care for healthier decisions every day.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
              Connect with registered nutritionists, learn from clinical courses, book online
              consultations, pay securely, and continue care through chat and video sessions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onNavigate('appointments')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-slate-950 shadow-soft transition hover:-translate-y-1 hover:bg-[#ff9d2d]"
              >
                <CalendarDays size={19} />
                Book Appointment
              </button>
              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
              >
                <BookOpenCheck size={19} />
                Browse Courses
              </button>
            </div>
          </div>

          <div className="mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md"
              >
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-emerald-50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="About the platform"
              title="Nutrition care that combines clinical trust with practical education."
              description="NutriCare Pro is designed for patients, registered nutritionists, and administrators who need a reliable healthcare workflow across learning, booking, payment, and follow-up communication."
            />
            <div className="mt-8 grid gap-4">
              {aboutCards.map((card) => (
                <div
                  key={card.title}
                  className="flex gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                    <card.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">{card.title}</h3>
                    <p className="mt-1 leading-6 text-slate-600">{card.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src={imageLibrary.doctorPatient}
              alt="Nutritionist reviewing a care plan with a patient"
              className="h-72 w-full rounded-lg object-cover shadow-card sm:h-full"
            />
            <div className="grid gap-4">
              <img
                src={imageLibrary.healthyPlate}
                alt="Balanced healthy meal with vegetables"
                className="h-48 w-full rounded-lg object-cover shadow-card"
              />
              <div className="rounded-lg bg-primary p-6 text-white shadow-card">
                <Sparkles size={28} className="mb-4 text-emerald-100" />
                <p className="text-3xl font-bold">24/7</p>
                <p className="mt-2 text-emerald-50">Patient messaging and care notifications</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Featured courses"
              title="Clinical nutrition learning for everyday decisions."
              description="Courses include video lessons, progress tracking, downloadable learning materials, and condition-specific guidance."
            />
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-1 hover:bg-emerald-700"
            >
              View all courses
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredCourses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <img
                  src={course.thumbnail}
                  alt={`${course.title} course thumbnail`}
                  className="h-52 w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                    {course.category}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-ink">{course.title}</h3>
                  <p className="mt-3 line-clamp-3 leading-6 text-slate-600">
                    {course.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                    <span>{course.lessons} lessons</span>
                    <span>{course.duration}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCourseSelect(course)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-4 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
                  >
                    Course details
                    <ArrowRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Featured videos"
            title="Nutritionists can publish YouTube lessons directly to patient learning spaces."
            description="Uploaded YouTube links are converted into secure embedded lessons and displayed in course modules."
            align="center"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {featuredVideos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card"
              >
                <div className="aspect-video bg-slate-100">
                  <iframe
                    className="h-full w-full"
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-secondary">
                    <PlayCircle size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">{video.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{video.nutritionist}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Nutrition categories"
            title="Specialized care paths for patients at every stage."
            description="Patients can search by condition, life stage, wellness goal, and prevention focus."
          />
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onNavigate('courses')}
                className="rounded-lg border border-slate-200 bg-white p-4 text-left text-sm font-bold text-slate-700 shadow-card transition hover:-translate-y-1 hover:border-primary hover:text-primary"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Registered nutritionists"
            title="Trusted clinicians ready for personalized consultation."
            description="Nutritionists manage schedules, course content, appointments, patient chat, and payments from a dedicated dashboard."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {nutritionists.map((nutritionist) => (
              <article
                key={nutritionist.id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              >
                <img
                  src={nutritionist.image}
                  alt={`${nutritionist.name} portrait`}
                  className="h-64 w-full rounded-lg object-cover"
                />
                <h3 className="mt-5 text-xl font-bold text-ink">{nutritionist.name}</h3>
                <p className="mt-2 min-h-[48px] leading-6 text-slate-600">
                  {nutritionist.specialty}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-500">Rating</p>
                    <p className="font-bold text-ink">{nutritionist.rating}/5.0</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-500">Next slot</p>
                    <p className="font-bold text-ink">{nutritionist.nextSlot}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <MetricCard
              icon={Video}
              label="Video consultations"
              value="HD visits"
              detail="Patients join approved online sessions directly from the appointment record."
              tone="blue"
            />
            <MetricCard
              icon={MessageSquareText}
              label="Care chat"
              value="Real-time"
              detail="Socket-ready conversations preserve message history for patients and clinicians."
            />
            <MetricCard
              icon={Users}
              label="Role dashboards"
              value="3 roles"
              detail="Patient, nutritionist, and admin workflows are separated by role permissions."
              tone="orange"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Patient stories"
            title="A calmer nutrition care experience from booking to follow-up."
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-lg border border-slate-200 p-6 shadow-card">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={`${item.name} testimonial portrait`}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-ink">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.role}</p>
                  </div>
                </div>
                <p className="mt-5 leading-7 text-slate-600">"{item.quote}"</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-lg bg-primary p-8 text-white shadow-soft">
            <CalendarDays size={34} className="text-emerald-100" />
            <h2 className="mt-5 text-3xl font-bold">Book a consultation with confidence.</h2>
            <p className="mt-4 leading-7 text-emerald-50">
              Patients can select a nutritionist, choose a slot, confirm secure payment, and
              receive status updates before joining online care.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('appointments')}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-[#ff9d2d]"
            >
              Start booking
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Create account', 'Choose schedule', 'Pay securely', 'Join consultation'].map(
              (step) => (
                <div key={step} className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
                  <CheckCircle2 className="text-primary" size={24} />
                  <p className="mt-4 text-lg font-bold text-ink">{step}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Contact
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">
              Coordinate clinical nutrition programs, virtual care, and patient education.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              care@nutricarepro.health | +250 788 000 245 | Kigali Telehealth Center
            </p>
          </div>
          <form className="grid gap-4 rounded-lg bg-white p-5 text-ink shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="focus-ring rounded-lg border border-slate-200 px-4 py-3"
                placeholder="Full name"
                aria-label="Full name"
              />
              <input
                className="focus-ring rounded-lg border border-slate-200 px-4 py-3"
                placeholder="Email address"
                aria-label="Email address"
              />
            </div>
            <select className="focus-ring rounded-lg border border-slate-200 px-4 py-3" aria-label="Service interest">
              <option>Nutrition consultation</option>
              <option>Course access</option>
              <option>Corporate wellness</option>
              <option>Partnership</option>
            </select>
            <textarea
              className="focus-ring min-h-[128px] rounded-lg border border-slate-200 px-4 py-3"
              placeholder="Message"
              aria-label="Message"
            />
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Send message
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
