export const imageLibrary = {
  hero: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=2200&q=85',
  consultation: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
  doctorPatient: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1200&q=80',
  healthyPlate: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  maternal: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80',
  mealPlanning: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  clinic: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
  kitchen: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80',
  asifiweRuth: '/images/asifiwe-ruth.png',
};

export const categories = [
  'Diabetes management',
  'Hypertension nutrition',
  'Cancer nutrition support',
  'Child nutrition',
  'Maternal nutrition',
  'Healthy meal planning',
  'Disease prevention',
  'Nutrition through life stages',
  'Weight management',
  'General healthy eating',
];

export const consultationFee = 100; // RWF 100 for testing

export const nutritionists = [
  {
    id: 'asifiwe-ruth',
    name: 'ASIFIWE Ruth',
    title: 'Registered Nutrition Doctor',
    specialty: 'Nutrition education, consultation, and personalized healthcare support',
    email: 'ruthasifiwe@gmail.com',
    phone: '0787977326',
    rating: 4.9,
    sessions: 1840,
    nextSlot: 'Today, 14:30',
    image: imageLibrary.asifiweRuth,
  },
];

export const courses = [
  {
    id: 'diabetes-plate-method',
    title: 'Diabetes Plate Method Masterclass',
    category: 'Diabetes management',
    description:
      'Build blood sugar-friendly meals with practical portioning, label reading, and weekly planning tools.',
    thumbnail: imageLibrary.healthyPlate,
    instructor: 'ASIFIWE Ruth',
    createdBy: 'Admin',
    updatedBy: 'ASIFIWE Ruth',
    lessons: 12,
    duration: '4h 20m',
    level: 'Intermediate',
    rating: 4.9,
    students: 1240,
    progress: 68,
    price: 55000,
    videoUrl: 'https://www.youtube.com/embed/1nAKwH1C4v8',
    outcomes: ['Plate method confidence', 'Carbohydrate quality checks', 'Seven-day meal plan'],
  },
  {
    id: 'heart-smart-sodium',
    title: 'Heart Smart Sodium Reset',
    category: 'Hypertension nutrition',
    description:
      'Learn how to reduce sodium, increase potassium-rich foods, and cook satisfying meals for heart health.',
    thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
    instructor: 'ASIFIWE Ruth',
    createdBy: 'Admin',
    updatedBy: 'ASIFIWE Ruth',
    lessons: 9,
    duration: '3h 05m',
    level: 'Beginner',
    rating: 4.8,
    students: 910,
    progress: 34,
    price: 41000,
    videoUrl: 'https://www.youtube.com/embed/Q4yUlJV31Rk',
    outcomes: ['Low-sodium cooking swaps', 'Shopping checklist', 'Blood pressure nutrition tracker'],
  },
  {
    id: 'maternal-nutrition-pathway',
    title: 'Maternal Nutrition Pathway',
    category: 'Maternal nutrition',
    description:
      'Evidence-based guidance for pregnancy, postpartum recovery, lactation, and nutrient adequacy.',
    thumbnail: imageLibrary.maternal,
    instructor: 'ASIFIWE Ruth',
    createdBy: 'Admin',
    updatedBy: 'ASIFIWE Ruth',
    lessons: 14,
    duration: '5h 10m',
    level: 'All levels',
    rating: 4.9,
    students: 760,
    progress: 12,
    price: 69000,
    videoUrl: 'https://www.youtube.com/embed/fqhYBTg73fw',
    outcomes: ['Trimester-specific nutrition', 'Iron and folate routines', 'Postpartum meal support'],
  },
  {
    id: 'cancer-care-support',
    title: 'Nutrition Support During Cancer Care',
    category: 'Cancer nutrition support',
    description:
      'Support appetite, strength, digestion, and treatment tolerance with ASIFIWE Ruth-reviewed nutrition practices.',
    thumbnail: imageLibrary.consultation,
    instructor: 'ASIFIWE Ruth',
    createdBy: 'Admin',
    updatedBy: 'ASIFIWE Ruth',
    lessons: 11,
    duration: '4h 45m',
    level: 'Clinical',
    rating: 4.7,
    students: 430,
    progress: 0,
    price: 83000,
    videoUrl: 'https://www.youtube.com/embed/xyQY8a-ng6g',
    outcomes: ['Symptom-aware food choices', 'High-protein mini meals', 'Care team discussion guide'],
  },
  {
    id: 'family-meal-planning',
    title: 'Healthy Family Meal Planning',
    category: 'Healthy meal planning',
    description:
      'Design affordable weekly menus, prep balanced meals, and reduce decision fatigue at home.',
    thumbnail: imageLibrary.mealPlanning,
    instructor: 'ASIFIWE Ruth',
    createdBy: 'Admin',
    updatedBy: 'ASIFIWE Ruth',
    lessons: 8,
    duration: '2h 50m',
    level: 'Beginner',
    rating: 4.8,
    students: 1880,
    progress: 85,
    price: 35000,
    videoUrl: 'https://www.youtube.com/embed/0SPwwpruGIA',
    outcomes: ['Pantry planning', 'Balanced family plates', 'Budget shopping templates'],
  },
  {
    id: 'weight-management-science',
    title: 'Sustainable Weight Management',
    category: 'Weight management',
    description:
      'A respectful, habit-focused program for energy balance, satiety, movement, and long-term adherence.',
    thumbnail: imageLibrary.kitchen,
    instructor: 'ASIFIWE Ruth',
    createdBy: 'Admin',
    updatedBy: 'ASIFIWE Ruth',
    lessons: 10,
    duration: '3h 40m',
    level: 'All levels',
    rating: 4.7,
    students: 1320,
    progress: 42,
    price: 49000,
    videoUrl: 'https://www.youtube.com/embed/vuIlsN32WaE',
    outcomes: ['Satiety habits', 'Progress dashboards', 'Relapse prevention planning'],
  },
];

