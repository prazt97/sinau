import { prisma } from "@/lib/db/prisma";
export const dynamic = "force-dynamic";
export default async function PricingPage() {
  const prices = await prisma.coursePrice.findMany({
    include: { courses: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Pricing</h1>
      <div className="mt-6 space-y-3">
        {prices.map((price) => (
          <div key={price.id} className="rounded-xl bg-white p-4 shadow-sm">
            {price.courses.title}: Rp{" "}
            {Number(price.regularPrice).toLocaleString("id-ID")}
          </div>
        ))}
      </div>
    </main>
  );
}
