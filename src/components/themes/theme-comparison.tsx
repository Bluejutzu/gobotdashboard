"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ThemeData } from "@/lib/types/types";

interface ThemeComparisonProps {
    themes: ThemeData[];
    onApply: (theme: ThemeData) => void;
    onClose: () => void;
}

export function ThemeComparison({ themes, onApply, onClose }: ThemeComparisonProps) {
    const [activeTab, setActiveTab] = useState("visual");

    if (themes.length !== 2) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <p className="text-white/60 mb-4">Please select exactly two themes to compare.</p>
                <Button onClick={onClose}>Back to Themes</Button>
            </div>
        );
    }

    const [theme1, theme2] = themes;

    return (
        <div className="flex flex-col h-full">
            <Tabs defaultValue="visual" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="border-b border-white/10">
                    <TabsList className="h-12 bg-transparent px-6">
                        <TabsTrigger
                            value="visual"
                            className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full"
                        >
                            Visual Comparison
                        </TabsTrigger>
                        <TabsTrigger
                            value="properties"
                            className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full"
                        >
                            Properties
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-auto">
                    <TabsContent value="visual" className="h-full m-0 p-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="border rounded-md p-4 bg-white/5 backdrop-blur-sm border-white/10">
                                <h3 className="text-lg font-medium mb-2">{theme1.name}</h3>
                                <div className="flex space-x-2 mb-4">
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: theme1.primary }}
                                    ></div>
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: theme1.secondary }}
                                    ></div>
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: theme1.accent }}
                                    ></div>
                                </div>
                                <p className="text-sm text-white/70">Border Radius: {theme1.borderRadius}px</p>
                                <Button
                                    onClick={() => onApply(theme1)}
                                    className="mt-4 w-full"
                                    style={{
                                        backgroundColor: theme1.primary,
                                        color: "#fff",
                                        borderRadius: `${theme1.borderRadius}px`
                                    }}
                                >
                                    Apply Theme
                                </Button>
                            </div>

                            <div className="border rounded-md p-4 bg-white/5 backdrop-blur-sm border-white/10">
                                <h3 className="text-lg font-medium mb-2">{theme2.name}</h3>
                                <div className="flex space-x-2 mb-4">
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: theme2.primary }}
                                    ></div>
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: theme2.secondary }}
                                    ></div>
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: theme2.accent }}
                                    ></div>
                                </div>
                                <p className="text-sm text-white/70">Border Radius: {theme2.borderRadius}px</p>
                                <Button
                                    onClick={() => onApply(theme2)}
                                    className="mt-4 w-full"
                                    style={{
                                        backgroundColor: theme2.primary,
                                        color: "#fff",
                                        borderRadius: `${theme2.borderRadius}px`
                                    }}
                                >
                                    Apply Theme
                                </Button>
                            </div>
                        </div>

                        {/* UI Element Comparisons */}
                        <div className="mt-8 border-t border-white/10 pt-6">
                            <h3 className="text-lg font-medium mb-4">UI Elements Comparison</h3>

                            {/* Buttons Comparison */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-white/70 mb-3">Buttons</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <button
                                            className="px-4 py-2 text-white rounded-md w-full"
                                            style={{
                                                backgroundColor: theme1.primary,
                                                borderRadius: `${theme1.borderRadius}px`
                                            }}
                                        >
                                            Primary Button
                                        </button>
                                        <button
                                            className="px-4 py-2 border rounded-md w-full"
                                            style={{
                                                borderColor: theme1.primary,
                                                color: theme1.primary,
                                                borderRadius: `${theme1.borderRadius}px`
                                            }}
                                        >
                                            Outline Button
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <button
                                            className="px-4 py-2 text-white rounded-md w-full"
                                            style={{
                                                backgroundColor: theme2.primary,
                                                borderRadius: `${theme2.borderRadius}px`
                                            }}
                                        >
                                            Primary Button
                                        </button>
                                        <button
                                            className="px-4 py-2 border rounded-md w-full"
                                            style={{
                                                borderColor: theme2.primary,
                                                color: theme2.primary,
                                                borderRadius: `${theme2.borderRadius}px`
                                            }}
                                        >
                                            Outline Button
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Cards Comparison */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-white/70 mb-3">Cards</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div
                                        className="p-4 border rounded-md"
                                        style={{
                                            borderColor: "rgba(255, 255, 255, 0.1)",
                                            borderRadius: `${theme1.borderRadius}px`
                                        }}
                                    >
                                        <div className="font-medium mb-2" style={{ color: theme1.primary }}>
                                            Card Title
                                        </div>
                                        <div className="text-sm text-white/70 mb-4">
                                            Card content with theme applied.
                                        </div>
                                        <button
                                            className="px-3 py-1 text-xs text-white rounded-md"
                                            style={{
                                                backgroundColor: theme1.accent,
                                                borderRadius: `${theme1.borderRadius}px`
                                            }}
                                        >
                                            Action
                                        </button>
                                    </div>
                                    <div
                                        className="p-4 border rounded-md"
                                        style={{
                                            borderColor: "rgba(255, 255, 255, 0.1)",
                                            borderRadius: `${theme2.borderRadius}px`
                                        }}
                                    >
                                        <div className="font-medium mb-2" style={{ color: theme2.primary }}>
                                            Card Title
                                        </div>
                                        <div className="text-sm text-white/70 mb-4">
                                            Card content with theme applied.
                                        </div>
                                        <button
                                            className="px-3 py-1 text-xs text-white rounded-md"
                                            style={{
                                                backgroundColor: theme2.accent,
                                                borderRadius: `${theme2.borderRadius}px`
                                            }}
                                        >
                                            Action
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="properties" className="h-full m-0 p-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium mb-4">{theme1.name}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/70">Primary Color</span>
                                        <div className="flex items-center">
                                            <div
                                                className="w-4 h-4 rounded-full mr-2"
                                                style={{ backgroundColor: theme1.primary }}
                                            ></div>
                                            <span className="text-sm">{theme1.primary}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/70">Secondary Color</span>
                                        <div className="flex items-center">
                                            <div
                                                className="w-4 h-4 rounded-full mr-2"
                                                style={{ backgroundColor: theme1.secondary }}
                                            ></div>
                                            <span className="text-sm">{theme1.secondary}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/70">Accent Color</span>
                                        <div className="flex items-center">
                                            <div
                                                className="w-4 h-4 rounded-full mr-2"
                                                style={{ backgroundColor: theme1.accent }}
                                            ></div>
                                            <span className="text-sm">{theme1.accent}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/70">Border Radius</span>
                                        <span className="text-sm">{theme1.borderRadius}px</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/70">Category</span>
                                        <span className="text-sm">{theme1.category || "None"}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-4">{theme2.name}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/70">Primary Color</span>
                                        <div className="flex items-center">
                                            <div
                                                className="w-4 h-4 rounded-full mr-2"
                                                style={{ backgroundColor: theme2.primary }}
                                            ></div>
                                            <span className="text-sm">{theme2.primary}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/70">Secondary Color</span>
                                        <div className="flex items-center">
                                            <div
                                                className="w-4 h-4 rounded-full mr-2"
                                                style={{ backgroundColor: theme2.secondary }}
                                            ></div>
                                            <span className="text-sm">{theme2.secondary}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/70">Accent Color</span>
                                        <div className="flex items-center">
                                            <div
                                                className="w-4 h-4 rounded-full mr-2"
                                                style={{ backgroundColor: theme2.accent }}
                                            ></div>
                                            <span className="text-sm">{theme2.accent}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/70">Border Radius</span>
                                        <span className="text-sm">{theme2.borderRadius}px</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/70">Category</span>
                                        <span className="text-sm">{theme2.category || "None"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            <div className="px-6 py-4 border-t border-white/10 flex justify-between">
                <Button variant="outline" onClick={onClose}>
                    Back to Themes
                </Button>
                <div className="flex gap-2">
                    <Button onClick={() => onApply(theme1)}>Apply {theme1.name}</Button>
                    <Button onClick={() => onApply(theme2)}>Apply {theme2.name}</Button>
                </div>
            </div>
        </div>
    );
}
