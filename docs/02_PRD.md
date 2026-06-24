# PRODUCT REQUIREMENTS DOCUMENT — Sinau LMS

## 1. Ringkasan Produk

Sinau adalah Learning Management System untuk pembelajaran online mandiri yang tetap menyediakan pendampingan oleh Tutor. Platform ini dirancang untuk membantu learner membeli akses course, belajar secara bertahap, berdiskusi dengan tutor, mengerjakan quiz/tugas, dan memantau progres belajar.

Pembayaran dilakukan di luar sistem. Sinau hanya mencatat konfirmasi pembayaran dan memfasilitasi admin untuk melakukan verifikasi. Setelah pembayaran disetujui, sistem membuka akses course kepada learner.

---

## 2. Problem Statement

Banyak program pembelajaran online membutuhkan sistem yang tidak hanya menyediakan materi, tetapi juga:

1. Memastikan akses learner hanya dibuka setelah pembayaran tervalidasi.
2. Memudahkan admin mengelola harga, voucher, pembayaran manual, dan enrollment.
3. Memudahkan creator menyusun course tanpa campur tangan developer.
4. Memudahkan tutor mendampingi learner secara terstruktur.
5. Memudahkan learner belajar mandiri dengan progres yang jelas.

---

## 3. Goals

1. Menyediakan LMS yang mudah digunakan untuk learner, creator, tutor, dan admin.
2. Mendukung self-paced learning dengan lesson tracking.
3. Mendukung tutor-assisted learning melalui diskusi dan feedback.
4. Mendukung manual payment confirmation tanpa payment gateway.
5. Mendukung pricing dan voucher discount.
6. Menyediakan dashboard operasional untuk admin.
7. Dapat dideploy stabil di Railway dengan PostgreSQL.

---

## 4. Non-Goals

1. Tidak membangun payment gateway.
2. Tidak membangun mobile app native.
3. Tidak membangun live class engine.
4. Tidak membangun creator payout.
5. Tidak membangun sertifikat blockchain.
6. Tidak membangun AI tutor pada MVP.

---

## 5. Target Pengguna

### 5.1 Learner

Kebutuhan:

- Melihat catalog course.
- Melihat detail course dan harga.
- Menggunakan voucher.
- Mengirim konfirmasi pembayaran.
- Menunggu verifikasi admin.
- Mengakses course setelah approved.
- Melihat progress belajar.
- Bertanya kepada tutor.
- Mengirim assignment.
- Melihat feedback.

### 5.2 Creator

Kebutuhan:

- Membuat course.
- Menyusun module dan lesson.
- Upload materi belajar.
- Membuat quiz dan assignment.
- Submit course untuk review.
- Melihat status course.

### 5.3 Tutor

Kebutuhan:

- Melihat learner yang didampingi.
- Melihat progress learner.
- Menjawab diskusi.
- Memberikan feedback assignment.
- Memberikan rekomendasi follow-up.

### 5.4 Admin

Kebutuhan:

- Mengelola user dan role.
- Review dan publish course.
- Mengatur harga course.
- Membuat voucher discount.
- Memverifikasi pembayaran.
- Membuka akses course.
- Melihat laporan enrollment dan pembayaran.
- Mengelola assignment tutor ke course.

---

## 6. User Journey

### 6.1 Learner Journey

1. Register/login.
2. Browse course catalog.
3. Buka detail course.
4. Pilih course.
5. Masukkan voucher jika ada.
6. Lihat instruksi pembayaran manual.
7. Transfer di luar sistem.
8. Upload bukti pembayaran.
9. Menunggu admin approve.
10. Mendapat akses course.
11. Belajar lesson per lesson.
12. Diskusi dengan tutor.
13. Mengerjakan quiz/assignment.
14. Menyelesaikan course.

### 6.2 Creator Journey

1. Login sebagai creator.
2. Buat course baru.
3. Isi metadata course.
4. Buat module.
5. Buat lesson.
6. Tambahkan quiz/assignment.
7. Submit ke admin.
8. Revisi jika diperlukan.
9. Course published.

### 6.3 Admin Journey

1. Login sebagai admin.
2. Melihat dashboard pending payment.
3. Review bukti pembayaran.
4. Approve/reject.
5. Sistem membuka course jika approved.
6. Mengelola harga dan voucher.
7. Review course baru.
8. Melihat laporan operasional.

