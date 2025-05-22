"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/utils";
import { useThemeContext } from "@/contexts/theme-context";
import { getContrastingTextColor } from "@/lib/utils/color-utils";

export interface ThemedBadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "outline" | "secondary" | "accent";
}

const ThemedBadge = forwardRef<HTMLDivElement, ThemedBadgeProps>(
    ({ className, variant = "default", ...props }, ref) => {
        const { currentTheme } = useThemeContext();

        // Determine styles based on variant
        const getStyles = () => {
            switch (variant) {
                case "default":
                    return {
                        backgroundColor: currentTheme.primary,
                        color: getContrastingTextColor(currentTheme.primary || ""),
                        border: "none"
                    };
                case "outline":
                    return {
                        backgroundColor: "transparent",
                        color: currentTheme.primary,
                        border: `1px solid ${currentTheme.primary}`
                    };
                case "secondary":
                    return {
                        backgroundColor: currentTheme.secondary,
                        color: getContrastingTextColor(currentTheme.secondary || ""),
                        border: "none"
                    };
                case "accent":
                    return {
                        backgroundColor: currentTheme.accent,
                        color: getContrastingTextColor(currentTheme.accent || ""),
                        border: "none"
                    };
                default:
                    return {};
            }
        };

        return (
            <div
                className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                    className
                )}
                ref={ref}
                style={{
                    ...getStyles(),
                    borderRadius: `${currentTheme.borderRadius}px`
                }}
                {...props}
            />
        );
    }
);

ThemedBadge.displayName = "ThemedBadge";

export { ThemedBadge };
