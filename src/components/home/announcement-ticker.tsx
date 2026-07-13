"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { SITE_NAME } from "@/lib/constants";
import "swiper/css";
import styles from "./announcement-ticker.module.css";

const ANNOUNCEMENTS = [
  `${SITE_NAME.toUpperCase()} OPERATES ONLY ONE OFFICIAL STORE. BEWARE OF FAKE STORES CLAIMING OUR NAME.`,
  "STORE TIMINGS: MON - THU AND SAT: 11 AM - 8 PM | FRI: 11 AM - 1 PM, 2:30 PM - 8 PM | SUN: CLOSE",
  "PRICES MAY VARY DUE TO CURRENCY CHANGES.",
];

const TICKER_TEXT = ANNOUNCEMENTS.join("  ●  ");

export function AnnouncementTicker() {
  return (
    <section className="w-full border-b border-[#0c2340] bg-[#dce9f8]">
      <div className="mx-auto max-w-[1400px] overflow-hidden px-4">
        <Swiper
          modules={[Autoplay, FreeMode]}
          className={styles.ticker}
          slidesPerView="auto"
          spaceBetween={80}
          loop
          speed={24000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          freeMode={{ enabled: true, momentum: false }}
          allowTouchMove={false}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SwiperSlide key={i} className="!w-auto">
              <p className="whitespace-nowrap py-2.5 text-[11px] font-medium uppercase tracking-wide text-gray-900 md:py-3 md:text-xs">
                {TICKER_TEXT}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
