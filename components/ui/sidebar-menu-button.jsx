"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export const SidebarMenuButton = React.forwardRef(
  ({ className, asChild = false, isActive = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          "w-full text-left px-4 py-2 hover:bg-muted",
          isActive && "bg-muted font-semibold text-primary",
          className
        )}
        {...props}
      />
    )
  }
)

SidebarMenuButton.displayName = "SidebarMenuButton"
