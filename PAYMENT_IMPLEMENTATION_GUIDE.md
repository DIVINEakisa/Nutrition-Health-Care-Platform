# Payment System Implementation Guide

## Overview
This document outlines the complete payment system implementation for the Nutrition Health Care Platform, enabling realistic mobile money and bank transfer payments.

## Architecture

### 1. Payment Methods Supported
- **MTN Mobile Money (MTN MoMo)**: Send payment prompt to customer's MTN phone
- **Airtel Money**: Send payment prompt to customer's Airtel phone  
- **Bank Transfer**: Record manual bank transfer with reference number

### 2. Payment Flow

```
Customer Booking Flow:
│
├─> Select Nutritionist + Date/Time + Reason
│
├─> Click "Pay Consultation"
│   └─> Payment Modal Opens
│
├─> Select Payment Method
│   ├─> MTN: Enter phone number → Send payment prompt to phone
│   ├─> Airtel: Enter phone number → Send payment prompt to phone
│   └─> Bank: Enter bank details → Record reference
│
├─> Process Payment
│   ├─> System polls for confirmation (every 5 seconds)
│   ├─> Customer confirms on their phone
│   └─> System receives confirmation
│
├─> Enter Confirmation Code (from phone)
│   └─> Confirm in system
│
└─> Payment recorded + Appointment ready to send
```

## Backend Implementation

### Mobile Money Service (`server/src/services/mobileMoneyService.js`)

**Functions:**
- `initiateM2MPayment()`: Start MTN payment flow
- `initiateAirtelPayment()`: Start Airtel payment flow
- `checkPaymentStatus()`: Poll payment provider for confirmation
- `confirmPayment()`: Mark payment as confirmed
- `processBankTransfer()`: Record bank transfer details

**Key Features:**
- Mock mode for development/testing
- Real API integration points for production
- Automatic phone number normalization
- Confirmation code generation/validation

### Payment Routes (`server/src/routes/payments.js`)

**Endpoints:**

1. **POST /api/payments/mobile-money/initiate**
   - Initiates mobile money payment
   - Sends payment prompt to customer's phone
   - Returns request ID for polling
   - Body: `{ paymentMethod, phoneNumber, amountCents, appointmentId }`

2. **POST /api/payments/mobile-money/check-status**
   - Poll endpoint for payment confirmation
   - Returns current payment status
   - Called every 5 seconds by frontend
   - Body: `{ requestId }`

3. **POST /api/payments/mobile-money/confirm**
   - User enters confirmation code from phone
   - Marks payment as "confirmed"
   - Body: `{ requestId, confirmationCode }`

4. **POST /api/payments/bank-transfer**
   - Record bank transfer details
   - Returns reference number
   - Body: `{ accountHolder, accountNumber, bankName, referenceNumber, amountCents }`

### Nutritionist Payment Accounts (`server/src/routes/nutritionist.js`)

**Endpoints:**

1. **GET /api/nutritionist/payment-account**
   - Retrieve doctor's payment account configuration
   - Shows where payments will be sent

2. **POST /api/nutritionist/payment-account**
   - Create/update payment account
   - Supports MTN, Airtel, or Bank
   - Body: `{ accountType, phoneNumber?, accountNumber?, accountHolder?, bankName? }`

3. **DELETE /api/nutritionist/payment-account**
   - Remove payment account

4. **GET /api/nutritionist/earnings**
   - View earnings summary
   - Total earned, this month, this week
   - Pending payouts, last payout info

## Frontend Implementation

### Payment Modal Component (`client/src/components/ui/PaymentModal.jsx`)

**Features:**
- Multi-stage payment flow
- Payment method selection
- Phone number collection with validation
- Real-time payment status checking
- Confirmation code entry
- Success/Error states
- Bank transfer details form

**States:**
- `method`: Choose payment method
- `details`: Enter phone number
- `bank-details`: Enter bank information
- `processing`: Waiting for user to confirm on phone
- `confirmation`: Enter confirmation code
- `success`: Payment successful
- `bank-success`: Bank transfer recorded

