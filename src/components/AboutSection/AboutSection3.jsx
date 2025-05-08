"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faCode,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

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

export default function AboutSection3({ theme }) {
  // Get the theme colors

  return (
    <section
      className={`min-h-screen  mx-auto px-6 py-16 md:px-20  flex flex-col lg:flex-row gap-10 items-center ${theme.bg}`}
    >
      <div className="w-full lg:w-1/3">
        <h2 className={`text-4xl md:text-5xl font-bold ${theme.accentText}`}>
          About Me
        </h2>
      </div>

      <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {aboutData.map((item, index) => {
          let cardBg = "";
          let cardText = "";

          if (index === 0) {
            cardBg = theme.card1Bg;
            cardText = theme.card1Text;
          } else if (index === 1) {
            cardBg = theme.card2Bg;
            cardText = theme.card2Text;
          } else if (index === 2) {
            cardBg = theme.card3Bg;
            cardText = theme.card3Text;
          } else if (index === 3) {
            cardBg = theme.card4Bg;
            cardText = theme.card4Text;
          }

          return (
            <div
              key={index}
              className={`group ${cardBg} p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:rounded-3xl cursor-pointer`}
            >
              <div className="flex items-center space-x-4">
                <div className={`${cardText}`}>{item.icon}</div>
                <div>
                  <p className={`text-sm ${cardText} opacity-80`}>
                    {item.label}
                  </p>
                  <p className={`font-semibold ${cardText}`}>{item.value}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bio Box (2-column wide) */}
        <div
          className={`sm:col-span-2 ${theme.bioBg} p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:rounded-3xl`}
        >
          <h3
            className={`text-lg font-semibold mb-2 ${theme.card1Text} opacity-80`}
          >
            Bio
          </h3>
          <p className={`text-sm ${theme.card1Text} leading-relaxed`}>
            I'm a passionate frontend developer with a knack for crafting
            pixel-perfect UI and engaging user experiences. I love experimenting
            with animations, bento layouts, and clean responsive designs.
          </p>
        </div>
      </div>
    </section>
  );
}
