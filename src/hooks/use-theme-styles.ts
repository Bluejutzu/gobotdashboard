"use client";

import { useEffect, useState } from "react";
import { useThemeContext } from "@/contexts/theme-context";
import { darkenColor, getContrastingTextColor } from "@/lib/color-utils";

interface ThemeStyles {
    primary: string;
    secondary: string;
    accent: string;
    borderRadius: string;
    primaryHover: string;
    secondaryHover: string;
    accentHover: string;
    primaryActive: string;
    secondaryActive: string;
    accentActive: string;
    primaryText: string;
    secondaryText: string;
    accentText: string;
}

export function useThemeStyles(): ThemeStyles {
    const { currentTheme } = useThemeContext();
    const [styles, setStyles] = useState<ThemeStyles>({
        primary: "#0ea5e9",
        secondary: "#f1f5f9",
        accent: "#6366f1",
        borderRadius: "8px",
        primaryHover: "#0284c7",
        secondaryHover: "#e2e8f0",
        accentHover: "#4f46e5",
        primaryActive: "#0369a1",
        secondaryActive: "#cbd5e1",
        accentActive: "#4338ca",
        primaryText: "#ffffff",
        secondaryText: "#000000",
        accentText: "#ffffff"
    });

    useEffect(() => {
        if (currentTheme.primary && currentTheme.secondary && currentTheme.accent) {
            setStyles({
                primary: currentTheme.primary,
                secondary: currentTheme.secondary,
                accent: currentTheme.accent,
                borderRadius: `${currentTheme.borderRadius}px`,
                primaryHover: darkenColor(currentTheme.primary, 10),
                secondaryHover: darkenColor(currentTheme.secondary, 5),
                accentHover: darkenColor(currentTheme.accent, 10),
                primaryActive: darkenColor(currentTheme.primary, 15),
                secondaryActive: darkenColor(currentTheme.secondary, 10),
                accentActive: darkenColor(currentTheme.accent, 15),
                primaryText: getContrastingTextColor(currentTheme.primary),
                secondaryText: getContrastingTextColor(currentTheme.secondary),
                accentText: getContrastingTextColor(currentTheme.accent)
            });
        }
    }, [currentTheme]);

    return styles;
}
