"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSelector } from "@/components/themes/theme-selector";
import { ThemeImportExport } from "@/components/themes/theme-import-export";
import { CodeBlock } from "@/components/code-block";
import { useThemeContext } from "@/contexts/theme-context";

export default function ThemeImportExportDemoPage() {
	const { currentTheme } = useThemeContext();
	const [showSelector, setShowSelector] = useState(false);

	const themeJsonExample = `{
  "id": "custom-theme-1",
  "name": "My Custom Theme",
  "primary": "#3b82f6",
  "secondary": "#f8fafc",
  "accent": "#8b5cf6",
  "borderRadius": 10
}`;

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
								Theme Import & Export
							</h1>
							<p className="text-xl text-muted-foreground mb-8">
								Share your custom themes with others or backup your theme
								collection
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" onClick={() => setShowSelector(true)}>
									Open Theme Selector
								</Button>
								{showSelector && <ThemeSelector />}

								<ThemeImportExport variant="default" size="lg" />
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-16 bg-black/50">
					<div className="container">
						<h2 className="text-3xl font-bold text-center mb-12">
							Key Features
						</h2>

						<div className="grid md:grid-cols-3 gap-8">
							<Card>
								<CardHeader>
									<CardTitle>Export Themes</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										Export your custom themes as JSON files that can be shared
										with others or saved as backups.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Import Themes</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										Import themes from JSON files, either by selecting a file or
										using drag-and-drop functionality.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Validation</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										Imported themes are validated to ensure they contain all
										required properties and valid color values.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Current Theme Section */}
				<section className="py-16">
					<div className="container">
						<h2 className="text-3xl font-bold text-center mb-8">
							Current Theme
						</h2>
						<p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
							This is your currently active theme. You can export it using the
							button below.
						</p>

						<div className="max-w-md mx-auto">
							<Card>
								<CardHeader>
									<CardTitle className="flex justify-between items-center">
										<span>{currentTheme.name}</span>
										<div className="flex gap-2">
											<div
												className="w-5 h-5 rounded-full border border-white/10"
												style={{ backgroundColor: currentTheme.primary }}
											></div>
											<div
												className="w-5 h-5 rounded-full border border-white/10"
												style={{ backgroundColor: currentTheme.accent }}
											></div>
										</div>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<p className="text-sm text-muted-foreground mb-1">
												Primary Color
											</p>
											<div className="flex items-center gap-2">
												<div
													className="w-6 h-6 rounded-full border border-white/10"
													style={{ backgroundColor: currentTheme.primary }}
												></div>
												<code className="text-sm">{currentTheme.primary}</code>
											</div>
										</div>

										<div>
											<p className="text-sm text-muted-foreground mb-1">
												Secondary Color
											</p>
											<div className="flex items-center gap-2">
												<div
													className="w-6 h-6 rounded-full border border-white/10"
													style={{ backgroundColor: currentTheme.secondary }}
												></div>
												<code className="text-sm">
													{currentTheme.secondary}
												</code>
											</div>
										</div>

										<div>
											<p className="text-sm text-muted-foreground mb-1">
												Accent Color
											</p>
											<div className="flex items-center gap-2">
												<div
													className="w-6 h-6 rounded-full border border-white/10"
													style={{ backgroundColor: currentTheme.accent }}
												></div>
												<code className="text-sm">{currentTheme.accent}</code>
											</div>
										</div>

										<div>
											<p className="text-sm text-muted-foreground mb-1">
												Border Radius
											</p>
											<code className="text-sm">
												{currentTheme.borderRadius}px
											</code>
										</div>

										<div className="pt-4">
											<ThemeImportExport
												theme={currentTheme}
												variant="default"
											/>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Theme JSON Format Section */}
				<section className="py-16 bg-black/30">
					<div className="container">
						<h2 className="text-3xl font-bold text-center mb-8">
							Theme JSON Format
						</h2>
						<p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
							Themes are exported as JSON files with the following structure.
							You can create your own theme files following this format.
						</p>

						<div className="max-w-2xl mx-auto">
							<CodeBlock
								code={themeJsonExample}
								language="json"
								filename="my-custom-theme.json"
							/>

							<div className="mt-8 space-y-4">
								<h3 className="text-xl font-semibold">Required Properties</h3>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<code className="text-sm">name</code> - The name of the
										theme (string)
									</li>
									<li>
										<code className="text-sm">primary</code> - Primary color in
										hex format (string)
									</li>
									<li>
										<code className="text-sm">secondary</code> - Secondary color
										in hex format (string)
									</li>
									<li>
										<code className="text-sm">accent</code> - Accent color in
										hex format (string)
									</li>
									<li>
										<code className="text-sm">borderRadius</code> - Border
										radius in pixels (number)
									</li>
								</ul>

								<h3 className="text-xl font-semibold mt-6">
									Optional Properties
								</h3>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<code className="text-sm">id</code> - Unique identifier for
										the theme (string)
									</li>
									<li>
										<code className="text-sm">creator</code> - Name of the theme
										creator (string)
									</li>
									<li>
										<code className="text-sm">isPublic</code> - Whether the
										theme is public (boolean)
									</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
