"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faCode,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

const aboutData = [
  {
    icon: <FontAwesomeIcon icon={faUser} size="lg" />,
    label: "Name",
    value: "Sebastian Brooks",
  },
  {
    icon: <FontAwesomeIcon icon={faCode} size="lg" />,
    label: "Role",
    value: "Frontend Developer",
  },
  {
    icon: <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />,
    label: "Location",
    value: "Jakarta, Indonesia",
  },
  {
    icon: <FontAwesomeIcon icon={faEnvelope} size="lg" />,
    label: "Email",
    value: "sebastian@email.com",
  },
];

export default function AboutSection3({
  theme,
  isMobileLayout,
  setIsMobileLayout,
}) {
  return (
    <section
      className={`min-h-screen mx-auto px-6 py-16 md:px-20 flex flex-col ${
        isMobileLayout ? "md:px-4" : "lg:flex-row"
      } gap-10 items-center ${theme.bg}`}
    >
      <div className={`w-full ${isMobileLayout ? "text-center" : "lg:w-1/3"}`}>
        <h2 className={`text-4xl md:text-5xl font-bold ${theme.accentText}`}>
          About Me
        </h2>
      </div>

      <div
        className={`w-full ${
          isMobileLayout
            ? "flex flex-col justify-center gap-6"
            : "grid grid-cols-1 gap-6 lg:w-2/3 "
        } `}
      >
        {aboutData.map((item, index) => {
          const cardBg = theme[`card${index + 1}Bg`] || "";
          const cardText = theme[`card${index + 1}Text`] || "";

          return (
            <div
              key={index}
              className={`${
                isMobileLayout ? "w-full mb-4 p-5 text-center" : "group p-6"
              } ${cardBg} rounded-xl shadow-md ${
                isMobileLayout
                  ? ""
                  : "transition-all duration-300 transform hover:scale-105 hover:rounded-3xl cursor-pointer"
              }`}
            >
              <div
                className={`flex ${
                  isMobileLayout
                    ? "flex-col items-center gap-2"
                    : "items-center space-x-4"
                }`}
              >
                <div className={`${cardText}`}>{item.icon}</div>
                <div>
                  <p
                    className={`text-sm ${cardText} opacity-80 ${
                      isMobileLayout ? "mt-2" : ""
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className={`font-semibold ${cardText}`}>{item.value}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bio Box */}
        <div
          className={`sm:col-span-2 ${theme.bioBg} p-6 rounded-xl shadow-md ${
            isMobileLayout
              ? "mt-4 text-center"
              : "transition-all duration-300 transform hover:scale-105 hover:rounded-3xl"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-2 ${theme.card1Text} opacity-80`}
          >
            Bio
          </h3>
          <p
            className={`text-sm ${theme.card1Text} leading-relaxed ${
              isMobileLayout ? "text-center" : ""
            }`}
          >
            I'm a passionate frontend developer with a knack for crafting
            pixel-perfect UI and engaging user experiences. I love experimenting
            with animations, bento layouts, and clean responsive designs.
          </p>
        </div>
      </div>
    </section>
  );
}
