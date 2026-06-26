import { prisma } from "@/lib/db/prisma";
import { PaymentPricingMenu } from "@/components/payment-pricing-menu";
import { VoucherForm } from "./voucher-form";
export const dynamic = "force-dynamic";

const formatDiscount = (type: string, value: number) =>
  type === "percentage"
    ? `${value.toLocaleString("id-ID")}%`
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);

export default async function VouchersPage() {
  const [vouchers, courses] = await Promise.all([
    prisma.vouchers.findMany({
      orderBy: { created_at: "desc" },
      include: { courses: true },
    }),
    prisma.course.findMany({
      where: { status: "published" },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  return (
    <main className="p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Voucher</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Pantau voucher global dan course-specific yang dapat dipakai learner.
        </p>
      </div>

      <div className="mt-5">
        <PaymentPricingMenu role="admin" />
      </div>

      <VoucherForm courses={courses} />

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {vouchers.map((voucher) => (
          <article
            key={voucher.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span
                  className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                    voucher.is_active
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {voucher.is_active ? "active" : "inactive"}
                </span>
                <h2 className="mt-3 text-base font-semibold">
                  {voucher.code} - {voucher.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {voucher.courses?.title ?? "Global voucher"}
                </p>
              </div>
              <p className="text-xl font-bold tabular-nums">
                {formatDiscount(
                  voucher.discount_type,
                  Number(voucher.discount_value),
                )}
              </p>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  Usage
                </dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {voucher.usage_count}
                  {voucher.usage_limit ? ` / ${voucher.usage_limit}` : ""}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  Valid until
                </dt>
                <dd className="mt-1 font-semibold">
                  {voucher.valid_until
                    ? voucher.valid_until.toLocaleDateString("id-ID")
                    : "Tidak dibatasi"}
                </dd>
              </div>
            </dl>
          </article>
        ))}
        {vouchers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada voucher.
          </div>
        ) : null}
      </section>
    </main>
  );
}
