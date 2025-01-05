"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      disabled={pending}
      aria-disabled={pending}
      className={cn("mt-4 w-full rounded-full")}
    >
      {children}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? "Loading" : "Submit"}
      </span>
    </Button>
  );
}
