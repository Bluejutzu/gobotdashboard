"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Settings, Shield, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase/client";

type AdminSidebarProps = React.HTMLAttributes<HTMLElement>;

export function AdminSidebar({ className, ...props }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const items = [
        {
            title: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard
        },
        {
            title: "Data Requests",
            href: "/admin/data-requests",
            icon: FileText
        },
        {
            title: "Users",
            href: "/admin/users",
            icon: Users
        },
        {
            title: "Permissions",
            href: "/admin/permissions",
            icon: Shield
        },
        {
            title: "Settings",
            href: "/admin/settings",
            icon: Settings
        }
    ];

    return (
        <nav className={cn("flex flex-col space-y-1", className)} {...props}>
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Dashboard</h2>
                <div className="space-y-1">
                    {items.map(item => (
                        <Button
                            key={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start",
                                pathname === item.href
                                    ? "bg-muted hover:bg-muted"
                                    : "hover:bg-transparent hover:underline"
                            )}
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2 mt-auto">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </Button>
            </div>
        </nav>
    );
}
