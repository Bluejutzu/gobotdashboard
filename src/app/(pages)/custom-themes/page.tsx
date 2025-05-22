"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, Palette, Save, Share, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ThemeData } from "@/lib/types/types";
import { useThemeContext } from "@/contexts/theme-context";
import { SiteHeader } from "@/components/site-header";
import supabase from "@/lib/supabase/client";

/****
 * Renders the Custom Themes page, allowing users to create, preview, save, and manage custom UI themes, as well as browse and interact with community-shared themes.
 *
 * @remark
 * - Requires user authentication for saving, liking, and managing themes.
 * - Applies theme color and border radius settings to CSS variables for live preview.
 * - Integrates with Supabase for authentication and theme persistence.
 */
export default function CustomThemesPage() {
    const { theme, setTheme } = useTheme();
    const { currentTheme, savedThemes, communityThemes, saveTheme, applyTheme, likeTheme, deleteTheme } =
        useThemeContext();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("create");

    const [primaryColor, setPrimaryColor] = useState(currentTheme.primary);
    const [secondaryColor, setSecondaryColor] = useState(currentTheme.secondary);
    const [accentColor, setAccentColor] = useState(currentTheme.accent);
    const [borderRadius, setBorderRadius] = useState(currentTheme.borderRadius);
    const [themeName, setThemeName] = useState("My Custom Theme");
    const [isPublic, setIsPublic] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Check for user session on mount
    useEffect(() => {
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        setMounted(true);

        // Initialize with current theme
        setPrimaryColor(currentTheme.primary);
        setSecondaryColor(currentTheme.secondary);
        setAccentColor(currentTheme.accent);
        setBorderRadius(currentTheme.borderRadius);
    }, [currentTheme]);

    useEffect(() => {
        document.documentElement.style.setProperty("--theme-primary", primaryColor || "");
        document.documentElement.style.setProperty("--theme-secondary", secondaryColor || "");
        document.documentElement.style.setProperty("--theme-accent", accentColor || "");
        document.documentElement.style.setProperty("--theme-radius", `${borderRadius}px`);

        return () => {
            document.documentElement.style.removeProperty("--theme-primary");
            document.documentElement.style.removeProperty("--theme-secondary");
            document.documentElement.style.removeProperty("--theme-accent");
            document.documentElement.style.removeProperty("--theme-radius");
        };
    }, [primaryColor, secondaryColor, accentColor, borderRadius]);

    const handleSaveTheme = async () => {
        if (!user) {
            toast("Authentication Required", {
                description: "Please sign in to save themes."
            });
            return;
        }

        const newTheme: ThemeData = {
            id: Date.now().toString(),
            name: themeName,
            primary: primaryColor,
            secondary: secondaryColor,
            accent: accentColor,
            borderRadius: borderRadius,
            isPublic: isPublic,
            userId: user.id
        };
        console.log(newTheme);

        await saveTheme(newTheme);
    };

    const handleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "github",
                options: {
                    redirectTo: window.location.href
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error("Error signing in:", error);
            toast("Authentication Error", {
                description: "Failed to sign in. Please try again."
            });
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader className="absolute top-0 left-0 right-0 z-50 bg-transparent" />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-background py-24 md:py-32">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute -top-20 -left-20 h-[40rem] w-[40rem] rounded-full bg-primary/5 animate-blob"></div>
                        <div className="absolute top-40 -right-20 h-[35rem] w-[35rem] rounded-full bg-blue-500/5 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-40 left-20 h-[30rem] w-[30rem] rounded-full bg-indigo-500/5 animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-500/10 rounded-full animate-float animation-delay-1000"></div>
                    <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-indigo-500/10 rounded-full animate-float animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-primary/10 rounded-full animate-float animation-delay-3000"></div>

                    <div className="container relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <Badge variant="outline" className="mb-4 animate-fade-in">
                                PERSONALIZATION
                            </Badge>
                            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-6 animate-slide-in">
                                Custom Themes
                            </h1>
                            <p className="text-xl text-muted-foreground animate-slide-in animation-delay-500">
                                Personalize your Gobot experience with custom color schemes and themes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Theme Editor Section */}
                <section className="py-16 md:py-24 relative">
                    <div className="container relative z-10">
                        <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                                <TabsTrigger value="create" className="flex items-center gap-2">
                                    <Palette className="h-4 w-4" />
                                    <span>Create</span>
                                </TabsTrigger>
                                <TabsTrigger value="community" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>Community</span>
                                </TabsTrigger>
                                <TabsTrigger value="saved" className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    <span>Saved</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="create" className="animate-fade-in">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-8">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Theme Editor</CardTitle>
                                                <CardDescription>Customize your Gobot experience</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="theme-name">Theme Name</Label>
                                                    <Input
                                                        id="theme-name"
                                                        value={themeName}
                                                        onChange={e => setThemeName(e.target.value)}
                                                        placeholder="My Awesome Theme"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="primary-color">Primary Color</Label>
                                                            <div
                                                                className="w-6 h-6 rounded-full border"
                                                                style={{ backgroundColor: primaryColor }}
                                                            ></div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id="primary-color"
                                                                type="color"
                                                                value={primaryColor}
                                                                onChange={e => setPrimaryColor(e.target.value)}
                                                                className="w-12 h-10 p-1"
                                                            />
                                                            <Input
                                                                value={primaryColor}
                                                                onChange={e => setPrimaryColor(e.target.value)}
                                                                className="flex-1"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="secondary-color">Secondary Color</Label>
                                                            <div
                                                                className="w-6 h-6 rounded-full border"
                                                                style={{ backgroundColor: secondaryColor }}
                                                            ></div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id="secondary-color"
                                                                type="color"
                                                                value={secondaryColor}
                                                                onChange={e => setSecondaryColor(e.target.value)}
                                                                className="w-12 h-10 p-1"
                                                            />
                                                            <Input
                                                                value={secondaryColor}
                                                                onChange={e => setSecondaryColor(e.target.value)}
                                                                className="flex-1"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="accent-color">Accent Color</Label>
                                                            <div
                                                                className="w-6 h-6 rounded-full border"
                                                                style={{ backgroundColor: accentColor }}
                                                            ></div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id="accent-color"
                                                                type="color"
                                                                value={accentColor}
                                                                onChange={e => setAccentColor(e.target.value)}
                                                                className="w-12 h-10 p-1"
                                                            />
                                                            <Input
                                                                value={accentColor}
                                                                onChange={e => setAccentColor(e.target.value)}
                                                                className="flex-1"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="border-radius">
                                                            Border Radius: {borderRadius}px
                                                        </Label>
                                                    </div>
                                                    <Slider
                                                        id="border-radius"
                                                        min={0}
                                                        max={20}
                                                        step={1}
                                                        value={[borderRadius || 0]}
                                                        onValueChange={value => setBorderRadius(value[0])}
                                                        className="py-4"
                                                    />
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="dark-mode"
                                                        checked={theme === "dark"}
                                                        onCheckedChange={checked =>
                                                            setTheme(checked ? "dark" : "light")
                                                        }
                                                    />
                                                    <Label htmlFor="dark-mode">Dark Mode</Label>
                                                </div>

                                                {user && (
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            id="public-theme"
                                                            checked={isPublic}
                                                            onCheckedChange={setIsPublic}
                                                        />
                                                        <Label htmlFor="public-theme">Share with community</Label>
                                                    </div>
                                                )}
                                            </CardContent>
                                            <CardFooter className="flex justify-between">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setPrimaryColor("#0ea5e9");
                                                        setSecondaryColor("#f1f5f9");
                                                        setAccentColor("#6366f1");
                                                        setBorderRadius(8);
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                                <Button onClick={handleSaveTheme}>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Theme
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </div>

                                    <div className="space-y-8">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Preview</CardTitle>
                                                <CardDescription>See how your theme looks</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">Buttons</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button
                                                                style={{
                                                                    backgroundColor: primaryColor,
                                                                    color: "#fff",
                                                                    borderRadius: `${borderRadius}px`
                                                                }}
                                                            >
                                                                Primary
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                style={{
                                                                    borderColor: primaryColor,
                                                                    color: primaryColor,
                                                                    borderRadius: `${borderRadius}px`
                                                                }}
                                                            >
                                                                Outline
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                style={{
                                                                    color: primaryColor,
                                                                    borderRadius: `${borderRadius}px`
                                                                }}
                                                            >
                                                                Ghost
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">Cards</div>
                                                        <div
                                                            className="border rounded-lg p-4"
                                                            style={{
                                                                borderRadius: `${borderRadius}px`,
                                                                borderColor: "var(--border)"
                                                            }}
                                                        >
                                                            <div className="font-medium mb-2">Card Title</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                This is a sample card with your theme applied.
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">Pricing Card Preview</div>
                                                        <div
                                                            className="border rounded-lg p-4 bg-white/5 backdrop-blur-sm"
                                                            style={{
                                                                borderRadius: `${borderRadius}px`,
                                                                borderColor: "var(--border)"
                                                            }}
                                                        >
                                                            <div className="text-center">
                                                                <div className="font-bold text-xl mb-1">Premium</div>
                                                                <div className="text-2xl font-bold mb-2">$4.99</div>
                                                                <div className="text-sm text-muted-foreground mb-4">
                                                                    For growing communities
                                                                </div>
                                                                <Button
                                                                    className="w-full"
                                                                    style={{
                                                                        backgroundColor: primaryColor,
                                                                        color: "#fff",
                                                                        borderRadius: `${borderRadius}px`
                                                                    }}
                                                                >
                                                                    Upgrade Now
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">Badges</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <span
                                                                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                                                style={{
                                                                    backgroundColor: primaryColor,
                                                                    color: "#fff",
                                                                    borderRadius: `${borderRadius}px`
                                                                }}
                                                            >
                                                                Primary
                                                            </span>
                                                            <span
                                                                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                                                style={{
                                                                    backgroundColor: secondaryColor,
                                                                    color: theme === "dark" ? "#fff" : "#000",
                                                                    borderRadius: `${borderRadius}px`
                                                                }}
                                                            >
                                                                Secondary
                                                            </span>
                                                            <span
                                                                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                                                style={{
                                                                    backgroundColor: accentColor,
                                                                    color: "#fff",
                                                                    borderRadius: `${borderRadius}px`
                                                                }}
                                                            >
                                                                Accent
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="community" className="animate-fade-in">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-2">Community Themes</h2>
                                    <p className="text-muted-foreground">
                                        Explore and use themes created by the community
                                    </p>
                                </div>

                                {!user && (
                                    <div className="text-center py-8 mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                                        <p className="mb-4 text-muted-foreground">
                                            Sign in to like and save community themes
                                        </p>
                                        <Button onClick={handleSignIn}>Sign In with GitHub</Button>
                                    </div>
                                )}

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {communityThemes.length > 0 ? (
                                        communityThemes.map(theme => (
                                            <Card key={theme.id} className="overflow-hidden hover-lift">
                                                <div
                                                    className="h-24 flex"
                                                    style={{
                                                        background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                                                    }}
                                                ></div>
                                                <CardHeader>
                                                    <CardTitle>{theme.name}</CardTitle>
                                                    <CardDescription>By {theme.creator || "Anonymous"}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex space-x-2 mb-4">
                                                        <div
                                                            className="w-8 h-8 rounded-full"
                                                            style={{ backgroundColor: theme.primary }}
                                                        ></div>
                                                        <div
                                                            className="w-8 h-8 rounded-full"
                                                            style={{ backgroundColor: theme.secondary }}
                                                        ></div>
                                                        <div
                                                            className="w-8 h-8 rounded-full"
                                                            style={{ backgroundColor: theme.accent }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Heart className="h-4 w-4 mr-1" />
                                                        <span>{theme.likes || 0} likes</span>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="flex justify-between">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => likeTheme(theme.id)}
                                                        disabled={!user}
                                                    >
                                                        <Heart className="h-4 w-4 mr-2" />
                                                        Like
                                                    </Button>
                                                    <Button size="sm" onClick={() => applyTheme(theme)}>
                                                        Apply Theme
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <p className="text-muted-foreground">No community themes available yet</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="saved" className="animate-fade-in">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-2">Your Saved Themes</h2>
                                    <p className="text-muted-foreground">Manage your custom themes</p>
                                </div>

                                {!user ? (
                                    <div className="text-center py-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                                        <p className="mb-4 text-muted-foreground">
                                            Sign in to save and manage your themes
                                        </p>
                                        <Button onClick={handleSignIn}>Sign In with GitHub</Button>
                                    </div>
                                ) : savedThemes.length > 0 ? (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedThemes.map(theme => (
                                            <Card key={theme.id} className="overflow-hidden hover-lift">
                                                <div
                                                    className="h-24 flex"
                                                    style={{
                                                        background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                                                    }}
                                                ></div>
                                                <CardHeader>
                                                    <CardTitle>{theme.name}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex space-x-2 mb-4">
                                                        <div
                                                            className="w-8 h-8 rounded-full"
                                                            style={{ backgroundColor: theme.primary }}
                                                        ></div>
                                                        <div
                                                            className="w-8 h-8 rounded-full"
                                                            style={{ backgroundColor: theme.secondary }}
                                                        ></div>
                                                        <div
                                                            className="w-8 h-8 rounded-full"
                                                            style={{ backgroundColor: theme.accent }}
                                                        ></div>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Border Radius: {theme.borderRadius}px
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="flex justify-between">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => deleteTheme(theme.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button size="sm" onClick={() => applyTheme(theme)}>
                                                        Apply
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border rounded-lg">
                                        <Save className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No saved themes</h3>
                                        <p className="text-muted-foreground mb-4">{`You haven't saved any custom themes yet.`}</p>
                                        <Button onClick={() => setActiveTab("create")}>Create a Theme</Button>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>

                {/* Share Section */}
                <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
                    <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.2)_0%,_transparent_70%)]"></div>
                    </div>
                    <div className="container relative z-10 text-center">
                        <h2 className="text-3xl font-bold md:text-4xl mb-6 animate-fade-in">Share Your Creativity</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-500">
                            Create and share your custom themes with the Gobot community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-1000">
                            <Button variant="secondary" className="group" onClick={() => setIsPublic(true)}>
                                <Share className="mr-2 h-4 w-4" />
                                Share Your Theme
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-transparent border-white text-white hover:bg-white/10"
                                onClick={() => setActiveTab("community")}
                            >
                                <Palette className="mr-2 h-4 w-4" />
                                Browse Gallery
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
