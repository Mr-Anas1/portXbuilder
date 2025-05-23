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
  setEditingSection,
  componentMeta,
}) => {
  return (
    <section
      ref={innerRef}
      id={id}
      className={`${theme.bg}  relative group border-2 hover:border-primary-500 border-transparent transition-all duration-300`}
    >
      {componentMeta?.type === "pro" && (
        <span className="absolute top-2 right-2 md:right-auto md:left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          PRO
        </span>
      )}

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

      <button
        onClick={() => setEditingSection(id)}
        className="hidden md:block absolute top-2 right-20 z-10 px-2 py-1 rounded-md text-white text-sm cursor-pointer font-base transition-all duration-200 ease-in bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105 opacity-0 group-hover:opacity-100"
      >
        Edit
      </button>

      {/* Mobile: always show small icon */}
      <button
        onClick={() => changeFunction(id, componentList)}
        className="md:hidden absolute top-1 left-1 z-10 px-1 py-1 rounded-md text-white text-sm cursor-pointer font-base transition-all duration-200 ease-in bg-gradient-to-r from-primary-500 to-secondary-500"
      >
        {/* <Pen size={16} /> */}
        Change
      </button>

      <button
        onClick={() => setEditingSection(id)}
        className="md:hidden absolute top-1 left-16 z-10 px-2 py-1 rounded-md text-white text-sm cursor-pointer font-base transition-all duration-200 ease-in bg-gradient-to-r from-primary-500 to-secondary-500 "
      >
        Edit
      </button>
    </section>
  );
};

export default SectionWrapper;
