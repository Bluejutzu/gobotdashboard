"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart, ChevronRight, MessageSquare, Settings, Shield, UserPlus, Vote } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function Home() {
    // Track scroll position for parallax effects
    const [scrollY, setScrollY] = useState(0);

    // Refs for scroll animations
    const heroRef = useRef<HTMLDivElement>(null);

    // Intersection observers for scroll animations
    const [statsRef, statsInView] = useInView({
        triggerOnce: true,
        threshold: 0.2
    });

    const [featuresRef, featuresInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const [ctaRef, ctaInView] = useInView({
        triggerOnce: true,
        threshold: 0.2
    });

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            <main className="flex-1">
                {/* Welcome Toast */}
                {/* <ToastDemo
          title="Welcome to Gobot!"
          description="Explore our powerful Discord bot features."
          autoShow={true}
          delay={1500}
          action={
            <Button variant="outline" size="sm" asChild>
              <Link href="/features">Explore</Link>
            </Button>
          }
        /> */}

                {/* Hero Section - Enhanced with gradients */}
                <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
                    {/* Enhanced background gradients */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.15),_transparent_50%)]"></div>
                        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.15),_transparent_50%)]"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/5 blur-[120px]"></div>
                    </div>

                    {/* Animated background elements */}
                    <div
                        className="absolute inset-0 z-0 overflow-hidden"
                        style={{
                            transform: `translateY(${scrollY * 0.2}px)`
                        }}
                    >
                        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px]"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]"></div>
                    </div>

                    <div className="container relative z-10 mx-auto px-4 text-center">
                        <div
                            className="max-w-4xl mx-auto space-y-6"
                            style={{
                                transform: `translateY(${scrollY * -0.2}px)`,
                                opacity: Math.max(0.2, 1 - scrollY * 0.002)
                            }}
                        >
                            <Badge
                                variant="outline"
                                className="mb-4 py-1.5 px-6 text-sm font-medium tracking-wider border-blue-500/30 bg-blue-500/10 text-blue-300"
                            >
                                NEXT-GEN DISCORD BOT
                            </Badge>

                            <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x">
                                Gobot
                            </h1>

                            <div className="space-y-6 mt-8">
                                <p className="text-2xl md:text-3xl text-white/80 font-light">
                                    Multi-purpose Discord Bot.
                                </p>
                                <p className="text-2xl md:text-3xl text-white/80 font-light">Fully customizable.</p>
                                <p className="text-2xl md:text-3xl text-white/80 font-light">Completely free.</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8 py-6 text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    asChild
                                >
                                    <Link href="/auth/login">
                                        <span className="flex items-center">
                                            Add to Discord
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </span>
                                    </Link>
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white rounded-full px-8 py-6 text-lg transition-all duration-300"
                                    asChild
                                >
                                    <Link href="/features">
                                        <span className="flex items-center">
                                            Explore features
                                            <ChevronRight className="ml-2 h-5 w-5" />
                                        </span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
                        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
                            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse"></div>
                        </div>
                        <span className="mt-2 text-sm text-white/50">Scroll</span>
                    </div>
                </section>

                {/* Stats Section - Enhanced with gradients */}
                <section ref={statsRef} className="py-32 relative overflow-hidden">
                    {/* Enhanced background gradients */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-black to-blue-950/30"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_rgba(59,130,246,0.2)_0%,_transparent_70%)]"></div>
                        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_70%,_rgba(124,58,237,0.2)_0%,_transparent_60%)]"></div>
                    </div>

                    <div className="container relative z-10 mx-auto px-4">
                        <div
                            className={cn(
                                "text-center mb-20 transition-all duration-1000 transform",
                                statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            )}
                        >
                            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x">
                                Trusted by your favorite servers.
                            </h2>
                            <p className="mt-6 text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
                                Gobot is in over <span className="font-bold text-white">866,600 servers</span>, reaching
                                more than <span className="font-bold text-white">297.3 million users</span>.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                            <StatCard
                                title="866,600+"
                                description="Discord Servers"
                                color="blue"
                                delay={0}
                                inView={statsInView}
                            />
                            <StatCard
                                title="297.3M+"
                                description="Discord Users"
                                color="purple"
                                delay={300}
                                inView={statsInView}
                            />
                            <StatCard
                                title="99.9%"
                                description="Uptime"
                                color="teal"
                                delay={600}
                                inView={statsInView}
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section - Enhanced with gradients */}
                <section ref={featuresRef} className="py-32 relative">
                    {/* Enhanced background gradients */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 to-purple-950/30"></div>
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,_rgba(124,58,237,0.2)_0%,_transparent_70%)]"></div>
                    </div>

                    <div className="container relative z-10 mx-auto px-4">
                        <div
                            className={cn(
                                "text-center mb-20 transition-all duration-1000 transform",
                                featuresInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            )}
                        >
                            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x">
                                Everything you need
                            </h2>
                            <p className="mt-6 text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
                                Comprehensive tools to manage and enhance your Discord server.
                            </p>
                        </div>

                        <Tabs defaultValue="moderation" className="w-full max-w-6xl mx-auto">
                            <div className="flex justify-center mb-12 overflow-x-auto pb-2 scrollbar-thin">
                                <TabsList className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-1">
                                    <FeatureTab
                                        value="moderation"
                                        icon={<Shield className="h-5 w-5" />}
                                        label="Moderation"
                                    />
                                    <FeatureTab
                                        value="commands"
                                        icon={<MessageSquare className="h-5 w-5" />}
                                        label="Commands"
                                    />
                                    <FeatureTab
                                        value="welcome"
                                        icon={<UserPlus className="h-5 w-5" />}
                                        label="Welcome"
                                    />
                                    <FeatureTab value="roles" icon={<Settings className="h-5 w-5" />} label="Roles" />
                                    <FeatureTab value="polls" icon={<Vote className="h-5 w-5" />} label="Polls" />
                                    <FeatureTab
                                        value="analytics"
                                        icon={<BarChart className="h-5 w-5" />}
                                        label="Analytics"
                                    />
                                </TabsList>
                            </div>

                            <div className="mt-12">
                                <FeatureTabContent
                                    value="moderation"
                                    title="Advanced Moderation"
                                    description="Keep your server safe with powerful moderation tools. Ban, kick, mute, and warn users with ease."
                                    features={[
                                        "Auto-moderation for spam and inappropriate content",
                                        "Customizable word filters and link detection",
                                        "Detailed moderation logs and history"
                                    ]}
                                    icon={<Shield className="h-5 w-5 text-blue-400" />}
                                    learnMoreLink="/features#moderation"
                                    demoContent={<ModDemoContent />}
                                    inView={featuresInView}
                                />

                                <FeatureTabContent
                                    value="welcome"
                                    title="Welcome Messages"
                                    description="Greet new members with customizable welcome messages and images."
                                    features={[
                                        "Customizable text and embed welcome messages",
                                        "Dynamic variables for personalization",
                                        "Optional DM welcomes"
                                    ]}
                                    icon={<UserPlus className="h-5 w-5 text-blue-400" />}
                                    learnMoreLink="/features#utility"
                                    demoContent={<WelcomeDemoContent />}
                                    inView={featuresInView}
                                />

                                <FeatureTabContent
                                    value="roles"
                                    title="Role Management"
                                    description="Automatically assign roles to new members and manage role assignments."
                                    features={[
                                        "Auto-role assignment for new members",
                                        "Reaction roles for self-assignment",
                                        "Level-based role progression"
                                    ]}
                                    icon={<Settings className="h-5 w-5 text-blue-400" />}
                                    learnMoreLink="/features#utility"
                                    demoContent={<RolesDemoContent />}
                                    inView={featuresInView}
                                />

                                <FeatureTabContent
                                    value="polls"
                                    title="Interactive Polls"
                                    description="Create polls and let your members vote on decisions."
                                    features={[
                                        "Multiple choice polls with reactions",
                                        "Timed polls with automatic results",
                                        "Poll analytics and result visualization"
                                    ]}
                                    icon={<Vote className="h-5 w-5 text-blue-400" />}
                                    learnMoreLink="/features#engagement"
                                    demoContent={<PollsDemoContent />}
                                    inView={featuresInView}
                                />

                                <FeatureTabContent
                                    value="analytics"
                                    title="Detailed Analytics"
                                    description="Track your server's activity and growth with detailed analytics."
                                    features={[
                                        "Member growth and activity tracking",
                                        "Channel usage statistics",
                                        "Command usage insights"
                                    ]}
                                    icon={<BarChart className="h-5 w-5 text-blue-400" />}
                                    learnMoreLink="/features#utility"
                                    demoContent={<AnalyticsDemoContent />}
                                    inView={featuresInView}
                                />
                            </div>
                        </Tabs>
                    </div>
                </section>

                {/* CTA Section - Enhanced with gradients */}
                <section ref={ctaRef} className="py-32 relative overflow-hidden">
                    {/* Enhanced background gradients */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.1)_0%,_transparent_70%)]"></div>
                    </div>

                    <div
                        className={cn(
                            "container relative z-10 mx-auto px-4 text-center transition-all duration-1000 transform",
                            ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        )}
                    >
                        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                            Ready to enhance your Discord server?
                        </h2>
                        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/80">
                            Join thousands of servers already using Gobot to improve their Discord experience.
                        </p>
                        <Button
                            size="lg"
                            className="bg-white hover:bg-white/90 text-blue-600 rounded-full px-8 py-6 text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                            asChild
                        >
                            <Link href="/auth/login">
                                <span className="flex items-center">
                                    Add to Discord
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </span>
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    );
}

