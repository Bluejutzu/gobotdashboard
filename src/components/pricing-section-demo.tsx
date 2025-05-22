import { PricingCard } from "@/components/pricing-card";

export function PricingSectionDemo() {
    return (
        <section className="py-20 relative">
            {/* Background gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black to-blue-950/20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.1),_transparent_50%)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.1),_transparent_50%)]"></div>
            </div>

            <div className="container relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-block mb-4 px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/80">
                        Pricing with Availability States
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
                        Choose the perfect plan for your needs
                    </h2>
                    <p className="text-xl text-white/70">
                        Demonstration of pricing cards with different availability states
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {/* Available Plans */}
                    <PricingCard
                        title="Free"
                        price="0"
                        description="Perfect for small to medium communities"
                        features={[
                            "All core moderation features",
                            "Basic auto-moderation",
                            "Custom commands (up to 10)",
                            "Welcome messages",
                            "Basic role management"
                        ]}
                        buttonText="Get Started"
                        buttonLink="/auth/login"
                        gradient="from-blue-500/20 to-blue-600/20"
                        available={true}
                    />

                    <PricingCard
                        title="Premium"
                        price="4.99"
                        period="month"
                        description="For growing communities with advanced needs"
                        features={[
                            "Everything in Free",
                            "Advanced auto-moderation",
                            "Unlimited custom commands",
                            "Advanced analytics",
                            "Priority support",
                            "Custom branding"
                        ]}
                        buttonText="Upgrade Now"
                        buttonLink="/pricing"
                        gradient="from-purple-500/20 to-purple-600/20"
                        popular={true}
                        available={true}
                    />

                    {/* Unavailable Plans */}
                    <PricingCard
                        title="Business"
                        price="9.99"
                        period="month"
                        description="For businesses and large communities"
                        features={[
                            "Everything in Premium",
                            "Multiple server support",
                            "Advanced analytics",
                            "Custom integrations",
                            "Dedicated support",
                            "API access"
                        ]}
                        buttonText="Upgrade Now"
                        buttonLink="/pricing"
                        gradient="from-teal-500/20 to-teal-600/20"
                        bestValue={true}
                        available={false}
                        unavailableReason="Coming Soon"
                    />

                    <PricingCard
                        title="Enterprise"
                        price="Custom"
                        description="For large communities and businesses"
                        features={[
                            "Everything in Business",
                            "Dedicated support",
                            "Custom feature development",
                            "SLA guarantees",
                            "Multiple server management",
                            "API access"
                        ]}
                        buttonText="Contact Us"
                        buttonLink="/contact"
                        gradient="from-red-500/20 to-red-600/20"
                        limited={true}
                        available={false}
                        unavailableReason="Currently Unavailable"
                    />
                </div>

                {/* Additional pricing information */}
                <div className="mt-16 text-center">
                    <div className="inline-block mx-auto p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl max-w-3xl">
                        <h3 className="text-xl font-semibold mb-3">Pricing Card Availability Demo</h3>
                        <p className="text-white/70 mb-4">
                            This demonstrates how pricing cards can be shown as available or unavailable with different
                            visual states.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
