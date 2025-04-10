import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { BriefcaseBusiness } from "lucide-react";

const Navbar = () => {
  return (
    <section>
      <div className="h-16 flex justify-between items-center px-20 py-10">
        <div className="flex justify-center items-center gap-2.5">
          <BriefcaseBusiness size={38} />
          <div className="text-xl font-bold">Port X Builder</div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-10">
          <Link href={"#features"} className="cursor-pointer">
            Features
          </Link>
          <Link href={"#pricing"} className="cursor pointer">
            Pricing
          </Link>
          <Link href={"#templates"} className="cursor pointer">
            Templates
          </Link>
        </div>

        <div>
          <Button
            variant="outline"
            className="bg-white pointer text-primary-500 cursor-pointer text-md px-8 py-6 border-none rounded-xl hover:bg-primary-50"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
