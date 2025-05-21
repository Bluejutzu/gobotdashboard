"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/error-page";

export default function NotFound() {
	const router = useRouter();

	// Custom actions to match the original design
	const customActions = (
		<div className="flex flex-col sm:flex-row gap-4">
			<Button asChild variant="default" className="animate-pulse-slow">
				<Link href="/">Return to Homepage</Link>
			</Button>
			<Button asChild variant="outline">
				<Link href="/dashboard">Go to Dashboard</Link>
			</Button>
			<Button variant="ghost" onClick={() => router.back()}>
				Go to previous Page
			</Button>
		</div>
	);

	return (
		<ErrorPage
			statusCode={404}
			minecraftStyle={true}
			showSearch={false}
			showPixelCharacter={true}
			customActions={customActions}
			footerText="You died! Score: 0"
			description="Oops! Looks like you've ventured into uncharted territory. The page you're looking for has either been moved or doesn't exist."
		/>
	);
}
