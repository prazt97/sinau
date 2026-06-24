# SYSTEM ARCHITECTURE — Sinau LMS

## 1. Architecture Overview

Sinau menggunakan arsitektur web application modular dengan frontend, backend/API, PostgreSQL database, dan file storage. Deployment ditargetkan ke Railway.

```text
[Browser]
   |
   | HTTPS
   v
[Frontend Web App]
   |
   | API Request
   v
[Backend/API Service]
   |
   | ORM / SQL
   v
[PostgreSQL on Railway]
   |
   +--> [File Storage: proof payment, course files]
```

---

## 2. Recommended Stack

| Layer | Rekomendasi |
|---|---|
| Frontend | Next.js/React + TailwindCSS |
| Backend | Next.js API Routes atau Node.js service |
| Database | PostgreSQL di Railway |
| ORM | Prisma |
| Validation | Zod |
| Auth | Auth.js/JWT/session-based auth |
| File Upload | Storage adapter ke S3-compatible/Supabase Storage/Cloudinary |
| Deployment | Railway |
| Testing | Vitest + Playwright |
| Logging | Railway logs + structured app logs |

Catatan: Jika tim ingin lebih sederhana, Sinau dapat dibangun sebagai monolith Next.js di Railway, dengan API routes dan frontend dalam satu repository.

---

## 3. Logical Modules

```text
src/
├── app/
│   ├── auth/
│   ├── learner/
│   ├── creator/
│   ├── tutor/
│   └── admin/
├── components/
├── features/
│   ├── auth/
│   ├── courses/
│   ├── pricing/
│   ├── vouchers/
│   ├── payments/
│   ├── enrollments/
│   ├── learning-player/
│   ├── discussions/
│   ├── assessments/
│   └── reporting/
├── lib/
│   ├── db/
│   ├── auth/
│   ├── storage/
│   ├── validation/
│   └── utils/
└── server/
    ├── services/
    ├── repositories/
    └── policies/
```

---

## 4. Deployment Architecture on Railway

```text
Railway Project: sinau-production

Services:
1. sinau-web
   - Node.js app
   - Runs frontend + API
   - Environment variables configured in Railway

2. sinau-postgres
   - PostgreSQL database
   - Internal DATABASE_URL used by app

3. storage provider
   - External recommended for files
   - Examples: Supabase Storage, Cloudinary, S3-compatible
```

---

## 5. Environment Variables

```env
DATABASE_URL=
APP_URL=https://sinau.up.railway.app
APP_NAME=Sinau
AUTH_SECRET=
JWT_SECRET=
STORAGE_PROVIDER=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
MAX_UPLOAD_SIZE_MB=10
```

Do not commit `.env` to repository.

---

## 6. Authentication Flow

```text
User submits email/password
        |
Backend validates credentials
        |
Check user status = active
        |
Create secure session/JWT
        |
Redirect by role
```

Role redirect:

| Role | Default Route |
|---|---|
| learner | `/learner/dashboard` |
| creator | `/creator/dashboard` |
| tutor | `/tutor/dashboard` |
| admin | `/admin/dashboard` |

---

## 7. Authorization Model

Authorization must be enforced in backend/API.

### Policy Examples

1. Learner can only access own enrollments.
2. Learner can only open lessons from active enrollment.
3. Creator can only edit own courses unless admin.
4. Tutor can only access assigned courses.
5. Admin can access all records.
6. Only admin can approve/reject payment.
7. Only admin can publish course.
8. Only admin can manage voucher and pricing.

---

## 8. Payment Verification Architecture

Payment gateway is not used.

```text
Learner selects course
        |
Learner enters voucher code
        |
System calculates final amount
        |
Learner transfers outside system
        |
Learner submits payment confirmation + proof
        |
Payment status = pending
        |
Admin reviews proof
        |
Approved?
  | Yes -> call approve_payment_and_create_enrollment()
  | No  -> set status rejected + reason
        |
Learner gets access only if enrollment active
```

Approval must be atomic. The database function in `04_DATABASE_SCHEMA.sql` is designed to update payment, create enrollment, record voucher usage, increment voucher count, and write audit log in a single transaction.

---

## 9. Course Access Control

Every request to lesson content must check:

1. User is authenticated.
2. User role is learner/admin/tutor with valid relation.
3. If learner:
   - Enrollment exists.
   - Enrollment status is active/completed.
   - Course matches enrollment.
4. Lesson is published or user is creator/admin.

---

## 10. Data Flow — Learning Progress

