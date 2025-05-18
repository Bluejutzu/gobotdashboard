"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useThemeContext } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ThemeData } from "@/lib/types"
import { ColorPicker } from "@/components/ui/color-picker"

interface ThemeCreatorProps {
    initialTheme?: ThemeData
    onSave?: (theme: ThemeData) => void
    onCancel?: () => void
}

export function ThemeCreator({ initialTheme, onSave, onCancel }: ThemeCreatorProps) {
    const { currentTheme, saveTheme } = useThemeContext()

    // Initialize with provided theme or current theme
    const [themeName, setThemeName] = useState(initialTheme?.name || "My Custom Theme")
    const [primaryColor, setPrimaryColor] = useState(initialTheme?.primary || currentTheme.primary)
    const [secondaryColor, setSecondaryColor] = useState(initialTheme?.secondary || currentTheme.secondary)
    const [accentColor, setAccentColor] = useState(initialTheme?.accent || currentTheme.accent)
    const [borderRadius, setBorderRadius] = useState(initialTheme?.borderRadius || currentTheme.borderRadius)
    const [isPublic, setIsPublic] = useState(initialTheme?.isPublic || false)
    const [category, setCategory] = useState(initialTheme?.category || "custom")

    // Preview styles
    const [previewStyles, setPreviewStyles] = useState({
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
        borderRadius: `${borderRadius}px`,
    })

    // Update preview when colors change
    useEffect(() => {
        setPreviewStyles({
            primary: primaryColor,
            secondary: secondaryColor,
            accent: accentColor,
            borderRadius: `${borderRadius}px`,
        })
    }, [primaryColor, secondaryColor, accentColor, borderRadius])

    // Handle save
    const handleSave = async () => {
        if (!themeName.trim()) {
            toast.error("Please enter a theme name")
            return
        }

        const newTheme: ThemeData = {
            id: initialTheme?.id || Date.now().toString(),
            name: themeName,
            primary: primaryColor,
            secondary: secondaryColor,
            accent: accentColor,
            borderRadius: borderRadius,
            isPublic: isPublic,
            category: category,
        }

        try {
            await saveTheme(newTheme)
            if (onSave) onSave(newTheme)
        } catch (error) {
            console.error("Error saving theme:", error)
        }
    }

    // Handle reset
    const handleReset = () => {
        if (initialTheme) {
            setThemeName(initialTheme.name)
            setPrimaryColor(initialTheme.primary)
            setSecondaryColor(initialTheme.secondary)
            setAccentColor(initialTheme.accent)
            setBorderRadius(initialTheme.borderRadius)
            setIsPublic(initialTheme.isPublic || false)
            setCategory(initialTheme.category || "custom")
        } else {
            setThemeName("My Custom Theme")
            setPrimaryColor("#0ea5e9")
            setSecondaryColor("#f1f5f9")
            setAccentColor("#6366f1")
            setBorderRadius(8)
            setIsPublic(false)
            setCategory("custom")
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                    id="theme-name"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    placeholder="My Awesome Theme"
                />
            </div>

            <div className="space-y-4">
                <ColorPicker color={primaryColor} onChange={setPrimaryColor} label="Primary Color" />

                <ColorPicker color={secondaryColor} onChange={setSecondaryColor} label="Secondary Color" />

                <ColorPicker color={accentColor} onChange={setAccentColor} label="Accent Color" />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="border-radius">Border Radius: {borderRadius}px</Label>
                </div>
                <Slider
                    id="border-radius"
                    min={0}
                    max={20}
                    step={1}
                    value={[borderRadius]}
                    onValueChange={(value) => setBorderRadius(value[0])}
                    className="py-4"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="theme-category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="theme-category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="colorful">Colorful</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center space-x-2">
                <Switch id="public-theme" checked={isPublic} onCheckedChange={setIsPublic} />
                <Label htmlFor="public-theme">Share with community</Label>
            </div>

            {/* Preview Section */}
            <div className="space-y-2 pt-4 border-t border-white/10">
                <Label>Preview</Label>
                <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Buttons</div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    className="px-4 py-2 text-white rounded-md"
                                    style={{
                                        backgroundColor: previewStyles.primary,
                                        borderRadius: previewStyles.borderRadius,
                                    }}
                                >
                                    Primary Button
                                </button>
                                <button
                                    className="px-4 py-2 border rounded-md"
                                    style={{
                                        borderColor: previewStyles.primary,
                                        color: previewStyles.primary,
                                        borderRadius: previewStyles.borderRadius,
                                    }}
                                >
                                    Outline Button
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Card</div>
                            <div
                                className="p-4 border rounded-md"
                                style={{
                                    borderColor: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: previewStyles.borderRadius,
                                }}
                            >
                                <div className="font-medium mb-2">Card Title</div>
                                <div className="text-sm text-white/70">Card content with your theme applied.</div>
                                <div className="mt-4">
                                    <button
                                        className="px-3 py-1 text-xs text-white rounded-md"
                                        style={{
                                            backgroundColor: previewStyles.accent,
                                            borderRadius: previewStyles.borderRadius,
                                        }}
                                    >
                                        Action
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Badges</div>
                            <div className="flex flex-wrap gap-2">
                                <span
                                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                    style={{
                                        backgroundColor: previewStyles.primary,
                                        color: "#fff",
                                        borderRadius: previewStyles.borderRadius,
                                    }}
                                >
                                    Primary
                                </span>
                                <span
                                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                    style={{
                                        backgroundColor: previewStyles.secondary,
                                        color: "#000",
                                        borderRadius: previewStyles.borderRadius,
                                    }}
                                >
                                    Secondary
                                </span>
                                <span
                                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                    style={{
                                        backgroundColor: previewStyles.accent,
                                        color: "#fff",
                                        borderRadius: previewStyles.borderRadius,
                                    }}
                                >
                                    Accent
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleReset}>
                    Reset
                </Button>
                <div className="flex gap-2">
                    {onCancel && (
                        <Button variant="ghost" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button onClick={handleSave}>Save Theme</Button>
                </div>
            </div>
        </div>
    )
}
