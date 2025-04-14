import { SignUp } from "@clerk/nextjs";
import Navbar from "@/components/Home/Navbar";

export default function Page() {
  return (
    <section className="w-full h-full flex flex-col">
      <div className="flex flex-col item-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <Navbar />
        <div className="mt-12 mx-auto">
          <SignUp />
        </div>
      </div>
    </section>
  );
}
