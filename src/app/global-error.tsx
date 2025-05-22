"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-[#1e2030] text-white">
                <div className="flex min-h-screen flex-col items-center justify-center p-4">
                    <div className="relative w-full max-w-md">
                        {/* Animated background elements */}
                        <div className="absolute -top-20 -left-20 h-[20rem] w-[20rem] rounded-full bg-destructive/10 animate-blob will-animate"></div>
                        <div className="absolute top-20 -right-20 h-[15rem] w-[15rem] rounded-full bg-destructive/15 animate-blob animation-delay-2000 will-animate"></div>
                        <div className="absolute -bottom-20 left-10 h-[18rem] w-[18rem] rounded-full bg-destructive/10 animate-blob animation-delay-4000 will-animate"></div>

                        <div className="relative z-10 text-center space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-destructive/20 rounded-full flex items-center justify-center mb-6 animate-pulse-slow will-animate">
                                    <AlertOctagon className="h-12 w-12 text-destructive" />
                                </div>
                                <h1 className="text-3xl font-bold tracking-tighter">Critical Error</h1>
                                <p className="mt-4 text-lg text-gray-400 max-w-sm animate-fade-in animation-delay-300 will-animate">
                                    We've encountered a critical error with the application.
                                </p>
                                {error.digest && (
                                    <div className="mt-2 px-3 py-1 bg-destructive/10 rounded-md text-sm font-mono text-destructive animate-fade-in animation-delay-500 will-animate">
                                        Error ID: {error.digest}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up animation-delay-500 will-animate">
                                <Button variant="outline" className="group hover-glow" onClick={reset}>
                                    <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                                    Reload Application
                                </Button>
                                <Button className="bg-destructive hover:bg-destructive/90 btn-pulse" asChild>
                                    <Link href="/">
                                        <Home className="mr-2 h-4 w-4" />
                                        Return Home
                                    </Link>
                                </Button>
                            </div>

                            <div className="pt-8 text-sm text-gray-500 animate-fade-in animation-delay-700 will-animate">
                                <p>Please contact our support team with the error ID above.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
