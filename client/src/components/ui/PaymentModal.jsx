import {
  AlertCircle,
  CheckCircle2,
  Loader,
  X,
  Copy,
  Phone,
  DollarSign,
  Clock,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { formatRwf } from '../../utils/currency.js';

const paymentMethods = [
  {
    id: 'mtn',
    label: 'MTN Mobile Money',
    description: 'Send a payment prompt to your MTN phone number',
    icon: '📱',
  },
  {
    id: 'airtel',
    label: 'Airtel Money',
    description: 'Send a payment prompt to your Airtel phone number',
    icon: '📲',
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    description: 'Manually transfer funds and provide reference number',
    icon: '🏦',
  },
];

/**
 * PaymentModal Component
 * Handles complete payment flow: method selection, amount confirmation, payment processing
 */
export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  appointmentId,
  nutritionistName,
  appointmentDate,
  onPaymentSuccess,
}) {
  const [stage, setStage] = useState('method'); // method, details, processing, confirmation, success, error
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [error, setError] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const checkIntervalRef = useRef(null);

  // Bank transfer fields
  const [bankDetails, setBankDetails] = useState({
    accountHolder: '',
    accountNumber: '',
    bankName: '',
    referenceNumber: '',
  });

  // ASIFIWE Ruth's payment account
  const RECIPIENT = {
    name: 'ASIFIWE Ruth',
    phone: '+250 787 977 326',
    account: 'MTN Mobile Money',
  };

  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    setError(null);

    if (methodId === 'bank') {
      setStage('bank-details');
    } else {
      setStage('details');
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    // Format as +250 XXX XXX XXX
    if (value.length > 0) {
      if (!value.startsWith('250') && !value.startsWith('0')) {
        value = '250' + value;
      } else if (value.startsWith('0')) {
        value = '250' + value.substring(1);
      }
    }
    setPhoneNumber(value);
  };

  const validatePhoneNumber = () => {
    const regex = /^250\d{9}$/;
    if (!regex.test(phoneNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number (10 digits)');
      return false;
    }
    return true;
  };

  const handleInitiatePayment = async () => {
    if (!validatePhoneNumber()) return;

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/mobile-money/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          paymentMethod: selectedMethod,
          phoneNumber,
          amountCents: amount * 100, // Convert RWF to cents (100 RWF = 10,000 cents)
        }),
      });

      if (!response.ok) {
        try {
          const data = await response.json();
          throw new Error(data.error || 'Failed to initiate payment');
        } catch (parseErr) {
          throw new Error(`Server error: ${response.statusText}`);
        }
      }

      const data = await response.json();
      if (!data || !data.payment) {
        throw new Error('Invalid server response');
      }
      setRequestId(data.payment.requestId || data.paymentRequest?.requestId);
      setStage('processing');
      setIsChecking(false);

      // Start polling for payment confirmation
      startStatusChecking(data.payment.requestId || data.paymentRequest?.requestId);
    } catch (err) {
      setError(err.message);
      setIsChecking(false);
    }
  };

  const startStatusChecking = (reqId) => {
    // Initial check after 3 seconds
    setTimeout(() => checkPaymentStatus(reqId), 3000);

    // Then check every 5 seconds
    checkIntervalRef.current = setInterval(() => {
      checkPaymentStatus(reqId);
    }, 5000);
  };

  const checkPaymentStatus = async (reqId) => {
    try {
      const response = await fetch('/api/payments/mobile-money/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: reqId }),
      });

      if (!response.ok) throw new Error('Failed to check status');

      const data = await response.json();
      setPaymentStatus(data.status);

      if (data.status === 'confirmed') {
        clearInterval(checkIntervalRef.current);
        setStage('confirmation');
      }
    } catch (err) {
      console.error('Status check error:', err);
    }
  };

  const handleConfirmPayment = async () => {
    if (!confirmationCode.trim()) {
      setError('Please enter the confirmation code from your phone');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/mobile-money/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          confirmationCode,
        }),
      });

      if (!response.ok) {
        try {
          const data = await response.json();
          throw new Error(data.error || 'Failed to confirm payment');
        } catch (parseErr) {
          throw new Error(`Server error: ${response.statusText}`);
        }
      }

      const data = await response.json();
      setStage('success');
      setIsChecking(false);

      // Notify parent component
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess(data.payment);
        }
      }, 2000);
    } catch (err) {
      setError(err.message);
      setIsChecking(false);
    }
  };

  const handleBankTransfer = async () => {
    // Validate bank details
    if (!bankDetails.accountHolder || !bankDetails.accountNumber || !bankDetails.bankName || !bankDetails.referenceNumber) {
      setError('Please fill in all bank details');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/bank-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          amountCents: amount * 100, // Convert RWF to cents
          ...bankDetails,
        }),
      });

      if (!response.ok) {
        try {
          const data = await response.json();
          throw new Error(data.error || 'Failed to process bank transfer');
        } catch (parseErr) {
          throw new Error(`Server error: ${response.statusText}`);
        }
      }

      const data = await response.json();
      setStage('bank-success');
      setIsChecking(false);
    } catch (err) {
      setError(err.message);
      setIsChecking(false);
    }
  };

  const handleClose = () => {
    // Reset state
    setStage('method');
    setSelectedMethod(null);
    setPhoneNumber('');
    setConfirmationCode('');
    setRequestId(null);
    setError(null);
    setPaymentStatus(null);
    clearInterval(checkIntervalRef.current);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Complete Payment</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Appointment Summary */}
          {stage !== 'success' && stage !== 'bank-success' && (
            <div className="mb-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Consultation with</p>
              <p className="font-bold text-ink">{nutritionistName}</p>
              <p className="text-sm text-slate-600 mt-1">{appointmentDate}</p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="font-semibold text-slate-700">Amount</span>
                <span className="text-2xl font-bold text-primary">{formatRwf(amount)}</span>
              </div>
              
              {/* Payment Recipient Info */}
              <div className="mt-4 rounded-lg bg-white p-3 border border-emerald-200">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 mb-2">Money will go to</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                    AR
                  </div>
                  <div>
                    <p className="font-bold text-ink text-sm">{RECIPIENT.name}</p>
                    <p className="text-xs text-slate-600">{RECIPIENT.account}: {RECIPIENT.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage: Payment Method Selection */}
          {stage === 'method' && (
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleSelectMethod(method.id)}
                  className="text-left rounded-lg border-2 border-slate-200 p-4 transition hover:border-primary hover:bg-slate-50"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-bold text-ink">{method.label}</p>
                      <p className="text-sm text-slate-600">{method.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Stage: Phone Number Entry */}
          {stage === 'details' && selectedMethod && (
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {selectedMethod === 'mtn' ? 'MTN Phone Number' : 'Airtel Phone Number'}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-3 text-slate-500">
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="0700000000"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Format: +250 or 07XX XXX XXX</p>
              </div>

              {error && (
                <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-900">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStage('method');
                    setSelectedMethod(null);
                  }}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  disabled={isChecking}
                >
                  Back
                </button>
                <button
                  onClick={handleInitiatePayment}
                  disabled={isChecking || !phoneNumber}
                  className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Payment'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Stage: Bank Details */}
          {stage === 'bank-details' && (
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={bankDetails.accountHolder}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, accountHolder: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, bankName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., BNR, Equity Bank"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, accountNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your account number"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Transfer Reference Number
                </label>
                <input
                  type="text"
                  value={bankDetails.referenceNumber}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, referenceNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Reference from your bank"
                />
              </div>

              {error && (
                <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-900">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStage('method');
                    setSelectedMethod(null);
                    setBankDetails({ accountHolder: '', accountNumber: '', bankName: '', referenceNumber: '' });
                  }}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  disabled={isChecking}
                >
                  Back
                </button>
                <button
                  onClick={handleBankTransfer}
                  disabled={isChecking}
                  className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300 flex items-center justify-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Record Transfer'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Stage: Processing/Waiting for Confirmation */}
          {stage === 'processing' && (
            <div className="text-center py-8">
              <div className="mb-6 flex justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Phone size={32} className="text-primary" />
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-ink mb-2">Check Your Phone</h3>
              <p className="text-slate-600 mb-4">
                A payment prompt has been sent to <strong>{phoneNumber}</strong>
              </p>

              <div className="mb-6 rounded-lg bg-blue-50 p-4 border border-blue-200">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-900 mb-2">This payment goes to</p>
                <p className="text-sm font-bold text-blue-900">{RECIPIENT.name}</p>
                <p className="text-xs text-blue-800">{RECIPIENT.account}: {RECIPIENT.phone}</p>
              </div>

              <div className="mb-6 rounded-lg bg-amber-50 p-4 border border-amber-200">
                <p className="text-sm text-amber-900">
                  Open the payment prompt on your phone and enter your PIN to complete the payment.
                </p>
              </div>

              <p className="text-xs text-slate-500 mb-4">Waiting for confirmation...</p>
              <div className="flex gap-2 justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>

              {paymentStatus === 'failed' && (
                <div className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Payment failed</p>
                    <p className="text-sm mt-1">Please try again</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stage: Confirmation Code Entry */}
          {stage === 'confirmation' && (
            <div className="grid gap-4">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                <div className="flex gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-900">Payment received on phone</p>
                    <p className="text-sm text-emerald-800 mt-1">
                      Your phone has confirmed the payment. The funds will be transferred to {RECIPIENT.name}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-900 mb-2">Recipient</p>
                <p className="text-sm font-bold text-blue-900">{RECIPIENT.name}</p>
                <p className="text-xs text-blue-800">{RECIPIENT.account}: {RECIPIENT.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Confirmation Code
                </label>
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                  placeholder="e.g., MTN-A1B2C3"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-lg tracking-widest"
                />
              </div>

              {error && (
                <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-900">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleConfirmPayment}
                disabled={isChecking || !confirmationCode.trim()}
                className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isChecking ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Confirm Payment
                  </>
                )}
              </button>
            </div>
          )}

          {/* Stage: Success */}
          {stage === 'success' && (
            <div className="text-center py-8">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-emerald-100 p-4">
                  <CheckCircle2 size={48} className="text-emerald-600" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-ink mb-2">Payment Successful!</h3>
              <p className="text-slate-600 mb-2">
                Your consultation payment of <strong>{formatRwf(amount)}</strong> has been confirmed.
              </p>
              <p className="text-sm text-slate-600 mb-6">
                ✅ Funds transferred to {RECIPIENT.name} ({RECIPIENT.phone})
              </p>

              <div className="mb-6 rounded-lg bg-emerald-50 p-4 border border-emerald-200">
                <p className="text-sm text-emerald-900">
                  You can now proceed to book your consultation. ASIFIWE Ruth has received your payment and will review your request.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-white transition hover:bg-emerald-700"
              >
                Close
              </button>
            </div>
          )}

          {/* Stage: Bank Success */}
          {stage === 'bank-success' && (
            <div className="text-center py-8">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-blue-100 p-4">
                  <CheckCircle2 size={48} className="text-blue-600" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-ink mb-2">Bank Transfer Recorded</h3>
              <p className="text-slate-600 mb-4">
                Your bank transfer of <strong>{formatRwf(amount)}</strong> has been recorded.
              </p>

              <div className="mb-6 rounded-lg bg-blue-50 p-4 border border-blue-200">
                <p className="text-sm font-bold text-blue-900 mb-2">Please save your reference number:</p>
                <p className="font-mono text-lg font-bold text-blue-900">REF-{Date.now().toString().slice(-8)}</p>
                <p className="text-xs text-blue-800 mt-3">
                  Our admin team will verify your transfer within 24 hours and confirm your booking.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-white transition hover:bg-emerald-700"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
