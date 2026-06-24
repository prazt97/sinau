import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
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
    <main className="p-6">
      <h1 className="text-2xl font-bold">Status Pembayaran</h1>
      {payments.map((payment) => (
        <article
          key={payment.id}
          className="mt-3 rounded-xl bg-white p-4 shadow-sm"
        >
          <p>{payment.courses.title}</p>
          <p>Status: {payment.status}</p>
          <p>
            Total: Rp {Number(payment.final_amount).toLocaleString("id-ID")}
          </p>
        </article>
      ))}
    </main>
  );
}
