"use client";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";

export const useSocialLinks = () => {
  const { portfolio } = usePortfolio();

  return [
    portfolio?.linkedin && {
      href: portfolio.linkedin,
      icon: <FaLinkedin />,
      label: "LinkedIn",
    },
    portfolio?.github && {
      href: portfolio.github,
      icon: <FaGithub />,
      label: "GitHub",
    },
    portfolio?.x && {
      href: portfolio.x,
      icon: <FaTwitter />,
      label: "X",
    },
    portfolio?.instagram && {
      href: portfolio.instagram,
      icon: <FaInstagram />,
      label: "Instagram",
    },
    portfolio?.facebook && {
      href: portfolio.facebook,
      icon: <FaFacebook />,
      label: "Facebook",
    },
  ].filter(Boolean);
};