---

## 7. Feature Requirements

## 7.1 Authentication & Authorization

### Description
Sistem login dan pembatasan akses berdasarkan role.

### Requirements
- User dapat login dan logout.
- User memiliki satu role utama: learner, creator, tutor, admin.
- Admin dapat mengaktifkan/nonaktifkan user.
- Route dan API harus dilindungi role-based access control.

### Acceptance Criteria
- Learner tidak dapat membuka dashboard admin.
- Creator tidak dapat approve payment.
- Tutor tidak dapat mengubah harga course.
- Admin memiliki akses penuh.

---

## 7.2 Course Catalog

### Description
Halaman daftar course yang dapat dibeli learner.

### Requirements
- Menampilkan course published.
- Filter/search course.
- Menampilkan harga normal dan harga setelah diskon jika voucher diterapkan.
- Menampilkan info creator, level, durasi, dan deskripsi singkat.

### Acceptance Criteria
- Course draft tidak tampil di catalog.
- Course archived tidak tampil.
- Learner dapat membuka detail course.

---

## 7.3 Course Builder

### Description
Creator membuat dan mengelola konten pembelajaran.

### Requirements
- Creator dapat membuat course draft.
- Creator dapat mengelola module.
- Creator dapat mengelola lesson.
- Lesson dapat berupa video link, text, file, atau embed.
- Creator dapat membuat quiz dan assignment.
- Creator dapat submit course untuk review.

### Acceptance Criteria
- Course baru default `draft`.
- Course hanya bisa published oleh admin.
- Lesson harus berada dalam module.

---

## 7.4 Pricing Management

### Description
Admin mengatur harga course.

### Requirements
- Admin dapat mengatur harga regular course.
- Admin dapat mengatur harga promo manual.
- Admin dapat mengaktifkan/menonaktifkan harga course.
- Semua harga menggunakan IDR.

### Acceptance Criteria
- Harga tampil di course catalog.
- Harga tidak boleh negatif.
- Perubahan harga tercatat `updated_at`.

---

## 7.5 Voucher Discount

### Description
Admin membuat voucher diskon.

### Requirements
- Voucher memiliki kode unik.
- Tipe diskon: percentage atau fixed amount.
- Voucher memiliki tanggal mulai dan berakhir.
- Voucher memiliki batas penggunaan total.
- Voucher dapat dibatasi untuk course tertentu atau berlaku global.
- Voucher dapat dinonaktifkan.

### Acceptance Criteria
- Voucher expired tidak dapat digunakan.
- Voucher inactive tidak dapat digunakan.
- Discount tidak boleh membuat harga akhir kurang dari 0.
- Penggunaan voucher tercatat.

---

## 7.6 Manual Payment Confirmation

### Description
Learner melakukan pembayaran di luar sistem lalu mengirim konfirmasi.

### Requirements
- Learner memilih course.
- Learner mengisi nominal bayar.
- Learner mengisi metode pembayaran.
- Learner mengisi nama pengirim.
- Learner mengunggah bukti pembayaran.
- Learner dapat menggunakan voucher.
- Status awal payment confirmation adalah `pending`.

### Acceptance Criteria
- Learner tidak mendapat akses sebelum payment approved.
- Admin melihat daftar pending payment.
- Bukti pembayaran dapat dibuka admin.
- Payment rejected dapat dikirim ulang.

---

## 7.7 Payment Verification

### Description
Admin memverifikasi pembayaran manual.

### Requirements
- Admin dapat approve payment.
- Admin dapat reject payment dengan alasan.
- Jika approved, sistem membuat enrollment active.
- Jika rejected, sistem menyimpan reason.
- Admin dapat melihat history payment.

### Acceptance Criteria
- Approval otomatis membuka akses course.
- Reject tidak membuka akses course.
- Enrollment tidak duplikat untuk learner dan course yang sama.

---

## 7.8 Learning Player

### Description
Learner mengakses lesson setelah enrollment aktif.

### Requirements
- Learner melihat daftar module dan lesson.
- Learner membuka lesson.
- Learner menandai lesson completed.
- Sistem menghitung progress course.
- Lesson premium terkunci jika learner belum enrolled.

