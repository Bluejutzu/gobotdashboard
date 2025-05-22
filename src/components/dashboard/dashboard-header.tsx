"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Bell,
    ChevronDown,
    LogOut,
    Menu,
    Moon,
    Settings,
    Sun,
    UserIcon,
    Shield,
    Home,
    HelpCircle,
    ExternalLink
} from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { Badge } from "@/components/ui/badge";
import supabase from "@/lib/supabase/client";

interface DashboardHeaderProps {
    user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [notifications, setNotifications] = useState<number>(0);
    const pathname = usePathname();

    // Set mounted to true on client side
    useEffect(() => {
        setMounted(true);
        // Check local storage for theme preference
        const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        if (storedTheme) {
            setTheme(storedTheme);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
        }

        // Simulate fetching notifications
        const fetchNotifications = async () => {
            // In a real app, you would fetch notifications from your API
            setNotifications(3);
        };

        fetchNotifications();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    // Get user initials for avatar fallback
    const getUserInitials = () => {
        if (!user?.user_metadata?.full_name) return "U";

        const nameParts = user.user_metadata.full_name.split(" ");
        if (nameParts.length >= 2) {
            return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        }
        return nameParts[0][0].toUpperCase();
    };

    // Check if we're on a server-specific page
    const isServerPage = pathname?.includes("/servers/");

    // Animation variants
    const headerVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    if (!mounted) return null;

    return (
        <motion.header
            className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm"
            initial="hidden"
            animate="visible"
            variants={headerVariants}
        >
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="pr-0">
                            <MobileNav />
                        </SheetContent>
                    </Sheet>

                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold md:inline-block">Sapphire</span>
                    </Link>

                    {isServerPage && (
                        <div className="hidden md:flex items-center">
                            <span className="text-muted-foreground mx-2">/</span>
                            <Badge variant="outline" className="font-normal text-xs px-2 py-0">
                                Server Dashboard
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle theme"
                        className="mr-1"
                        onClick={toggleTheme}
                    >
                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                {notifications > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                        {notifications}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-80 overflow-y-auto">
                                {notifications > 0 ? (
                                    <div className="p-2 space-y-2">
                                        <div className="rounded-md bg-muted p-3">
                                            <div className="flex items-start gap-2">
                                                <Shield className="h-5 w-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium">New Feature Available</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Moderation analytics is now available for all servers.
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-md bg-muted p-3">
                                            <div className="flex items-start gap-2">
                                                <Shield className="h-5 w-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium">Server Joined</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Sapphire has been added to a new server: Gaming Community
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-2">1 day ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-md bg-muted p-3">
                                            <div className="flex items-start gap-2">
                                                <Shield className="h-5 w-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium">System Update</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Sapphire has been updated to version 2.1.0
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-2">3 days ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-6 text-center">
                                        <Bell className="mx-auto h-8 w-8 text-muted-foreground/60" />
                                        <p className="mt-2 text-sm font-medium">No notifications</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            We'll notify you when something important happens.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <DropdownMenuSeparator />
                            <div className="p-2">
                                <Button variant="outline" size="sm" className="w-full">
                                    View all notifications
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 flex items-center gap-2 pl-2 pr-1">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage
                                        src={user?.user_metadata?.avatar_url || "/placeholder.svg"}
                                        alt={user?.user_metadata?.full_name || "User"}
                                    />
                                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                </Avatar>
                                <span className="max-w-[100px] truncate text-sm font-medium md:inline-block">
                                    {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                                </span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer">
                                        <Home className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile" className="cursor-pointer">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href="/docs" className="cursor-pointer">
                                        <HelpCircle className="mr-2 h-4 w-4" />
                                        <span>Documentation</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a
                                        href="https://discord.gg/sapphire"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        <span>Support Server</span>
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleSignOut}
                                className="cursor-pointer text-destructive focus:text-destructive"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </motion.header>
    );
}
