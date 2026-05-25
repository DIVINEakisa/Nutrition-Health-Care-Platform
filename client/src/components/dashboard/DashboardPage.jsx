import {
  Activity,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  FileImage,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  Plus,
  Send,
  ShieldCheck,
  Users,
  Video,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  adminMetrics,
  appointments,
  chatMessages,
  courses,
  nutritionists,
  payments,
} from '../../data/platformData.js';

const roleOptions = [
  { id: 'patient', label: 'Patient', icon: Users },
  { id: 'nutritionist', label: 'Nutritionist', icon: BookOpen },
  { id: 'admin', label: 'Admin', icon: ShieldCheck },
];

const dashboardNav = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
  { id: 'messages', label: 'Messages', icon: MessageSquareText },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

export default function DashboardPage() {
  const [role, setRole] = useState('nutritionist');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="bg-surface">
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Role dashboards
            </p>
            <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
              Manage learning, consultations, payments, and platform operations.
            </h1>
          </div>
          <div className="grid gap-2 rounded-lg bg-slate-100 p-1 sm:grid-cols-3">
            {roleOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setRole(item.id);
                  setActiveTab('overview');
                }}
                className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition ${
                  role === item.id ? 'bg-white text-primary shadow-card' : 'text-slate-600'
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-3 shadow-card">
            <div className="hidden px-3 py-3 lg:block">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                Workspace
              </p>
              <p className="mt-2 text-lg font-bold text-ink">
                {role === 'admin'
                  ? 'Admin Console'
                  : role === 'patient'
                    ? 'Patient Portal'
                    : 'Nutritionist Studio'}
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto p-1 lg:grid lg:overflow-visible">
              {dashboardNav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-bold transition lg:w-full ${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-primary'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0">
            {role === 'nutritionist' && (
              <NutritionistDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
            {role === 'patient' && <PatientDashboard activeTab={activeTab} />}
            {role === 'admin' && <AdminDashboard activeTab={activeTab} />}
          </div>
        </div>
      </section>
    </main>
  );
}

function NutritionistDashboard({ activeTab, setActiveTab }) {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=1nAKwH1C4v8');
  const [uploadedVideos, setUploadedVideos] = useState([
    { title: 'Balanced plates for metabolic health', embedUrl: courses[0].videoUrl },
  ]);
  const [appointmentRows, setAppointmentRows] = useState(appointments);

  const embedUrl = useMemo(() => toYoutubeEmbed(videoUrl), [videoUrl]);

  const addVideo = () => {
    if (!embedUrl) return;
    setUploadedVideos([
      { title: `Nutrition video ${uploadedVideos.length + 1}`, embedUrl },
      ...uploadedVideos,
    ]);
  };

  const setStatus = (id, status) => {
    setAppointmentRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, status } : row)),
    );
  };

  if (activeTab === 'courses') {
    return (
      <div className="grid gap-6">
        <Panel title="Upload YouTube lesson" icon={Video}>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <input
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              className="focus-ring rounded-lg border border-slate-200 px-4 py-3"
              placeholder="Paste YouTube video link"
            />
            <button
              type="button"
              onClick={addVideo}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              Add video
            </button>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {uploadedVideos.map((video) => (
              <article key={video.embedUrl} className="overflow-hidden rounded-lg border border-slate-200">
                <div className="aspect-video bg-slate-100">
                  <iframe
                    className="h-full w-full"
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 font-bold text-ink">{video.title}</div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Create and manage courses" icon={BookOpen}>
          <div className="grid gap-4 lg:grid-cols-2">
            <CourseBuilder />
            <LessonBuilder />
          </div>
        </Panel>
      </div>
    );
  }

  if (activeTab === 'appointments') {
    return (
      <Panel title="Appointment approvals and schedules" icon={CalendarCheck}>
        <div className="grid gap-4">
          {appointmentRows.map((appointment) => (
            <div
              key={appointment.id}
              className="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-bold text-ink">{appointment.patient}</p>
                <p className="mt-1 text-sm text-slate-600">{appointment.concern}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {appointment.date} at {appointment.time} - {appointment.payment}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    appointment.status === 'Approved'
                      ? 'bg-emerald-50 text-primary'
                      : appointment.status === 'Rejected'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-orange-50 text-amber-700'
                  }`}
                >
                  {appointment.status}
                </span>
                <button
                  type="button"
                  onClick={() => setStatus(appointment.id, 'Approved')}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white"
                >
                  <CheckCircle2 size={15} />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(appointment.id, 'Rejected')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
                >
                  <XCircle size={15} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  if (activeTab === 'messages') {
    return <CommunicationHub />;
  }

  if (activeTab === 'payments') {
    return <PaymentsPanel />;
  }

  return (
    <div className="grid gap-6">
      <DashboardMetrics
        metrics={[
          ['Pending appointments', '12', '+4 today'],
          ['Course revenue', '$7.8K', '+11%'],
          ['Active patients', '248', '+27'],
          ['Unread messages', '18', '5 urgent'],
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Today at a glance" icon={Activity}>
          <div className="grid gap-4">
            {appointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="rounded-lg border border-slate-200 p-4">
                <p className="font-bold text-ink">{appointment.patient}</p>
                <p className="mt-1 text-sm text-slate-600">{appointment.concern}</p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  {appointment.date} - {appointment.time}
                </p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Quick actions" icon={Plus}>
          <div className="grid gap-3">
            {[
              ['Create course', 'Add thumbnail, description, lessons, and materials.'],
              ['Set schedule', 'Publish available telehealth consultation slots.'],
              ['Review payments', 'Track invoices, confirmations, and service revenue.'],
            ].map(([title, copy]) => (
              <button
                key={title}
                type="button"
                onClick={() =>
                  setActiveTab(title === 'Create course' ? 'courses' : title === 'Set schedule' ? 'appointments' : 'payments')
                }
                className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-primary hover:bg-emerald-50"
              >
                <span className="block font-bold text-ink">{title}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">{copy}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function PatientDashboard({ activeTab }) {
  if (activeTab === 'messages') return <CommunicationHub />;
  if (activeTab === 'payments') return <PaymentsPanel />;

  if (activeTab === 'courses') {
    return (
      <Panel title="Learning progress" icon={BookOpen}>
        <div className="grid gap-4 md:grid-cols-2">
          {courses.slice(0, 4).map((course) => (
            <div key={course.id} className="rounded-lg border border-slate-200 p-4">
              <p className="font-bold text-ink">{course.title}</p>
              <p className="mt-1 text-sm text-slate-500">{course.category}</p>
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${course.progress}%` }} />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-500">{course.progress}% complete</p>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  if (activeTab === 'appointments') {
    return (
      <Panel title="My appointments" icon={CalendarCheck}>
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="rounded-lg border border-slate-200 p-4">
              <p className="font-bold text-ink">{appointment.nutritionist}</p>
              <p className="mt-1 text-sm text-slate-600">{appointment.concern}</p>
              <p className="mt-2 text-sm font-semibold text-primary">
                {appointment.date} at {appointment.time} - {appointment.status}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-6">
      <DashboardMetrics
        metrics={[
          ['Active courses', '4', '2 in progress'],
          ['Appointments', '3', '1 pending'],
          ['Care messages', '24', '2 unread'],
          ['Paid invoices', '$159', 'This month'],
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel title="Profile management" icon={Users}>
          <div className="grid gap-4">
            <input className="focus-ring rounded-lg border border-slate-200 px-4 py-3" defaultValue="Maya Roberts" />
            <input className="focus-ring rounded-lg border border-slate-200 px-4 py-3" defaultValue="maya@example.com" />
            <textarea
              className="focus-ring min-h-[112px] rounded-lg border border-slate-200 px-4 py-3"
              defaultValue="Goals: improve blood sugar stability, plan balanced meals, and track energy levels."
            />
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white"
            >
              <CheckCircle2 size={18} />
              Save profile
            </button>
          </div>
        </Panel>
        <Panel title="Care plan summary" icon={FileText}>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Current focus', 'Diabetes meal planning'],
              ['Nutritionist', 'Dr. Amara Collins'],
              ['Next session', 'May 27, 2026 at 10:30'],
              ['Payment status', 'Confirmed'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-1 font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function AdminDashboard({ activeTab }) {
  if (activeTab === 'messages') return <CommunicationHub />;
  if (activeTab === 'payments') return <PaymentsPanel />;

  if (activeTab === 'courses') {
    return (
      <Panel title="Course moderation" icon={BookOpen}>
        <AdminTable
          columns={['Course', 'Category', 'Instructor', 'Status']}
          rows={courses.map((course) => [
            course.title,
            course.category,
            course.instructor,
            course.progress > 0 ? 'Published' : 'Review',
          ])}
        />
      </Panel>
    );
  }

  if (activeTab === 'appointments') {
    return (
      <Panel title="Appointment oversight" icon={CalendarCheck}>
        <AdminTable
          columns={['ID', 'Patient', 'Nutritionist', 'Status', 'Payment']}
          rows={appointments.map((appointment) => [
            appointment.id,
            appointment.patient,
            appointment.nutritionist,
            appointment.status,
            appointment.payment,
          ])}
        />
      </Panel>
    );
  }

  return (
    <div className="grid gap-6">
      <DashboardMetrics metrics={adminMetrics.map((item) => [item.label, item.value, item.trend])} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="User and nutritionist management" icon={Users}>
          <AdminTable
            columns={['Name', 'Role', 'Status']}
            rows={[
              ['Maya Roberts', 'Patient', 'Active'],
              ['Dr. Amara Collins', 'Registered Nutritionist', 'Verified'],
              ['Samuel Okafor', 'Registered Nutritionist', 'Verified'],
              ['Jean Ndayisenga', 'Patient', 'Active'],
            ]}
          />
        </Panel>
        <Panel title="Analytics and content moderation" icon={BarChart3}>
          <div className="grid gap-4">
            {[
              ['Monthly revenue', '$82.4K', 'Payments confirmed through Stripe-ready service.'],
              ['Moderation queue', '7 items', 'Courses, thumbnails, and video links awaiting review.'],
              ['Consultation completion', '94%', 'Approved appointments that reached video session.'],
            ].map(([label, value, copy]) => (
              <div key={label} className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function CommunicationHub() {
  const [messages, setMessages] = useState(chatMessages);
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([
      ...messages,
      {
        id: `msg-${messages.length + 1}`,
        sender: 'Current User',
        role: 'patient',
        message,
        time: 'Now',
      },
    ]);
    setMessage('');
  };

  return (
    <Panel title="Online communication" icon={MessageSquareText}>
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-50 p-4">
            <p className="font-bold text-ink">Maya Roberts and Dr. Amara Collins</p>
            <p className="text-sm text-slate-500">Real-time chat, notifications, and message history</p>
          </div>
          <div className="grid max-h-[430px] gap-4 overflow-y-auto p-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`max-w-[88%] rounded-lg p-4 ${
                  item.role === 'patient'
                    ? 'ml-auto bg-primary text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <p className="text-sm font-bold">{item.sender}</p>
                <p className="mt-2 leading-6">{item.message}</p>
                <p className={`mt-2 text-xs ${item.role === 'patient' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {item.time}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 border-t border-slate-200 p-4 sm:grid-cols-[1fr_auto]">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="focus-ring rounded-lg border border-slate-200 px-4 py-3"
              placeholder="Write message"
            />
            <button
              type="button"
              onClick={sendMessage}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>

        <div className="grid h-fit gap-4">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-slate-950"
          >
            <Video size={18} />
            Start video consultation
          </button>
          {['Appointment approved', 'Payment confirmed', 'New nutritionist message'].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="font-bold text-ink">{item}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Notification delivered to patient and clinician dashboards.
              </p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function PaymentsPanel() {
  return (
    <Panel title="Payments, invoices, and confirmations" icon={CreditCard}>
      <div className="grid gap-4 lg:grid-cols-3">
        {payments.map((payment) => (
          <div key={payment.id} className="rounded-lg border border-slate-200 p-4">
            <p className="font-bold text-ink">{payment.service}</p>
            <p className="mt-1 text-sm text-slate-500">{payment.id} - {payment.date}</p>
            <p className="mt-4 text-2xl font-bold text-ink">${payment.amount}</p>
            <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-primary">
              {payment.status}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CourseBuilder() {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <FileImage size={21} className="text-primary" />
        <h3 className="font-bold text-ink">Course details</h3>
      </div>
      <div className="mt-4 grid gap-3">
        <input className="focus-ring rounded-lg border border-slate-200 px-4 py-3" placeholder="Course title" />
        <select className="focus-ring rounded-lg border border-slate-200 px-4 py-3">
          <option>Diabetes management</option>
          <option>Hypertension nutrition</option>
          <option>Maternal nutrition</option>
          <option>Healthy meal planning</option>
        </select>
        <input className="focus-ring rounded-lg border border-slate-200 px-4 py-3" placeholder="Thumbnail image URL or Cloudinary upload" />
        <textarea
          className="focus-ring min-h-[100px] rounded-lg border border-slate-200 px-4 py-3"
          placeholder="Course description"
        />
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white"
        >
          <Plus size={18} />
          Save course
        </button>
      </div>
    </div>
  );
}

function LessonBuilder() {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <FileText size={21} className="text-primary" />
        <h3 className="font-bold text-ink">Lesson materials</h3>
      </div>
      <div className="mt-4 grid gap-3">
        <input className="focus-ring rounded-lg border border-slate-200 px-4 py-3" placeholder="Lesson title" />
        <input className="focus-ring rounded-lg border border-slate-200 px-4 py-3" placeholder="Video URL" />
        <textarea
          className="focus-ring min-h-[100px] rounded-lg border border-slate-200 px-4 py-3"
          placeholder="Learning material notes"
        />
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-4 py-3 text-sm font-bold text-primary"
        >
          <Plus size={18} />
          Add lesson
        </button>
      </div>
    </div>
  );
}

function DashboardMetrics({ metrics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(([label, value, detail]) => (
        <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
          <p className="mt-1 text-sm text-primary">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-primary">
          <Icon size={22} />
        </div>
        <h2 className="text-xl font-bold text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function AdminTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.join('-')}>
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3 text-slate-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function toYoutubeEmbed(url) {
  try {
    const parsed = new URL(url);
    const id =
      parsed.hostname.includes('youtu.be')
        ? parsed.pathname.slice(1)
        : parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop();
    return id ? `https://www.youtube.com/embed/${id}` : '';
  } catch {
    return '';
  }
}

