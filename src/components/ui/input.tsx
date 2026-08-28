import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-13 w-full min-w-0 rounded-[2px] border border-input bg-background/45 px-3.5 py-2 text-base text-foreground transition-[border-color,box-shadow,background-color] duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/75 focus-visible:border-ring focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-55 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
