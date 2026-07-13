import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader/PageHeader";
import Section from "@/components/Section/Section";
import { pageHeaderStyles } from "@/components/PageHeader/PageHeader";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Dezyon Store — our mission, values, and passion for gaming excellence.",
};

const values = [
  {
    icon: "⚡",
    title: "Performance",
    description: "Every product meets our strict standards for speed, reliability, and durability.",
  },
  {
    icon: "🎯",
    title: "Precision",
    description: "We curate only gear that delivers measurable improvements to your experience.",
  },
  {
    icon: "🤝",
    title: "Trust",
    description: "Transparent pricing, honest recommendations, and dedicated customer support.",
  },
  {
    icon: "🚀",
    title: "Innovation",
    description: "Always ahead of the curve with the latest in gaming technology and design.",
  },
];

const team = [
  { name: "Alex Rivera", role: "Founder & CEO", initials: "AR" },
  { name: "Jordan Lee", role: "Head of Curation", initials: "JL" },
  { name: "Sam Chen", role: "Customer Experience", initials: "SC" },
  { name: "Taylor Brooks", role: "Technical Advisor", initials: "TB" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="Our Story"
        title="About Dezyon Store"
        description="We're a premium gaming store built by enthusiasts, for enthusiasts — dedicated to helping you find gear that truly performs."
      />

      <Section label="Who We Are" title="Built for Gamers">
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
            <h3>Our Mission</h3>
            <p>
              At Dezyon Store, we believe every gamer deserves access to premium
              hardware without the guesswork. We hand-select every product in our
              catalog, testing and evaluating each item to ensure it meets the
              standards we&apos;d expect in our own setups.
            </p>
            <p>
              What started as a small passion project among friends has grown into
              a trusted destination for thousands of gamers worldwide. We&apos;re not
              just a store — we&apos;re a community of people who live and breathe
              gaming culture.
            </p>
          </div>
          <div className={styles.imageBlock}>
            <Image
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"
              alt="Gaming setup"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className={styles.valuesGrid}>
          {values.map((value) => (
            <div key={value.title} className={styles.valueCard}>
              <div className={styles.valueIcon}>{value.icon}</div>
              <h4 className={styles.valueTitle}>{value.title}</h4>
              <p className={styles.valueDesc}>{value.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.teamSection}>
          <span className={pageHeaderStyles.label}>The Team</span>
          <h2 className={pageHeaderStyles.title} style={{ fontSize: "1.75rem" }}>
            Meet the People Behind the Store
          </h2>
          <div className={styles.teamGrid}>
            {team.map((member) => (
              <div key={member.name} className={styles.teamCard}>
                <div className={styles.teamAvatar}>{member.initials}</div>
                <p className={styles.teamName}>{member.name}</p>
                <p className={styles.teamRole}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