// Reusable components for better organization

interface StatCardProps {
    title: string;
    description: string;
    color: string;
    delay?: number;
    inView: boolean;
}

function StatCard({ title, description, color, delay = 0, inView }: StatCardProps) {
    const colorMap = {
        blue: "from-blue-500 to-blue-600",
        purple: "from-purple-500 to-purple-600",
        teal: "from-teal-500 to-teal-600"
    };

    const gradientClass = colorMap[color as keyof typeof colorMap] || colorMap.blue;

    return (
        <div
            className={cn(
                "bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-1000 transform",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <h3 className="text-5xl md:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r animate-shimmer-slow will-change-transform">
                <span className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>{title}</span>
            </h3>
            <p className="text-xl text-white/70">{description}</p>
        </div>
    );
}

interface FeatureTabProps {
    value: string;
    icon: React.ReactNode;
    label: string;
}

function FeatureTab({ value, icon, label }: FeatureTabProps) {
    return (
        <TabsTrigger
            value={value}
            className="px-6 py-3 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
        >
            <div className="flex items-center gap-2">
                {icon}
                <span>{label}</span>
            </div>
        </TabsTrigger>
    );
}

interface FeatureTabContentProps {
    value: string;
    title: string;
    description: string;
    features: string[];
    icon: React.ReactNode;
    learnMoreLink: string;
    demoContent: React.ReactNode;
    inView: boolean;
}

function FeatureTabContent({
    value,
    title,
    description,
    features,
    icon,
    learnMoreLink,
    demoContent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inView
}: FeatureTabContentProps) {
    return (
        <TabsContent
            value={value}
            className="animate-fade-in will-change-transform focus-visible:outline-none focus-visible:ring-0"
        >
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {title}
                    </h3>
                    <p className="text-xl text-white/70">{description}</p>
                    <ul className="space-y-4">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3 text-white/80">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    {icon}
                                </div>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <Button
                        className="mt-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white border border-white/10 rounded-full px-6 py-5 transition-all duration-300"
                        asChild
                    >
                        <Link href={learnMoreLink}>
                            <span className="flex items-center">
                                Learn more
                                <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </Link>
                    </Button>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    {demoContent}
                </div>
            </div>
        </TabsContent>
    );
}

// Demo content components for each feature tab

function ModDemoContent() {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-2 animate-slide-in-left animation-delay-300 will-change-transform">
                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0"></div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-sm">!ban @user Spamming</div>
            </div>
            <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-600 will-change-transform">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">
                    G
                </div>
                <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <div className="font-medium text-blue-400 mb-1">Moderation</div>
                    <div className="text-white/80">
                        User has been banned from the server.
                        <div className="mt-2 p-3 border border-white/10 rounded bg-white/5 backdrop-blur-sm animate-fade-in animation-delay-900 will-change-transform">
                            <div className="text-xs font-medium text-white/90">Ban Information</div>
                            <div className="text-xs text-white/70">User: @user</div>
                            <div className="text-xs text-white/70">Reason: Spamming</div>
                            <div className="text-xs text-white/70">Moderator: @admin</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WelcomeDemoContent() {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-300 will-change-transform">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">
                    G
                </div>
                <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <div className="font-medium text-blue-400 mb-1">Welcome</div>
                    <div className="text-white/80">
                        <div className="p-3 border border-white/10 rounded bg-white/5 backdrop-blur-sm animate-pulse-slow will-change-transform">
                            <div className="text-xs font-medium text-white/90">Welcome to the server, @newuser!</div>
                            <div className="text-xs text-white/70 mt-1">
                                Please check out our rules in #rules and introduce yourself in #introductions.
                            </div>
                            <div className="text-xs text-white/70 mt-1">You are member #1,234</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RolesDemoContent() {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-2 animate-slide-in-left animation-delay-300 will-change-transform">
                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0"></div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-sm">!autorole Member</div>
            </div>
            <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-600 will-change-transform">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">
                    G
                </div>
                <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <div className="font-medium text-blue-400 mb-1">Auto Role</div>
                    <div className="text-white/80">
                        {` Auto role has been set to "Member". New members will automatically receive this role when`}
                        they join.
                    </div>
                </div>
            </div>
        </div>
    );
}

function PollsDemoContent() {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-2 animate-slide-in-left animation-delay-300 will-change-transform">
                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0"></div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-sm">
                    {`!poll "What game should we play tonight?" "Minecraft" "Fortnite" "Among Us"`}
                </div>
            </div>
            <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-600 will-change-transform">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">
                    G
                </div>
                <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <div className="font-medium text-blue-400 mb-1">Poll</div>
                    <div className="text-white/80">
                        <div className="p-3 border border-white/10 rounded bg-white/5 backdrop-blur-sm">
                            <div className="text-xs font-medium text-white/90">What game should we play tonight?</div>
                            <div className="text-xs mt-2 flex items-center">
                                <span className="mr-2">1️⃣</span>
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <span>Minecraft</span>
                                        <span className="ml-auto">(3 votes)</span>
                                    </div>
                                    <div
                                        className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-1 animate-grow-width"
                                        style={{ width: "60%" }}
                                    ></div>
                                </div>
                            </div>
                            <div className="text-xs mt-2 flex items-center">
                                <span className="mr-2">2️⃣</span>
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <span>Fortnite</span>
                                        <span className="ml-auto">(1 vote)</span>
                                    </div>
                                    <div
                                        className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-1 animate-grow-width animation-delay-300"
                                        style={{ width: "20%" }}
                                    ></div>
                                </div>
                            </div>
                            <div className="text-xs mt-2 flex items-center">
                                <span className="mr-2">3️⃣</span>
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <span>Among Us</span>
                                        <span className="ml-auto">(5 votes)</span>
                                    </div>
                                    <div
                                        className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-1 animate-grow-width animation-delay-600"
                                        style={{ width: "100%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnalyticsDemoContent() {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-2 animate-slide-in-left animation-delay-300 will-change-transform">
                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0"></div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-sm">!analytics</div>
            </div>
            <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-600 will-change-transform">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">
                    G
                </div>
                <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <div className="font-medium text-blue-400 mb-1">Server Analytics</div>
                    <div className="text-white/80">
                        <div className="p-3 border border-white/10 rounded bg-white/5 backdrop-blur-sm">
                            <div className="text-xs font-medium text-white/90">Server Growth</div>
                            <div className="text-xs mt-2">
                                <div className="flex items-center justify-between">
                                    <span>New members:</span>
                                    <span className="font-medium text-green-400">+24 this week</span>
                                </div>
                                <div
                                    className="h-1.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-1 animate-grow-width"
                                    style={{ width: "70%" }}
                                ></div>
                            </div>
                            <div className="text-xs mt-2">
                                <div className="flex items-center justify-between">
                                    <span>Active users:</span>
                                    <span className="font-medium text-blue-400">156 (↑12%)</span>
                                </div>
                                <div
                                    className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-1 animate-grow-width animation-delay-300"
                                    style={{ width: "85%" }}
                                ></div>
                            </div>
                            <div className="text-xs mt-2">
                                <div className="flex items-center justify-between">
                                    <span>Messages:</span>
                                    <span className="font-medium text-purple-400">1,245 (↑8%)</span>
                                </div>
                                <div
                                    className="h-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mt-1 animate-grow-width animation-delay-600"
                                    style={{ width: "60%" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
