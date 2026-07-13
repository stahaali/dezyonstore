import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/assets/images/banner.webp"
        alt="Gaming setup"
        fill
        priority
        sizes="100vw"
        className={styles.bgImage}
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.badge}>Premium Gaming Store</span>

          <h1 className={styles.title}>Level Up Your Setup</h1>

          <p className={styles.subtitle}>
            Discover curated gaming hardware, accessories, and complete
            packages built for performance-driven enthusiasts.
          </p>

          <div className={styles.actions}>
            <Link href="/products" className={styles.primaryBtn}>
              Browse Products
            </Link>
            <Link href="/pricing" className={styles.secondaryBtn}>
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
