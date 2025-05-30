"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/themes/theme-selector";
import supabase from "@/lib/supabase/client";

export function SiteHeader({ className }: { className?: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session }
            } = await supabase.auth.getSession();
            if (!session) {
                router.push("/auth/login");
            }
            setIsLoggedIn(!!session);
        };
        checkSession();
    }, [router]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isDashboard = pathname.startsWith("/dashboard");

    if (isDashboard) {
        return <></>;
    }

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-black/80 backdrop-blur-md py-3 shadow-md" : "bg-transparent py-5",
                className
            )}
        >
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                        Gobot
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname === "/" ? "text-white" : "text-white/70"
                        )}
                    >
                        Home
                    </Link>
                    <Link
                        href="/features"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname === "/features" ? "text-white" : "text-white/70"
                        )}
                    >
                        Features
                    </Link>
                    <Link
                        href="/pricing"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname === "/pricing" ? "text-white" : "text-white/70"
                        )}
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/docs"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname === "/docs" ? "text-white" : "text-white/70"
                        )}
                    >
                        Docs
                    </Link>
                    <Link
                        href="/custom-themesv2"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname === "/custom-themesv2" ? "text-white" : "text-white/70"
                        )}
                    >
                        Themes
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <ThemeSelector />
                    {isLoggedIn ? (
                        <>
                            <Button asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <Button
                                variant={"outline"}
                                onClick={() =>
                                    supabase.auth.signOut().then(() => {
                                        router.push("/");
                                    })
                                }
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <Button asChild>
                            <Link href="/auth/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
