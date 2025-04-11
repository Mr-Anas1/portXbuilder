import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="flex-1 flex items-center justify-center  px-4 flex-col gap-6 lg:gap-8 ">
      <h1 className="text-4xl lg:text-7xl font-bold text-center ">
        Build Your{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
          Portfolio Website
        </span>
        <br className="hidden md:block" /> In Minutes
      </h1>
      <p className="text-lg lg:text-2xl font-base text-center">
        No code needed. Just you, your story, and a beautiful site to show it.
        <br className="hidden md:block" />
        One link to show the world who you are.
      </p>

      <Button
        variant="outline"
        className="bg-white pointer text-lg text-primary-500 cursor-pointer px-8 py-7 border-none rounded-full hover:bg-primary-50"
      >
        Start Free Trail
      </Button>
    </section>
  );
};

export default Hero;