export const featuredVideos = [
  {
    id: 'video-1',
    title: 'Understanding Balanced Plates',
    nutritionist: 'ASIFIWE Ruth',
    embedUrl: 'https://www.youtube.com/embed/1nAKwH1C4v8',
  },
  {
    id: 'video-2',
    title: 'Meal Prep for Busy Families',
    nutritionist: 'ASIFIWE Ruth',
    embedUrl: 'https://www.youtube.com/embed/0SPwwpruGIA',
  },
];

export const appointments = [
  {
    id: 'APT-2048',
    patient: 'Maya Roberts',
    nutritionist: 'ASIFIWE Ruth',
    concern: 'Diabetes meal plan review',
    date: 'May 27, 2026',
    time: '10:30',
    status: 'Approved',
    payment: 'Paid',
  },
  {
    id: 'APT-2051',
    patient: 'Jean Ndayisenga',
    nutritionist: 'ASIFIWE Ruth',
    concern: 'Blood pressure nutrition consultation',
    date: 'May 28, 2026',
    time: '15:00',
    status: 'Pending',
    payment: 'Awaiting payment',
  },
  {
    id: 'APT-2057',
    patient: 'Aline Uwase',
    nutritionist: 'ASIFIWE Ruth',
    concern: 'Pregnancy nutrition support',
    date: 'May 30, 2026',
    time: '09:30',
    status: 'Approved',
    payment: 'Paid',
  },
];

export const payments = [
  {
    id: 'INV-9082',
    service: 'Initial nutrition consultation',
    amount: 105000,
    status: 'Confirmed',
    date: 'May 21, 2026',
  },
  {
    id: 'INV-9104',
    service: 'Diabetes Plate Method Masterclass',
    amount: 55000,
    status: 'Confirmed',
    date: 'May 23, 2026',
  },
  {
    id: 'INV-9120',
    service: 'Follow-up video consultation',
    amount: 63000,
    status: 'Processing',
    date: 'May 25, 2026',
  },
];

export const chatMessages = [
  {
    id: 'msg-1',
    sender: 'ASIFIWE Ruth',
    role: 'nutritionist',
    message: 'Your glucose notes look consistent. Please keep the evening snack protein-forward this week.',
    time: '09:12',
  },
  {
    id: 'msg-2',
    sender: 'Maya Roberts',
    role: 'patient',
    message: 'Thanks. I uploaded my meal photos and would like to review breakfast options.',
    time: '09:18',
  },
];

export const testimonials = [
  {
    quote:
      'The consultation felt clinical, kind, and practical. I left with a weekly plan I could actually follow.',
    name: 'Maya Roberts',
    role: 'Patient managing diabetes',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80',
  },
  {
    quote:
      'Our pediatric nutrition sessions helped my family build better routines without making food stressful.',
    name: 'Aline Uwase',
    role: 'Parent and course learner',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
  {
    quote:
      'The dashboard gives me appointments, payments, learning progress, and chat history in one calm place.',
    name: 'Jean Ndayisenga',
    role: 'Telehealth patient',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
];

export const adminMetrics = [
  { label: 'Active patients', value: '8,420', trend: '+18%' },
  { label: 'Active doctor', value: '1', trend: 'ASIFIWE Ruth' },
  { label: 'Course enrollments', value: '14,870', trend: '+24%' },
  { label: 'Monthly payments', value: 'RWF 115.4M', trend: '+16%' },
];
