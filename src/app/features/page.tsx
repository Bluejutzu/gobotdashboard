import Link from "next/link"
import { ArrowRight, BarChart, Bot, MessageSquare, Server, Settings, Shield, UserPlus, Vote, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PricingCard } from "@/components/pricing-card"

export default function FeaturesPage() {
    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            <SiteHeader className="absolute top-0 left-0 right-0 z-50 bg-transparent" />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background gradients */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.15),_transparent_50%)]"></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.15),_transparent_50%)]"></div>
                </div>

                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge
                            variant="outline"
                            className="mb-4 py-1.5 px-6 text-sm font-medium tracking-wider border-blue-500/30 bg-blue-500/10 text-blue-300"
                        >
                            FEATURES
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                            Everything you need for your Discord server
                        </h1>
                        <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                            Gobot provides a comprehensive suite of tools to manage, moderate, and enhance your Discord community
                            experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Feature Categories Section */}
            <section className="py-20 relative">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCategoryCard
                            icon={<Shield className="h-8 w-8 text-blue-400" />}
                            title="Moderation & Management"
                            description="Keep your server safe and organized with powerful moderation tools."
                            features={["Auto-moderation", "Custom permissions", "Logging", "Anti-spam"]}
                            href="#moderation"
                        />
                        <FeatureCategoryCard
                            icon={<Bot className="h-8 w-8 text-purple-400" />}
                            title="Engagement & Fun"
                            description="Keep your community engaged with interactive features and games."
                            features={["Custom commands", "Polls & voting", "Giveaways", "Mini-games"]}
                            href="#engagement"
                        />
                        <FeatureCategoryCard
                            icon={<Server className="h-8 w-8 text-teal-400" />}
                            title="Utility & Integration"
                            description="Enhance your server with useful utilities and integrations."
                            features={["Welcome messages", "Role management", "Server stats", "Webhooks"]}
                            href="#utility"
                        />
                    </div>
                </div>
            </section>

            {/* Moderation Features Section */}
            <section id="moderation" className="py-20 relative">
                {/* Background gradient */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-black to-blue-950/20"></div>

                <div className="container relative z-10">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/30">
                            MODERATION & MANAGEMENT
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500">
                            Keep your server safe and organized
                        </h2>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto">
                            Powerful moderation tools to help you manage your community and keep it safe from spam, inappropriate
                            content, and disruptive users.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <FeatureCard
                            icon={<Shield className="h-6 w-6" />}
                            title="Advanced Auto-Moderation"
                            description="Automatically detect and handle spam, inappropriate content, excessive caps, links, and more."
                            gradient="from-blue-500 to-blue-600"
                        />
                        <FeatureCard
                            icon={<MessageSquare className="h-6 w-6" />}
                            title="Customizable Word Filters"
                            description="Create custom word filters with different severity levels and automated actions."
                            gradient="from-blue-500 to-blue-600"
                        />
                        <FeatureCard
                            icon={<Settings className="h-6 w-6" />}
                            title="Moderation Logs"
                            description="Comprehensive logging of all moderation actions with detailed information and context."
                            gradient="from-blue-500 to-blue-600"
                        />
                        <FeatureCard
                            icon={<Zap className="h-6 w-6" />}
                            title="Anti-Raid Protection"
                            description="Detect and prevent server raids with automated verification and lockdown options."
                            gradient="from-blue-500 to-blue-600"
                        />
                    </div>

                    <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">Moderation Dashboard</h3>
                                <p className="text-white/70">
                                    Access a comprehensive dashboard to view server activity, moderation logs, and user reports. Configure
                                    auto-moderation settings and manage your server from anywhere.
                                </p>
                            </div>
                            <Button
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-6 text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                asChild
                            >
                                <Link href="/dashboard">
                                    <span className="flex items-center">
                                        View Dashboard
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Engagement Features Section */}
            <section id="engagement" className="py-20 relative">
                {/* Background gradient */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-950/20 to-purple-950/20"></div>

                <div className="container relative z-10">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/30">
                            ENGAGEMENT & FUN
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-500">
                            Keep your community engaged
                        </h2>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto">
                            Interactive features and games to keep your community active, engaged, and having fun.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <FeatureCard
                            icon={<MessageSquare className="h-6 w-6" />}
                            title="Custom Commands"
                            description="Create custom commands with text, embeds, images, and more without any coding required."
                            gradient="from-purple-500 to-purple-600"
                        />
                        <FeatureCard
                            icon={<Vote className="h-6 w-6" />}
                            title="Interactive Polls"
                            description="Create polls with multiple options, timers, and result visualization."
                            gradient="from-purple-500 to-purple-600"
                        />
                        <FeatureCard
                            icon={<Zap className="h-6 w-6" />}
                            title="Giveaways"
                            description="Host giveaways with customizable duration, requirements, and winner selection."
                            gradient="from-purple-500 to-purple-600"
                        />
                        <FeatureCard
                            icon={<Bot className="h-6 w-6" />}
                            title="Mini-Games"
                            description="Fun mini-games like trivia, rock-paper-scissors, and more to keep your community entertained."
                            gradient="from-purple-500 to-purple-600"
                        />
                    </div>

                    <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">Command Builder</h3>
                                <p className="text-white/70">
                                    Use our intuitive command builder to create custom commands with rich embeds, buttons, and interactive
                                    elements without any coding knowledge.
                                </p>
                            </div>
                            <Button
                                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6 py-6 text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                                asChild
                            >
                                <Link href="/command-builder">
                                    <span className="flex items-center">
                                        Try Command Builder
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Utility Features Section */}
            <section id="utility" className="py-20 relative">
                {/* Background gradient */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-950/20 to-teal-950/20"></div>

                <div className="container relative z-10">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border-teal-500/30">
                            UTILITY & INTEGRATION
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-500">
                            Enhance your server functionality
                        </h2>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto">
                            Useful utilities and integrations to streamline your server management and enhance user experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <FeatureCard
                            icon={<UserPlus className="h-6 w-6" />}
                            title="Welcome Messages"
                            description="Customize welcome messages with text, images, and embeds to greet new members."
                            gradient="from-teal-500 to-teal-600"
                        />
                        <FeatureCard
                            icon={<Settings className="h-6 w-6" />}
                            title="Role Management"
                            description="Automated role assignment, reaction roles, and role hierarchy management."
                            gradient="from-teal-500 to-teal-600"
                        />
                        <FeatureCard
                            icon={<BarChart className="h-6 w-6" />}
                            title="Server Statistics"
                            description="Track member growth, activity, and engagement with detailed analytics."
                            gradient="from-teal-500 to-teal-600"
                        />
                        <FeatureCard
                            icon={<Server className="h-6 w-6" />}
                            title="Webhooks & Integrations"
                            description="Connect your server to external services like Twitch, YouTube, Twitter, and more."
                            gradient="from-teal-500 to-teal-600"
                        />
                    </div>

                    <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">Server Analytics</h3>
                                <p className="text-white/70">
                                    Get detailed insights into your server's growth, activity, and engagement with our comprehensive
                                    analytics dashboard.
                                </p>
                            </div>
                            <Button
                                className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-6 py-6 text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(20,184,166,0.5)]"
                                asChild
                            >
                                <Link href="/analytics">
                                    <span className="flex items-center">
                                        View Analytics
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 relative">
                {/* Background gradient */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-teal-950/20 to-black"></div>

                <div className="container relative z-10">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-white/10 text-white hover:bg-white/20 border-white/30">PRICING</Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto">
                            Gobot is completely free to use with optional premium features for power users.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <PricingCard
                            title="Free"
                            price="$0"
                            description="Perfect for small to medium communities"
                            features={[
                                "All core moderation features",
                                "Basic auto-moderation",
                                "Custom commands (up to 10)",
                                "Welcome messages",
                                "Basic role management",
                            ]}
                            buttonText="Get Started"
                            buttonLink="/auth/login"
                            gradient="from-blue-500/20 to-blue-600/20"
                            popular={false}
                        />
                        <PricingCard
                            title="Premium"
                            price="$4.99"
                            period="per month"
                            description="For growing communities with advanced needs"
                            features={[
                                "Everything in Free",
                                "Advanced auto-moderation",
                                "Unlimited custom commands",
                                "Advanced analytics",
                                "Priority support",
                                "Custom branding",
                            ]}
                            buttonText="Upgrade Now"
                            buttonLink="/pricing"
                            gradient="from-purple-500/20 to-purple-600/20"
                            popular={true}
                        />
                        <PricingCard
                            title="Enterprise"
                            price="Custom"
                            description="For large communities and businesses"
                            features={[
                                "Everything in Premium",
                                "Dedicated support",
                                "Custom feature development",
                                "SLA guarantees",
                                "Multiple server management",
                                "API access",
                            ]}
                            buttonText="Contact Us"
                            buttonLink="/contact"
                            gradient="from-teal-500/20 to-teal-600/20"
                            popular={false}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5"></div>

                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to transform your Discord server?</h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Join thousands of servers already using Gobot to improve their Discord experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button
                                size="lg"
                                className="bg-white hover:bg-white/90 text-blue-600 rounded-full px-8 py-6 text-lg transition-all duration-300"
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
                                className="border-white/40 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white rounded-full px-8 py-6 text-lg transition-all duration-300"
                                asChild
                            >
                                <Link href="/docs">
                                    <span className="flex items-center">Read Documentation</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    )
}

// Feature Category Card Component
function FeatureCategoryCard({
    icon,
    title,
    description,
    features,
    href,
}: {
    icon: React.ReactNode
    title: string
    description: string
    features: string[]
    href: string
}) {
    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1">
            <div className="flex flex-col h-full">
                <div className="mb-6">{icon}</div>
                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                <p className="text-white/70 mb-6">{description}</p>
                <ul className="space-y-2 mb-8">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-white/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-auto">
                    <Button
                        variant="outline"
                        className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300"
                        asChild
                    >
                        <Link href={href}>
                            <span className="flex items-center justify-center">
                                Learn More
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Feature Card Component
function FeatureCard({
    icon,
    title,
    description,
    gradient,
}: {
    icon: React.ReactNode
    title: string
    description: string
    gradient: string
}) {
    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mb-6`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-white/70">{description}</p>
        </div>
    )
}

// Pricing Card Component

