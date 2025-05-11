"use client"

import type React from "react"

import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NotFound() {
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="mx-auto max-w-md text-center">
                <h1 className="text-4xl font-bold">404</h1>
                <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
                <p className="mt-4 text-gray-600">
                    We couldn&apos;t find the page you&apos;re looking for. Please check the URL or
                    return to the homepage.
                </p>
            </div>

            {/* Background glow effect */}
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -z-10" />

            {/* Minecraft-style 404 text */}
            <div className="mb-8 text-center">
                <h1
                    className="text-8xl font-bold text-primary mb-2 tracking-widest"
                    style={{
                        fontFamily: '"Minecraft", monospace',
                        textShadow: "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)",
                    }}
                >
                    404
                </h1>
                <h2
                    className="text-2xl md:text-3xl font-semibold mb-4"
                    style={{
                        fontFamily: '"Minecraft", monospace',
                        textShadow: "0 0 5px rgba(59, 130, 246, 0.3)",
                    }}
                >
                    Page Not Found
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Oops! Looks like you&apos;ve ventured into uncharted territory. The page you&apos;re looking for has either been moved
                    or doesn&apos;t exist.
                </p>
            </div>

            {/* Pixel art character - simple CSS art */}
            <div className="mb-8 pixel-character animate-float">
                <div className="w-16 h-16 relative mx-auto">
                    <div className="absolute w-8 h-8 bg-primary rounded-sm top-0 left-4"></div>
                    <div className="absolute w-4 h-4 bg-background rounded-sm top-2 left-6"></div>
                    <div className="absolute w-12 h-6 bg-primary/80 rounded-sm top-8 left-2"></div>
                    <div className="absolute w-4 h-8 bg-primary/80 rounded-sm top-8 left-0"></div>
                    <div className="absolute w-4 h-8 bg-primary/80 rounded-sm top-8 right-0"></div>
                </div>
            </div>

            {/* Search form */}
            <div className="mb-8 w-full max-w-md">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Search for content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-secondary/50 border-primary/20 focus-visible:ring-primary"
                    />
                    <Button type="submit" variant="secondary">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </form>
            </div>

            {/* Navigation options */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="default" className="animate-pulse-slow">
                    <Link href="/">Return to Homepage</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild variant="ghost" onClick={() => router.back()}>
                    Go to previous Page
                </Button>
            </div>

            {/* Minecraft-style footer text */}
            <p className="mt-12 text-sm text-muted-foreground" style={{ fontFamily: '"Minecraft", monospace' }}>
                You died! Score: 0
            </p>
        </div>
    )
}
