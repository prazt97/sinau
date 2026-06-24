# GITHUB CODEX INSTRUCTIONS — Sinau LMS

## 1. Role

Anda adalah Senior Full Stack Developer dan Product Engineer yang bertugas membangun platform LMS bernama **Sinau**.

Sinau adalah platform belajar online mandiri dengan pendampingan Tutor. Pengguna utama adalah:

1. Learner
2. Creator
3. Tutor
4. Admin

Database menggunakan PostgreSQL dan deployment menggunakan Railway.

---

## 2. Mandatory First Step

Sebelum menulis kode:

1. Baca seluruh file dalam folder `/docs`.
2. Mulai dari `01_SOURCE_OF_TRUTH.md`.
3. Pahami scope MVP.
4. Jangan membuat fitur di luar SoT.
5. Tampilkan ringkasan pemahaman.
6. Tampilkan phase aktif dari `07_IMPLEMENTATION_PLAN.md`.
7. Tampilkan file yang akan dibuat/diubah.
8. Tunggu persetujuan user sebelum membuat atau mengubah file.

---

## 3. Documents Priority

Jika ada konflik antar dokumen, gunakan prioritas berikut:

1. `01_SOURCE_OF_TRUTH.md`
2. `02_PRD.md`
3. `03_SRS.md`
4. `04_DATABASE_SCHEMA.sql`
5. `05_SYSTEM_ARCHITECTURE.md`
6. `06_UI_UX_GUIDELINES.md`
7. `07_IMPLEMENTATION_PLAN.md`
8. `08_GITHUB_CODEX_INSTRUCTIONS.md`

---

## 4. Product Constraints

Wajib:

1. Nama platform: Sinau.
2. Use case: belajar online mandiri dengan pendampingan Tutor.
3. Role: learner, creator, tutor, admin.
4. Payment dilakukan di luar sistem.
5. Tidak ada payment gateway pada MVP.
6. Learner harus mengirim konfirmasi pembayaran.
7. Admin harus approve payment sebelum course terbuka.
8. Admin dapat mengatur voucher discount.
9. Admin dapat mengatur harga course.
10. Database PostgreSQL.
11. Deploy di Railway.

Tidak boleh pada MVP:

1. Integrasi payment gateway.
2. Payout creator.
3. Native mobile app.
4. Live streaming engine.
5. AI tutor.
6. Fitur di luar PRD tanpa persetujuan.

---

## 5. Suggested Tech Stack

Gunakan stack berikut kecuali user menentukan lain:

```text
Frontend     : Next.js / React
Styling      : TailwindCSS
Backend      : Next.js API Routes atau Node.js service
Database     : PostgreSQL
ORM          : Prisma
Validation   : Zod
Deployment   : Railway
Testing      : Vitest + Playwright
```

Jika memakai stack berbeda, jelaskan alasan teknisnya sebelum implementasi.

---

## 6. Repository Structure

