"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSelector } from "@/components/themes/theme-selector";
import { ColorPicker } from "@/components/ui/color-picker";
import { ThemeCreator } from "@/components/themes/theme-creator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ThemeCategoriesDemoPage() {
	const [color, setColor] = useState("#0ea5e9");
	const [showSelector, setShowSelector] = useState(false);

	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader className="absolute top-0 left-0 right-0 z-50 bg-transparent" />
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative overflow-hidden bg-background py-24 md:py-32">
					<div className="absolute inset-0 z-0 overflow-hidden">
						<div className="absolute -top-20 -left-20 h-[40rem] w-[40rem] rounded-full bg-primary/5 animate-blob"></div>
						<div className="absolute top-40 -right-20 h-[35rem] w-[35rem] rounded-full bg-blue-500/5 animate-blob animation-delay-2000"></div>
					</div>

					<div className="container relative z-10">
						<div className="max-w-3xl mx-auto text-center">
							<h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-6">
								Theme Categories & Color Picker
							</h1>
							<p className="text-xl text-muted-foreground mb-8">
								Explore our improved theme selector with categories and color
								customization
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" onClick={() => setShowSelector(true)}>
									Open Theme Selector
								</Button>
								{showSelector && <ThemeSelector />}
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-16 bg-black/50">
					<div className="container">
						<h2 className="text-3xl font-bold text-center mb-12">
							New Features
						</h2>

						<div className="grid md:grid-cols-3 gap-8">
							<Card>
								<CardHeader>
									<CardTitle>Theme Categories</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										Themes are now organized into categories like Light, Dark,
										Colorful, and Minimal for easier browsing and filtering.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Color Picker</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										A powerful color picker allows you to select custom colors
										for your themes with hex input and color swatches.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Search & Filter</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										Easily find themes with the new search and filter
										functionality, allowing you to narrow down themes by name or
										category.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Demo Section */}
				<section className="py-16">
					<div className="container">
						<Tabs defaultValue="color-picker" className="max-w-3xl mx-auto">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="color-picker">Color Picker</TabsTrigger>
								<TabsTrigger value="theme-creator">Theme Creator</TabsTrigger>
							</TabsList>

							<TabsContent
								value="color-picker"
								className="p-6 border rounded-md mt-6"
							>
								<h2 className="text-2xl font-bold mb-6">
									Color Picker Component
								</h2>
								<p className="mb-6">
									The new color picker component allows for intuitive color
									selection with hex input and predefined color swatches.
								</p>

								<div className="max-w-md mx-auto">
									<ColorPicker
										color={color}
										onChange={setColor}
										label="Select a color"
									/>

									<div
										className="mt-8 p-4 rounded-md"
										style={{ backgroundColor: color }}
									>
										<p
											className="text-center font-medium"
											style={{
												color: color === "#ffffff" ? "#000000" : "#ffffff",
											}}
										>
											Selected Color: {color}
										</p>
									</div>
								</div>
							</TabsContent>

							<TabsContent
								value="theme-creator"
								className="p-6 border rounded-md mt-6"
							>
								<h2 className="text-2xl font-bold mb-6">Theme Creator</h2>
								<p className="mb-6">
									Create and customize your own themes with our intuitive theme
									creator interface.
								</p>

								<ThemeCreator />
							</TabsContent>
						</Tabs>
					</div>
				</section>

				{/* How It Works Section */}
				<section className="py-16 bg-black/30">
					<div className="container">
						<h2 className="text-3xl font-bold text-center mb-12">
							How It Works
						</h2>

						<div className="max-w-3xl mx-auto space-y-12">
							<div className="flex flex-col md:flex-row gap-8 items-center">
								<div className="md:w-1/2">
									<h3 className="text-xl font-bold mb-4">
										1. Browse by Category
									</h3>
									<p>
										Themes are organized into intuitive categories like Light,
										Dark, Colorful, and Minimal. Use the category filter to
										quickly find themes that match your style preference.
									</p>
								</div>
								<div className="md:w-1/2 bg-white/5 p-4 rounded-lg">
									<div className="flex flex-wrap gap-2">
										<div className="px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm">
											Light
										</div>
										<div className="px-3 py-1.5 rounded-full bg-slate-700/80 text-white text-sm">
											Dark
										</div>
										<div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm">
											Colorful
										</div>
										<div className="px-3 py-1.5 rounded-full bg-gray-200 text-gray-800 text-sm">
											Minimal
										</div>
										<div className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm">
											Modern
										</div>
										<div className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm">
											Classic
										</div>
									</div>
								</div>
							</div>

							<div className="flex flex-col md:flex-row gap-8 items-center">
								<div className="md:w-1/2 bg-white/5 p-4 rounded-lg order-1 md:order-0">
									<div className="flex items-center gap-2">
										<div
											className="w-8 h-8 rounded-full"
											style={{ backgroundColor: "#0ea5e9" }}
										></div>
										<div
											className="w-8 h-8 rounded-full"
											style={{ backgroundColor: "#8b5cf6" }}
										></div>
										<div
											className="w-8 h-8 rounded-full"
											style={{ backgroundColor: "#10b981" }}
										></div>
										<div
											className="w-8 h-8 rounded-full"
											style={{ backgroundColor: "#f97316" }}
										></div>
									</div>
								</div>
								<div className="md:w-1/2 order-0 md:order-1">
									<h3 className="text-xl font-bold mb-4">
										2. Customize Colors
									</h3>
									<p>
										Use the color picker to select custom colors for your theme.
										Choose from predefined swatches or enter specific hex values
										to get exactly the color you want.
									</p>
								</div>
							</div>

							<div className="flex flex-col md:flex-row gap-8 items-center">
								<div className="md:w-1/2">
									<h3 className="text-xl font-bold mb-4">3. Create & Save</h3>
									<p>
										Create your own custom themes with the theme creator.
										Preview how your theme will look in real-time, then save it
										to your collection for easy access later.
									</p>
								</div>
								<div className="md:w-1/2 bg-white/5 p-4 rounded-lg">
									<div className="flex justify-between mb-2">
										<span className="text-sm font-medium">My Custom Theme</span>
										<Button size="sm" variant="secondary">
											Save
										</Button>
									</div>
									<div className="h-20 rounded-md bg-gradient-to-r from-blue-500 to-purple-500"></div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
