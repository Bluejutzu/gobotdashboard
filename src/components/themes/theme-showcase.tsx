"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ThemeData } from "@/lib/types/types";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface ThemeShowcaseProps {
	themes: ThemeData[];
	onApply: (theme: ThemeData) => void;
	onClose: () => void;
}

export function ThemeShowcase({
	themes,
	onApply,
	onClose,
}: ThemeShowcaseProps) {
	const [activeThemeIndex, setActiveThemeIndex] = useState(0);
	const activeTheme = themes[activeThemeIndex];

	const goToNextTheme = () => {
		setActiveThemeIndex((prev) => (prev + 1) % themes.length);
	};

	const goToPrevTheme = () => {
		setActiveThemeIndex((prev) => (prev - 1 + themes.length) % themes.length);
	};

	if (!themes.length) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-6 text-center">
				<p className="text-white/60 mb-4">No themes available to showcase.</p>
				<Button onClick={onClose}>Back to Themes</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto">
				<div className="p-6">
					{/* Theme Navigation */}
					<div className="flex items-center justify-between mb-6">
						<Button variant="outline" size="icon" onClick={goToPrevTheme}>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<div className="text-center">
							<Badge variant="outline" className="mb-2">
								{activeThemeIndex + 1} of {themes.length}
							</Badge>
							<h2 className="text-2xl font-bold">{activeTheme.name}</h2>
							{activeTheme.category && (
								<Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
									{activeTheme.category.charAt(0).toUpperCase() +
										activeTheme.category.slice(1)}
								</Badge>
							)}
						</div>
						<Button variant="outline" size="icon" onClick={goToNextTheme}>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>

					{/* Theme Preview */}
					<div className="mb-8">
						<div
							className="h-48 rounded-xl mb-4 relative overflow-hidden"
							style={{
								background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.accent})`,
							}}
						>
							{/* Animated background elements */}
							<div className="absolute inset-0 w-full h-full">
								<div
									className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-white/10 animate-blob"
									style={{ animationDelay: "0s" }}
								></div>
								<div
									className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-black/10 animate-blob"
									style={{ animationDelay: "2s" }}
								></div>
							</div>

							{/* Featured badge */}
							<div className="absolute top-4 left-4">
								<Badge
									variant="secondary"
									className="bg-black/40 backdrop-blur-sm"
								>
									<Star className="h-3.5 w-3.5 mr-1 fill-yellow-400 text-yellow-400 animate-pulse-slow" />
									Featured Theme
								</Badge>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-4 mb-6">
							<div className="text-center">
								<div
									className="w-full h-12 rounded-md mb-2 mx-auto"
									style={{ backgroundColor: activeTheme.primary }}
								></div>
								<span className="text-xs font-mono">{activeTheme.primary}</span>
								<p className="text-xs text-white/60 mt-1">Primary</p>
							</div>
							<div className="text-center">
								<div
									className="w-full h-12 rounded-md mb-2 mx-auto"
									style={{ backgroundColor: activeTheme.secondary }}
								></div>
								<span className="text-xs font-mono">
									{activeTheme.secondary}
								</span>
								<p className="text-xs text-white/60 mt-1">Secondary</p>
							</div>
							<div className="text-center">
								<div
									className="w-full h-12 rounded-md mb-2 mx-auto"
									style={{ backgroundColor: activeTheme.accent }}
								></div>
								<span className="text-xs font-mono">{activeTheme.accent}</span>
								<p className="text-xs text-white/60 mt-1">Accent</p>
							</div>
						</div>

						<div className="text-center mb-6">
							<p className="text-sm text-white/70 mb-2">
								Border Radius: {activeTheme.borderRadius}px
							</p>
							<div className="flex items-center justify-center gap-4">
								<div
									className="w-8 h-8 bg-primary"
									style={{ borderRadius: `${activeTheme.borderRadius}px` }}
								></div>
								<div
									className="w-16 h-8 bg-primary"
									style={{ borderRadius: `${activeTheme.borderRadius}px` }}
								></div>
								<div
									className="w-8 h-8 bg-primary rounded-full"
									style={{
										borderRadius: `${Math.max(activeTheme.borderRadius, 9999)}px`,
									}}
								></div>
							</div>
						</div>
					</div>

					{/* UI Elements Preview */}
					<div className="space-y-8">
						<div>
							<h3 className="text-lg font-medium mb-4">Buttons</h3>
							<div className="grid grid-cols-2 gap-4">
								<button
									className="px-4 py-2 text-white w-full"
									style={{
										backgroundColor: activeTheme.primary,
										borderRadius: `${activeTheme.borderRadius}px`,
									}}
								>
									Primary Button
								</button>
								<button
									className="px-4 py-2 border w-full"
									style={{
										borderColor: activeTheme.primary,
										color: activeTheme.primary,
										borderRadius: `${activeTheme.borderRadius}px`,
									}}
								>
									Outline Button
								</button>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-4">Cards</h3>
							<div
								className="p-4 border rounded-md"
								style={{
									borderColor: "rgba(255, 255, 255, 0.1)",
									borderRadius: `${activeTheme.borderRadius}px`,
								}}
							>
								<div
									className="font-medium mb-2"
									style={{ color: activeTheme.primary }}
								>
									Card Title
								</div>
								<div className="text-sm text-white/70 mb-4">
									Card content with theme applied.
								</div>
								<button
									className="px-3 py-1 text-xs text-white rounded-md"
									style={{
										backgroundColor: activeTheme.accent,
										borderRadius: `${activeTheme.borderRadius}px`,
									}}
								>
									Action
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="px-6 py-4 border-t border-white/10 flex justify-between">
				<Button variant="outline" onClick={onClose}>
					Back to Themes
				</Button>
				<Button onClick={() => onApply(activeTheme)}>Apply This Theme</Button>
			</div>
		</div>
	);
}
