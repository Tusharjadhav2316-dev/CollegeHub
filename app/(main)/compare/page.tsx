import { Suspense } from "react";
import CompareClient from "@/components/college/CompareClient";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Colleges — CampusPilot",
  description:
    "Compare up to 4 colleges side by side. Evaluate NIRF rankings, fees, placements, ratings and courses to make the best decision.",
};

function CompareLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareLoading />}>
      <CompareClient />
    </Suspense>
  );
}
