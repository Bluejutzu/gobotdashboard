"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import {
	Check,
	X,
	ChevronRight,
	Palette,
	Star,
	Plus,
	Download,
	Upload,
	Filter,
} from "lucide-react";
import { useThemeContext } from "@/contexts/theme-context";
import type { ThemeData } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ThemeAnimation } from "@/components/themes/theme-animation";
import { exportThemeToJson } from "@/lib/theme-export";
import { ThemeCreator } from "@/components/themes/theme-creator";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function ThemeSelector() {
	const { currentTheme, savedThemes, communityThemes, applyTheme } =
		useThemeContext();
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("featured");
	const [mounted, setMounted] = useState(false);
	const [animatingTheme, setAnimatingTheme] = useState<ThemeData | null>(null);
	const [isCreatingTheme, setIsCreatingTheme] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [allCategories, setAllCategories] = useState<string[]>([]);

	const featuredThemes: ThemeData[] = useMemo(
		() => [
			{
				id: "default",
				name: "Default Blue",
				primary: "#0ea5e9",
				secondary: "#f1f5f9",
				accent: "#6366f1",
				borderRadius: 8,
				category: "light",
			},
			{
				id: "purple",
				name: "Purple Dream",
				primary: "#8b5cf6",
				secondary: "#f3f4f6",
				accent: "#ec4899",
				borderRadius: 12,
				category: "colorful",
			},
			{
				id: "green",
				name: "Forest Green",
				primary: "#10b981",
				secondary: "#f0fdf4",
				accent: "#f59e0b",
				borderRadius: 4,
				category: "light",
			},
			{
				id: "dark",
				name: "Dark Mode",
				primary: "#6366f1",
				secondary: "#1f2937",
				accent: "#f43f5e",
				borderRadius: 8,
				category: "dark",
			},
			{
				id: "sunset",
				name: "Sunset Orange",
				primary: "#f97316",
				secondary: "#fff7ed",
				accent: "#8b5cf6",
				borderRadius: 16,
				category: "colorful",
			},
			{
				id: "ocean",
				name: "Ocean Breeze",
				primary: "#0891b2",
				secondary: "#ecfeff",
				accent: "#6d28d9",
				borderRadius: 8,
				category: "light",
			},
			{
				id: "midnight",
				name: "Midnight",
				primary: "#3b82f6",
				secondary: "#0f172a",
				accent: "#a855f7",
				borderRadius: 6,
				category: "dark",
			},
			{
				id: "minimal",
				name: "Minimal",
				primary: "#64748b",
				secondary: "#f8fafc",
				accent: "#94a3b8",
				borderRadius: 2,
				category: "minimal",
			},
		],
		[],
	);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const categories = new Set<string>();
		const allThemes = [...featuredThemes, ...savedThemes, ...communityThemes];
		allThemes.forEach((theme) => {
			if (theme.category) {
				categories.add(theme.category);
			}
		});
		setAllCategories(Array.from(categories));
	}, [savedThemes, communityThemes, featuredThemes]);

	// Combine all themes for the "All" tab
	const allThemes = [
		...featuredThemes,
		...savedThemes.filter(
			(savedTheme) =>
				!featuredThemes.some(
					(featuredTheme) => featuredTheme.id === savedTheme.id,
				),
		),
		...communityThemes.filter(
			(communityTheme) =>
				!featuredThemes.some(
					(featuredTheme) => featuredTheme.id === communityTheme.id,
				) &&
				!savedThemes.some((savedTheme) => savedTheme.id === communityTheme.id),
		),
	];

	// Filter themes based on search query and selected categories
	const filterThemes = (themes: ThemeData[]) => {
		return themes.filter((theme) => {
			// Filter by search query
			const matchesSearch =
				searchQuery === "" ||
				theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(theme.category &&
					theme.category.toLowerCase().includes(searchQuery.toLowerCase()));

			// Filter by selected categories
			const matchesCategory =
				selectedCategories.length === 0 ||
				(theme.category && selectedCategories.includes(theme.category));

			return matchesSearch && matchesCategory;
		});
	};

	// Filtered themes
	const filteredFeaturedThemes = filterThemes(featuredThemes);
	const filteredAllThemes = filterThemes(allThemes);
	const filteredSavedThemes = filterThemes(savedThemes);

	// Handle category selection
	const handleCategoryToggle = (category: string) => {
		setSelectedCategories((prev) => {
			if (prev.includes(category)) {
				return prev.filter((c) => c !== category);
			} else {
				return [...prev, category];
			}
		});
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery("");
		setSelectedCategories([]);
	};

	const handleApplyTheme = (theme: ThemeData) => {
		applyTheme(theme);
		setAnimatingTheme(theme);
	};

	const handleAnimationComplete = () => {
		setAnimatingTheme(null);
	};

	if (!mounted) return null;

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="gap-2 theme-transition"
					>
						<div
							className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
							style={{ backgroundColor: currentTheme.primary }}
						/>
						<span className="hidden sm:inline">Theme:</span> {currentTheme.name}
					</Button>
				</DialogTrigger>

				<DialogContent className="p-0 max-w-[650px] max-h-[85vh] bg-black border-white/10 overflow-hidden">
					{isCreatingTheme ? (
						<div className="flex flex-col h-full max-h-[85vh]">
							<DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Palette className="h-5 w-5 text-primary" />
										<DialogTitle className="text-xl">Create Theme</DialogTitle>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full"
										onClick={() => setIsCreatingTheme(false)}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
								<DialogDescription className="text-white/60 pt-1">
									Customize colors and properties to create your own theme.
								</DialogDescription>
							</DialogHeader>

							<div className="flex-1 overflow-auto p-6">
								<ThemeCreator
									onSave={() => setIsCreatingTheme(false)}
									onCancel={() => setIsCreatingTheme(false)}
								/>
							</div>
						</div>
					) : (
						<div className="flex flex-col h-full max-h-[85vh]">
							<DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Palette className="h-5 w-5 text-primary" />
										<DialogTitle className="text-xl">Select Theme</DialogTitle>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full"
										onClick={() => setIsOpen(false)}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
								<DialogDescription className="text-white/60 pt-1">
									Choose a theme to customize the appearance of the application.
								</DialogDescription>
							</DialogHeader>

							<div className="px-6 py-3 border-b border-white/10 flex items-center gap-3">
								<div className="relative flex-1">
									<Input
										placeholder="Search themes..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="bg-white/5"
									/>
									{searchQuery && (
										<Button
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full"
											onClick={() => setSearchQuery("")}
										>
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											className={cn(
												"h-10 w-10",
												selectedCategories.length > 0 &&
													"bg-primary/20 border-primary/50",
											)}
										>
											<Filter className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56">
										<div className="p-2 text-sm font-medium">Categories</div>
										{allCategories.map((category) => (
											<DropdownMenuCheckboxItem
												key={category}
												checked={selectedCategories.includes(category)}
												onCheckedChange={() => handleCategoryToggle(category)}
											>
												{category.charAt(0).toUpperCase() + category.slice(1)}
											</DropdownMenuCheckboxItem>
										))}
										{selectedCategories.length > 0 && (
											<div className="p-2">
												<Button
													variant="ghost"
													size="sm"
													className="w-full"
													onClick={clearFilters}
												>
													Clear Filters
												</Button>
											</div>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							<Tabs
								defaultValue="featured"
								value={activeTab}
								onValueChange={setActiveTab}
								className="flex-1 flex flex-col min-h-0"
							>
								<div className="border-b border-white/10">
									<TabsList className="h-12 bg-transparent px-6">
										<TabsTrigger
											value="featured"
											className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full"
										>
											Featured
										</TabsTrigger>
										<TabsTrigger
											value="all"
											className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full"
										>
											All Themes
										</TabsTrigger>
										<TabsTrigger
											value="saved"
											className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full"
										>
											My Themes
										</TabsTrigger>
									</TabsList>
								</div>

								<div className="flex-1 min-h-0">
									<TabsContent value="featured" className="h-full m-0 p-0">
										<div className="h-full overflow-y-auto">
											<div className="p-6">
												{selectedCategories.length > 0 && (
													<div className="flex flex-wrap gap-2 mb-4">
														{selectedCategories.map((category) => (
															<Badge
																key={category}
																variant="outline"
																className="bg-primary/10 border-primary/20"
															>
																{category.charAt(0).toUpperCase() +
																	category.slice(1)}
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-4 w-4 ml-1 -mr-1"
																	onClick={() => handleCategoryToggle(category)}
																>
																	<X className="h-3 w-3" />
																</Button>
															</Badge>
														))}
														<Button
															variant="ghost"
															size="sm"
															className="h-6 px-2"
															onClick={clearFilters}
														>
															Clear All
														</Button>
													</div>
												)}

												{filteredFeaturedThemes.length > 0 ? (
													<div className="grid grid-cols-2 gap-4">
														{filteredFeaturedThemes.map((theme) => (
															<ThemeCard
																key={theme.id}
																theme={theme}
																onApply={() => handleApplyTheme(theme)}
																isActive={currentTheme.id === theme.id}
																featured
															/>
														))}
													</div>
												) : (
													<div className="flex flex-col items-center justify-center py-12 text-center">
														<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
															<Palette className="h-8 w-8 text-white/40" />
														</div>
														<h3 className="text-lg font-medium mb-2">
															No themes found
														</h3>
														<p className="text-white/60 mb-6 max-w-md">
															No themes match your current filters. Try
															adjusting your search or filter criteria.
														</p>
														<Button onClick={clearFilters}>
															Clear Filters
														</Button>
													</div>
												)}
											</div>
										</div>
									</TabsContent>

									<TabsContent value="all" className="h-full m-0 p-0">
										<div className="h-full overflow-y-auto">
											<div className="p-6">
												{selectedCategories.length > 0 && (
													<div className="flex flex-wrap gap-2 mb-4">
														{selectedCategories.map((category) => (
															<Badge
																key={category}
																variant="outline"
																className="bg-primary/10 border-primary/20"
															>
																{category.charAt(0).toUpperCase() +
																	category.slice(1)}
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-4 w-4 ml-1 -mr-1"
																	onClick={() => handleCategoryToggle(category)}
																>
																	<X className="h-3 w-3" />
																</Button>
															</Badge>
														))}
														<Button
															variant="ghost"
															size="sm"
															className="h-6 px-2"
															onClick={clearFilters}
														>
															Clear All
														</Button>
													</div>
												)}

												{filteredAllThemes.length > 0 ? (
													<div className="grid grid-cols-2 gap-4">
														{filteredAllThemes.map((theme) => (
															<ThemeCard
																key={theme.id}
																theme={theme}
																onApply={() => handleApplyTheme(theme)}
																isActive={currentTheme.id === theme.id}
															/>
														))}
													</div>
												) : (
													<div className="flex flex-col items-center justify-center py-12 text-center">
														<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
															<Palette className="h-8 w-8 text-white/40" />
														</div>
														<h3 className="text-lg font-medium mb-2">
															No themes found
														</h3>
														<p className="text-white/60 mb-6 max-w-md">
															No themes match your current filters. Try
															adjusting your search or filter criteria.
														</p>
														<Button onClick={clearFilters}>
															Clear Filters
														</Button>
													</div>
												)}
											</div>
										</div>
									</TabsContent>

									<TabsContent value="saved" className="h-full m-0 p-0">
										<div className="h-full overflow-y-auto">
											<div className="p-6">
												{filteredSavedThemes.length > 0 ? (
													<>
														{selectedCategories.length > 0 && (
															<div className="flex flex-wrap gap-2 mb-4">
																{selectedCategories.map((category) => (
																	<Badge
																		key={category}
																		variant="outline"
																		className="bg-primary/10 border-primary/20"
																	>
																		{category.charAt(0).toUpperCase() +
																			category.slice(1)}
																		<Button
																			variant="ghost"
																			size="icon"
																			className="h-4 w-4 ml-1 -mr-1"
																			onClick={() =>
																				handleCategoryToggle(category)
																			}
																		>
																			<X className="h-3 w-3" />
																		</Button>
																	</Badge>
																))}
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-6 px-2"
																	onClick={clearFilters}
																>
																	Clear All
																</Button>
															</div>
														)}

														<div className="grid grid-cols-2 gap-4">
															{filteredSavedThemes.map((theme) => (
																<ThemeCard
																	key={theme.id}
																	theme={theme}
																	onApply={() => handleApplyTheme(theme)}
																	isActive={currentTheme.id === theme.id}
																	showExport
																/>
															))}
														</div>
													</>
												) : savedThemes.length > 0 ? (
													<div className="flex flex-col items-center justify-center py-12 text-center">
														<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
															<Palette className="h-8 w-8 text-white/40" />
														</div>
														<h3 className="text-lg font-medium mb-2">
															No themes found
														</h3>
														<p className="text-white/60 mb-6 max-w-md">
															No saved themes match your current filters. Try
															adjusting your search or filter criteria.
														</p>
														<Button onClick={clearFilters}>
															Clear Filters
														</Button>
													</div>
												) : (
													<div className="flex flex-col items-center justify-center h-full text-center p-6">
														<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
															<Palette className="h-8 w-8 text-white/40" />
														</div>
														<h3 className="text-lg font-medium mb-2">
															No saved themes
														</h3>
														<p className="text-white/60 mb-6 max-w-md">
															You haven't saved any custom themes yet. Create
															your own theme or save community themes to your
															collection.
														</p>
														<Button onClick={() => setIsCreatingTheme(true)}>
															Create Custom Theme
														</Button>
													</div>
												)}
											</div>
										</div>
									</TabsContent>
								</div>
							</Tabs>

							<DialogFooter className="px-6 py-4 border-t border-white/10 flex-row justify-between">
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										className="gap-1"
										onClick={() => setIsCreatingTheme(true)}
									>
										<Plus className="h-4 w-4" />
										<span>Create Theme</span>
									</Button>

									<Button variant="outline" size="sm" className="gap-1">
										<Download className="h-4 w-4" />
										<span>Export</span>
									</Button>

									<Button variant="outline" size="sm" className="gap-1">
										<Upload className="h-4 w-4" />
										<span>Import</span>
									</Button>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="secondary"
										size="sm"
										onClick={() => setIsOpen(false)}
									>
										Close
									</Button>
									<Button asChild size="sm">
										<Link
											href="/theme-demo"
											className="flex items-center gap-1"
										>
											<span>Theme Demo</span>
											<ChevronRight className="h-4 w-4" />
										</Link>
									</Button>
								</div>
							</DialogFooter>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{animatingTheme && (
				<ThemeAnimation
					isActive={!!animatingTheme}
					primaryColor={animatingTheme.primary}
					accentColor={animatingTheme.accent}
					onAnimationComplete={handleAnimationComplete}
				/>
			)}
		</>
	);
}

interface ThemeCardProps {
	theme: ThemeData;
	onApply: () => void;
	isActive: boolean;
	featured?: boolean;
	showExport?: boolean;
}

function ThemeCard({
	theme,
	onApply,
	isActive,
	featured = false,
	showExport = false,
}: ThemeCardProps) {
	// Generate a complementary gradient for the preview
	const gradientStyle = {
		background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
	};

	// Handle export button click
	const handleExport = (e: React.MouseEvent) => {
		e.stopPropagation();
		exportThemeToJson(theme);
	};

	// Create a mock UI preview that shows the theme colors in action
	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-xl border transition-all duration-300",
				isActive
					? "border-primary shadow-[0_0_0_1px_rgba(var(--primary),0.3),0_0_20px_rgba(var(--primary),0.2)]"
					: "border-white/10 hover:border-white/20",
				featured && !isActive && "hover:border-primary/40",
				"hover:-translate-y-1 hover:shadow-lg theme-transition",
			)}
			onClick={onApply}
		>
			{/* Theme preview */}
			<div className="relative h-32 overflow-hidden" style={gradientStyle}>
				{/* Animated background elements */}
				<div className="absolute inset-0 w-full h-full">
					<div
						className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/10 opacity-0 group-hover:opacity-20 transition-all duration-700 ease-in-out"
						style={{
							transform: "translate(0%, 0%) scale(0.8)",
							transition:
								"transform 10s ease-in-out, opacity 700ms ease-in-out",
						}}
					></div>
					<div
						className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-black/10 opacity-0 group-hover:opacity-20 transition-all duration-700 ease-in-out"
						style={{
							transform: "translate(0%, 0%) scale(0.8)",
							transition:
								"transform 10s ease-in-out, opacity 700ms ease-in-out",
						}}
					></div>
				</div>

				{/* Category badge */}
				{theme.category && (
					<div className="absolute bottom-2 left-2 animate-fade-in">
						<Badge
							variant="secondary"
							className="bg-black/40 backdrop-blur-sm text-xs"
						>
							{theme.category.charAt(0).toUpperCase() + theme.category.slice(1)}
						</Badge>
					</div>
				)}

				{/* Featured badge */}
				{featured && (
					<div className="absolute top-2 left-2 animate-fade-in">
						<Badge
							variant="secondary"
							className="bg-black/40 backdrop-blur-sm text-xs"
						>
							<Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400 animate-pulse-slow" />
							Featured
						</Badge>
					</div>
				)}

				{/* Active indicator */}
				{isActive && (
					<div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-md animate-fade-in">
						<Check className="h-4 w-4" />
					</div>
				)}

				{/* Export button for saved themes */}
				{showExport && (
					<div className="absolute top-2 right-2">
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60"
							onClick={handleExport}
							title="Export Theme"
						>
							<Download className="h-3.5 w-3.5 text-white" />
						</Button>
					</div>
				)}
			</div>

			{/* Theme info */}
			<div className="p-4 bg-black">
				<h3 className="font-medium text-sm mb-3">{theme.name}</h3>

				{/* Color swatches with hover animations */}
				<div className="flex space-x-2 mb-4">
					<div
						className="w-6 h-6 rounded-full border border-white/10 shadow-sm transform group-hover:scale-110 transition-transform duration-300 hover:shadow-md"
						style={{ backgroundColor: theme.primary, transitionDelay: "0ms" }}
						title="Primary color"
					/>
					<div
						className="w-6 h-6 rounded-full border border-white/10 shadow-sm transform group-hover:scale-110 transition-transform duration-300 hover:shadow-md"
						style={{
							backgroundColor: theme.secondary,
							transitionDelay: "50ms",
						}}
						title="Secondary color"
					/>
					<div
						className="w-6 h-6 rounded-full border border-white/10 shadow-sm transform group-hover:scale-110 transition-transform duration-300 hover:shadow-md"
						style={{ backgroundColor: theme.accent, transitionDelay: "100ms" }}
						title="Accent color"
					/>
					<div
						className="ml-auto flex items-center text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300"
						title="Border radius"
					>
						<span className="rounded px-1.5 py-0.5 bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
							{theme.borderRadius}px
						</span>
					</div>
				</div>

				{/* Apply button with hover effect */}
				<Button
					onClick={onApply}
					className="w-full relative overflow-hidden group-hover:shadow-md transition-shadow duration-300"
					variant={isActive ? "secondary" : "default"}
					style={
						!isActive
							? {
									backgroundColor: theme.primary,
									color: "#fff",
									borderRadius: `${theme.borderRadius}px`,
								}
							: {}
					}
				>
					{/* Button shine effect */}
					<span
						className={cn(
							"absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out",
							isActive ? "opacity-0" : "opacity-100",
						)}
					></span>
					{isActive ? "Current Theme" : "Apply Theme"}
				</Button>
			</div>
		</div>
	);
}
