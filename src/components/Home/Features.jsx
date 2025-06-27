import React from "react";
import {
  LayoutTemplate,
  Paintbrush,
  Globe,
  Code2,
  Users,
  Link2,
} from "lucide-react";

const iconColors = [
  "text-primary-500",
  "text-secondary-500",
  "text-green-500",
  "text-blue-500",
  "text-yellow-500",
  "text-pink-500",
];

export const featuresData = [
  {
    Icon: LayoutTemplate,
    title: "Component Designs",
    description:
      "Choose from a variety of beautiful designs for each section of your portfolio.",
  },
  {
    Icon: Paintbrush,
    title: "Easy Customization",
    description:
      "Personalize colors, fonts, and layout with our intuitive editor.",
  },
  {
    Icon: Link2,
    title: "Unique Portfolio Link",
    description:
      "Get a unique, shareable link for your site that you can send to anyone.",
  },
  {
    Icon: Globe,
    title: "SEO Optimized",
    description: "Be discoverable on Google and other search engines.",
  },
  {
    Icon: Code2,
    title: "Portfolio URL",
    description: "Get a unique, shareable link for your portfolio instantly.",
  },
  {
    Icon: Users,
    title: "Growing Community",
    description: "Join thousands of professionals showcasing their work.",
  },
];

function Features() {
  return (
    <section
      className="flex flex-col my-24 px-5 gap-10 bg-gradient-to-b from-background to-primary-50/30 py-16 rounded-3xl shadow-inner"
      id="features"
    >
      <div>
        <h1 className="text-center text-3xl lg:text-5xl font-bold text-neutral-900 mb-20">
          Key Features
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mx-0 lg:mx-20">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-white/90 border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-md"
            >
              <feature.Icon
                className={`h-12 w-12 mb-4 ${
                  iconColors[index % iconColors.length]
                }`}
              />
              <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
