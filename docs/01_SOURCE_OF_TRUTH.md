# SOURCE OF TRUTH — Sinau Learning Management System

## 1. Identitas Produk

**Nama platform:** Sinau  
**Jenis produk:** Learning Management System (LMS) berbasis web  
**Tujuan utama:** Menyediakan platform belajar online secara mandiri dengan pendampingan oleh Tutor.  
**Model bisnis:** Learner membeli akses course. Pembayaran dilakukan di luar sistem. Learner mengunggah atau mengisi konfirmasi pembayaran. Admin memverifikasi pembayaran dan membuka akses course.

---

## 2. Prinsip Produk

Sinau harus menjadi LMS yang sederhana, terpercaya, dan mudah dioperasikan oleh learner, creator, tutor, dan admin.

Prinsip utama:

1. **Self-paced learning first** — learner dapat belajar mandiri berdasarkan modul, lesson, video, materi, dan quiz.
2. **Tutor-assisted learning** — tutor membantu learner melalui diskusi, review tugas, mentoring, dan feedback.
3. **Manual payment verification** — tidak ada integrasi payment gateway pada MVP.
4. **Admin-controlled access** — course hanya terbuka setelah admin menyetujui pembayaran atau memberikan akses manual.
5. **Creator-friendly** — creator dapat membuat dan mengelola konten course.
6. **Role-aware experience** — setiap role memiliki dashboard, menu, dan hak akses berbeda.
7. **PostgreSQL-first** — database menggunakan PostgreSQL dan dideploy di Railway.
8. **MVP stable over feature overload** — fitur inti harus berjalan stabil sebelum fitur lanjutan.

---

## 3. Role Pengguna

| Role | Deskripsi |
|---|---|
| Learner | Pengguna yang membeli course, belajar mandiri, mengerjakan quiz/tugas, berdiskusi dengan tutor, dan melihat progres belajar. |
| Creator | Pengguna yang membuat course, module, lesson, quiz, assignment, dan materi belajar. |
| Tutor | Pengguna yang mendampingi learner, menjawab diskusi, memberi feedback tugas, dan memantau progres learner. |
| Admin | Pengelola platform yang mengatur user, course, harga, voucher diskon, pembayaran manual, enrollment, dan laporan operasional. |

---

## 4. Scope MVP

### In Scope

1. Authentication dan role-based access control.
2. Dashboard sesuai role.
3. Course catalog untuk learner.
4. Detail course dan preview informasi course.
5. Course content management oleh creator.
6. Module dan lesson management.
7. Enrollment learner.
8. Manual payment confirmation.
9. Payment verification oleh admin.
10. Course access unlock setelah pembayaran disetujui.
11. Voucher discount management oleh admin.
12. Course price setting oleh admin.
13. Learning progress tracking.
14. Discussion atau tutor support per course.
15. Quiz sederhana.
16. Assignment submission dan tutor feedback.
17. Basic reporting untuk admin.
18. PostgreSQL database.
19. Deployment ke Railway.

### Out of Scope MVP

1. Payment gateway.
2. Auto settlement payment.
3. Native mobile app.
4. Live streaming bawaan.
5. Marketplace payout creator.
6. Multi-currency.
7. Gamification kompleks.
8. AI tutor.
9. Certificate blockchain.
10. SCORM/xAPI advanced integration.

---

## 5. Modul Utama

| Modul | Pemilik Utama | Tujuan |
|---|---|---|
| Auth & User Management | Admin | Login, role, status user, profil pengguna. |
| Course Catalog | Learner | Melihat daftar course, harga, diskon, dan detail course. |
| Course Builder | Creator | Membuat course, module, lesson, quiz, dan assignment. |
| Pricing & Voucher | Admin | Mengatur harga course dan voucher diskon. |
| Manual Payment | Learner/Admin | Learner konfirmasi bayar, admin verifikasi. |
| Enrollment & Access | Admin/System | Membuka akses course setelah payment approved. |
| Learning Player | Learner | Mengakses materi dan menandai lesson selesai. |
| Tutor Support | Tutor/Learner | Diskusi, feedback, dan pendampingan. |
| Assessment | Creator/Tutor/Learner | Quiz, assignment, submission, feedback. |
| Reporting | Admin | Laporan learner, enrollment, pembayaran, dan progres. |

---

## 6. Workflow Utama

### 6.1 Learner Membeli Course

1. Learner login.
2. Learner melihat course catalog.
3. Learner membuka detail course.
4. Learner memilih course.
5. Sistem menampilkan harga normal, harga setelah diskon, dan instruksi pembayaran manual.
6. Learner melakukan pembayaran di luar sistem.
7. Learner mengisi konfirmasi pembayaran:
   - Course
   - Nominal bayar
   - Bank/payment method
   - Tanggal bayar
   - Nama pengirim
   - Upload bukti pembayaran
   - Kode voucher jika ada
