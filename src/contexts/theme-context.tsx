"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import type { ThemeContextType, ThemeData } from "@/lib/types"
import {
    supabase,
    getThemes,
    getUserThemes,
    saveTheme as saveThemeToDb,
    deleteTheme as deleteThemeFromDb,
    likeTheme as likeThemeInDb,
} from "@/lib/supabase"
import { hexToHSL } from "@/lib/color-utils"
import { validateThemeData } from "@/lib/theme-export"

// Default theme
const defaultTheme: ThemeData = {
    id: "default",
    name: "Default Theme",
    primary: "#0ea5e9",
    secondary: "#73d0e6",
    accent: "#6366f1",
    borderRadius: 8,
}

const ThemeContext = createContext<ThemeContextType>({
    currentTheme: defaultTheme,
    setCurrentTheme: () => { },
    savedThemes: [],
    communityThemes: [],
    saveTheme: async () => { },
    importTheme: async () => { },
    applyTheme: () => { },
    likeTheme: async () => { },
    deleteTheme: async () => { },
    isLoading: false,
    error: null,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [currentTheme, setCurrentTheme] = useState<ThemeData>(defaultTheme)
    const [savedThemes, setSavedThemes] = useState<ThemeData[]>([])
    const [communityThemes, setCommunityThemes] = useState<ThemeData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<any>(null)

    // Check for user session on mount
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null)
        })

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Load themes when user changes
    useEffect(() => {
        async function loadThemes() {
            setIsLoading(true)
            setError(null)

            try {
                // Load community themes
                const publicThemes = await getThemes(true)
                setCommunityThemes(publicThemes.map(formatThemeFromDb))

                // Load user themes if logged in
                if (user) {
                    const userThemes = await getUserThemes(user.id)
                    setSavedThemes(userThemes.map(formatThemeFromDb))
                }
            } catch (err) {
                console.error("Error loading themes:", err)
                setError("Failed to load themes")
                toast.error("Error loading themes. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }

        loadThemes()
    }, [user])

    // Apply theme to document
    useEffect(() => {
        if (!currentTheme.primary || !currentTheme.secondary || !currentTheme.accent) {
            return
        }

        // Convert hex colors to HSL for CSS variables
        const primaryHSL = hexToHSL(currentTheme.primary)
        const secondaryHSL = hexToHSL(currentTheme.secondary)
        const accentHSL = hexToHSL(currentTheme.accent)

        // Set CSS variables for direct use
        document.documentElement.style.setProperty("--theme-primary", currentTheme.primary)
        document.documentElement.style.setProperty("--theme-secondary", currentTheme.secondary)
        document.documentElement.style.setProperty("--theme-accent", currentTheme.accent)
        document.documentElement.style.setProperty("--theme-radius", `${currentTheme.borderRadius}px`)

        // Set HSL variables for Tailwind
        document.documentElement.style.setProperty("--primary", primaryHSL)
        document.documentElement.style.setProperty("--secondary", secondaryHSL)
        document.documentElement.style.setProperty("--accent", accentHSL)
        document.documentElement.style.setProperty("--radius", `${currentTheme.borderRadius}px`)

        // Store the current theme in localStorage for persistence
        localStorage.setItem("current-theme", JSON.stringify(currentTheme))

        return () => {
            // Clean up CSS variables
            document.documentElement.style.removeProperty("--theme-primary")
            document.documentElement.style.removeProperty("--theme-secondary")
            document.documentElement.style.removeProperty("--theme-accent")
            document.documentElement.style.removeProperty("--theme-radius")

            document.documentElement.style.removeProperty("--primary")
            document.documentElement.style.removeProperty("--secondary")
            document.documentElement.style.removeProperty("--accent")
            document.documentElement.style.removeProperty("--radius")
        }
    }, [currentTheme])

    // Load saved theme from localStorage on initial mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("current-theme")
        if (savedTheme) {
            try {
                const parsedTheme = JSON.parse(savedTheme)
                setCurrentTheme(parsedTheme)
            } catch (err) {
                console.error("Error parsing saved theme:", err)
            }
        }
    }, [])

    // Format theme from database
    function formatThemeFromDb(theme: any): ThemeData {
        return {
            id: theme.id,
            name: theme.name,
            primary: theme.primary_color, // Map from primary_color to primary
            secondary: theme.secondary_color, // Map from secondary_color to secondary
            accent: theme.accent_color, // Map from accent_color to accent
            borderRadius: theme.border_radius,
            creator: theme.creator_name,
            likes: theme.likes || 0,
            isPublic: theme.is_public || false,
            userId: theme.user_id,
            createdAt: theme.created_at,
        }
    }

    // Format theme for database
    function formatThemeForDb(theme: ThemeData): any {
        return {
            name: theme.name,
            primary_color: theme.primary,
            secondary_color: theme.secondary,
            accent_color: theme.accent,
            border_radius: theme.borderRadius,
            user_id: user?.id,
            is_public: theme.isPublic || false,
            creator_name: user?.user_metadata?.name || user?.user_metadata?.full_name || "Anonymous",
        }
    }

    // Apply a theme
    const applyTheme = (theme: ThemeData) => {
        setCurrentTheme(theme)
        toast.success(`The theme "${theme.name}" has been applied.`)

        // Dispatch a custom event that components can listen for
        const event = new CustomEvent("themeChanged", { detail: theme })
        document.dispatchEvent(event)
    }

    // Save a theme
    const saveTheme = async (theme: ThemeData) => {
        if (!user) {
            toast.error("Please sign in to save themes.")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const themeToSave = {
                ...formatThemeForDb(theme),
                user_id: user.id,
            }

            const savedTheme = await saveThemeToDb(themeToSave)

            if (savedTheme) {
                const formattedTheme = formatThemeFromDb(savedTheme)
                setSavedThemes((prev) => [formattedTheme, ...prev])

                toast.success(`Your theme "${theme.name}" has been saved successfully.`)
            }
        } catch (err) {
            console.error("Error saving theme:", err)
            setError("Failed to save theme")
            toast.error("Failed to save theme. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Import a theme
    const importTheme = async (themeData: ThemeData) => {
        if (!validateThemeData(themeData)) {
            toast.error("Invalid theme data. Please check the file format.")
            return
        }

        // If user is logged in, save the theme to their collection
        if (user) {
            await saveTheme(themeData)
        } else {
            // If not logged in, just add to local state
            setSavedThemes((prev) => [themeData, ...prev])
            toast.success(`Theme "${themeData.name}" has been imported.`)
        }

        // Apply the imported theme
        applyTheme(themeData)
    }

    // Like a theme
    const likeTheme = async (themeId: number | string) => {
        if (!user) {
            toast.error("Please sign in to like themes.")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const updatedTheme = await likeThemeInDb(themeId)

            if (updatedTheme) {
                setCommunityThemes((prev) =>
                    prev.map((theme) => (theme.id === themeId ? { ...theme, likes: (theme.likes || 0) + 1 } : theme)),
                )

                toast.success("You've liked this community theme.")
            }
        } catch (err) {
            console.error("Error liking theme:", err)
            setError("Failed to like theme")
            toast.error("Failed to like theme. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Delete a theme
    const deleteTheme = async (themeId: number | string) => {
        if (!user) {
            toast.error("Please sign in to delete themes.")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const success = await deleteThemeFromDb(themeId)

            if (success) {
                setSavedThemes((prev) => prev.filter((theme) => theme.id !== themeId))

                toast.success("The theme has been deleted successfully.")
            }
        } catch (err) {
            console.error("Error deleting theme:", err)
            setError("Failed to delete theme")
            toast.error("Failed to delete theme. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ThemeContext.Provider
            value={{
                currentTheme,
                setCurrentTheme,
                savedThemes,
                communityThemes,
                saveTheme,
                importTheme,
                applyTheme,
                likeTheme,
                deleteTheme,
                isLoading,
                error,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () => useContext(ThemeContext)
