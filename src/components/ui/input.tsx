
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border-2 border-cosmic-teal bg-cosmic-indigo/50 px-3 py-2 text-base text-cosmic-ethereal-glow ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-cosmic-silver/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold focus-visible:ring-offset-2 focus-visible:border-cosmic-gold disabled:cursor-not-allowed disabled:opacity-50 md:text-sm backdrop-blur-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
