import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import Section from "@/components/Section/Section";
import ContactForm from "./ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Dezyon Store — we're here to help with product questions and recommendations.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Reach Out"
        title="Contact Us"
        description="Have a question about our products or need help choosing the right gear? We'd love to hear from you."
      />

      <Section label="Get in Touch" title="We're Here to Help">
        <div className={styles.contactGrid}>
          <div>
            <div className={styles.infoBlock}>
              <div>
                <p className={styles.country}>
                  <span className={styles.countryFlag} aria-hidden="true">
                    🇨🇦
                  </span>
                  Canada
                </p>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon} aria-hidden="true">
                    📍
                  </div>
                  <div>
                    <p className={styles.infoLabel}>Address</p>
                    <p className={styles.infoValue}>
                      2465 Finch Ave W
                      <br />
                      North York, ON M9M 2G1
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon} aria-hidden="true">
                  ✉️
                </div>
                <div>
                  <p className={styles.infoLabel}>Email</p>
                  <p className={styles.infoValue}>
                    <a href="mailto:hello@dezyonstudio.inc">hello@dezyonstudio.inc</a>
                  </p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon} aria-hidden="true">
                  📞
                </div>
                <div>
                  <p className={styles.infoLabel}>Phone</p>
                  <p className={styles.infoValue}>
                    <a href="tel:+12265010914">+1 226-501-0914</a>
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.hours}>
              <p className={styles.hoursTitle}>Store Hours</p>
              <div className={styles.hoursRow}>
                <span className={styles.hoursDay}>Monday – Friday</span>
                <span>9:00 AM – 8:00 PM</span>
              </div>
              <div className={styles.hoursRow}>
                <span className={styles.hoursDay}>Saturday</span>
                <span>10:00 AM – 6:00 PM</span>
              </div>
              <div className={styles.hoursRow}>
                <span className={styles.hoursDay}>Sunday</span>
                <span>12:00 PM – 5:00 PM</span>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </Section>
    </>
  );
}
