import Image from "next/image";
import Link from "next/link";

const HOME_BANNER = "/assets/images/optimized/banners/homebanner1.webp";

export function HeroBanners() {
  return (
    <section
      className="scroll-mt-28 bg-white py-4 md:py-6 lg:scroll-mt-32"
      id="homebanner"
    >
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="relative min-h-[220px] overflow-hidden rounded-3xl md:min-h-[300px] lg:min-h-[380px]">
          <Image
            src={HOME_BANNER}
            alt="Razer gaming accessories banner"
            fill
            className="object-cover object-[68%_center]"
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
          />

          <div className="absolute inset-y-0 left-0 flex w-full max-w-[92%] flex-col justify-center px-6 sm:max-w-[78%] md:max-w-[58%] md:px-10 lg:max-w-[52%] lg:px-14">
            <div className="relative max-w-xl">
              <div
                className="pointer-events-none absolute -inset-3 rounded-2xl bg-white/20 md:-inset-4"
                aria-hidden="true"
              />
              <div className="relative">
                <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-[#c8102e]/40 bg-[#c8102e]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b00e28] md:text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c8102e]" />
                  For Gamers. By Gamers.
                </span>

                <h2 className="mt-4 text-[1.65rem] font-black uppercase leading-[0.95] tracking-tight text-gray-950 sm:text-4xl md:mt-5 md:text-[2.75rem] lg:text-5xl">
                  <span className="block italic">Dominate</span>
                  <span className="mt-1 block text-[#c8102e]">Every Match</span>
                </h2>

                <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-800 md:mt-5 md:text-base">
                  Premium Razer mice, keyboards, headsets and fight-ready gear —
                  built for speed, precision, and tournament-level play.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 md:mt-7">
                  <Link
                    href="/categories/razer-products"
                    className="inline-flex items-center rounded-full bg-[#c8102e] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_8px_24px_rgba(200,16,46,0.35)] transition hover:bg-[#a50d25] md:px-7 md:py-3"
                  >
                    Shop Razer Accessories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
