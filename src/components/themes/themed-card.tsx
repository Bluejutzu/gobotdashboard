"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/utils";

export interface ThemedCardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "outline" | "ghost";
}

const ThemedCard = forwardRef<HTMLDivElement, ThemedCardProps>(({ className, variant = "default", ...props }, ref) => {
    return (
        <div
            className={cn(
                "rounded-[var(--theme-radius)]",
                {
                    "bg-white/5 backdrop-blur-sm border border-white/10": variant === "default",
                    "border border-[var(--theme-primary)]": variant === "outline",
                    "bg-transparent": variant === "ghost"
                },
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

ThemedCard.displayName = "ThemedCard";

export { ThemedCard };
