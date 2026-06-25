import { cookies } from "next/headers";
import Link from "next/link";
import { PaymentPricingMenu } from "@/components/payment-pricing-menu";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
export const dynamic = "force-dynamic";

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const statusClass: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-200",
  approved: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
  cancelled:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

export default async function PaymentsPage() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  const payments = session
    ? await prisma.payment_confirmations.findMany({
        where: { learner_id: session.id },
        orderBy: { created_at: "desc" },
        include: { courses: true },
      })
    : [];
  return (
    <main className="p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Status Pembayaran</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Pantau konfirmasi pembayaran manual dan status akses course.
          </p>
        </div>
        <Link
          href="/learner/payments/new"
          className="w-fit rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Konfirmasi Pembayaran
        </Link>
      </div>

      <div className="mt-5">
        <PaymentPricingMenu role="learner" />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {payments.map((payment) => (
          <article
            key={payment.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span
                  className={`rounded-lg px-2 py-1 text-xs font-semibold ${statusClass[payment.status]}`}
                >
                  {payment.status}
                </span>
                <h2 className="mt-3 text-base font-semibold">
                  {payment.courses.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Transfer {payment.transfer_date.toLocaleDateString("id-ID")}
                </p>
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {formatIDR(Number(payment.final_amount))}
              </p>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  Paid
                </dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {formatIDR(Number(payment.paid_amount))}
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
            {payment.rejected_reason ? (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
                {payment.rejected_reason}
              </p>
            ) : null}
          </article>
        ))}
        {payments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada konfirmasi pembayaran.
          </div>
        ) : null}
      </section>
    </main>
  );
}
