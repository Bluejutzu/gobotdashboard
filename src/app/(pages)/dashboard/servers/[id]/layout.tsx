import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/theme-context";
import { getFormattedServerList } from "@/lib/redis-service/guild-service";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Progress } from "@/components/ui/progress";
// Define Inter font configuration outside the component for better caching
const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter"
});

// Type definitions for better code maintainability
interface ServerLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

/**
 * Generate metadata for the server page
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createServerSupabaseClient();

        const { data: server, error } = await supabase.from("servers").select("name").eq("discord_id", id).single();

        if (error) {
            console.error("Error fetching server metadata:", error);
            return { title: "Server Dashboard" };
        }

        return {
            title: `${server?.name || "Server"} - Dashboard`,
            description: `Manage settings and configuration for ${server?.name || "your server"}`
        };
    } catch (err) {
        console.error("Failed to generate metadata:", err);
        return { title: "Server Dashboard" };
    }
}

/**
 * Loading component for server data
 */
function ServerLoading() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Progress />
        </div>
    );
}

/**
 * Server layout component
 */
export default async function ServerLayout({ children, params }: ServerLayoutProps) {
    // Extract server ID
    const { id } = await params;

    // Initialize Supabase client
    const supabase = await createServerSupabaseClient();

    // Get user authentication information
    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();

    // Redirect to login if authentication fails
    if (userError || !user?.id) {
        console.error("Authentication error:", userError || "No user ID found");
        redirect("/login?redirectTo=/dashboard/servers/" + id);
    }

    // Fetch server data and user's guilds
    try {
        // Get server information
        const { data: server, error: serverError } = await supabase
            .from("servers")
            .select("*")
            .eq("discord_id", id)
            .single();

        if (serverError || !server) {
            console.error("Error fetching server:", serverError);
        }

        // Get formatted list of user's servers
        const guilds = await getFormattedServerList(user.user_metadata?.provider_id, user.id, false, "server-layout");

        if (!guilds.some(guild => guild.id === id)) {
            console.error("User does not have access to this server");
        }

        return (
            <html lang="en" suppressHydrationWarning className={inter.variable}>
                <body className={`${inter.className} antialiased`}>
                    <ThemeProvider>
                        <div className="flex min-h-screen flex-col">
                            <Suspense fallback={<div className="h-14 w-full bg-background/80 backdrop-blur-sm" />}>
                                <DashboardHeader user={user} />
                            </Suspense>

                            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                                    <Suspense fallback={<div className="p-4">Loading servers...</div>}>
                                        <DashboardNav
                                            serverId={id}
                                            serverName={server.name}
                                            serverIcon={server.icon}
                                            guilds={guilds}
                                        />
                                    </Suspense>
                                </aside>

                                <main className="flex w-full flex-col overflow-hidden">
                                    <Suspense fallback={<ServerLoading />}>{children}</Suspense>
                                </main>
                            </div>
                        </div>

                        <SiteFooter />
                        <Toaster className="dark" />
                        <Analytics />
                        <SpeedInsights />
                    </ThemeProvider>
                </body>
            </html>
        );
    } catch (err) {
        console.error("Unhandled error in server layout:", err);
        return (
            <html lang="en" suppressHydrationWarning className={inter.variable}>
                <body className={`${inter.className} antialiased`}>
                    <ThemeProvider>
                        <div className="flex min-h-screen flex-col items-center justify-center">
                            <div className="rounded-md bg-destructive/10 p-6 text-destructive">
                                <h1 className="text-xl font-semibold">Something went wrong</h1>
                                <p className="mt-2">Unable to load server dashboard. Please try again later.</p>
                                <button
                                    onClick={() => (window.location.href = "/dashboard")}
                                    className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                        <SiteFooter />
                        <Toaster className="dark" />
                    </ThemeProvider>
                </body>
            </html>
        );
    }
}
