# IMPLEMENTATION PLAN — Sinau LMS

## 1. Prinsip Pengembangan

Sinau dikembangkan secara bertahap. Setiap phase harus selesai, dites, dan divalidasi sebelum lanjut ke phase berikutnya.

Prinsip utama:

1. Setup fondasi dulu.
2. Bangun auth dan role sebelum fitur.
3. Bangun database dan migration sebelum UI kompleks.
4. Payment manual harus aman dan atomic.
5. Course access harus dikunci sampai enrollment aktif.
6. Deploy lebih awal ke Railway untuk validasi environment.
7. Stabilitas MVP lebih penting daripada fitur banyak.

---

## 2. Phase 0 — Repository & Documentation Setup — Status: complete

### Tujuan
Menyiapkan repository dan dokumen source of truth.

### Tasks
- Buat repository `sinau`.
- Buat folder `/docs`.
- Masukkan 8 dokumen SoT.
- Buat README.md.
- Buat `.gitignore`.
- Buat environment template `.env.example`.

### Deliverables
- Repository siap dikembangkan.
- Dokumen SoT tersedia.

### Acceptance Criteria
- Semua dokumen ada di `/docs`.
- README menjelaskan cara menjalankan project.
- `.env` tidak masuk repository.

---

## 3. Phase 1 — Project Setup — Status: complete

### Tujuan
Menyiapkan aplikasi web dan struktur project.

### Tasks
- Init project frontend/backend.
- Setup TailwindCSS.
- Setup formatter dan linter.
- Setup folder structure.
- Setup healthcheck endpoint.
- Setup Railway config.

### Deliverables
- Aplikasi berjalan lokal.
- Endpoint `/api/health` aktif.

### Acceptance Criteria
- App dapat dijalankan di localhost.
- Healthcheck return status ok.
- Tidak ada secret hardcoded.

---

## 4. Phase 2 — PostgreSQL & ORM Setup — Status: complete

### Tujuan
Menyiapkan database PostgreSQL dan migration.

### Tasks
- Buat Railway PostgreSQL service.
- Setup `DATABASE_URL`.
- Setup Prisma/ORM.
- Implement schema dari `04_DATABASE_SCHEMA.sql`.
- Buat migration.
- Seed category awal.
- Test koneksi database.

### Deliverables
- Database aktif.
- Migration berhasil.
- Seed data tersedia.

### Acceptance Criteria
- Semua tabel utama terbentuk.
- Index dan constraint terbentuk.
- App dapat query database.

---

## 5. Phase 3 — Auth & Role System — Status: complete

### Tujuan
Membangun login, session, dan role-based access.

### Tasks
- Buat user model integration.
- Buat login page.
- Buat logout.
- Buat session/JWT.
- Buat middleware route protection.
- Buat redirect by role.
- Buat admin seed user.

### Deliverables
- Login/logout berjalan.
- Dashboard redirect sesuai role.

### Acceptance Criteria
- User inactive tidak dapat login.
- Learner tidak dapat akses admin route.
- Admin dapat akses semua dashboard.

---

## 6. Phase 4 — Admin User Management — Status: complete

### Tujuan
Admin dapat mengelola user.

### Tasks
- Buat daftar user.
- Buat create user.
- Buat edit user.
- Buat activate/deactivate user.
- Buat filter by role/status.
- Buat reset password flow jika diperlukan.

### Deliverables
- Admin user management.

### Acceptance Criteria
- Admin dapat membuat learner, creator, tutor, admin.
- Admin dapat nonaktifkan user.
- Nonaktif user tidak dapat login.

---

## 7. Phase 5 — Course Catalog & Course Detail — Status: complete

### Tujuan
Learner dapat melihat course yang tersedia.

### Tasks
- Buat course catalog page.
- Buat course detail page.
- Buat search/filter.
- Tampilkan harga.
- Tampilkan lock state untuk course belum enrolled.

### Deliverables
- Catalog dan detail course.

### Acceptance Criteria
- Hanya course published yang tampil.
- Harga tampil format IDR.
- Course detail jelas menampilkan instruksi pembayaran manual.

---

## 8. Phase 6 — Course Builder for Creator — Status: complete

### Tujuan
Creator dapat membuat course content.

### Tasks
- Buat creator dashboard.
- Buat create/edit course.
- Buat module management.
- Buat lesson management.
- Buat upload materi.
- Buat submit for review.

### Deliverables
- Course builder.

### Acceptance Criteria
- Course default draft.
- Creator dapat membuat module dan lesson.
- Course bisa dikirim ke review.

---

## 9. Phase 7 — Admin Course Review & Publishing — Status: complete

### Tujuan
Admin dapat mereview dan publish course.

### Tasks
- Buat admin course review list.
- Buat preview course.
- Buat approve/publish.
- Buat request revision.
- Buat archive course.

### Deliverables
- Course review workflow.

### Acceptance Criteria
- Course review dapat dipublish oleh admin.
- Course published tampil di catalog.
- Course archived tidak tampil.

---

## 10. Phase 8 — Pricing Management — Status: complete

### Tujuan
Admin dapat mengatur harga course.

### Tasks
- Buat course price form.
- Buat update regular price.
- Buat promo price optional.
- Buat price active/inactive.
- Buat audit log perubahan harga.

### Deliverables
- Pricing management.

### Acceptance Criteria
- Harga tidak boleh negatif.
- Harga terbaru tampil di catalog.
- Audit log tersimpan.

---

## 11. Phase 9 — Voucher Discount — Status: complete

### Tujuan
Admin dapat membuat dan mengelola voucher.

### Tasks
- Buat voucher list.
- Buat create/edit voucher.
- Buat activate/deactivate voucher.
- Buat validation endpoint.
- Buat course-specific/global voucher logic.
- Buat usage limit logic.

