"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ErrorPage } from "@/components/error-page"
import { AlertTriangle, Bug, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Errorv2Page from "./errorv2/disabled"

export default function ErrorDemoPage() {
    const [selectedError, setSelectedError] = useState<string>("none")
    const [selectedStyle, setSelectedStyle] = useState<string>("standard")
    const [showError, setShowError] = useState(false)

    // Reset error state
    const resetError = () => {
        setShowError(false)
        setSelectedError("none")
    }

    // Handle showing error or redirecting
    const handleShowError = () => {
        if (selectedError === "errorv2") {
            setShowError(true)
            return
        }
        setShowError(true)
    }

    // If showing error, render the error page
    if (showError) {
        if (selectedError === "errorv2") {
            return <Errorv2Page error={new Error("Demo error for errorv2 page") as Error & { digest?: string }} reset={resetError} />
        }

        const statusCode = selectedError !== "custom" ? Number.parseInt(selectedError, 10) : undefined
        const isMinecraft = selectedStyle === "minecraft"

        // Custom actions for Minecraft style
        const customActions = isMinecraft ? (
            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="default" className="animate-pulse-slow">
                    <Link href="/">Return to Homepage</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button variant="ghost" onClick={resetError}>
                    Go to previous Page
                </Button>
            </div>
        ) : undefined

        return (
            <ErrorPage
                statusCode={statusCode}
                title={selectedError === "custom" ? "Custom Error" : undefined}
                description={
                    selectedError === "custom" ? "This is a custom error message for demonstration purposes." : undefined
                }
                errorId={selectedError === "custom" ? "DEMO-12345" : undefined}
                showReset={!isMinecraft}
                resetFn={resetError}
                minecraftStyle={isMinecraft}
                showSearch={isMinecraft}
                showPixelCharacter={isMinecraft}
                customActions={customActions}
                footerText={isMinecraft ? "You died! Score: 0" : undefined}
            />
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#1e2030] text-white p-4">
            <Card className="w-full max-w-md bg-[#252839] border-[#2a2d3d] text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bug className="h-5 w-5 text-primary" />
                        Error Page Demo
                    </CardTitle>
                    <CardDescription className="text-gray-400">Test different error pages and see how they look</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Select Error Type</label>
                        <Select value={selectedError} onValueChange={setSelectedError}>
                            <SelectTrigger className="bg-[#1e2030] border-[#2a2d3d] text-white">
                                <SelectValue placeholder="Select an error type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1e2030] border-[#2a2d3d] text-white">
                                <SelectItem value="none">Select an error...</SelectItem>
                                <SelectItem value="400">400 - Bad Request</SelectItem>
                                <SelectItem value="401">401 - Unauthorized</SelectItem>
                                <SelectItem value="403">403 - Forbidden</SelectItem>
                                <SelectItem value="404">404 - Not Found</SelectItem>
                                <SelectItem value="500">500 - Internal Server Error</SelectItem>
                                <SelectItem value="503">503 - Service Unavailable</SelectItem>
                                <SelectItem value="custom">Custom Error</SelectItem>
                                <SelectItem value="errorv2">Error V2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Select Style</label>
                        <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                            <SelectTrigger className="bg-[#1e2030] border-[#2a2d3d] text-white">
                                <SelectValue placeholder="Select a style" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1e2030] border-[#2a2d3d] text-white">
                                <SelectItem value="standard">Standard Style</SelectItem>
                                <SelectItem value="minecraft">Minecraft Style</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md bg-amber-500/10 p-3 border border-amber-500/20">
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                            <div className="text-sm text-amber-300">
                                <p>This is a demo page to preview error pages. No actual errors will be thrown.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                    <Button variant="outline" className="hover-glow" onClick={resetError}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                    <Button
                        className="bg-primary hover:bg-primary/90 btn-pulse"
                        onClick={handleShowError}
                        disabled={selectedError === "none"}
                    >
                        Show Error Page
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
