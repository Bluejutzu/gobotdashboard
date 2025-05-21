import Link from "next/link";
import { ArrowRight, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { PricingCard } from "@/components/pricing-card";

export default function PricingPage() {
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
						<h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
							Simple, transparent pricing
						</h1>
						<p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
							Choose the perfect plan for your Discord community. No hidden
							fees, no surprises.
						</p>
					</div>
				</div>
			</section>

			{/* Pricing Toggle Section */}
			<section className="py-8 relative">
				<div className="container relative z-10">
					<div className="flex justify-between items-center max-w-md mx-auto">
						<Tabs defaultValue="monthly" className="w-full">
							<TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
								<TabsTrigger
									value="monthly"
									className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
								>
									Monthly
								</TabsTrigger>
								<TabsTrigger
									value="yearly"
									className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
								>
									Yearly{" "}
									<span className="ml-1.5 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
										Save 20%
									</span>
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</div>
			</section>

			{/* Pricing Cards */}
			<section className="py-20 relative">
				{/* Background gradient */}
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-gradient-to-b from-black to-blue-950/20"></div>
					<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.1),_transparent_50%)]"></div>
					<div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.1),_transparent_50%)]"></div>
				</div>

				<div className="container relative z-10">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
						<TooltipProvider>
							{/* Free Plan */}
							<PricingCard
								title="Free"
								price="0"
								description="Perfect for small to medium communities"
								features={[
									<FeatureWithTooltip
										key="mod"
										feature="All core moderation features"
										tooltip="Ban, kick, mute, and warn users with basic logging"
									/>,
									<FeatureWithTooltip
										key="auto"
										feature="Basic auto-moderation"
										tooltip="Simple spam and inappropriate content filtering"
									/>,
									<FeatureWithTooltip
										key="cmd"
										feature="Custom commands (up to 10)"
										tooltip="Create up to 10 custom commands for your server"
									/>,
									<FeatureWithTooltip
										key="welcome"
										feature="Welcome messages"
										tooltip="Basic welcome messages for new members"
									/>,
									<FeatureWithTooltip
										key="role"
										feature="Basic role management"
										tooltip="Simple role assignment and management"
									/>,
								]}
								buttonText="Get Started"
								buttonLink="/auth/login"
								gradient="from-blue-500/20 to-blue-600/20"
								available={true}
							/>

							{/* Premium Plan */}
							<PricingCard
								title="Premium"
								price="4.99"
								period="month"
								description="For growing communities with advanced needs"
								features={[
									<FeatureWithTooltip
										key="free"
										feature="Everything in Free"
										tooltip="All features from the Free plan included"
									/>,
									<FeatureWithTooltip
										key="auto"
										feature="Advanced auto-moderation"
										tooltip="Customizable word filters, link detection, and raid protection"
									/>,
									<FeatureWithTooltip
										key="cmd"
										feature="Unlimited custom commands"
										tooltip="Create as many custom commands as you need"
									/>,
									<FeatureWithTooltip
										key="analytics"
										feature="Advanced analytics"
										tooltip="Detailed server activity and growth statistics"
									/>,
									<FeatureWithTooltip
										key="support"
										feature="Priority support"
										tooltip="Get faster responses from our support team"
									/>,
									<FeatureWithTooltip
										key="branding"
										feature="Custom branding"
										tooltip="Customize the bot's appearance in your server"
									/>,
								]}
								buttonText="Upgrade Now"
								buttonLink="/pricing/checkout"
								gradient="from-purple-500/20 to-purple-600/20"
								popular={true}
								available={true}
							/>

							{/* Business Plan */}
							<PricingCard
								title="Business"
								price="9.99"
								period="month"
								description="For businesses and large communities"
								features={[
									<FeatureWithTooltip
										key="premium"
										feature="Everything in Premium"
										tooltip="All features from the Premium plan included"
									/>,
									<FeatureWithTooltip
										key="servers"
										feature="Multiple server support"
										tooltip="Use the bot on up to 5 servers with unified management"
									/>,
									<FeatureWithTooltip
										key="analytics"
										feature="Advanced analytics"
										tooltip="Cross-server analytics and detailed reports"
									/>,
									<FeatureWithTooltip
										key="integrations"
										feature="Custom integrations"
										tooltip="Connect with external services like Twitch, YouTube, and more"
									/>,
									<FeatureWithTooltip
										key="support"
										feature="Dedicated support"
										tooltip="Get a dedicated support agent for your servers"
									/>,
									<FeatureWithTooltip
										key="api"
										feature="API access"
										tooltip="Access the bot's API for custom development"
									/>,
								]}
								buttonText="Upgrade Now"
								buttonLink="/pricing/checkout"
								gradient="from-teal-500/20 to-teal-600/20"
								bestValue={true}
								available={false}
								unavailableReason="Coming Soon"
							/>

							{/* Enterprise Plan */}
							<PricingCard
								title="Enterprise"
								price="Custom"
								description="For large communities and businesses"
								features={[
									<FeatureWithTooltip
										key="business"
										feature="Everything in Business"
										tooltip="All features from the Business plan included"
									/>,
									<FeatureWithTooltip
										key="support"
										feature="Dedicated support"
										tooltip="24/7 dedicated support with a personal account manager"
									/>,
									<FeatureWithTooltip
										key="custom"
										feature="Custom feature development"
										tooltip="Get custom features developed specifically for your needs"
									/>,
									<FeatureWithTooltip
										key="sla"
										feature="SLA guarantees"
										tooltip="Service Level Agreement with uptime and response time guarantees"
									/>,
									<FeatureWithTooltip
										key="servers"
										feature="Multiple server management"
										tooltip="Manage unlimited servers from a central dashboard"
									/>,
									<FeatureWithTooltip
										key="api"
										feature="API access"
										tooltip="Full API access with higher rate limits and custom endpoints"
									/>,
								]}
								buttonText="Contact Us"
								buttonLink="/contact"
								gradient="from-red-500/20 to-red-600/20"
								limited={true}
								available={true}
							/>
						</TooltipProvider>
					</div>

					{/* Additional pricing information */}
					<div className="mt-16 text-center">
						<div className="inline-block mx-auto p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl max-w-3xl">
							<h3 className="text-xl font-semibold mb-3">
								Need a custom solution?
							</h3>
							<p className="text-white/70 mb-4">
								We offer tailored plans for large communities and special use
								cases. Contact our sales team to discuss your needs.
							</p>
							<div className="flex flex-wrap justify-center gap-4 mt-6">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-blue-500"></div>
									<span className="text-sm text-white/70">24/7 Support</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-purple-500"></div>
									<span className="text-sm text-white/70">Custom Features</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-teal-500"></div>
									<span className="text-sm text-white/70">
										Volume Discounts
									</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-emerald-500"></div>
									<span className="text-sm text-white/70">SLA Guarantees</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Feature Comparison */}
			<section className="py-20 relative">
				<div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-950/20 to-purple-950/20"></div>

				<div className="container relative z-10">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
							Compare features
						</h2>
						<p className="text-xl text-white/70 max-w-3xl mx-auto">
							See which plan is right for your Discord community
						</p>
					</div>

					<div className="overflow-x-auto pb-6">
						<table className="w-full min-w-[800px] border-collapse">
							<thead>
								<tr className="border-b border-white/10">
									<th className="py-4 px-6 text-left font-medium text-white/70">
										Feature
									</th>
									<th className="py-4 px-6 text-center font-medium text-white/70">
										Free
									</th>
									<th className="py-4 px-6 text-center font-medium text-white/70 bg-purple-500/5">
										Premium
									</th>
									<th className="py-4 px-6 text-center font-medium text-white/70 bg-teal-500/5">
										Business
									</th>
									<th className="py-4 px-6 text-center font-medium text-white/70">
										Enterprise
									</th>
								</tr>
							</thead>
							<tbody>
								<FeatureRow
									feature="Servers"
									free="1"
									premium="3"
									business="5"
									enterprise="Unlimited"
									tooltip="Number of Discord servers you can add the bot to"
								/>
								<FeatureRow
									feature="Custom Commands"
									free="Up to 10"
									premium="Unlimited"
									business="Unlimited"
									enterprise="Unlimited"
									tooltip="Create custom commands with text, embeds, and more"
								/>
								<FeatureRow
									feature="Auto-moderation"
									free="Basic"
									premium="Advanced"
									business="Advanced"
									enterprise="Advanced"
									tooltip="Automatically detect and handle spam, inappropriate content, etc."
								/>
								<FeatureRow
									feature="Welcome Messages"
									free="Basic"
									premium="Advanced"
									business="Advanced"
									enterprise="Advanced"
									tooltip="Customize welcome messages for new members"
								/>
								<FeatureRow
									feature="Role Management"
									free="Basic"
									premium="Advanced"
									business="Advanced"
									enterprise="Advanced"
									tooltip="Manage roles and permissions"
								/>
								<FeatureRow
									feature="Analytics"
									free="Limited"
									premium="Full"
									business="Advanced"
									enterprise="Custom"
									tooltip="Track server activity and growth"
								/>
								<FeatureRow
									feature="Support"
									free="Community"
									premium="Priority"
									business="Dedicated"
									enterprise="24/7 Dedicated"
									tooltip="Get help when you need it"
								/>
								<FeatureRow
									feature="Custom Branding"
									free={false}
									premium={true}
									business={true}
									enterprise={true}
									tooltip="Customize the bot's appearance"
								/>
								<FeatureRow
									feature="API Access"
									free={false}
									premium={false}
									business={true}
									enterprise={true}
									tooltip="Access the bot's API for custom integrations"
								/>
								<FeatureRow
									feature="SLA Guarantees"
									free={false}
									premium={false}
									business={false}
									enterprise={true}
									tooltip="Service Level Agreement guarantees"
								/>
								<FeatureRow
									feature="Custom Development"
									free={false}
									premium={false}
									business={false}
									enterprise={true}
									tooltip="Get custom features developed for your needs"
								/>
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-20 relative">
				<div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-950/20 to-black"></div>

				<div className="container relative z-10">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
							Frequently asked questions
						</h2>
						<p className="text-xl text-white/70 max-w-3xl mx-auto">
							Everything you need to know about our pricing and plans
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
						<FaqItem
							question="Can I switch plans at any time?"
							answer="Yes, you can upgrade or downgrade your plan at any time. Changes will be applied immediately, and your billing will be prorated accordingly."
						/>
						<FaqItem
							question="Do you offer refunds?"
							answer="We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied with our service, you can request a refund within 7 days of your purchase."
						/>
						<FaqItem
							question="What payment methods do you accept?"
							answer="We accept all major credit cards, PayPal, and cryptocurrency payments. For Enterprise plans, we also offer invoice-based payments."
						/>
						<FaqItem
							question="Is there a free trial for Premium?"
							answer="Yes, we offer a 14-day free trial for our Premium plan. No credit card required, and you can cancel anytime."
						/>
						<FaqItem
							question="What happens if I exceed my plan limits?"
							answer="We'll notify you when you're approaching your plan limits. If you exceed them, the bot will continue to function, but some features may be limited until you upgrade or reduce usage."
						/>
						<FaqItem
							question="Can I use the bot on multiple servers?"
							answer="The Free plan allows you to use the bot on 1 server, Premium on up to 3 servers, Business on up to 5 servers, and Enterprise on unlimited servers."
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
						<h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
							Ready to transform your Discord server?
						</h2>
						<p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
							Join thousands of servers already using Gobot to improve their
							Discord experience.
						</p>
						<div className="flex flex-col sm:flex-row gap-6 justify-center">
							<Button
								size="lg"
								className="bg-white hover:bg-white/90 text-blue-600 rounded-full px-8 py-6 text-lg transition-all duration-300"
								asChild
							>
								<Link href="/auth/login">
									<span className="flex items-center">
										Get Started for Free
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
								<Link href="/contact">
									<span className="flex items-center">Contact Sales</span>
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

