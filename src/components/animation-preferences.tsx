"use client";

import { useEffect, useState } from "react";
import { Eye, Gauge, Monitor, Moon, Settings, Sparkles, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils/utils";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";

export function AnimationPreferences() {
    // Animation preferences
    const [reducedMotion, setReducedMotion] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(1);
    const [parallaxEffects, setParallaxEffects] = useState(true);
    const [scrollAnimations, setScrollAnimations] = useState(true);
    const [hoverEffects, setHoverEffects] = useState(true);

    // Theme preferences
    const { theme, setTheme } = useTheme();

    // Component mount state
    const [mounted, setMounted] = useState(false);

    // Load preferences on mount
    useEffect(() => {
        setMounted(true);

        // Load animation preferences
        const savedReducedMotion = localStorage.getItem("reduced-motion");
        const savedAnimationSpeed = localStorage.getItem("animation-speed");
        const savedParallaxEffects = localStorage.getItem("parallax-effects");
        const savedScrollAnimations = localStorage.getItem("scroll-animations");
        const savedHoverEffects = localStorage.getItem("hover-effects");

        if (savedReducedMotion) {
            setReducedMotion(savedReducedMotion === "true");
        } else {
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            setReducedMotion(prefersReducedMotion);
        }

        if (savedAnimationSpeed) {
            setAnimationSpeed(Number.parseFloat(savedAnimationSpeed));
        }

        if (savedParallaxEffects) {
            setParallaxEffects(savedParallaxEffects === "true");
        }

        if (savedScrollAnimations) {
            setScrollAnimations(savedScrollAnimations === "true");
        }

        if (savedHoverEffects) {
            setHoverEffects(savedHoverEffects === "true");
        }
    }, []);

    // Apply preferences when they change
    useEffect(() => {
        if (!mounted) return;

        // Save preferences to localStorage
        localStorage.setItem("reduced-motion", reducedMotion.toString());
        localStorage.setItem("animation-speed", animationSpeed.toString());
        localStorage.setItem("parallax-effects", parallaxEffects.toString());
        localStorage.setItem("scroll-animations", scrollAnimations.toString());
        localStorage.setItem("hover-effects", hoverEffects.toString());

        // Apply reduced motion class
        if (reducedMotion) {
            document.documentElement.classList.add("reduce-motion");
        } else {
            document.documentElement.classList.remove("reduce-motion");
        }

        // Apply animation speed
        document.documentElement.style.setProperty("--animation-speed-factor", animationSpeed.toString());

        // Apply other animation settings
        if (!parallaxEffects) {
            document.documentElement.classList.add("disable-parallax");
        } else {
            document.documentElement.classList.remove("disable-parallax");
        }

        if (!scrollAnimations) {
            document.documentElement.classList.add("disable-scroll-animations");
        } else {
            document.documentElement.classList.remove("disable-scroll-animations");
        }

        if (!hoverEffects) {
            document.documentElement.classList.add("disable-hover-effects");
        } else {
            document.documentElement.classList.remove("disable-hover-effects");
        }
    }, [reducedMotion, animationSpeed, parallaxEffects, scrollAnimations, hoverEffects, mounted]);

    if (!mounted) return null;

    return (
        <SidebarProvider defaultOpen={false}>
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SidebarTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm"
                                aria-label="Settings"
                            >
                                <Settings className="h-5 w-5" />
                            </Button>
                        </SidebarTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Preferences</p>
                    </TooltipContent>
                </Tooltip>

                <Sidebar side="right" variant="floating" collapsible="offcanvas">
                    <SidebarHeader className="border-b border-border/50 pb-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Preferences</h2>
                            <Tabs defaultValue="animations" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="animations" className="text-xs">
                                        <Sparkles className="mr-1 h-3.5 w-3.5" />
                                        Animations
                                    </TabsTrigger>
                                    <TabsTrigger value="appearance" className="text-xs">
                                        <Eye className="mr-1 h-3.5 w-3.5" />
                                        Appearance
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <Tabs defaultValue="animations" className="w-full">
                            <TabsContent value="animations" className="mt-0">
                                <SidebarGroup>
                                    <SidebarGroupLabel>Animation Settings</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <div className="space-y-6">
                                            {/* Reduced Motion Toggle */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="reduced-motion" className="text-sm font-medium">
                                                            Reduce animations
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                            Minimize or disable animations
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        id="reduced-motion"
                                                        checked={reducedMotion}
                                                        onCheckedChange={setReducedMotion}
                                                    />
                                                </div>
                                            </div>

                                            {/* Animation Speed Slider */}
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <Label
                                                            htmlFor="animation-speed"
                                                            className="text-sm font-medium"
                                                        >
                                                            Animation speed
                                                        </Label>
                                                        <span className="text-xs text-muted-foreground">
                                                            {animationSpeed === 0.5
                                                                ? "Slow"
                                                                : animationSpeed === 1
                                                                  ? "Normal"
                                                                  : animationSpeed === 1.5
                                                                    ? "Fast"
                                                                    : animationSpeed === 2
                                                                      ? "Very fast"
                                                                      : `${animationSpeed}x`}
                                                        </span>
                                                    </div>
                                                    <Slider
                                                        id="animation-speed"
                                                        disabled={reducedMotion}
                                                        min={0.5}
                                                        max={2}
                                                        step={0.5}
                                                        value={[animationSpeed]}
                                                        onValueChange={value => setAnimationSpeed(value[0])}
                                                        className={cn(reducedMotion && "opacity-50")}
                                                    />
                                                </div>
                                            </div>

                                            {/* Animation Type Toggles */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label
                                                            htmlFor="parallax-effects"
                                                            className="text-sm font-medium"
                                                        >
                                                            Parallax effects
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                            Elements move at different speeds while scrolling
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        id="parallax-effects"
                                                        disabled={reducedMotion}
                                                        checked={parallaxEffects}
                                                        onCheckedChange={setParallaxEffects}
                                                        className={cn(reducedMotion && "opacity-50")}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label
                                                            htmlFor="scroll-animations"
                                                            className="text-sm font-medium"
                                                        >
                                                            Scroll animations
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                            Elements animate as they enter the viewport
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        id="scroll-animations"
                                                        disabled={reducedMotion}
                                                        checked={scrollAnimations}
                                                        onCheckedChange={setScrollAnimations}
                                                        className={cn(reducedMotion && "opacity-50")}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="hover-effects" className="text-sm font-medium">
                                                            Hover effects
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                            Elements animate when hovered
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        id="hover-effects"
                                                        disabled={reducedMotion}
                                                        checked={hoverEffects}
                                                        onCheckedChange={setHoverEffects}
                                                        className={cn(reducedMotion && "opacity-50")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </SidebarGroupContent>
                                </SidebarGroup>

                                <SidebarGroup>
                                    <SidebarGroupLabel>Performance</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="high-performance" className="text-sm font-medium">
                                                        High performance mode
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Optimize for performance over visual quality
                                                    </p>
                                                </div>
                                                <Switch id="high-performance" />
                                            </div>
                                        </div>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            </TabsContent>

                            <TabsContent value="appearance" className="mt-0">
                                <SidebarGroup>
                                    <SidebarGroupLabel>Theme</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    onClick={() => setTheme("light")}
                                                    isActive={theme === "light"}
                                                >
                                                    <Sun className="h-4 w-4 mr-2" />
                                                    <span>Light</span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    onClick={() => setTheme("dark")}
                                                    isActive={theme === "dark"}
                                                >
                                                    <Moon className="h-4 w-4 mr-2" />
                                                    <span>Dark</span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    onClick={() => setTheme("system")}
                                                    isActive={theme === "system"}
                                                >
                                                    <Monitor className="h-4 w-4 mr-2" />
                                                    <span>System</span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>

                                <SidebarGroup>
                                    <SidebarGroupLabel>Display</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label
                                                        htmlFor="reduce-transparency"
                                                        className="text-sm font-medium"
                                                    >
                                                        Reduce transparency
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Reduce blur and transparency effects
                                                    </p>
                                                </div>
                                                <Switch id="reduce-transparency" />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="high-contrast" className="text-sm font-medium">
                                                        High contrast
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Increase contrast for better visibility
                                                    </p>
                                                </div>
                                                <Switch id="high-contrast" />
                                            </div>
                                        </div>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            </TabsContent>
                        </Tabs>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-border/50 pt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Gauge className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Preferences saved automatically</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
                                    setAnimationSpeed(1);
                                    setParallaxEffects(true);
                                    setScrollAnimations(true);
                                    setHoverEffects(true);
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </SidebarFooter>
                </Sidebar>
            </TooltipProvider>
        </SidebarProvider>
    );
}
