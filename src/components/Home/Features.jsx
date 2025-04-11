import React from "react";
import FeatureBox from "../ui/FeatureBox";
import {
  LayoutTemplate,
  Paintbrush,
  Globe,
  Rocket,
  Code2,
  Users,
} from "lucide-react";

export const featuresData = [
  {
    Icon: LayoutTemplate,
    title: "Beautiful Templates",
    description:
      "Choose from our collection of professionally designed templates.",
  },
  {
    Icon: Paintbrush,
    title: "Easy Customization",
    description:
      "Customize colors, fonts, and layout with our intuitive editor.",
  },
  {
    Icon: Globe,
    title: "Custom Domain",
    description: "Get your own professional domain name with one click.",
  },
  {
    Icon: Rocket,
    title: "Instant Deploy",
    description: "Deploy your portfolio instantly with our one-click solution.",
  },
  {
    Icon: Code2,
    title: "SEO Optimized",
    description: "Get found online with our SEO-friendly portfolio sites.",
  },
  {
    Icon: Users,
    title: "Growing Community",
    description: "Join thousands of professionals showcasing their work.",
  },
];

function Features() {
  return (
    <section className="flex flex-col my-12 px-5 gap-10 " id="features">
      <div>
        <h1 className="text-center text-2xl  lg:text-4xl font-bold text-neutral-900 mb-12">
          Everything You Need, Built Right In
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-12 mx-0 lg:mx-20">
          {featuresData.map((feature, index) => (
            <FeatureBox
              key={index}
              Icon={feature.Icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
