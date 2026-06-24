# SOFTWARE REQUIREMENTS SPECIFICATION — Sinau LMS

## 1. Purpose

Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional Sinau LMS sebagai acuan teknis untuk pengembangan, testing, deployment, dan maintenance.

---

## 2. Product Scope

Sinau adalah LMS berbasis web untuk pembelajaran mandiri dengan pendampingan tutor. Sistem mendukung learner, creator, tutor, dan admin. Pembayaran dilakukan manual di luar sistem, sedangkan Sinau mencatat konfirmasi pembayaran, memfasilitasi verifikasi admin, dan membuka akses course setelah pembayaran disetujui.

---

## 3. User Classes

| User Class | Capabilities |
|---|---|
| Learner | Browse course, submit payment confirmation, access enrolled course, track progress, submit assessment, discuss with tutor. |
| Creator | Create and manage course content, submit course for review. |
| Tutor | Monitor assigned learners, answer discussions, review assignments. |
| Admin | Manage users, courses, pricing, vouchers, payments, enrollments, tutor assignments, and reports. |

---

## 4. System Context

Sinau terdiri dari:

1. Web frontend.
2. Backend/API service.
3. PostgreSQL database.
4. File storage untuk materi dan bukti pembayaran.
5. Railway deployment runtime.

Tidak ada payment gateway. Semua transaksi pembayaran terjadi di luar Sinau.

---

## 5. Assumptions and Dependencies

1. Semua harga menggunakan IDR.
2. Learner bertanggung jawab melakukan transfer/manual payment di luar sistem.
3. Admin bertanggung jawab memvalidasi bukti pembayaran.
4. Bukti pembayaran disimpan di file storage.
5. Database utama adalah PostgreSQL.
6. Aplikasi dideploy di Railway.
7. Setiap user memiliki satu role utama.
8. Admin dapat membuat enrollment manual untuk kebutuhan operasional.

---

## 6. Functional Requirements

### SRS-FR-001 — Authentication

**Description:** Sistem harus menyediakan login dan logout.  
**Input:** Email dan password.  
**Process:** Validasi credential dan buat session.  
**Output:** User masuk ke dashboard sesuai role.  
**Acceptance Criteria:**
- Credential invalid menampilkan error.
- User inactive tidak dapat login.
- Session valid tersimpan sesuai konfigurasi.

### SRS-FR-002 — Role-Based Dashboard

**Description:** Setiap role memiliki dashboard berbeda.  
**Acceptance Criteria:**
- Learner masuk ke learner dashboard.
- Creator masuk ke creator dashboard.
- Tutor masuk ke tutor dashboard.
- Admin masuk ke admin dashboard.

### SRS-FR-003 — Course Catalog

**Description:** Sistem menampilkan course published.  
**Acceptance Criteria:**
- Course draft/review/archived tidak muncul.
- Search dan filter berjalan.
- Harga tampil dalam format IDR.

### SRS-FR-004 — Course Detail

**Description:** Learner dapat melihat detail course.  
**Acceptance Criteria:**
- Detail menampilkan title, description, learning outcomes, curriculum, tutor/creator, price, dan payment instruction.
- Lesson premium tidak dapat dibuka sebelum enrolled.

### SRS-FR-005 — Course Creation

**Description:** Creator dapat membuat course.  
**Acceptance Criteria:**
- Course baru berstatus draft.
- Field wajib tervalidasi.
- Creator hanya dapat mengubah course miliknya kecuali admin.

### SRS-FR-006 — Module Management

**Description:** Creator dapat mengelola module.  
**Acceptance Criteria:**
- Module memiliki urutan.
- Module harus terhubung ke course.
- Module dapat ditambah, diubah, dihapus jika course belum archived.

### SRS-FR-007 — Lesson Management

**Description:** Creator dapat mengelola lesson.  
**Acceptance Criteria:**
- Lesson memiliki tipe: text, video, file, embed.
- Lesson memiliki urutan.
- Lesson wajib berada dalam module.

### SRS-FR-008 — Course Review and Publishing

**Description:** Admin mereview dan publish course.  
**Acceptance Criteria:**
- Creator dapat submit course ke review.
- Admin dapat approve menjadi published.
- Admin dapat meminta revisi.

### SRS-FR-009 — Course Price Setting

**Description:** Admin dapat mengatur harga course.  
**Acceptance Criteria:**
- Harga tidak boleh negatif.
- Harga aktif digunakan di catalog dan payment.
- Perubahan harga menyimpan timestamp.

### SRS-FR-010 — Voucher Management

**Description:** Admin dapat membuat dan mengatur voucher.  
**Acceptance Criteria:**
- Kode voucher unik.
- Voucher expired tidak valid.
- Voucher inactive tidak valid.
- Voucher usage limit dihitung.
- Voucher dapat berlaku global atau course-specific.

### SRS-FR-011 — Voucher Validation

**Description:** Learner dapat menggunakan voucher pada payment confirmation.  
**Acceptance Criteria:**
- Sistem menghitung final amount.
- Discount fixed tidak membuat amount negatif.
- Discount percentage maksimal 100%.
- Voucher usage tercatat setelah payment approved.

### SRS-FR-012 — Payment Confirmation

**Description:** Learner mengirim konfirmasi pembayaran.  
**Acceptance Criteria:**
- Payment status default pending.
- Bukti pembayaran wajib diupload atau disediakan sesuai konfigurasi.
- Learner dapat melihat status payment.

### SRS-FR-013 — Payment Verification

**Description:** Admin approve/reject pembayaran.  
**Acceptance Criteria:**
- Approve membuat enrollment active.
- Reject menyimpan alasan.
- Payment approved tidak dapat diapprove ulang.
- Enrollment tidak duplikat.

