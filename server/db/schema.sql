CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('admin', 'nutritionist', 'patient');
CREATE TYPE appointment_status AS ENUM ('pending', 'approved', 'rejected', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('awaiting_payment', 'processing', 'confirmed', 'failed', 'refunded');
CREATE TYPE payment_method_type AS ENUM ('mtn', 'airtel', 'bank', 'stripe');
CREATE TYPE payment_account_type AS ENUM ('mtn', 'airtel', 'bank');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE nutritionist_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  license_number TEXT,
  specialty TEXT,
  phone TEXT,
  profile_image_url TEXT,
  bio TEXT,
  rating NUMERIC(2, 1) DEFAULT 0,
  verified_at TIMESTAMPTZ
);

CREATE TABLE nutritionist_payment_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nutritionist_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  account_type payment_account_type NOT NULL,
  phone_number TEXT,
  account_number TEXT,
  account_holder_name TEXT,
  bank_name TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nutritionist_id UUID NOT NULL REFERENCES users(id),
  created_by_admin_id UUID REFERENCES users(id),
  updated_by_nutritionist_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  materials JSONB NOT NULL DEFAULT '[]'::jsonb,
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE course_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  percent_complete INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id),
  nutritionist_id UUID NOT NULL REFERENCES users(id),
  concern TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'awaiting_payment',
  video_room_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  appointment_id UUID REFERENCES appointments(id),
  course_id UUID REFERENCES courses(id),
  payment_method payment_method_type NOT NULL,
  stripe_payment_intent_id TEXT,
  mobile_money_request_id TEXT,
  phone_number TEXT,
  confirmation_code TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'RWF',
  status payment_status NOT NULL DEFAULT 'awaiting_payment',
  invoice_number TEXT UNIQUE,
  bank_reference TEXT,
  nutritionist_id UUID REFERENCES users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);
