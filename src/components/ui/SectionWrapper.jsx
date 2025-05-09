import { Pen } from "lucide-react";

const SectionWrapper = ({
  id,
  innerRef,
  Component,
  theme,
  handleScrollToSection,
  changeFunction,
  componentList,
  isMobileLayout,
  setIsMobileLayout,
}) => {
  return (
    <section
      ref={innerRef}
      id={id}
      className="relative group border-2 border-transparent hover:border-primary-500 transition-all duration-300"
    >
      <Component
        theme={theme}
        handleScrollToSection={handleScrollToSection}
        isMobileLayout={isMobileLayout}
        setIsMobileLayout={setIsMobileLayout}
      />

      {/* Desktop: floating 'Change' button on hover */}
      <button
        onClick={() => changeFunction(id, componentList)}
        className="hidden md:block absolute top-2 right-2 z-10 px-2 py-1 rounded-md text-white text-sm cursor-pointer font-base transition-all duration-200 ease-in bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105 opacity-0 group-hover:opacity-100"
      >
        Change
      </button>

      {/* Mobile: always show small icon */}
      <button
        onClick={() => changeFunction(id, componentList)}
        className="md:hidden absolute top-0 left-1 z-10 px-1 py-1 rounded-md text-white text-sm cursor-pointer font-base transition-all duration-200 ease-in bg-gradient-to-r from-primary-500 to-secondary-500"
      >
        <Pen size={16} />
      </button>
    </section>
  );
};

export default SectionWrapper;
