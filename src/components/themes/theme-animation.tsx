"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/utils";

interface ThemeAnimationProps {
    isActive: boolean;
    primaryColor: string;
    accentColor: string;
    onAnimationComplete?: () => void;
}

export function ThemeAnimation({ isActive, primaryColor, accentColor, onAnimationComplete }: ThemeAnimationProps) {
    const [animationStage, setAnimationStage] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        // Animation sequence
        const stage1 = setTimeout(() => setAnimationStage(1), 100);
        const stage2 = setTimeout(() => setAnimationStage(2), 400);
        const stage3 = setTimeout(() => setAnimationStage(3), 700);
        const stage4 = setTimeout(() => {
            setAnimationStage(4);
            if (onAnimationComplete) onAnimationComplete();
        }, 1000);

        return () => {
            clearTimeout(stage1);
            clearTimeout(stage2);
            clearTimeout(stage3);
            clearTimeout(stage4);
        };
    }, [isActive, onAnimationComplete]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {/* Background overlay */}
            <div
                className={cn(
                    "absolute inset-0 bg-black transition-opacity duration-500",
                    animationStage >= 1 ? "opacity-50" : "opacity-0"
                )}
            />

            {/* Center ripple */}
            <div
                className={cn(
                    "relative w-20 h-20 rounded-full transition-transform duration-500",
                    animationStage >= 2 ? "scale-100" : "scale-0"
                )}
                style={{ backgroundColor: primaryColor }}
            >
                {/* Ripple effects */}
                <div
                    className="absolute inset-0 rounded-full animate-ripple"
                    style={{ backgroundColor: primaryColor }}
                />
                <div
                    className="absolute inset-0 rounded-full animate-ripple animation-delay-200"
                    style={{ backgroundColor: accentColor }}
                />

                {/* Inner circle */}
                <div
                    className="absolute inset-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                >
                    <div
                        className={cn(
                            "w-6 h-6 rounded-full transition-transform duration-300",
                            animationStage >= 3 ? "scale-0" : "scale-100"
                        )}
                        style={{ backgroundColor: primaryColor }}
                    />
                </div>

                {/* Additional animated elements */}
                <div
                    className={cn(
                        "absolute -top-10 -left-10 w-6 h-6 rounded-full bg-white/80 transition-all duration-700",
                        animationStage >= 3
                            ? "opacity-100 translate-x-4 translate-y-4"
                            : "opacity-0 translate-x-0 translate-y-0"
                    )}
                />
                <div
                    className={cn(
                        "absolute -bottom-10 -right-10 w-6 h-6 rounded-full bg-white/80 transition-all duration-700",
                        animationStage >= 3
                            ? "opacity-100 translate-x-4 translate-y-4"
                            : "opacity-0 translate-x-0 translate-y-0"
                    )}
                />

                {/* Pulse effect */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full border-4 border-white/30 transition-all duration-500",
                        animationStage >= 4 ? "opacity-0 scale-150" : "opacity-100 scale-100"
                    )}
                />
            </div>
        </div>
    );
}
