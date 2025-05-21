"use client";

import type React from "react";

import { cn } from "@/lib/utils";

interface ThemePreviewCardProps {
	theme: any;
	onApply: () => void;
}

export function ThemePreviewCard({ theme, onApply }: ThemePreviewCardProps) {
	return (
		<div className="border rounded-md p-4 bg-white/5 backdrop-blur-sm border-white/10">
			<h3 className="text-lg font-medium mb-2">{theme.name}</h3>
			<div className="flex space-x-2 mb-4">
				<div
					className="w-6 h-6 rounded-full"
					style={{ backgroundColor: theme.primary }}
				></div>
				<div
					className="w-6 h-6 rounded-full"
					style={{ backgroundColor: theme.secondary }}
				></div>
				<div
					className="w-6 h-6 rounded-full"
					style={{ backgroundColor: theme.accent }}
				></div>
			</div>
			<p className="text-sm text-white/70">
				Border Radius: {theme.borderRadius}px
			</p>
			<Button onClick={onApply} className="mt-4 w-full">
				Apply Theme
			</Button>
		</div>
	);
}

interface PropertyItemProps {
	label: string;
	value: string;
	color?: string;
}

export function PropertyItem({ label, value, color }: PropertyItemProps) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-sm font-medium text-white/70">{label}</span>
			<div className="flex items-center">
				{color && (
					<div
						className="w-4 h-4 rounded-full mr-2"
						style={{ backgroundColor: color }}
					></div>
				)}
				<span className="text-sm">{value}</span>
			</div>
		</div>
	);
}

interface DifferenceItemProps {
	label: string;
	value1: string;
	value2: string;
	color1?: string;
	color2?: string;
}

export function DifferenceItem({
	label,
	value1,
	value2,
	color1,
	color2,
}: DifferenceItemProps) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-sm font-medium text-white/70">{label}</span>
			<div className="flex items-center space-x-4">
				<div className="flex items-center">
					{color1 && (
						<div
							className="w-4 h-4 rounded-full mr-2"
							style={{ backgroundColor: color1 }}
						></div>
					)}
					<span className="text-sm">{value1}</span>
				</div>
				<span className="text-sm">→</span>
				<div className="flex items-center">
					{color2 && (
						<div
							className="w-4 h-4 rounded-full mr-2"
							style={{ backgroundColor: color2 }}
						></div>
					)}
					<span className="text-sm">{value2}</span>
				</div>
			</div>
		</div>
	);
}

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

function Button({ children, onClick, className }: ButtonProps) {
	return (
		<button
			className={cn(
				"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2",
				className,
			)}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
