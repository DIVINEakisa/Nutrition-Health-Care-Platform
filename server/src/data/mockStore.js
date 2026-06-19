import crypto from 'crypto';

export const roles = {
  ADMIN: 'admin',
  NUTRITIONIST: 'nutritionist',
  PATIENT: 'patient',
};

export const users = [
  {
    id: 'usr-admin',
    name: 'Platform Admin',
    email: 'admin@nutricarepro.health',
    passwordHash: '$2a$10$development',
    role: roles.ADMIN,
    status: 'active',
  },
  {
    id: 'usr-nutritionist',
    name: 'ASIFIWE Ruth',
    email: 'ruthasifiwe@gmail.com',
    passwordHash: '$2a$10$development',
    role: roles.NUTRITIONIST,
    status: 'verified',
    phone: '0787977326',
    specialty: 'Nutrition education, consultation, and personalized healthcare support',
    profileImageUrl: '/images/asifiwe-ruth.png',
  },
  {
    id: 'usr-patient',
    name: 'Maya Roberts',
    email: 'maya@example.com',
    passwordHash: '$2a$10$development',
    role: roles.PATIENT,
    status: 'active',
  },
];

export const courses = [
  {
    id: 'diabetes-plate-method',
    title: 'Diabetes Plate Method Masterclass',
    category: 'Diabetes management',
    description: 'Build blood sugar-friendly meals with practical portioning and weekly planning.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    nutritionistId: 'usr-nutritionist',
    createdByAdminId: 'usr-admin',
    updatedByNutritionistId: 'usr-nutritionist',
    priceCents: 3900,
    status: 'published',
    lessons: [
      {
        id: 'les-1',
        title: 'Balanced plate foundations',
        videoUrl: 'https://www.youtube.com/embed/1nAKwH1C4v8',
        materials: ['plate-method.pdf', 'meal-log-template.pdf'],
      },
    ],
  },
];

export const appointments = [
  {
    id: 'apt-2048',
    patientId: 'usr-patient',
    nutritionistId: 'usr-nutritionist',
    concern: 'Diabetes meal plan review',
    date: '2026-05-27',
    time: '10:30',
    status: 'approved',
    paymentStatus: 'paid',
  },
];

export const payments = [
  {
    id: 'pay-9082',
    userId: 'usr-patient',
    appointmentId: 'apt-2048',
    amountCents: 7500,
    status: 'confirmed',
    invoiceNumber: 'INV-9082',
  },
];

export const messages = [
  {
    id: 'msg-1',
    appointmentId: 'apt-2048',
    senderId: 'usr-nutritionist',
    body: 'Your glucose notes look consistent. Please keep the evening snack protein-forward this week.',
    createdAt: new Date().toISOString(),
  },
];

// ASIFIWE Ruth's payment account - All payments go here
export const doctorPaymentAccounts = {
  'usr-nutritionist': {
    id: 'acc-asifiwe',
    nutritionistId: 'usr-nutritionist',
    name: 'ASIFIWE Ruth',
    accountType: 'mtn',
    phoneNumber: '0787977326',
    phoneNumberFormatted: '+250787977326',
    verified: true,
    verifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
};

export function makeId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}
