import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faWhatsapp,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export const FOOTER_SOCIAL_ICONS: {
  label: string;
  href: string;
  icon: IconDefinition;
}[] = [
  { label: "Facebook", href: "#", icon: faFacebook },
  { label: "X", href: "#", icon: faXTwitter },
  { label: "Instagram", href: "#", icon: faInstagram },
  { label: "YouTube", href: "#", icon: faYoutube },
  { label: "WhatsApp", href: "#", icon: faWhatsapp },
  { label: "TikTok", href: "#", icon: faTiktok },
];