### Deliverables
- Voucher management.

### Acceptance Criteria
- Voucher valid dapat digunakan learner.
- Voucher expired/inactive ditolak.
- Discount dihitung benar.
- Usage limit dihormati.

---

## 12. Phase 10 — Manual Payment Confirmation — Status: complete

### Tujuan
Learner dapat melakukan konfirmasi pembayaran.

### Tasks
- Buat payment instruction UI.
- Buat voucher application UI.
- Buat payment confirmation form.
- Buat upload proof.
- Simpan payment confirmation pending.
- Buat learner payment status page.

### Deliverables
- Payment confirmation flow.

### Acceptance Criteria
- Learner dapat submit payment.
- Status awal pending.
- Proof payment tersimpan.
- Learner belum dapat akses course sebelum approved.

---

## 13. Phase 11 — Admin Payment Verification — Status: complete

### Tujuan
Admin dapat approve/reject pembayaran dan membuka akses course.

### Tasks
- Buat pending payment list.
- Buat payment detail review.
- Buat approve action.
- Buat reject action dengan reason.
- Gunakan transaction function untuk approve.
- Buat notification/status update UI.

### Deliverables
- Payment verification panel.

### Acceptance Criteria
- Approved payment membuat enrollment active.
- Rejected payment tidak membuka akses.
- Enrollment tidak duplikat.
- Voucher usage tercatat saat approved.

---

## 14. Phase 12 — Enrollment & Learning Player — Status: complete

### Tujuan
Learner dapat belajar setelah enrolled.

### Tasks
- Buat my courses page.
- Buat learning player.
- Buat module/lesson sidebar.
- Buat lesson access guard.
- Buat mark lesson complete.
- Hitung progress course.

### Deliverables
- Learning player dan progress tracking.

### Acceptance Criteria
- Learner hanya melihat enrolled course.
- Lesson selesai menaikkan progress.
- Course completed jika semua lesson selesai.

---

## 15. Phase 13 — Tutor Assignment & Support — Status: complete

### Tujuan
Tutor dapat mendampingi learner.

### Tasks
- Buat admin assign tutor to course.
- Buat tutor dashboard.
- Buat learner progress list untuk tutor.
- Buat discussion thread.
- Buat tutor reply.

### Deliverables
- Tutor support module.

### Acceptance Criteria
- Tutor hanya melihat assigned course.
- Learner enrolled dapat bertanya.
- Tutor reply tampil ke learner.

---

## 16. Phase 14 — Assessment: Quiz & Assignment — Status: complete

### Tujuan
Menyediakan evaluasi belajar.

### Tasks
- Buat quiz builder.
- Buat quiz player.
- Buat quiz submission.
- Buat assignment builder.
- Buat assignment submission.
- Buat tutor feedback dan scoring.

### Deliverables
- Quiz dan assignment.

### Acceptance Criteria
- Learner enrolled dapat submit.
- Tutor dapat memberi feedback.
- Score tersimpan.

---

## 17. Phase 15 — Admin Reporting — Status: complete

### Tujuan
Admin dapat melihat laporan operasional.

### Tasks
- Buat admin dashboard summary.
- Buat report enrollment.
- Buat report payment.
- Buat report course progress.
- Buat filter date/course.

### Deliverables
- Reporting dashboard.

### Acceptance Criteria
- Total revenue menghitung payment approved.
- Pending payment terlihat jelas.
- Report dapat difilter.

---

## 18. Phase 16 — UI Polish & Accessibility — Status: complete

### Tujuan
Meningkatkan kualitas UX.

### Tasks
- Implement dark mode.
- Implement skeleton loaders.
- Implement toast.
- Implement confirmation modal.
- Review responsive layout.
- Review accessibility.

### Deliverables
- UI siap UAT.

### Acceptance Criteria
- Mobile layout rapi.
- Focus state terlihat.
- Semua destructive action punya confirmation modal.

---

## 19. Phase 17 — Testing & UAT — Status: complete

### Tujuan
Memastikan fitur inti stabil.

### Tasks
- Unit test business logic.
- API test payment approval.
- E2E test learner payment-to-access flow.
- E2E test creator course creation.
- E2E test tutor feedback.
- UAT dengan sample users.

### Deliverables
- Test report.
- Bug list dan fix.

### Acceptance Criteria
- Semua critical path lulus.
- Tidak ada blocker bug.

---

## 20. Phase 18 — Railway Production Deployment — Status: complete

### Tujuan
Deploy production.

### Tasks
- Connect GitHub to Railway.
- Setup environment variables.
- Provision PostgreSQL.
- Run migration.
- Deploy app.
- Test healthcheck.
- Smoke test production.

### Deliverables
- Sinau live di Railway.

### Acceptance Criteria
- App live.
- Login berjalan.
- Database connected.
- Payment confirmation dan approval berjalan.
- Learner dapat membuka course setelah approved.

---

## 21. Critical Path

Urutan critical path:

```text
Docs → Project Setup → Database → Auth → Course Catalog → Course Builder → Pricing/Voucher → Payment Confirmation → Payment Approval → Enrollment → Learning Player
```

Tutor support, assessment, dan reporting dapat dikembangkan setelah critical path stabil.

---

## 22. MVP Definition of Done

1. User dapat login sesuai role.
2. Creator dapat membuat course.
3. Admin dapat publish course.
4. Learner dapat melihat catalog.
5. Learner dapat submit payment confirmation.
6. Admin dapat approve payment.
7. Course access terbuka setelah approval.
8. Learner dapat menyelesaikan lesson.
9. Progress tersimpan.
10. Railway deployment berhasil.
