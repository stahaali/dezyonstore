import type { Package } from "@/data/packages";
import styles from "./PriceColumn.module.css";

interface PriceColumnProps {
  pkg: Package;
  featured?: boolean;
}

export default function PriceColumn({ pkg, featured = false }: PriceColumnProps) {
  return (
    <article className={`${styles.column} ${featured ? styles.featured : ""}`}>
      <h3 className={styles.title}>{pkg.title}</h3>
      <p className={styles.description}>{pkg.description}</p>
      <p className={styles.price}>{pkg.price}</p>
      <div className={styles.divider} />
      <ul className={styles.features}>
        {pkg.features.map((feature) => (
          <li key={feature} className={styles.feature}>
            <span className={styles.featureIcon} aria-hidden="true">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function PriceColumns({ children }: { children: React.ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
