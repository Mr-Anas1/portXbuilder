import { Loader2 } from "lucide-react";

export default function FullPageLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <p className="text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
}
