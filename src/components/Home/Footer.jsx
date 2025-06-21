import { Instagram, Linkedin, TwitterIcon, X } from "lucide-react";
import React from "react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <section className="bg-gray-900 text-gray-300 py-16">
      <div className="flex flex-col gap-6 justify-center items-center">
        <div className="flex flex-wrap gap-6 justify-center items-center text-gray-300">
          <Link
            href={"/"}
            className="cursor-pointer  hover:text-secondary-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href={"#features"}
            className="cursor-pointer  hover:text-secondary-500 transition-colors"
          >
            Features
          </Link>
          <Link
            href={"#pricing"}
            className="cursor-pointer  hover:text-secondary-500 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href={"#template"}
            className="cursor-pointer  hover:text-secondary-500 transition-colors"
          >
            Templates
          </Link>
          <Link
            href={"/privacy-policy"}
            className="cursor-pointer  hover:text-secondary-500 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href={"/terms-and-conditions"}
            className="cursor-pointer  hover:text-secondary-500 transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link
            href={"/subscription-policy"}
            className="cursor-pointer  hover:text-secondary-500 transition-colors"
          >
            Subscription Policy
          </Link>
        </div>

        <div className="flex justify-center item-center gap-6 py-5 md:py-0">
          <Linkedin className="h-6 w-6 cursor-pointer  hover:text-secondary-500 transition-colors" />
          <Instagram className="h-6 w-6 cursor-pointer  hover:text-secondary-500 transition-colors" />
          <TwitterIcon className="h-6 w-6 cursor-pointer  hover:text-secondary-500 transition-colors" />
        </div>

        <div className="copyright-content">© Copyright {year} PortXBuilder</div>
      </div>
    </section>
  );
};

export default Footer;