### SRS-FR-014 — Enrollment Management

**Description:** Sistem mengelola akses course learner.  
**Acceptance Criteria:**
- Learner hanya dapat mengakses enrolled course.
- Admin dapat membuat enrollment manual.
- Enrollment memiliki status active/completed/suspended.

### SRS-FR-015 — Learning Player

**Description:** Learner mengakses course content.  
**Acceptance Criteria:**
- Module dan lesson tampil sesuai urutan.
- Lesson completed menyimpan progress.
- Progress course dihitung otomatis.

### SRS-FR-016 — Quiz

**Description:** Learner mengerjakan quiz.  
**Acceptance Criteria:**
- Quiz hanya tersedia untuk learner enrolled.
- Submission tersimpan.
- Skor tersimpan jika auto-grade tersedia.

### SRS-FR-017 — Assignment

**Description:** Learner mengirim tugas.  
**Acceptance Criteria:**
- Submission dapat berupa text/file/link.
- Tutor dapat memberi feedback dan score.
- Learner dapat melihat feedback.

### SRS-FR-018 — Discussion

**Description:** Learner dan tutor dapat berdiskusi.  
**Acceptance Criteria:**
- Learner dapat membuat thread di enrolled course.
- Tutor assigned dapat membalas.
- Admin dapat melihat semua diskusi.

### SRS-FR-019 — Tutor Assignment

**Description:** Admin assign tutor ke course.  
**Acceptance Criteria:**
- Tutor hanya melihat course assigned.
- Admin dapat mengganti tutor.
- Assignment aktif/nonaktif tersedia.

### SRS-FR-020 — Admin Reporting

**Description:** Admin melihat ringkasan operasional.  
**Acceptance Criteria:**
- Dashboard menampilkan total learner, course, pending payment, approved payment, revenue, dan enrollment.
- Filter by date range dan course tersedia.

---

## 7. Non-Functional Requirements

### Performance

- Halaman dashboard utama load dalam < 3 detik pada koneksi normal.
- Query list menggunakan pagination atau limit.
- Search besar menggunakan debounce.
- File upload memiliki batas ukuran sesuai konfigurasi.

### Security

- Password disimpan menggunakan mekanisme auth yang aman.
- Semua endpoint API memvalidasi session.
- Role authorization dicek di backend, bukan hanya frontend.
- File bukti pembayaran hanya dapat diakses learner terkait dan admin.
- Tidak ada secret di repository.
- Input divalidasi server-side.

### Reliability

- Operasi payment approval harus atomic.
- Enrollment tidak boleh duplikat.
- Jika upload bukti gagal, payment confirmation tidak boleh dianggap complete.
- Error harus dicatat di log.

### Usability

- UI mobile first.
- Feedback menggunakan toast.
- Loading menggunakan skeleton.
- Destructive action menggunakan confirmation modal.
- Bahasa utama: Indonesia.

### Maintainability

- Struktur folder modular.
- Satu fungsi satu tanggung jawab.
- Validasi menggunakan schema validation.
- Naming konsisten.
- Database migration versioned.

### Compatibility

- Browser modern: Chrome, Edge, Safari, Firefox versi terbaru.
- Responsive minimal 320px width.
- Railway sebagai deployment platform.

---

## 8. Data Requirements

Entitas utama:

1. users
2. courses
3. course_prices
4. vouchers
5. voucher_usages
6. modules
7. lessons
8. enrollments
9. payment_confirmations
10. tutor_assignments
11. discussions
12. discussion_replies
13. quizzes
14. quiz_questions
15. quiz_submissions
16. assignments
17. assignment_submissions
18. lesson_progress
19. audit_logs

---

## 9. Business Rules

1. Course access hanya terbuka jika learner memiliki enrollment active.
2. Enrollment active dapat dibuat melalui payment approved atau manual admin.
3. Payment gateway tidak boleh ditambahkan di MVP.
4. Voucher hanya memengaruhi nominal yang harus dibayar, bukan proses pembayaran.
5. Harga final = course price - discount.
6. Harga final minimum adalah 0.
7. Voucher usage dihitung saat payment approved.
8. Creator tidak boleh publish course sendiri.
9. Tutor tidak boleh mengubah konten course kecuali diberi role creator/admin.
10. Learner tidak boleh mengakses course orang lain.
11. Admin dapat override enrollment untuk kebutuhan operasional.
12. Payment proof wajib tersimpan sebelum admin verification.

---

## 10. External Interface Requirements

### Web UI
- Responsive dashboard per role.
- Course builder.
- Payment confirmation form.
- Admin verification panel.
- Learning player.
- Tutor discussion panel.

### API
- REST atau RPC-style endpoints.
- JSON request/response.
- Auth token/session required untuk protected endpoints.

### Database
- PostgreSQL.
- Migration-based schema.
- UUID primary keys.

### File Storage
- Menyimpan proof of payment.
- Menyimpan file lesson/material.
- URL file tidak boleh public untuk data sensitif kecuali material public.

---

## 11. Acceptance Test Summary

| Test ID | Scenario | Expected Result |
|---|---|---|
| AT-001 | Learner submit payment | Status pending. |
| AT-002 | Admin approve payment | Enrollment active dibuat. |
| AT-003 | Learner access approved course | Lesson dapat dibuka. |
| AT-004 | Learner access unpaid course | Akses ditolak/locked. |
| AT-005 | Admin create voucher | Voucher valid tersimpan. |
| AT-006 | Learner use expired voucher | Sistem menolak. |
| AT-007 | Creator submit course | Status berubah review. |
| AT-008 | Admin publish course | Course muncul di catalog. |
| AT-009 | Tutor answer discussion | Reply tampil ke learner. |
| AT-010 | Learner complete lesson | Progress meningkat. |
