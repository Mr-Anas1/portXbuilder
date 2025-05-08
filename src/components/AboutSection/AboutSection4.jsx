"use client";

export default function AboutSection3({ theme }) {
  return (
    <section
      className={`w-full min-h-screen flex items-center justify-center px-6 md:px-20 py-24 ${theme.bg}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Side: WHO? */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <h2
            className={`text-6xl md:text-8xl font-bold ${theme.accentText} tracking-wide`}
          >
            WHO <span className={theme.text}>?</span>
          </h2>
        </div>

        {/* Right Side: About Content */}
        <div className={`w-full md:w-1/2 space-y-6 ${theme.text}`}>
          <h3 className="text-center md:text-start text-3xl md:text-4xl font-semibold">
            About me
          </h3>
          <p className="text-center md:text-start text-lg leading-relaxed">
            I'm{" "}
            <span className={`${theme.accentText} font-medium`}>
              Mohamed Anas
            </span>
            , a self-taught frontend developer with a focus on creating
            beautiful, accessible, and performant interfaces. Over the past
            year, I've grown confident in building with HTML, CSS, JavaScript,
            and React.
          </p>

          {/* Skills Tags */}
          <div className="text-center md:text-start flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            {["HTML", "CSS", "JS", "React", "Git", "UI/UX"].map(
              (skill, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 rounded-full ${theme.card1Bg} text-sm font-medium ${theme.card1Text} shadow-sm hover:shadow-md transition`}
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
