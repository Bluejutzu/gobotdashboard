import { SiteHeader } from "@/components/site-header";
import { PricingSectionDemo } from "@/components/pricing-section-demo";

export default function PricingDemoPage() {
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
							Pricing Card Demo
						</h1>
						<p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
							Demonstration of pricing cards with available and unavailable
							states
						</p>
					</div>
				</div>
			</section>

			{/* Pricing Demo Section */}
			<PricingSectionDemo />
		</div>
	);
}
