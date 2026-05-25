import {
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Download,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import SectionHeader from '../ui/SectionHeader.jsx';
import { appointments, nutritionists, payments } from '../../data/platformData.js';

const timeSlots = ['09:00', '10:30', '12:00', '14:30', '16:00'];
const availableDates = ['May 27, 2026', 'May 28, 2026', 'May 30, 2026', 'June 02, 2026'];

export default function AppointmentsPage() {
  const [selectedNutritionist, setSelectedNutritionist] = useState(nutritionists[0].id);
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [selectedTime, setSelectedTime] = useState(timeSlots[1]);
  const [appointmentRequests, setAppointmentRequests] = useState(appointments);

  const activeNutritionist = useMemo(
    () => nutritionists.find((item) => item.id === selectedNutritionist) || nutritionists[0],
    [selectedNutritionist],
  );

  const requestAppointment = () => {
    const nextRequest = {
      id: `APT-${2060 + appointmentRequests.length}`,
      patient: 'Current Patient',
      nutritionist: activeNutritionist.name,
      concern: 'Personalized nutrition consultation',
      date: selectedDate,
      time: selectedTime,
      status: 'Pending',
      payment: 'Awaiting payment',
    };
    setAppointmentRequests([nextRequest, ...appointmentRequests]);
  };

  return (
    <main className="bg-surface">
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Appointments and consultations"
            title="Book secure nutrition consultations with registered clinicians."
            description="Patients can create requests, choose available dates and time slots, pay before consultation, view appointment status, and join online care sessions."
          />
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                <CalendarCheck size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink">Request appointment</h2>
                <p className="text-sm text-slate-500">Consultation payment is confirmed before the session.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Nutritionist</span>
                <select
                  value={selectedNutritionist}
                  onChange={(event) => setSelectedNutritionist(event.target.value)}
                  className="focus-ring rounded-lg border border-slate-200 px-4 py-3"
                >
                  {nutritionists.map((nutritionist) => (
                    <option key={nutritionist.id} value={nutritionist.id}>
                      {nutritionist.name} - {nutritionist.specialty}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-slate-700">Available date</span>
                  <select
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="focus-ring rounded-lg border border-slate-200 px-4 py-3"
                  >
                    {availableDates.map((date) => (
                      <option key={date}>{date}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-slate-700">Time slot</span>
                  <select
                    value={selectedTime}
                    onChange={(event) => setSelectedTime(event.target.value)}
                    className="focus-ring rounded-lg border border-slate-200 px-4 py-3"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot}>{slot}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Consultation reason</span>
                <textarea
                  className="focus-ring min-h-[120px] rounded-lg border border-slate-200 px-4 py-3"
                  defaultValue="I would like a personalized meal plan and nutrition assessment."
                />
              </label>

              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">Selected clinician</p>
                    <p className="mt-1 font-bold text-ink">{activeNutritionist.name}</p>
                    <p className="text-sm text-slate-600">{selectedDate} at {selectedTime}</p>
                  </div>
                  <p className="text-2xl font-bold text-ink">$75</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#ff9d2d]"
                >
                  <CreditCard size={18} />
                  Pay securely
                </button>
                <button
                  type="button"
                  onClick={requestAppointment}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <CheckCircle2 size={18} />
                  Request appointment
                </button>
              </div>
            </div>
          </div>

          <aside className="grid h-fit gap-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
              <h2 className="text-xl font-bold text-ink">Consultation tools</h2>
              <div className="mt-5 grid gap-3">
                {[
                  [Video, 'Join online consultation', 'Enabled after approval and payment confirmation.'],
                  [MessageSquareText, 'Chat with nutritionist', 'Share questions, meal photos, and progress updates.'],
                  [ShieldCheck, 'Secure visit record', 'Role-based access protects patient care history.'],
                ].map(([Icon, title, copy]) => (
                  <div key={title} className="flex gap-3 rounded-lg bg-slate-50 p-4">
                    <Icon size={21} className="mt-1 shrink-0 text-primary" />
                    <div>
                      <p className="font-bold text-ink">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
              <h2 className="text-xl font-bold text-ink">Payment history</h2>
              <div className="mt-5 grid gap-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-4"
                  >
                    <div>
                      <p className="font-bold text-ink">{payment.service}</p>
                      <p className="text-sm text-slate-500">{payment.id} - {payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-ink">${payment.amount}</p>
                      <p className="text-sm text-primary">{payment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                <ReceiptText size={18} />
                Generate invoice
                <Download size={18} />
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Appointment status"
            title="Track requests from submission to consultation."
          />
          <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Appointment</th>
                    <th className="px-5 py-4">Nutritionist</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {appointmentRequests.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-5 py-4 font-bold text-ink">{appointment.id}</td>
                      <td className="px-5 py-4 text-slate-600">{appointment.nutritionist}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {appointment.date}, {appointment.time}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            appointment.status === 'Approved'
                              ? 'bg-emerald-50 text-primary'
                              : 'bg-orange-50 text-amber-700'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{appointment.payment}</td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-primary hover:text-primary"
                        >
                          <Video size={15} />
                          Join
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

