import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-[640px] px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#00498e]">
        Thank you
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Order placed</h1>
      <p className="mt-3 text-sm text-gray-600">
        Your order has been saved to our database. We will contact you shortly.
      </p>
      {order ? (
        <p className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
          Order number: <span className="font-bold text-gray-900">{order}</span>
        </p>
      ) : null}
      <Link
        href="/"
        className="mt-8 inline-flex cursor-pointer rounded-full bg-[#0c2340] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1c33]"
      >
        Back to shop
      </Link>
    </div>
  );
}
