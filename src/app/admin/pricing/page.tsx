import { prisma } from "@/lib/db/prisma";
import { PaymentPricingMenu } from "@/components/payment-pricing-menu";
export const dynamic = "force-dynamic";

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default async function PricingPage() {
  const prices = await prisma.coursePrice.findMany({
    include: { courses: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <main className="p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Pricing</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Pantau harga regular dan promo yang digunakan pada catalog dan payment
          confirmation.
        </p>
      </div>

      <div className="mt-5">
        <PaymentPricingMenu role="admin" />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {prices.map((price) => (
          <article
            key={price.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span
                  className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                    price.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {price.isActive ? "active" : "inactive"}
                </span>
                <h2 className="mt-3 text-base font-semibold">
                  {price.courses.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Updated {price.updatedAt.toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Regular
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {formatIDR(Number(price.regularPrice))}
                </p>
              </div>
            </div>
            {price.promoPrice ? (
              <div className="mt-4 rounded-xl bg-blue-50 p-3 text-sm dark:bg-blue-950">
                <span className="text-slate-600 dark:text-slate-300">
                  Promo price:
                </span>{" "}
                <span className="font-semibold tabular-nums text-blue-700 dark:text-blue-200">
                  {formatIDR(Number(price.promoPrice))}
                </span>
              </div>
            ) : null}
          </article>
        ))}
        {prices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada harga course.
          </div>
        ) : null}
      </section>
    </main>
  );
}
