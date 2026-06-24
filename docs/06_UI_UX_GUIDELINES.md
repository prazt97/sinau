# UI/UX GUIDELINES — Sinau LMS

## 1. Design Principle

Sinau harus terasa seperti aplikasi LMS modern, bersih, mudah dipahami, dan nyaman digunakan untuk belajar jangka panjang.

Prinsip utama:

1. Clean & professional.
2. Mobile first.
3. Fast & responsive.
4. Minimal cognitive load.
5. Role-aware UI.
6. Dark mode first-class.
7. Learning-focused experience.
8. Clear progress visibility.
9. Trustworthy payment confirmation flow.

---

## 2. Visual Style

- Soft UI.
- Large border radius.
- Spacious layout.
- Calm learning atmosphere.
- Clear hierarchy.
- Accessible contrast.
- Minimal decorative noise.

---

## 3. Color System

### Light Mode

```css
--bg-base:        #F8FAFC;
--bg-surface:     #FFFFFF;
--bg-card:        #FFFFFF;
--border:         #E2E8F0;

--primary:        #2563EB;
--primary-hover:  #1D4ED8;
--primary-light:  #DBEAFE;

--accent:         #14B8A6;
--success:        #10B981;
--danger:         #EF4444;
--warning:        #F59E0B;
--info:           #3B82F6;

--text-primary:   #0F172A;
--text-secondary: #64748B;
--text-muted:     #94A3B8;
```

### Dark Mode

```css
--bg-base:        #020617;
--bg-surface:     #0F172A;
--bg-card:        #111827;
--border:         #1E293B;

--primary:        #60A5FA;
--primary-hover:  #93C5FD;
--primary-light:  #172554;

--accent:         #2DD4BF;
--success:        #34D399;
--danger:         #F87171;
--warning:        #FBBF24;
--info:           #60A5FA;

--text-primary:   #F8FAFC;
--text-secondary: #CBD5E1;
--text-muted:     #64748B;
```

---

## 4. Role Badge Colors

```text
learner  → bg-blue-100    text-blue-700
creator  → bg-purple-100  text-purple-700
tutor    → bg-teal-100    text-teal-700
admin    → bg-amber-100   text-amber-700
```

Dark mode variants must also exist.

---

## 5. Status Badge Colors

### Course Status

```text
draft      → bg-gray-100    text-gray-700
review     → bg-amber-100   text-amber-700
published  → bg-green-100   text-green-700
archived   → bg-red-100     text-red-700
```

### Payment Status

```text
pending    → bg-yellow-100  text-yellow-700
approved   → bg-green-100   text-green-700
rejected   → bg-red-100     text-red-700
cancelled  → bg-gray-100    text-gray-700
```

### Enrollment Status

```text
active     → bg-blue-100    text-blue-700
completed  → bg-green-100   text-green-700
suspended  → bg-red-100     text-red-700
```

### Progress Status

```text
not_started → bg-gray-100   text-gray-700
in_progress → bg-blue-100   text-blue-700
completed   → bg-green-100  text-green-700
```

---

## 6. Typography

Font family:

```css
font-family: 'Inter', system-ui, sans-serif;
```

Typography scale:

| Element | Tailwind Class |
|---|---|
| Page Title | `text-2xl font-bold` |
| Section Header | `text-lg font-semibold` |
| Card Title | `text-base font-semibold` |
| Body Text | `text-sm` |
| Small Label | `text-xs` |
| Price Large | `text-3xl font-bold tabular-nums` |
| Price Small | `text-base font-semibold tabular-nums` |

---

## 7. Border Radius

```text
Input / Badge   → rounded-lg
Button          → rounded-xl
Card            → rounded-2xl
Modal           → rounded-2xl
FAB             → rounded-full
Progress Bar    → rounded-full
```

---

## 8. Shadow System

```text
Card default    → shadow-sm
Card hover      → shadow-md
Modal           → shadow-xl
Dropdown        → shadow-lg
```

Avoid heavy shadow such as `shadow-2xl` unless explicitly needed.

---

## 9. Layout

### Mobile Layout

```text
Top Bar
Course / Dashboard Summary Cards
Primary CTA
Content Area
Bottom Navigation
```

### Desktop Layout

```text
Left Sidebar
Top Header
Dashboard Summary Row
Main Content Area
Right Detail Panel optional
```

---

## 10. Navigation by Role

### Learner

```text
Dashboard
Catalog
My Courses
Payment Status
Discussion
Profile
```

### Creator

```text
Dashboard
My Courses
Course Builder
Submissions for Review
Profile
```

### Tutor

```text
Dashboard
Assigned Courses
Learners
Discussions
Assignment Reviews
Profile
```

### Admin

```text
Dashboard
Users
Courses
Pricing
Vouchers
Payments
Enrollments
Tutor Assignment
Reports
Settings
```

---

## 11. Core Components

### 11.1 Course Card

