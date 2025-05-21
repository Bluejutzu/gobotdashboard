"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useThemeStyles } from "@/hooks/use-theme-styles";

export interface ThemedButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	colorScheme?: "primary" | "secondary" | "accent";
}

const ThemedButton = forwardRef<HTMLButtonElement, ThemedButtonProps>(
	(
		{
			className,
			variant = "default",
			size = "default",
			colorScheme = "primary",
			...props
		},
		ref,
	) => {
		const themeStyles = useThemeStyles();

		// Base styles that apply to all variants
		const baseStyles = {
			borderRadius: themeStyles.borderRadius,
		};

		// Variant-specific styles
		const variantStyles = {
			default: {
				backgroundColor: themeStyles[colorScheme],
				color: themeStyles[`${colorScheme}Text`],
				border: "none",
			},
			outline: {
				backgroundColor: "transparent",
				color: themeStyles[colorScheme],
				border: `1px solid ${themeStyles[colorScheme]}`,
			},
			ghost: {
				backgroundColor: "transparent",
				color: themeStyles[colorScheme],
				border: "none",
			},
			link: {
				backgroundColor: "transparent",
				color: themeStyles[colorScheme],
				border: "none",
				textDecoration: "underline",
			},
		};

		// Size-specific styles
		const sizeStyles = {
			default: {
				padding: "0.5rem 1rem",
				fontSize: "1rem",
			},
			sm: {
				padding: "0.25rem 0.5rem",
				fontSize: "0.875rem",
			},
			lg: {
				padding: "0.75rem 1.5rem",
				fontSize: "1.125rem",
			},
			icon: {
				padding: "0.5rem",
				fontSize: "1rem",
				aspectRatio: "1/1",
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
			},
		};

		// Combine all styles
		const styles = {
			...baseStyles,
			...variantStyles[variant],
			...sizeStyles[size],
		};

		return (
			<button
				className={cn(
					"inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50",
					className,
				)}
				ref={ref}
				style={styles}
				{...props}
			/>
		);
	},
);

ThemedButton.displayName = "ThemedButton";

export { ThemedButton };
