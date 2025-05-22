"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSelector } from "@/components/themes/theme-selector";
import { ThemeComparison } from "@/components/themes/theme-comparison";
import { ThemeShowcase } from "@/components/themes/theme-showcase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, Maximize2 } from "lucide-react";
import type { ThemeData } from "@/lib/types/types";

/**
 * Renders the theme comparison and showcase demo page with interactive sections, including a hero area, feature highlights, demo tabs for comparing and showcasing themes, and a step-by-step guide.
 *
 * The page allows users to open a theme selector, compare two sample themes side by side, explore a showcase of multiple themes, and learn how the comparison and showcase features work through illustrative sections.
 */
export default function ThemeComparisonDemoPage() {
    const [showSelector, setShowSelector] = useState(false);
    const [activeTab, setActiveTab] = useState("comparison");

    // Sample themes for demo
    const demoThemes: ThemeData[] = [
        {
            id: "default",
            name: "Default Blue",
            primary: "#0ea5e9",
            secondary: "#f1f5f9",
            accent: "#6366f1",
            borderRadius: 8,
            category: "light"
        },
        {
            id: "dark",
            name: "Dark Mode",
            primary: "#6366f1",
            secondary: "#1f2937",
            accent: "#f43f5e",
            borderRadius: 8,
            category: "dark"
        },
        {
            id: "sunset",
            name: "Sunset Orange",
            primary: "#f97316",
            secondary: "#fff7ed",
            accent: "#8b5cf6",
            borderRadius: 16,
            category: "colorful"
        },
        {
            id: "minimal",
            name: "Minimal",
            primary: "#64748b",
            secondary: "#f8fafc",
            accent: "#94a3b8",
            borderRadius: 2,
            category: "minimal"
        }
    ];

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
                                Theme Comparison & Showcase
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Compare themes side-by-side and explore detailed theme showcases
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
                        <h2 className="text-3xl font-bold text-center mb-12">New Features</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowLeftRight className="h-5 w-5 text-primary" />
                                        Theme Comparison
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4">
                                        Compare two themes side-by-side to see the visual differences and make an
                                        informed choice. The comparison tool shows:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li>Visual UI element differences</li>
                                        <li>Detailed property comparison</li>
                                        <li>Color and style differences</li>
                                        <li>Code and implementation details</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Maximize2 className="h-5 w-5 text-primary" />
                                        Theme Showcase
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4">
                                        Explore themes in detail with our comprehensive showcase. The showcase provides:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li>Interactive theme previews</li>
                                        <li>Detailed color information</li>
                                        <li>UI element demonstrations</li>
                                        <li>Easy navigation between themes</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Demo Section */}
                <section className="py-16">
                    <div className="container">
                        <Tabs
                            defaultValue={activeTab}
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="max-w-5xl mx-auto"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="comparison">Theme Comparison</TabsTrigger>
                                <TabsTrigger value="showcase">Theme Showcase</TabsTrigger>
                            </TabsList>

                            <TabsContent value="comparison" className="border rounded-md mt-6 overflow-hidden">
                                <div className="h-[600px]">
                                    <ThemeComparison
                                        themes={[demoThemes[0], demoThemes[1]]}
                                        onApply={() => {}}
                                        onClose={() => {}}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="showcase" className="border rounded-md mt-6 overflow-hidden">
                                <div className="h-[600px]">
                                    <ThemeShowcase themes={demoThemes} onApply={() => {}} onClose={() => {}} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-16 bg-black/30">
                    <div className="container">
                        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

                        <div className="max-w-3xl mx-auto space-y-12">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="md:w-1/2">
                                    <h3 className="text-xl font-bold mb-4">1. Select Themes to Compare</h3>
                                    <p>
                                        In the theme selector, choose two themes you want to compare by clicking the
                                        comparison checkbox. Once you've selected two themes, click the "Compare" button
                                        to see them side by side.
                                    </p>
                                </div>
                                <div className="md:w-1/2 bg-white/5 p-4 rounded-lg">
                                    <div className="flex items-center justify-between p-2 border border-white/10 rounded-md mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                            <span>Default Blue</span>
                                        </div>
                                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-white"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-2 border border-white/10 rounded-md">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                                            <span>Dark Mode</span>
                                        </div>
                                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-white"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="md:w-1/2 bg-white/5 p-4 rounded-lg order-1 md:order-0">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 border border-white/10 rounded-md">
                                            <div className="h-4 w-full bg-blue-500 rounded-sm mb-2"></div>
                                            <div className="h-2 w-3/4 bg-white/20 rounded-sm"></div>
                                        </div>
                                        <div className="p-2 border border-white/10 rounded-md">
                                            <div className="h-4 w-full bg-purple-500 rounded-sm mb-2"></div>
                                            <div className="h-2 w-3/4 bg-white/20 rounded-sm"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2 order-0 md:order-1">
                                    <h3 className="text-xl font-bold mb-4">2. Compare Visual Differences</h3>
                                    <p>
                                        The comparison view shows both themes side by side, highlighting the visual
                                        differences in UI elements, colors, and styles. You can see how each theme
                                        affects buttons, cards, form elements, and more.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="md:w-1/2">
                                    <h3 className="text-xl font-bold mb-4">3. Explore Theme Showcase</h3>
                                    <p>
                                        The theme showcase provides a comprehensive view of each theme with interactive
                                        previews and detailed information. Browse through featured themes and see how
                                        they look in various UI contexts.
                                    </p>
                                </div>
                                <div className="md:w-1/2 bg-white/5 p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <div className="text-center">
                                            <span className="text-sm px-2 py-0.5 rounded-full bg-white/10">2 of 4</span>
                                        </div>
                                        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function ChevronLeft(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    );
}

function ChevronRight(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    );
}
