"use client";

export function InvoicePrintButton() {
  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="cursor-pointer rounded-md bg-[#0c2340] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a1c33]"
      >
        Print Invoice
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
      >
        Save as PDF
      </button>
      <p className="w-full text-xs text-gray-500 sm:w-auto">
        Print dialog mein “Save as PDF” / “Microsoft Print to PDF” choose karo.
      </p>
    </div>
  );
}
