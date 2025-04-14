"use client";

import Navbar from "@/components/Home/Navbar";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="w-full h-full flex flex-col">
      <div className="flex flex-col item-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <Navbar />
        <div className="mt-12 mx-auto">
          <SignIn />
        </div>
      </div>
    </section>
  );
}
