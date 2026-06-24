import { prisma } from "@/lib/db/prisma";
export const dynamic = "force-dynamic";
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
    <main className="p-6">
      <h1 className="text-2xl font-bold">Pembayaran Pending</h1>
      <div className="mt-6 space-y-3">
        {payments.map((payment) => (
          <article
            key={payment.id}
            className="rounded-xl bg-white p-4 shadow-sm"
          >
            <h2>{payment.courses.title}</h2>
            <p>
              {payment.users_payment_confirmations_learner_idTousers.fullName}
            </p>
            <p>Rp {Number(payment.final_amount).toLocaleString("id-ID")}</p>
            <a
              className="text-blue-600"
              href={payment.proof_url ?? "#"}
              target="_blank"
            >
              Lihat bukti
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