### Updated AppointmentsPage (`client/src/components/sections/AppointmentsPage.jsx`)

**Changes:**
- Imports PaymentModal component
- Opens modal instead of confirming immediately
- Callback handler `handlePaymentSuccess()` updates state after payment
- Displays payment history with proper status

## Database Schema Updates

### New Tables

**nutritionist_payment_accounts**
```sql
- id (UUID)
- nutritionist_id (FK to users)
- account_type (mtn | airtel | bank)
- phone_number (optional, for mobile money)
- account_number (optional, for bank)
- account_holder_name (optional, for bank)
- bank_name (optional, for bank)
- verified (boolean)
- verified_at (timestamp)
```

### Modified Tables

**payments** (enhanced with):
```sql
- payment_method (mtn | airtel | bank | stripe)
- mobile_money_request_id
- phone_number
- confirmation_code
- bank_reference
- nutritionist_id (FK to users)
- currency (changed from 'usd' to 'RWF')
- processed_at
- updated_at
```

## Development Setup

### Environment Variables Required
```
MOCK_PAYMENT_MODE=true  # Enable mock mode for testing
# When ready for production, add:
# MTN_API_KEY=your_mtn_key
# MTN_BUSINESS_ID=your_business_id
# AIRTEL_API_KEY=your_airtel_key
# AIRTEL_MERCHANT_ID=your_merchant_id
```

### Testing the Payment Flow

1. **Start Backend:**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Test Booking:**
   - Navigate to Appointments page
   - Fill in consultation details
   - Click "Pay Consultation"
   - Select MTN or Airtel
   - Enter test phone number (e.g., 0700000000)
   - In mock mode, payment prompt appears immediately
   - Confirm on phone (simulated)
   - Enter confirmation code from system
   - Payment confirmed!

## Production Integration

### MTN Mobile Money (Collections API)

Replace API calls in `mobileMoneyService.js`:

```javascript
async function callMtnCollectionsApi(params) {
  const response = await fetch('https://api.mtn.com/momo/collections/v1_0/requesttopay', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.mtnApiKey}`,
      'Content-Type': 'application/json',
      'X-Reference-Id': params.externalId,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: 'RWF',
      externalId: params.externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: params.phoneNumber,
      },
      payerMessage: params.payerMessage,
      payeeNote: params.payeeNote,
    }),
  });
  
  return response.json();
}
```

### Airtel Money Integration

Similarly update `callAirtelPaymentApi()` with:
- Airtel API endpoint
- Authentication tokens
- Request format for Airtel API

### Bank Transfer Verification

Implement admin verification workflow:
1. Flag new bank transfers as "pending_verification"
2. Admin reviews bank reference number
3. Admin confirms transfer received
4. System marks appointment as paid
5. Customer notified

## Security Considerations

1. **Phone Number Validation**: Normalize and validate all phone numbers
2. **Confirmation Codes**: Generate random codes, verify before accepting
3. **SSL/TLS**: Always use HTTPS for payment endpoints
4. **PCI Compliance**: Don't store full account numbers (shown masked)
5. **Role-Based Access**: Only nutritionists manage payment accounts
6. **Payment Verification**: Poll payment provider to confirm before marking complete

## Monitoring & Logging

Track:
- Payment initiation attempts
- Confirmation failures
- Payment status checks
- Confirmation code mismatches
- Bank transfer recordings

## Error Handling

**Common Errors:**
- Invalid phone number format → Show format helper
- Payment provider timeout → Retry or cancel
- Confirmation code invalid → Suggest retry
- Network error → Show retry button

## Future Enhancements

1. **Automatic Bank Transfer Detection**: Connect to bank APIs to auto-verify transfers
2. **Payment Refunds**: Handle refunds if appointment cancelled
3. **Partial Payments**: Allow payment plans for expensive courses
4. **Receipts/Invoicing**: Generate PDF invoices
5. **Payment Analytics**: Track payment trends by method
6. **Payout Automation**: Auto-transfer earnings to doctor accounts
7. **Multi-Currency**: Support USD, EUR, etc.
