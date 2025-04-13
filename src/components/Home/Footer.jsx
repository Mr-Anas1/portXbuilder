import { Instagram, Linkedin, TwitterIcon, X } from "lucide-react";
import React from "react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <section className="bg-gray-900 text-gray-300 py-20">
      <div className="flex flex-col gap-6 justify-center items-center">
        <div className="flex flex-wrap gap-6 justify-center items-center text-gray-300">
          <Link
            href={"/"}
            className="cursor-pointer hover:text-yellow-300 transition-colors"
          >
            Home
          </Link>
          <Link
            href={"#features"}
            className="cursor-pointer hover:text-yellow-300 transition-colors"
          >
            Features
          </Link>
          <Link
            href={"#pricing"}
            className="cursor-pointer hover:text-yellow-300 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href={"#template"}
            className="cursor-pointer hover:text-yellow-300 transition-colors"
          >
            Templates
          </Link>
          <Link
            href={"/policy"}
            className="cursor-pointer hover:text-yellow-300 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href={"/terms"}
            className="cursor-pointer hover:text-yellow-300 transition-colors"
          >
            Terms and Conditions
          </Link>
        </div>

        <div className="flex justify-center item-center gap-6 py-5 md: py-0">
          <Linkedin className="h-6 w-6 cursor-pointer hover:text-yellow-300 transition-colors" />
          <Instagram className="h-6 w-6 cursor-pointer hover:text-yellow-300 transition-colors" />
          <TwitterIcon className="h-6 w-6 cursor-pointer hover:text-yellow-300 transition-colors" />
        </div>

        <div className="copyright-content">© Copyright {year} PortXBuilder</div>
      </div>
    </section>
  );
};

export default Footer;
