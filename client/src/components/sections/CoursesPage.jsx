import { ArrowLeft, ArrowRight, BookOpen, Clock, FileText, PlayCircle, Search, Star, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import SectionHeader from '../ui/SectionHeader.jsx';
import { categories, courses } from '../../data/platformData.js';

export default function CoursesPage({ selectedCourse, onCourseSelect, onBackToCatalog }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesQuery = [course.title, course.description, course.instructor, course.category]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory = category === 'All categories' || course.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  if (selectedCourse) {
    return (
      <CourseDetails
        course={selectedCourse}
        onBack={onBackToCatalog}
        onCourseSelect={onCourseSelect}
      />
    );
  }

  return (
    <main className="bg-surface">
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Learning center"
            title="Search clinical nutrition courses by condition, goal, or life stage."
            description="Every course supports embedded video lessons, progress tracking, descriptions, materials, and condition-specific education."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_280px]">
            <label className="relative block">
              <Search
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="focus-ring w-full rounded-lg border border-slate-200 bg-white py-3 pl-12 pr-4 shadow-card"
                placeholder="Search courses, symptoms, instructors, and goals"
                aria-label="Search courses"
              />
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="focus-ring rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-card"
              aria-label="Filter by category"
            >
              <option>All categories</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={`${course.title} course thumbnail`}
                    className="h-56 w-full object-cover"
                  />
                  <div className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-card">
                    {course.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <Star size={17} fill="currentColor" />
                    <span className="font-bold">{course.rating}</span>
                    <span className="text-slate-400">({course.students.toLocaleString()} learners)</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-ink">{course.title}</h3>
                  <p className="mt-3 leading-6 text-slate-600">{course.description}</p>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen size={16} />
                      {course.lessons}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {course.level}
                    </span>
                  </div>
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCourseSelect(course)}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    Open course
                    <ArrowRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CourseDetails({ course, onBack, onCourseSelect }) {
  const lessonTitles = [
    'Clinical introduction and goals',
    'Patient assessment checklist',
    'Meal planning and food swaps',
    'Monitoring progress and follow-up',
  ];

  return (
    <main className="bg-surface">
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back to catalog
          </button>
        </div>
      </section>

      <section className="bg-white pb-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              {course.category}
            </p>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-tight text-ink sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{course.description}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-4">
              {[
                ['Lessons', course.lessons],
                ['Duration', course.duration],
                ['Level', course.level],
                ['Price', `$${course.price}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-1 font-bold text-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={course.videoUrl}
                title={`${course.title} video lesson`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-5">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#ff9d2d]"
              >
                <PlayCircle size={18} />
                Continue learning
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-lg font-bold text-ink">Course outcomes</h2>
            <div className="mt-5 grid gap-3">
              {course.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-3 text-slate-600">
                  <FileText size={18} className="mt-1 shrink-0 text-primary" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-500">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-primary"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </aside>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-bold text-ink">Lessons and materials</h2>
            <div className="mt-5 grid gap-3">
              {lessonTitles.map((lesson, index) => (
                <button
                  key={lesson}
                  type="button"
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4 text-left transition hover:border-primary hover:bg-emerald-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block font-bold text-ink">{lesson}</span>
                      <span className="text-sm text-slate-500">Video lesson and PDF resource</span>
                    </span>
                  </span>
                  <PlayCircle size={19} className="text-primary" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Recommended next"
            title="Continue with related learning."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {courses
              .filter((item) => item.id !== course.id)
              .slice(0, 3)
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onCourseSelect(item)}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-card transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <img src={item.thumbnail} alt="" className="h-40 w-full object-cover" />
                  <span className="block p-4 font-bold text-ink">{item.title}</span>
                </button>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}

