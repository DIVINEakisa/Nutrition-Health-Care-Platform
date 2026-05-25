# Architecture Notes

## Roles

- Admin: manages users, nutritionists, courses, analytics, appointments, payments, and moderation.
- Registered Nutritionist: manages courses, lessons, YouTube videos, schedules, appointments, patient communication, and payments.
- User/Patient: manages profile, books appointments, pays for consultations, joins online sessions, chats with nutritionists, and tracks course progress.

## Data Model

The PostgreSQL schema includes:

- `users`
- `nutritionist_profiles`
- `courses`
- `lessons`
- `course_progress`
- `appointments`
- `payments`
- `messages`

## Integration Plan

- Stripe: create payment intents before appointment confirmation or course enrollment.
- Cloudinary: upload course thumbnails and nutrition learning images.
- Socket.io: power live chat, notifications, and consultation room presence.
- JWT: protect role-specific dashboards and API operations.

## Production Hardening

- Replace in-memory data with repository/service methods backed by PostgreSQL.
- Add refresh tokens and password reset email delivery.
- Add Stripe webhooks for definitive payment confirmation.
- Add Cloudinary signed upload presets for direct client upload.
- Add audit logging for admin and nutritionist actions.
- Add tests for authorization, appointment state transitions, payment confirmation, and course moderation.