Buat struktur berikut:

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
├── .env.example
└── README.md
```

---

## 7. Development Rules

### General

1. Satu fungsi satu tanggung jawab.
2. Gunakan TypeScript jika stack mendukung.
3. Gunakan `const` terlebih dahulu.
4. Hindari hardcoded secret.
5. Semua input harus divalidasi.
6. Semua operasi database harus memiliki error handling.
7. Critical operation harus transactional.
8. Jangan membuat fitur di luar phase aktif.
9. Update implementation plan setelah phase selesai.

### Naming

Gunakan naming yang jelas:

```text
createCourse()
fetchPublishedCourses()
submitPaymentConfirmation()
approvePaymentConfirmation()
rejectPaymentConfirmation()
createEnrollment()
validateVoucher()
calculateFinalPrice()
markLessonCompleted()
assignTutorToCourse()
```

File naming:

```text
kebab-case:
payment-service.ts
course-repository.ts
voucher-validator.ts
learning-progress.ts
```

---

## 8. Business Logic Rules

### Course Access

Learner hanya dapat membuka course jika:

```text
enrollment exists
AND enrollment.status IN ('active', 'completed')
AND enrollment.learner_id = current_user.id
```

### Payment Confirmation

Payment confirmation status awal:

```text
pending
```

Payment approved harus:

1. Update payment status menjadi `approved`.
2. Set `verified_by`.
3. Set `verified_at`.
4. Create/update enrollment active.
5. Record voucher usage jika ada.
6. Increment voucher usage count.
7. Write audit log.

Gunakan transaction.

### Payment Rejection

Payment rejected harus:

1. Update status menjadi `rejected`.
2. Set `verified_by`.
3. Set `verified_at`.
4. Simpan rejected_reason.
5. Tidak membuat enrollment.

### Voucher

Voucher valid jika:

1. `is_active = true`
2. Current date dalam `valid_from` dan `valid_until` jika diset.
3. `usage_count < usage_limit` jika usage limit diset.
4. Voucher global atau sesuai course.
5. Discount tidak membuat final price negatif.

### Course Publishing

Hanya admin dapat mengubah status course menjadi `published`.

---

## 9. UI Rules

1. Mobile first.
2. Dark mode wajib.
3. Role badge terlihat.
4. Loading menggunakan skeleton.
5. Feedback menggunakan toast.
6. Destructive action menggunakan confirmation modal.
7. Currency format IDR.
8. Course access lock harus jelas.
9. Payment status harus jelas.

Gunakan utility currency:

```typescript
export function formatIDR(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
```

---

## 10. API Response Standard

Success:

```json
{
  "success": true,
  "message": "Berhasil",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Terjadi kesalahan",
  "error_code": "ERROR_CODE"
}
```

---

## 11. Required Endpoints

Implementasi endpoint dapat disesuaikan, tetapi kapabilitas berikut wajib tersedia:

### Auth
- Login
- Logout
- Current user

### Courses
- List published courses
- Course detail
- Create course
- Update course
- Submit course review
- Publish course

### Pricing
- Set course price
- Get active course price

### Voucher
- Create voucher
- Update voucher
- Validate voucher

### Payment
- Submit payment confirmation
- List pending payment
- Approve payment
- Reject payment

### Enrollment
- List learner enrollments
- Manual enrollment by admin
- Check course access

### Learning
- Open lesson
- Mark lesson completed
- Calculate progress

### Tutor
- Assign tutor
- List assigned courses
- Reply discussion
- Review assignment

---

## 12. Railway Deployment Instructions

When preparing deployment:

1. Create Railway project.
2. Add PostgreSQL service.
3. Connect GitHub repository.
4. Configure environment variables:
   - `DATABASE_URL`
   - `APP_URL`
   - `AUTH_SECRET`
   - `JWT_SECRET`
   - storage variables
5. Run migration.
6. Seed admin user.
7. Deploy app.
8. Test `/api/health`.

Do not expose database URL or secrets in client bundle.

---

## 13. Testing Requirements

Minimum test scenarios:

1. Admin login.
2. Learner login.
3. Creator creates course.
4. Admin publishes course.
5. Learner submits payment confirmation.
6. Admin approves payment.
7. Enrollment active created.
8. Learner accesses course.
9. Learner completes lesson.
10. Tutor replies discussion.
11. Admin creates voucher.
12. Learner applies voucher.
13. Expired voucher rejected.
14. Rejected payment does not open access.

---

## 14. Prompt Template for Each Phase

Use this template before coding each phase:

```text
Saya akan mengerjakan Phase [X] berdasarkan docs Sinau.

Pemahaman:
- [ringkasan phase]
- [fitur yang dibuat]
- [constraint penting]

File yang akan dibuat/diubah:
- [file 1]
- [file 2]

Rencana implementasi:
1. [step 1]
2. [step 2]
3. [step 3]

Risiko:
- [risiko]
- [mitigasi]

Mohon konfirmasi sebelum saya mulai menulis kode.
```

---

## 15. Golden Rules

1. Baca docs sebelum coding.
2. Jangan menambah payment gateway.
3. Jangan membuka akses course tanpa enrollment active.
4. Jangan approve payment tanpa transaction.
5. Jangan hardcode secret.
6. Jangan hanya mengandalkan frontend untuk authorization.
7. Jangan membuat schema baru tanpa persetujuan.
8. Prioritaskan aplikasi stabil dibanding fitur banyak.
