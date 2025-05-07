// src/Helpers/SocialLinks.jsx
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
// FaXTwitter does not exist, use FaTwitter instead
import { FaTwitter } from "react-icons/fa";

export const socialLinks = [
  {
    href: "https://linkedin.com/in/yourprofile",
    icon: <FaLinkedin className="text-xl text-[#0A66C2]" />,
    subtitle: "Connect",
    label: "LinkedIn",
  },
  {
    href: "https://github.com/yourprofile",
    icon: <FaGithub className="text-xl" />,
    subtitle: "Follow",
    label: "GitHub",
  },
  {
    href: "https://twitter.com/yourprofile",
    icon: <FaTwitter className="text-xl" />,
    subtitle: "Follow us",
    label: "Twitter",
  },
  {
    href: "https://instagram.com/yourprofile",
    icon: <FaInstagram className="text-xl text-[#E1306C]" />,
    subtitle: "Follow",
    label: "Instagram",
  },
];
