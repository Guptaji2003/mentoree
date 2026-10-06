# Mentoree - Production-Grade Verified Expert Mentorship Marketplace

Zero-fail, verified 1:1 mentorship marketplace built specifically for Indian college students. Powered by Next.js 14 App Router, PostgreSQL, Prisma, Argon2id, Jose JWT, and Razorpay.

---

## 🏛 Architecture & Engineering Invariants

1. **Modular Monolith**: All business logic encapsulated under `src/server/modules/{auth,mentors,verification,availability,bookings,payments,reviews,notifications,admin}`. Route handlers remain thin adapters.
2. **Server-Authoritative Pricing & State**: Frontend never dictates prices, payouts, or user identity. All sessions and roles are cryptographically derived server-side.
3. **Database-Level Atomic Slot Holds**: High-concurrency 10-minute slot locks enforced directly in PostgreSQL via atomic update transactions. No BullMQ or Redlock required.
4. **Argon2id + Jose HS256 Auth**: Passwords hashed with true Argon2id. 15-minute access JWTs in HttpOnly cookies, 7-day refresh tokens rotated on every request and stored as SHA-256 hashes with automatic token theft/reuse detection.
5. **Idempotent Webhook Processing**: Razorpay webhooks cryptographically verified using `crypto.timingSafeEqual` with atomic `WebhookLog` deduplication.
6. **Zero Fallback Secrets**: Strict Zod-based startup validation (`src/server/env.ts`).

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- Node.js 20+
- PostgreSQL database (Neon, Supabase, or local Docker)

### 2. Installation & Database Setup
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Copy environment file
cp .env.example .env

# 3. Push schema to database
npx prisma db push

# 4. Seed database with Admin, 5 Verified Mentors (2 weeks slots), and Students
npx prisma db seed

# 5. Start development server
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

---

## 🔑 Environment Variables

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (Neon / Supabase / Local) |
| `JWT_SECRET` | Secret key for 15-minute access JWTs (min 32 chars) |
| `JWT_REFRESH_SECRET` | Secret key for 7-day refresh tokens |
| `RAZORPAY_KEY_ID` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret for HMAC SHA-256 verification |
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key for private S3 verification bucket |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Access Key |
| `AWS_S3_BUCKET` | S3 bucket name for mentor documents |
| `AWS_REGION` | AWS Region (default `ap-south-1`) |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `RESEND_FROM_EMAIL` | Sender address (e.g., `noreply@mentoree.live`) |
| `CRON_SECRET` | Secret bearer token for Vercel Cron endpoints |
| `UPSTASH_REDIS_REST_URL` | *(Optional)* Upstash REST URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN`| *(Optional)* Upstash REST token |

---

## 🧪 Testing

```bash
# Run unit & module security tests
npm run test

# Run Playwright E2E test suite
npm run test:e2e
```

---

## 📖 Operational Runbooks

### 1. Mentor Verification Runbook
1. Admin logs into the system using seeded credentials (`admin@mentoree.com`).
2. Navigate to Admin Console (`GET /api/admin/verifications`).
3. Inspect uploaded corporate documents (presigned S3 viewer) and corporate email domain verification badge.
4. Click **Approve** (`POST /api/admin/verifications/[id]/approve`) to publish mentor to the public directory and notify mentor via email, or **Reject** with mandatory reason.

### 2. Cancellation & Refund Runbook
- **Automated Policy (`src/server/modules/payments/refund-policy.ts`)**:
  - `> 24 hours` before session start: 100% full refund via Razorpay refund API. Slot auto-released to `AVAILABLE`.
  - `6 - 24 hours` before session start: 50% partial refund.
  - `< 6 hours` before session start: Non-refundable (slot released).
- **Manual Admin Refund**:
  - Route: `POST /api/admin/refunds` with `{ paymentId, amountINR, reason }`.

### 3. Mentor Payouts Runbook
1. When a mentorship session concludes, the mentor marks it **COMPLETED** (`POST /api/bookings/[id]/complete`).
2. The system automatically creates a `Payout` row with `status: PENDING` and net mentor amount (80% share).
3. Admin views pending payouts via `GET /api/admin/payouts`.
4. Admin completes manual bank/UPI transfer and clicks **Mark Paid** (`POST /api/admin/payouts/[id]/mark-paid`) which creates an immutable audit trail.

---

## 📦 Seeded Accounts for Testing

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@mentoree.com` | `MentoreePass123!` |
| **Mentor 1 (Google)** | `mentor1@google.com` | `MentoreePass123!` |
| **Mentor 2 (Stripe)** | `mentor2@stripe.com` | `MentoreePass123!` |
| **Student 1** | `student1@iitdelhi.ac.in` | `MentoreePass123!` |
| **Student 2** | `student2@nittrichy.ac.in` | `MentoreePass123!` |
