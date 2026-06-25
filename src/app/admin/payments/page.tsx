import { prisma } from "@/lib/db/prisma";
import { PaymentPricingMenu } from "@/components/payment-pricing-menu";
import { PaymentActions } from "./payment-actions";
export const dynamic = "force-dynamic";

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default async function AdminPayments() {
  const payments = await prisma.payment_confirmations.findMany({
    where: { status: "pending" },
    include: {
      courses: true,
      users_payment_confirmations_learner_idTousers: true,
    },
    orderBy: { created_at: "asc" },
  });
  return (
    <main className="p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Pembayaran Pending</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Review bukti pembayaran manual sebelum membuka akses course.
        </p>
      </div>

      <div className="mt-5">
        <PaymentPricingMenu role="admin" />
      </div>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        {payments.map((payment) => (
          <article
            key={payment.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <span className="rounded-lg bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-950 dark:text-yellow-200">
                  {payment.status}
                </span>
                <h2 className="mt-3 text-base font-semibold">
                  {payment.courses.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {
                    payment.users_payment_confirmations_learner_idTousers
                      .fullName
                  }
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {payment.payment_method} - {payment.payer_name}
                </p>
              </div>
              <div className="text-left lg:text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Final amount
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {formatIDR(Number(payment.final_amount))}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Paid: {formatIDR(Number(payment.paid_amount))}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  Course price
                </dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {formatIDR(Number(payment.course_price))}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  Discount
                </dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {formatIDR(Number(payment.discount_amount))}
                </dd>
              </div>
            </dl>
            {payment.proof_url ? (
              <a
                className="mt-4 inline-block rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700 outline-none transition hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:text-blue-300 dark:hover:bg-blue-950"
                href={payment.proof_url}
                target="_blank"
              >
                Lihat Bukti Pembayaran
              </a>
            ) : (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
                Bukti pembayaran belum tersedia.
              </p>
            )}
            <PaymentActions paymentId={payment.id} />
          </article>
        ))}
        {payments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada pembayaran pending.
          </div>
        ) : null}
      </section>
    </main>
  );
}
