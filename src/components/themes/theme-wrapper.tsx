"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useThemeContext } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

interface ThemeWrapperProps {
	children: ReactNode;
	className?: string;
	applyBorderRadius?: boolean;
	applyBackground?: boolean;
	applyTextColor?: boolean;
	applyBorder?: boolean;
}

export function ThemeWrapper({
	children,
	className,
	applyBorderRadius = true,
	applyBackground = false,
	applyTextColor = false,
	applyBorder = false,
}: ThemeWrapperProps) {
	const { currentTheme } = useThemeContext();
	const [themeStyles, setThemeStyles] = useState<Record<string, string>>({});

	useEffect(() => {
		const styles: Record<string, string> = {};

		if (applyBorderRadius) {
			styles.borderRadius = `${currentTheme.borderRadius}px`;
		}

		if (applyBackground) {
			styles.backgroundColor = currentTheme.primary || "";
		}

		if (applyTextColor) {
			styles.color = currentTheme.primary || "";
		}

		if (applyBorder) {
			styles.borderColor = currentTheme.primary || "";
		}

		setThemeStyles(styles);
	}, [
		currentTheme,
		applyBorderRadius,
		applyBackground,
		applyTextColor,
		applyBorder,
	]);

	return (
		<div className={cn(className)} style={themeStyles}>
			{children}
		</div>
	);
}
