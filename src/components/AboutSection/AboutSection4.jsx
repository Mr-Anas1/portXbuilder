"use client";

import { usePortfolio } from "@/context/PortfolioContext";

export default function AboutSection3({ theme, isMobileLayout }) {
  const { portfolio, loading } = usePortfolio();

  if (loading) return <p>Loading...</p>;
  if (!portfolio) return <p>No portfolio data found.</p>;
  return (
    <section
      className={`w-full min-h-screen flex items-center justify-center px-6 md:px-20 py-24 ${theme.bg}`}
    >
      <div
        className={`max-w-7xl mx-auto flex ${
          isMobileLayout ? "flex-col" : "md:flex-row"
        } items-center gap-12`}
      >
        {/* Left Side: WHO? */}
        <div
          className={`w-full ${
            isMobileLayout ? "" : "md:w-1/2"
          } flex items-center justify-center`}
        >
          <h2
            className={`${
              isMobileLayout ? "text-5xl" : "text-6xl md:text-8xl"
            } font-bold ${theme.accentText} tracking-wide`}
          >
            WHO <span className={theme.text}>?</span>
          </h2>
        </div>

        {/* Right Side: About Content */}
        <div
          className={`w-full ${
            isMobileLayout ? "text-center" : "md:w-1/2 text-start"
          } space-y-6 ${theme.text}`}
        >
          <h3 className="text-3xl md:text-4xl font-semibold">About me</h3>
          <p className="text-lg leading-relaxed">{portfolio.about_me}</p>

          {/* Skills Tags */}
          <div
            className={`flex flex-wrap gap-4 pt-4 ${
              isMobileLayout ? "justify-center  text-center" : " text-start"
            }`}
          >
            {portfolio.skills?.map((skill, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-full ${theme.card1Bg} text-sm font-medium ${theme.card1Text} shadow-sm hover:shadow-md transition`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
