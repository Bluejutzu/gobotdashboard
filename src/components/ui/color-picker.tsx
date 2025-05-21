"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps {
	color: string;
	onChange: (color: string) => void;
	label?: string;
	className?: string;
	popoverAlign?: "start" | "center" | "end";
}

export function ColorPicker({
	color,
	onChange,
	label,
	className,
	popoverAlign = "center",
}: ColorPickerProps) {
	const [localColor, setLocalColor] = useState(color);
	const [isOpen, setIsOpen] = useState(false);
	const colorPickerRef = useRef<HTMLInputElement>(null);

	// Sync local state with prop
	useEffect(() => {
		setLocalColor(color);
	}, [color]);

	// Handle color input change
	const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value;
		setLocalColor(newColor);
		onChange(newColor);
	};

	// Handle hex input change
	const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newColor = e.target.value;

		// Add # if missing
		if (newColor && !newColor.startsWith("#")) {
			newColor = `#${newColor}`;
		}

		// Only update if it's a valid hex color or empty
		if (newColor === "" || /^#([A-Fa-f0-9]{3}){1,2}$/.test(newColor)) {
			setLocalColor(newColor);
			onChange(newColor);
		}
	};

	// Handle click on color swatch
	const handleSwatchClick = () => {
		if (colorPickerRef.current) {
			colorPickerRef.current.click();
		}
	};

	// Predefined color swatches
	const colorSwatches = [
		"#0ea5e9", // blue
		"#8b5cf6", // purple
		"#10b981", // green
		"#f97316", // orange
		"#ef4444", // red
		"#f59e0b", // amber
		"#6366f1", // indigo
		"#ec4899", // pink
		"#14b8a6", // teal
		"#64748b", // slate
		"#1e293b", // dark
		"#f8fafc", // light
	];

	return (
		<div className={cn("space-y-2", className)}>
			{label && <Label>{label}</Label>}

			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<button
						type="button"
						className={cn(
							"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
							isOpen && "ring-2 ring-ring ring-offset-2",
						)}
					>
						<div className="flex items-center gap-2">
							<div
								className="h-6 w-6 rounded-full border shadow-sm"
								style={{ backgroundColor: localColor }}
								onClick={handleSwatchClick}
							/>
							<span>{localColor}</span>
						</div>
						<input
							ref={colorPickerRef}
							type="color"
							value={localColor}
							onChange={handleColorChange}
							className="sr-only"
						/>
					</button>
				</PopoverTrigger>
				<PopoverContent
					className="w-64 p-3"
					align={popoverAlign}
					sideOffset={5}
				>
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<div
								className="h-8 w-8 rounded-full border shadow-sm cursor-pointer"
								style={{ backgroundColor: localColor }}
								onClick={handleSwatchClick}
							/>
							<Input
								value={localColor}
								onChange={handleHexChange}
								className="flex-1"
								placeholder="#000000"
							/>
						</div>

						<div>
							<Label className="text-xs">Color Swatches</Label>
							<div className="mt-1.5 grid grid-cols-6 gap-2">
								{colorSwatches.map((swatch) => (
									<button
										key={swatch}
										type="button"
										className={cn(
											"h-6 w-6 rounded-full border shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
											localColor === swatch && "ring-2 ring-ring ring-offset-2",
										)}
										style={{ backgroundColor: swatch }}
										onClick={() => {
											setLocalColor(swatch);
											onChange(swatch);
										}}
										title={swatch}
									/>
								))}
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
