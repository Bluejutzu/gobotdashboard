"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export function AnimationPreferences() {
    const [reducedMotion, setReducedMotion] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedPreference = localStorage.getItem("reduced-motion")
        if (savedPreference) {
            setReducedMotion(savedPreference === "true")
        } else {
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            setReducedMotion(prefersReducedMotion)
        }
    }, [])

    useEffect(() => {
        if (!mounted) return

        localStorage.setItem("reduced-motion", reducedMotion.toString())

        if (reducedMotion) {
            document.documentElement.classList.add("reduce-motion")
        } else {
            document.documentElement.classList.remove("reduce-motion")
        }
    }, [reducedMotion, mounted])

    if (!mounted) return null

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Animation Settings">
                    <Settings className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Animation Preferences</SheetTitle>
                    <SheetDescription>
                        Customize your animation experience on our website.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="reduced-motion">Reduce animations</Label>
                            <p className="text-sm text-muted-foreground">
                                Minimize or disable animations for a simpler experience.
                            </p>
                        </div>
                        <Switch
                            id="reduced-motion"
                            checked={reducedMotion}
                            onCheckedChange={setReducedMotion}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