// Feature Row Component for the comparison table
function FeatureRow({
	feature,
	free,
	premium,
	business,
	enterprise,
	tooltip,
}: {
	feature: string;
	free: string | boolean;
	premium: string | boolean;
	business: string | boolean;
	enterprise: string | boolean;
	tooltip?: string;
}) {
	return (
		<TooltipProvider>
			<tr className="border-b border-white/10 hover:bg-white/5">
				<td className="py-4 px-6 text-left">
					<div className="flex items-center gap-2">
						<span>{feature}</span>
						{tooltip && (
							<Tooltip>
								<TooltipTrigger asChild>
									<HelpCircle className="h-4 w-4 text-white/40 cursor-help" />
								</TooltipTrigger>
								<TooltipContent>
									<p className="max-w-xs">{tooltip}</p>
								</TooltipContent>
							</Tooltip>
						)}
					</div>
				</td>
				<td className="py-4 px-6 text-center">
					{typeof free === "boolean" ? (
						free ? (
							<Check className="h-5 w-5 text-green-500 mx-auto" />
						) : (
							<span className="text-white/30">—</span>
						)
					) : (
						<span>{free}</span>
					)}
				</td>
				<td className="py-4 px-6 text-center bg-purple-500/5">
					{typeof premium === "boolean" ? (
						premium ? (
							<Check className="h-5 w-5 text-purple-500 mx-auto" />
						) : (
							<span className="text-white/30">—</span>
						)
					) : (
						<span className="font-medium text-purple-400">{premium}</span>
					)}
				</td>
				<td className="py-4 px-6 text-center bg-teal-500/5">
					{typeof business === "boolean" ? (
						business ? (
							<Check className="h-5 w-5 text-teal-500 mx-auto" />
						) : (
							<span className="text-white/30">—</span>
						)
					) : (
						<span className="font-medium text-teal-400">{business}</span>
					)}
				</td>
				<td className="py-4 px-6 text-center">
					{typeof enterprise === "boolean" ? (
						enterprise ? (
							<Check className="h-5 w-5 text-blue-500 mx-auto" />
						) : (
							<span className="text-white/30">—</span>
						)
					) : (
						<span>{enterprise}</span>
					)}
				</td>
			</tr>
		</TooltipProvider>
	);
}

// Feature with Tooltip Component for pricing cards
function FeatureWithTooltip({
	feature,
	tooltip,
}: { feature: string; tooltip: string }) {
	return (
		<TooltipProvider>
			<div className="flex items-center gap-1">
				<span>{feature}</span>
				<Tooltip>
					<TooltipTrigger asChild>
						<HelpCircle className="h-3.5 w-3.5 text-white/40 cursor-help ml-1" />
					</TooltipTrigger>
					<TooltipContent side="top" align="center">
						<p className="max-w-xs text-sm">{tooltip}</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
}

// FAQ Item Component
function FaqItem({ question, answer }: { question: string; answer: string }) {
	return (
		<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1">
			<h3 className="text-xl font-semibold mb-3">{question}</h3>
			<p className="text-white/70">{answer}</p>
		</div>
	);
}
