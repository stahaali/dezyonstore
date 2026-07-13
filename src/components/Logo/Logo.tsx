import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.css";
import { siteLogo } from "@/data/site-assets";

interface LogoProps {
  className?: string;
  onClick?: () => void;
  variant?: "header" | "footer";
}

export default function Logo({
  className,
  onClick,
  variant = "header",
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`${styles.logo} ${variant === "footer" ? styles.footerLogo : ""} ${className ?? ""}`}
      onClick={onClick}
    >
      <Image
        src={siteLogo}
        alt="Dezyon Store"
        width={320}
        height={104}
        className={styles.image}
        priority={variant === "header"}
      />
    </Link>
  );
}
