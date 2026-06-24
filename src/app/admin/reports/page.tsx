import { prisma } from "@/lib/db/prisma";
export default async function ReportsPage() {
  const [learners, courses, pending, payments] = await Promise.all([
    prisma.user.count({ where: { role: "learner" } }),
    prisma.course.count({ where: { status: "published" } }),
    prisma.payment_confirmations.count({ where: { status: "pending" } }),
    prisma.payment_confirmations.findMany({
      where: { status: "approved" },
      select: { paid_amount: true },
    }),
  ]);
  const revenue = payments.reduce(
    (total, payment) => total + Number(payment.paid_amount),
    0,
  );
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Laporan Admin</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div>Learner: {learners}</div>
        <div>Course Published: {courses}</div>
        <div>Payment Pending: {pending}</div>
        <div>Revenue: Rp {revenue.toLocaleString("id-ID")}</div>
      </div>
    </main>
  );
}
