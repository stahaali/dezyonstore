import Link from "next/link";
import styles from "./Section.module.css";

interface SectionProps {
  label: string;
  title: string;
  description?: string;
  centered?: boolean;
  noPaddingTop?: boolean;
  children: React.ReactNode;
  cta?: { href: string; label: string };
}

export default function Section({
  label,
  title,
  description,
  centered = false,
  noPaddingTop = false,
  children,
  cta,
}: SectionProps) {
  return (
    <section
      className={`${styles.section} ${noPaddingTop ? styles.sectionNoTop : ""}`}
    >
      <div className={styles.inner}>
        <div className={`${styles.header} ${centered ? styles.centered : ""}`}>
          <span className={styles.label}>{label}</span>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        {children}

        {cta && (
          <div className={styles.ctaWrap}>
            <Link href={cta.href} className={styles.ctaBtn}>
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export { styles as sectionStyles };
