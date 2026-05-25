export default function MetricCard({ icon: Icon, label, value, detail, tone = 'primary' }) {
  const toneClass =
    tone === 'blue'
      ? 'bg-blue-50 text-secondary'
      : tone === 'orange'
        ? 'bg-orange-50 text-amber-600'
        : 'bg-emerald-50 text-primary';

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}>
        <Icon size={21} strokeWidth={2.2} />
      </div>
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
      {detail && <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>}
    </article>
  );
}