```text
┌─────────────────────────────┐
│ Thumbnail                   │
│ [Level Badge] [Status]      │
│ Course Title                │
│ Short description           │
│ Creator / Tutor             │
│ Rp 500.000                  │
│ [Lihat Detail]              │
└─────────────────────────────┘
```

Required:
- Thumbnail fallback.
- Price in IDR.
- Clear CTA.
- Responsive.

### 11.2 Learning Progress Card

```text
┌─────────────────────────────┐
│ Nama Course                 │
│ Progress: 65%               │
│ ███████░░░                  │
│ Lesson terakhir             │
│ [Lanjutkan Belajar]         │
└─────────────────────────────┘
```

### 11.3 Payment Confirmation Card

```text
┌─────────────────────────────┐
│ Course Name                 │
│ Harga: Rp xxx               │
│ Diskon: Rp xxx              │
│ Total Bayar: Rp xxx         │
│ Status: Pending             │
│ [Lihat Detail]              │
└─────────────────────────────┘
```

### 11.4 Admin Payment Review Panel

```text
┌─────────────────────────────┐
│ Learner Name                │
│ Course Name                 │
│ Nominal seharusnya          │
│ Nominal dibayar             │
│ Bukti pembayaran            │
│ [Approve] [Reject]          │
└─────────────────────────────┘
```

### 11.5 Lesson Player

```text
┌────────────────────────────────────────┐
│ Sidebar Module/Lesson                  │
│ ┌────────────────────────────────────┐ │
│ │ Lesson Content                     │ │
│ │ Video/Text/File/Embed              │ │
│ └────────────────────────────────────┘ │
│ [Previous] [Tandai Selesai] [Next]     │
└────────────────────────────────────────┘
```

---

## 12. Form Guidelines

- Label above input.
- Required field marked with red `*`.
- Validation error below field.
- Do not use placeholder as label.
- Submit button on right, cancel on left.
- Use `type="button"` for non-submit buttons.
- Disable submit button while processing.

Example fields for payment confirmation:

```text
Course
Kode Voucher
Nominal Bayar
Metode Pembayaran
Nama Pengirim
Tanggal Transfer
Upload Bukti Pembayaran
Catatan
```

---

## 13. Feedback Pattern

### Toast Notification

Position:
- Desktop: top-right.
- Mobile: top-center.

Messages:

```text
success → "Berhasil disimpan"
error   → "Gagal menyimpan. Coba lagi."
warning → "Data belum lengkap"
info    → "Status pembayaran diperbarui"
delete  → "Data berhasil dihapus"
```

Duration: `3000ms`.

### Confirmation Modal

Required for:
- Delete course.
- Delete module/lesson.
- Reject payment.
- Suspend learner.
- Archive course.

Modal requirements:
- Backdrop blur.
- Close button.
- ESC support.
- Focus trap.
- Clear primary/secondary action.

---

## 14. Loading, Empty, and Error States

### Loading
Use skeleton loader as primary loading indicator.

### Empty State

Examples:

```text
Belum ada course yang tersedia
Belum ada pembayaran pending
Belum ada diskusi
Belum ada assignment untuk direview
```

### Error State

```text
Terjadi kesalahan saat memuat data
[Coba Lagi]
```

---

## 15. Accessibility

Requirements:

1. Keyboard navigation.
2. Visible focus state.
3. WCAG AA contrast.
4. Touch target minimum 44px.
5. ARIA label for icon-only buttons.
6. Alt text for images.
7. Form input associated with label.
8. Error message programmatically associated where possible.

---

## 16. Currency Formatting

All money values use IDR.

```javascript
export function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
```

Expected output:

```text
Rp 1.000.000
```

---

## 17. UX Rules for Manual Payment

The manual payment flow must feel trustworthy and clear.

Payment confirmation page must show:

1. Course title.
2. Normal price.
3. Voucher discount if any.
4. Final amount.
5. Bank/payment instruction.
6. Upload proof area.
7. Expected verification time text.
8. Payment status after submit.

Suggested helper text:

```text
Pembayaran dilakukan di luar sistem Sinau. Setelah transfer, unggah bukti pembayaran agar admin dapat memverifikasi dan membuka akses course Anda.
```

---

## 18. Responsive Breakpoints

```text
default   → mobile ≥320px
sm        → ≥640px
md        → ≥768px
lg        → ≥1024px
xl        → ≥1280px
```

Sidebar:
- Mobile: bottom navigation or hamburger.
- Desktop: left sidebar fixed.

---

## 19. Dark Mode

Requirements:

1. Toggle theme in header.
2. Save preference in localStorage.
3. Default follows system preference.
4. All cards, forms, tables, modals, and badges have dark variants.

---

## 20. UI Rules Summary

1. Tailwind utility classes preferred.
2. Mobile first.
3. Dark mode required.
4. Feedback through toast, not browser alert.
5. Loading through skeleton.
6. Destructive action through confirmation modal.
7. Role badge always visible.
8. IDR formatted consistently.
9. Learner payment status must be prominent.
10. Course access lock state must be obvious.