### Acceptance Criteria
- Learner hanya dapat membuka course yang sudah dienroll.
- Progress tersimpan per learner.
- Completion course dihitung dari semua lesson completed.

---

## 7.9 Tutor Support

### Description
Tutor mendampingi learner dalam course.

### Requirements
- Tutor dapat melihat learner di course yang ditugaskan.
- Learner dapat membuat pertanyaan/diskusi.
- Tutor dapat membalas diskusi.
- Tutor dapat memberi feedback assignment.
- Admin dapat assign tutor ke course.

### Acceptance Criteria
- Tutor hanya melihat course yang ditugaskan.
- Learner hanya melihat diskusi miliknya atau diskusi course sesuai aturan.
- Feedback tersimpan dan dapat dibaca learner.

---

## 7.10 Assessment

### Description
Quiz dan assignment untuk evaluasi belajar.

### Requirements
- Creator dapat membuat quiz.
- Creator dapat membuat assignment.
- Learner dapat submit quiz/assignment.
- Tutor dapat memberi nilai/feedback assignment.
- Sistem menyimpan skor.

### Acceptance Criteria
- Learner hanya dapat submit jika enrolled.
- Tutor dapat memberi feedback.
- Nilai tampil di dashboard learner.

---

## 7.11 Admin Reporting

### Description
Dashboard dan laporan dasar untuk admin.

### Requirements
- Total learner.
- Total course published.
- Total payment pending.
- Total payment approved.
- Total revenue tercatat dari payment approved.
- Enrollment per course.
- Progress rata-rata per course.

### Acceptance Criteria
- Admin melihat ringkasan operasional.
- Data pembayaran hanya menghitung payment approved.
- Laporan dapat difilter by date range dan course.

---

## 8. Role Permission Matrix

| Feature | Learner | Creator | Tutor | Admin |
|---|---:|---:|---:|---:|
| Browse catalog | Yes | Yes | Yes | Yes |
| Buy/request course access | Yes | No | No | Yes/manual |
| Submit payment confirmation | Yes | No | No | Yes/manual |
| Verify payment | No | No | No | Yes |
| Access enrolled course | Yes | No | Optional | Yes |
| Create course | No | Yes | No | Yes |
| Publish course | No | No | No | Yes |
| Manage pricing | No | No | No | Yes |
| Manage voucher | No | No | No | Yes |
| Answer discussions | No | No | Yes | Yes |
| Review assignment | No | No | Yes | Yes |
| Manage users | No | No | No | Yes |
| View reports | No | Limited own course | Limited assigned | Yes |

---

## 9. Functional Requirements Summary

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | User login/logout | Must |
| FR-002 | Role-based access | Must |
| FR-003 | Course catalog | Must |
| FR-004 | Course detail | Must |
| FR-005 | Course builder | Must |
| FR-006 | Admin pricing setting | Must |
| FR-007 | Voucher discount | Must |
| FR-008 | Manual payment confirmation | Must |
| FR-009 | Admin payment verification | Must |
| FR-010 | Enrollment unlock after payment approved | Must |
| FR-011 | Learning player | Must |
| FR-012 | Lesson progress tracking | Must |
| FR-013 | Tutor discussion | Should |
| FR-014 | Assignment feedback | Should |
| FR-015 | Admin report | Should |

---

## 10. Success Metrics

1. 95% learner dapat menyelesaikan payment confirmation tanpa bantuan admin.
2. 100% course access hanya terbuka setelah payment approved atau admin manual enrollment.
3. Admin dapat memverifikasi pembayaran dalam kurang dari 3 menit per transaksi.
4. Creator dapat membuat course lengkap tanpa bantuan developer.
5. Learner progress tersimpan konsisten di setiap lesson.
6. Aplikasi berhasil deploy di Railway tanpa error kritis.

---

## 11. MVP Release Criteria

MVP dapat dianggap siap rilis jika:

1. Auth dan role berjalan.
2. Admin dapat membuat user.
3. Creator dapat membuat course.
4. Admin dapat publish course.
5. Learner dapat submit payment confirmation.
6. Admin dapat approve/reject payment.
7. Enrollment aktif setelah approved.
8. Learner dapat belajar dan progress tersimpan.
9. Tutor dapat melihat learner dan memberi feedback.
10. Railway deployment berhasil.
