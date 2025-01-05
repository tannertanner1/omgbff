import { ReactNode } from "react";
import { cn } from "@/lib/utils";

function PageWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("container mx-auto flex-grow w-full max-w-5xl", className)}
    >
      {children}
    </div>
  );
}

export { PageWrapper };