```text
Learner opens lesson
        |
Create/update lesson_progress = in_progress
        |
Learner clicks "Tandai Selesai"
        |
lesson_progress = completed
        |
System recalculates enrollment.progress_percent
        |
If all lessons completed, enrollment.status = completed
```

Progress formula:

```text
completed published lessons / total published lessons * 100
```

---

## 11. API Design Principles

1. Use RESTful endpoints or server actions consistently.
2. Validate all inputs with schema validation.
3. Return consistent JSON responses.
4. Use pagination for list endpoints.
5. Never trust role data from frontend.
6. Wrap critical operations in transaction.
7. Use service layer for business logic.
8. Use repository layer for database access.

---

## 12. API Endpoint Overview

### Auth

| Method | Endpoint | Role |
|---|---|---|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Authenticated |
| GET | `/api/auth/me` | Authenticated |

### Courses

| Method | Endpoint | Role |
|---|---|---|
| GET | `/api/courses` | Public/Auth |
| GET | `/api/courses/:slug` | Public/Auth |
| POST | `/api/courses` | Creator/Admin |
| PATCH | `/api/courses/:id` | Creator owner/Admin |
| POST | `/api/courses/:id/submit-review` | Creator owner |
| POST | `/api/courses/:id/publish` | Admin |

### Pricing & Voucher

| Method | Endpoint | Role |
|---|---|---|
| POST | `/api/admin/course-prices` | Admin |
| POST | `/api/admin/vouchers` | Admin |
| GET | `/api/vouchers/validate?code=&courseId=` | Learner/Admin |

### Payment

| Method | Endpoint | Role |
|---|---|---|
| POST | `/api/payments/confirmations` | Learner |
| GET | `/api/admin/payments` | Admin |
| POST | `/api/admin/payments/:id/approve` | Admin |
| POST | `/api/admin/payments/:id/reject` | Admin |

### Learning

| Method | Endpoint | Role |
|---|---|---|
| GET | `/api/learner/enrollments` | Learner |
| GET | `/api/learner/courses/:id/player` | Learner |
| POST | `/api/learner/lessons/:id/progress` | Learner |

### Tutor

| Method | Endpoint | Role |
|---|---|---|
| GET | `/api/tutor/courses` | Tutor |
| GET | `/api/tutor/courses/:id/learners` | Tutor |
| POST | `/api/discussions/:id/replies` | Tutor/Learner/Admin |
| POST | `/api/assignments/:id/review` | Tutor/Admin |

---

## 13. Security Architecture

### Authentication
- Use secure password hashing.
- Use HTTP-only cookies for session if possible.
- Rotate secrets when compromised.

### Authorization
- Backend policy checks mandatory.
- Frontend route guard is only UX enhancement.

### Data Protection
- Payment proof access restricted.
- File URL should be signed for private files.
- Sensitive logs must not expose secrets.

### Input Validation
- Validate request body.
- Sanitize rich text content.
- Limit upload size and allowed MIME types.

### Audit
Audit log for:
- Admin approve/reject payment.
- Admin changes price.
- Admin creates/updates voucher.
- Admin publishes course.
- Admin manual enrollment.
- Role changes.

---

## 14. Error Handling Standard

Response format:

```json
{
  "success": false,
  "message": "Pembayaran tidak ditemukan",
  "error_code": "PAYMENT_NOT_FOUND"
}
```

Success format:

```json
{
  "success": true,
  "message": "Pembayaran berhasil disetujui",
  "data": {}
}
```

---

## 15. Suggested Repository Structure

```text
sinau/
├── docs/
│   ├── 01_SOURCE_OF_TRUTH.md
│   ├── 02_PRD.md
│   ├── 03_SRS.md
│   ├── 04_DATABASE_SCHEMA.sql
│   ├── 05_SYSTEM_ARCHITECTURE.md
│   ├── 06_UI_UX_GUIDELINES.md
│   ├── 07_IMPLEMENTATION_PLAN.md
│   └── 08_GITHUB_CODEX_INSTRUCTIONS.md
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   └── server/
├── public/
├── tests/
├── package.json
├── railway.json
├── Dockerfile
└── README.md
```

---

## 16. Railway Deployment Notes

1. Create Railway project.
2. Add PostgreSQL service.
3. Add web app service from GitHub repo.
4. Configure environment variables.
5. Run database migrations.
6. Deploy.
7. Verify healthcheck endpoint.
8. Test login, catalog, payment confirmation, admin approval, and learner access.

Healthcheck endpoint:

```text
GET /api/health
Response: { "status": "ok", "app": "Sinau" }
```