8. Status pembayaran menjadi `pending`.
9. Admin melakukan verifikasi.
10. Jika valid, status pembayaran menjadi `approved`.
11. Sistem membuat enrollment aktif.
12. Learner dapat mengakses course.
13. Jika tidak valid, status pembayaran menjadi `rejected` dan learner dapat mengirim ulang konfirmasi.

### 6.2 Creator Membuat Course

1. Creator login.
2. Creator membuat course draft.
3. Creator menambahkan module.
4. Creator menambahkan lesson.
5. Creator menambahkan quiz/assignment jika diperlukan.
6. Creator submit course untuk review.
7. Admin review dan publish course.
8. Course tampil di catalog.

### 6.3 Tutor Mendampingi Learner

1. Tutor login.
2. Tutor melihat daftar course/learner yang ditugaskan.
3. Tutor memantau progress learner.
4. Tutor menjawab diskusi.
5. Tutor memberi feedback assignment.
6. Tutor menandai follow-up jika learner membutuhkan pendampingan.

---

## 7. Status Definition

### Course Status

| Status | Arti |
|---|---|
| draft | Course masih disusun creator. |
| review | Course menunggu review admin. |
| published | Course tersedia di catalog. |
| archived | Course disembunyikan dari catalog. |

### Payment Status

| Status | Arti |
|---|---|
| pending | Konfirmasi pembayaran menunggu verifikasi admin. |
| approved | Pembayaran valid dan akses course dibuka. |
| rejected | Pembayaran ditolak. |
| cancelled | Pembayaran dibatalkan. |

### Enrollment Status

| Status | Arti |
|---|---|
| active | Learner aktif mengikuti course. |
| completed | Learner menyelesaikan course. |
| suspended | Akses learner dihentikan sementara. |

### Lesson Progress Status

| Status | Arti |
|---|---|
| not_started | Lesson belum dibuka. |
| in_progress | Lesson sedang dipelajari. |
| completed | Lesson selesai. |

---

## 8. Acceptance Criteria Global

1. Setiap user hanya dapat mengakses fitur sesuai role.
2. Learner tidak dapat membuka lesson premium sebelum payment approved.
3. Admin dapat mengubah harga course.
4. Admin dapat membuat, menonaktifkan, dan membatasi voucher.
5. Voucher dapat mengurangi harga sesuai aturan.
6. Konfirmasi pembayaran tersimpan lengkap dengan bukti pembayaran.
7. Admin dapat approve/reject pembayaran.
8. Enrollment otomatis aktif setelah pembayaran approved.
9. Creator dapat membuat course, module, dan lesson.
10. Tutor dapat melihat learner yang didampingi dan memberi feedback.
11. Progress belajar learner tersimpan.
12. Aplikasi dapat berjalan di Railway dengan PostgreSQL.
13. Tidak ada secret yang hardcoded di frontend/backend.
14. Semua operasi database memiliki error handling.
15. UI responsive, mobile first, dan mendukung dark mode.

---

## 9. Tech Stack Referensi

| Layer | Teknologi |
|---|---|
| Frontend | React atau Next.js, TailwindCSS |
| Backend | Node.js + Express/NestJS atau Next.js API routes |
| Database | PostgreSQL |
| ORM | Prisma atau Drizzle |
| Storage | Railway volume/object storage eksternal, Supabase Storage, S3-compatible storage, atau Cloudinary untuk bukti pembayaran dan materi |
| Auth | Auth.js, JWT, Clerk, Supabase Auth, atau custom session |
| Deployment | Railway |
| File Upload | Multer/upload adapter ke storage |
| Validation | Zod |
| Testing | Vitest/Jest + Playwright |
| Monitoring | Railway logs + basic app logging |

Catatan: stack final dapat disesuaikan dengan keputusan teknis tim, tetapi database dan deployment mengikuti mandat: PostgreSQL dan Railway.

---

## 10. Prinsip Desain UI

Sinau mengikuti prinsip SaaS modern:

1. Clean & professional.
2. Mobile first.
3. Minimal cognitive load.
4. Role-aware UI.
5. Dashboard ringkas.
6. Skeleton loader untuk loading utama.
7. Toast notification untuk feedback.
8. Confirmation modal untuk destructive action.
9. Dark mode tersedia.
10. Format uang menggunakan IDR: `Rp 1.000.000`.

---

## 11. Source of Truth Rule

Dokumen ini menjadi rujukan tertinggi untuk pengembangan Sinau. Jika ada konflik antar dokumen:

1. `01_SOURCE_OF_TRUTH.md`
2. `02_PRD.md`
3. `03_SRS.md`
4. `04_DATABASE_SCHEMA.sql`
5. `05_SYSTEM_ARCHITECTURE.md`
6. `06_UI_UX_GUIDELINES.md`
7. `07_IMPLEMENTATION_PLAN.md`
8. `08_GITHUB_CODEX_INSTRUCTIONS.md`

Perubahan scope, role, database, dan payment flow harus disetujui Product Owner sebelum diimplementasikan.
