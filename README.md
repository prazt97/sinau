# Sinau

Sinau adalah Learning Management System (LMS) berbasis web untuk pembelajaran mandiri dengan pendampingan tutor.

## Status

Fondasi aplikasi pada Phase 1 — Project Setup telah tersedia. Fitur LMS belum diimplementasikan.

## Dokumentasi

Seluruh keputusan produk dan teknis mengikuti dokumen di folder [`docs`](./docs), dengan prioritas tertinggi pada [`01_SOURCE_OF_TRUTH.md`](./docs/01_SOURCE_OF_TRUTH.md).

## Prinsip MVP

- Role: learner, creator, tutor, dan admin.
- Pembayaran dilakukan di luar sistem dan diverifikasi manual oleh admin.
- Akses course hanya terbuka setelah enrollment aktif.
- Database menggunakan PostgreSQL dan deployment ditargetkan ke Railway.
- Payment gateway tidak termasuk scope MVP.

## Konfigurasi Environment

Salin `.env.example` menjadi `.env`, lalu isi nilainya sesuai environment lokal atau Railway. Jangan commit file `.env` atau secret lainnya.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Aplikasi tersedia pada `http://localhost:3000`. Healthcheck dapat diakses pada `GET /api/health` dan mengembalikan `{ "status": "ok", "app": "Sinau" }`.

## Rencana Implementasi

Pengembangan mengikuti urutan phase pada [`07_IMPLEMENTATION_PLAN.md`](./docs/07_IMPLEMENTATION_PLAN.md). Phase berikutnya adalah PostgreSQL & ORM Setup.
