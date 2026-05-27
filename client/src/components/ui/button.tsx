import * as React from "react";
import { cn } from "@/lib/utils";

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="button"
      className={cn(
        "inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export { Button };
