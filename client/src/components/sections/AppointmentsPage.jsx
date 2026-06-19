import {
  AlertCircle,
  ArrowRight,
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
import PaymentModal from '../ui/PaymentModal.jsx';
import { appointments, consultationFee, nutritionists, payments } from '../../data/platformData.js';
import { formatRwf } from '../../utils/currency.js';

const timeSlots = ['09:00', '10:30', '12:00', '14:30', '16:00'];
const availableDates = ['May 30, 2026', 'June 02, 2026', 'June 04, 2026', 'June 06, 2026'];
const paymentMethods = [
  {
    id: 'mtn',
    label: 'MTN MoMo',
    description: 'Send a payment prompt to an MTN Mobile Money phone number.',
  },
  {
    id: 'airtel',
    label: 'Airtel Money',
    description: 'Send a payment prompt to an Airtel Money phone number.',
  },
  {
    id: 'bank',
    label: 'Bank transfer',
    description: 'Record a bank transfer reference for provider verification.',
  },
];

export default function AppointmentsPage() {
  const [selectedNutritionist, setSelectedNutritionist] = useState(nutritionists[0].id);
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [selectedTime, setSelectedTime] = useState(timeSlots[1]);
  const [consultationReason, setConsultationReason] = useState(
    'I would like a personalized meal plan and nutrition assessment.',
  );
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentRecords, setPaymentRecords] = useState(payments);
  const [appointmentRequests, setAppointmentRequests] = useState(appointments);
  const [bookingNotice, setBookingNotice] = useState(null);
  const [latestRequest, setLatestRequest] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const activeNutritionist = useMemo(
    () => nutritionists.find((item) => item.id === selectedNutritionist) || nutritionists[0],
    [selectedNutritionist],
  );

  const reasonText = consultationReason.trim();
  const isCurrentRequestSent =
    latestRequest?.nutritionist === activeNutritionist.name &&
    latestRequest?.date === selectedDate &&
    latestRequest?.time === selectedTime &&
    latestRequest?.concern === reasonText;

  const resetSlotProgress = () => {
    setPaymentConfirmed(false);
    setLatestRequest(null);
    setBookingNotice(null);
  };

  const payConsultation = () => {
    if (!reasonText) {
      setBookingNotice({
        type: 'warning',
        title: 'Add your consultation reason',
        message: 'Write what you want to discuss before paying for the consultation.',
      });
      return;
    }

    if (paymentConfirmed) {
      setBookingNotice({
        type: 'success',
        title: 'Payment already confirmed',
        message: 'Your consultation payment is ready for this booking request.',
      });
      return;
    }

    // Open payment modal instead of confirming immediately
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (payment) => {
    // Update payment records
    const newPayment = {
      id: payment.id,
      service: 'Nutrition consultation',
      amount: consultationFee,
      status: payment.status === 'confirmed' ? 'Confirmed' : 'Processing',
      date: selectedDate,
    };

    setPaymentRecords((records) => [newPayment, ...records]);
    setPaymentConfirmed(true);

    if (isCurrentRequestSent) {
      const paidRequest = { ...latestRequest, payment: 'Paid' };
      setLatestRequest(paidRequest);
      setAppointmentRequests((requests) =>
        requests.map((request) => (request.id === paidRequest.id ? paidRequest : request)),
      );
    }

    setBookingNotice({
      type: 'success',
      title: 'Consultation payment confirmed',
      message: `${formatRwf(consultationFee)} is recorded for ${selectedDate} at ${selectedTime}.`,
    });

    setIsPaymentModalOpen(false);
  };

  const requestAppointment = () => {
    if (!reasonText) {
      setBookingNotice({
        type: 'warning',
        title: 'Add your consultation reason',
        message: 'Write the reason for your visit so ASIFIWE Ruth can prepare for the session.',
      });
      return;
    }

    const nextRequest = {
      id: `APT-${Date.now().toString().slice(-5)}`,
      patient: 'Current Patient',
      nutritionist: activeNutritionist.name,
      concern: reasonText,
      date: selectedDate,
      time: selectedTime,
      status: 'Pending',
      payment: paymentConfirmed ? 'Paid' : 'Awaiting payment',
    };

    setAppointmentRequests((requests) => [nextRequest, ...requests]);
    setLatestRequest(nextRequest);
    setBookingNotice({
      type: paymentConfirmed ? 'success' : 'warning',
      title: paymentConfirmed ? 'Appointment request sent' : 'Appointment request sent',
      message: paymentConfirmed
        ? 'Your request is now pending doctor approval.'
        : 'Your request is pending. Pay the consultation fee to complete the booking.',
    });
  };

  return (
    <main className="bg-surface">
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Appointments and consultations"
            title="Book secure nutrition consultations with ASIFIWE Ruth."
            description="Patients can create requests, choose available dates and time slots, pay before consultation, view appointment status, and join online care sessions."
          />
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                <CalendarCheck size={22} />
              </div>
              <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Start here</p>
                  <h2 className="mt-1 text-2xl font-bold text-ink">Book consultation</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Choose a slot, pay the consultation fee, then send your request.
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-emerald-50 px-4 py-3 text-left sm:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Consultation fee</p>
                <p className="mt-1 text-2xl font-bold text-ink">{formatRwf(consultationFee)}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ['1', 'Choose slot', selectedDate && selectedTime ? 'Ready' : 'Required', true],
                ['2', 'Pay consultation', paymentConfirmed ? 'Paid' : 'Not paid yet', paymentConfirmed],
                ['3', 'Send request', isCurrentRequestSent ? 'Sent' : 'Not sent yet', isCurrentRequestSent],
              ].map(([number, label, status, complete]) => (
                <div
                  key={label}
                  className={`rounded-lg border px-4 py-3 ${
                    complete ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        complete ? 'bg-primary text-white' : 'bg-white text-slate-500'
                      }`}
                    >
                      {number}
                    </span>
                    <div>
                      <p className="font-bold text-ink">{label}</p>
                      <p className="text-sm text-slate-500">{status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {bookingNotice && (
              <div
                className={`mt-5 flex gap-3 rounded-lg border p-4 ${
                  bookingNotice.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
                role="status"
                aria-live="polite"
              >
                {bookingNotice.type === 'success' ? (
                  <CheckCircle2 size={21} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={21} className="mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="font-bold">{bookingNotice.title}</p>
                  <p className="mt-1 text-sm leading-6">{bookingNotice.message}</p>
                </div>
              </div>
            )}

            {latestRequest && (
              <div className="mt-5 rounded-lg border border-emerald-200 bg-white p-4">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
                  Latest booking request
                </p>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-4">
                  {[
                    ['Appointment', latestRequest.id],
                    ['Session', `${latestRequest.date} at ${latestRequest.time}`],
                    ['Status', latestRequest.status],
                    ['Payment', latestRequest.payment],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-slate-500">{label}</p>
                      <p className="mt-1 font-bold text-ink">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Doctor</span>
                <select
                  value={selectedNutritionist}
                  onChange={(event) => {
                    setSelectedNutritionist(event.target.value);
                    resetSlotProgress();
                  }}
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
                    onChange={(event) => {
                      setSelectedDate(event.target.value);
                      resetSlotProgress();
                    }}
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
                    onChange={(event) => {
                      setSelectedTime(event.target.value);
                      resetSlotProgress();
                    }}
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
                  value={consultationReason}
                  onChange={(event) => {
                    setConsultationReason(event.target.value);
                    setLatestRequest(null);
                  }}
                  className="focus-ring min-h-[120px] rounded-lg border border-slate-200 px-4 py-3"
                  placeholder="Example: I need help managing diabetes meals and building a weekly food plan."
                />
              </label>

              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">Booking summary</p>
                    <p className="mt-1 font-bold text-ink">{activeNutritionist.name}</p>
                    <p className="text-sm text-slate-600">{selectedDate} at {selectedTime}</p>
                    <p className="mt-2 text-sm font-bold text-slate-700">
                      {paymentConfirmed ? 'Payment confirmed' : 'Payment not paid yet'}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-ink">{formatRwf(consultationFee)}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={payConsultation}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#ff9d2d]"
                >
                  <CreditCard size={18} />
                  {paymentConfirmed ? 'Consultation paid' : 'Pay consultation'}
                </button>
                <button
                  type="button"
                  onClick={requestAppointment}
                  disabled={isCurrentRequestSent}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  {isCurrentRequestSent ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
                  {isCurrentRequestSent ? 'Request sent' : 'Send appointment request'}
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
                  [MessageSquareText, 'Chat with ASIFIWE Ruth', 'Share questions, meal photos, and progress updates.'],
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
                {paymentRecords.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-4"
                  >
                    <div>
                      <p className="font-bold text-ink">{payment.service}</p>
                      <p className="text-sm text-slate-500">{payment.id} - {payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-ink">{formatRwf(payment.amount)}</p>
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
                    <th className="px-5 py-4">Doctor</th>
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

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={consultationFee}
        appointmentId={selectedDate + selectedTime}
        nutritionistName={activeNutritionist.name}
        appointmentDate={selectedDate}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </main>
  );
}
