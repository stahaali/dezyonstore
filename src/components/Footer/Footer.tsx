import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import styles from "./Footer.module.css";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <Logo variant="footer" />
            <p className={styles.tagline}>
              Premium gaming gear and accessories curated for enthusiasts who
              demand excellence.
            </p>
          </div>

          <nav className={styles.nav} aria-label="Footer navigation">
            {footerLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {year} Dezyon Store. All rights reserved.</p>
          <p>
            Built with passion for{" "}
            <span className={styles.accent}>gamers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
