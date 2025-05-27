import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary-500 hover:bg-primary-600 text-sm normal-case",
            card: "shadow-xl",
          },
        }}
      />
    </div>
  );
}
