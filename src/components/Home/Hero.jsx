import { useAuthContext } from "@/context/AuthContext";
import { Button } from "../ui/button";
import Link from "next/link";
import Preview from "./Preview";

const Hero = () => {
  const { user } = useAuthContext();

  return (
    <section className="flex-1 flex items-center justify-center  px-4 flex-col gap-6 lg:gap-8 mt-16 lg:mt-28 pb-5 lg:pb-10 ">
      <h1 className="text-4xl lg:text-7xl font-bold text-center ">
        Build Your{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
          Portfolio Website
        </span>
        <br className="hidden md:block" /> In Minutes
      </h1>
      <p className="text-lg lg:text-2xl font-base text-center">
        No code needed. Just you, your story, and a beautiful site to show it.
        <br className="hidden md:block" />
        One link to show the world who you are.
      </p>

      <Link
        href="/sign-up"
        className="bg-gradient-to-r from-primary-600 to-secondary-600 pointer text-white cursor-pointer text-md px-8 py-4 border-none hover:bg-primary-50 hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-full lg:text-lg"
      >
        Create
      </Link>
    </section>
  );
};

export default Hero;
