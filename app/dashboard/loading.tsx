import { LoadingDots } from "@/components/loading-dots";

export default function LoadingPage() {
  return (
    <div
      className="flex h-screen items-start justify-center pt-[40vh]"
      aria-label="Loading"
    >
      <LoadingDots color="bg-primary" size="medium" />
    </div>
  );
}
