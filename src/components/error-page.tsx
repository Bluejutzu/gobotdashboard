"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";

interface ErrorPageProps {
    statusCode?: number;
    title?: string;
    description?: string;
    errorId?: string;
    showReset?: boolean;
    resetFn?: () => void;
    className?: string;
    minecraftStyle?: boolean;
    showSearch?: boolean;
    showPixelCharacter?: boolean;
    customActions?: React.ReactNode;
    footerText?: string;
}

export function ErrorPage({
    statusCode = 404,
    title,
    description,
    errorId,
    showReset = false,
    resetFn,
    className,
    minecraftStyle = false,
    showSearch = false,
    showPixelCharacter = false,
    customActions,
    footerText
}: ErrorPageProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    // Default messages based on status code
    const defaultTitle = statusCode ? getDefaultTitleByStatus(statusCode) : "An Error Occurred";
    const defaultDescription = statusCode
        ? getDefaultDescriptionByStatus(statusCode)
        : "We've encountered an error while processing your request.";

    // Use provided values or defaults
    const displayTitle = title || defaultTitle;
    const displayDescription = description || defaultDescription;

    // Determine background color based on status code
    const bgColor = statusCode && statusCode >= 500 ? "destructive" : "primary";

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className={cn("flex min-h-screen flex-col items-center justify-center", className)}>
            {/* Background glow effect */}
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -z-10" />

            <div className="relative w-full max-w-md text-center">
                {/* Minecraft-style 404 text or standard error display */}
                <div className="mb-8 text-center">
                    {minecraftStyle ? (
                        <>
                            <h1
                                className="text-8xl font-bold text-primary mb-2 tracking-widest"
                                style={{
                                    fontFamily: '"Minecraft", monospace',
                                    textShadow: "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)"
                                }}
                            >
                                {statusCode}
                            </h1>
                            <h2
                                className="text-2xl md:text-3xl font-semibold mb-4"
                                style={{
                                    fontFamily: '"Minecraft", monospace',
                                    textShadow: "0 0 5px rgba(59, 130, 246, 0.3)"
                                }}
                            >
                                {displayTitle}
                            </h2>
                        </>
                    ) : (
                        <div className="relative">
                            <div
                                className={`text-[10rem] font-bold text-${bgColor}/10 animate-pulse-slow will-animate`}
                            >
                                {statusCode}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h1 className="text-4xl font-bold tracking-tighter gradient-text">{displayTitle}</h1>
                            </div>
                        </div>
                    )}
                    <p className="text-muted-foreground max-w-md mx-auto">{displayDescription}</p>

                    {errorId && (
                        <div className="mt-2 px-3 py-1 bg-destructive/10 rounded-md text-sm font-mono text-destructive animate-fade-in animation-delay-500 will-animate">
                            Error ID: {errorId}
                        </div>
                    )}
                </div>

                {/* Pixel art character - simple CSS art */}
                {showPixelCharacter && (
                    <div className="mb-8 pixel-character animate-float">
                        <div className="w-16 h-16 relative mx-auto">
                            <div className="absolute w-8 h-8 bg-primary rounded-sm top-0 left-4"></div>
                            <div className="absolute w-4 h-4 bg-background rounded-sm top-2 left-6"></div>
                            <div className="absolute w-12 h-6 bg-primary/80 rounded-sm top-8 left-2"></div>
                            <div className="absolute w-4 h-8 bg-primary/80 rounded-sm top-8 left-0"></div>
                            <div className="absolute w-4 h-8 bg-primary/80 rounded-sm top-8 right-0"></div>
                        </div>
                    </div>
                )}

                {/* Search form */}
                {showSearch && (
                    <div className="mb-8 w-full max-w-md">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Search for content..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-secondary/50 border-primary/20 focus-visible:ring-primary"
                            />
                            <Button type="submit" variant="secondary">
                                <Search className="h-4 w-4 mr-2" />
                                Search
                            </Button>
                        </form>
                    </div>
                )}

                {/* Custom actions or default actions */}
                {customActions ? (
                    customActions
                ) : (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up animation-delay-500 will-animate">
                        {showReset && resetFn ? (
                            <Button variant="outline" className="group hover-glow" onClick={resetFn}>
                                <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                                Try Again
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                className="group hover-glow"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Go Back
                            </Button>
                        )}

                        <Button className={`bg-${bgColor} hover:bg-${bgColor}/90 btn-pulse`} asChild>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Return Home
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Minecraft-style footer text or standard footer */}
                {footerText ? (
                    <p className="mt-12 text-sm text-muted-foreground" style={{ fontFamily: '"Minecraft", monospace' }}>
                        {footerText}
                    </p>
                ) : (
                    <div className="pt-8 text-sm text-gray-500 animate-fade-in animation-delay-700 will-animate">
                        <p>
                            {statusCode && statusCode >= 500
                                ? "If this problem persists, please contact our support team."
                                : "If you believe this is an error, please contact support."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper functions to get default messages based on status code
function getDefaultTitleByStatus(statusCode: number): string {
    switch (statusCode) {
        case 400:
            return "Bad Request";
        case 401:
            return "Unauthorized";
        case 403:
            return "Forbidden";
        case 404:
            return "Page Not Found";
        case 405:
            return "Method Not Allowed";
        case 408:
            return "Request Timeout";
        case 429:
            return "Too Many Requests";
        case 500:
            return "Internal Server Error";
        case 502:
            return "Bad Gateway";
        case 503:
            return "Service Unavailable";
        case 504:
            return "Gateway Timeout";
        default:
            return statusCode >= 500 ? "Server Error" : "Client Error";
    }
}

function getDefaultDescriptionByStatus(statusCode: number): string {
    switch (statusCode) {
        case 400:
            return "The server could not understand the request due to invalid syntax.";
        case 401:
            return "You need to be authenticated to access this resource.";
        case 403:
            return "You don't have permission to access this resource.";
        case 404:
            return "Oops! Looks like you've ventured into uncharted territory. The page you're looking for has either been moved or doesn't exist.";
        case 405:
            return "The method specified in the request is not allowed for the resource.";
        case 408:
            return "The server timed out waiting for the request.";
        case 429:
            return "You've sent too many requests. Please try again later.";
        case 500:
            return "The server encountered an unexpected condition that prevented it from fulfilling the request.";
        case 502:
            return "The server received an invalid response from an upstream server.";
        case 503:
            return "The server is currently unavailable. Please try again later.";
        case 504:
            return "The server was acting as a gateway and did not receive a timely response.";
        default:
            return statusCode >= 500
                ? "We've encountered a server error. Our team has been notified."
                : "We've encountered an error with your request.";
    }
}
