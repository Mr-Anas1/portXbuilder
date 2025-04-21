import { SignIn } from "@clerk/clerk-react";
import React from "react";

const Review = () => {
  return (
    <section className="w-full  max-w-[80%] sm:max-w-lg lg:max-w-xl  rounded-xl px-6 py-8">
      <h2 className="text-2xl lg:4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
        Sign Up
      </h2>
      <p className="mx-sm">
        Create a FREE Account to Build & Publish Your Portfolio
      </p>

      <div>
        <div className="flex flex-col item-center text-white">
          <div className="mt-6 mx-auto">
            <SignIn
              appearance={{
                elements: {
                  card: {
                    boxShadow: "none !important",
                    backgroundColor: "bg-white/80",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;
