"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ExtendedAutoModerationRule } from "@/lib/types/types";
import { toast } from "sonner";

interface LinkSettingsProps {
	settings: ExtendedAutoModerationRule;
	updateSettings: (settings: ExtendedAutoModerationRule) => void;
}

/**
 * React component for managing link moderation settings, including blocking all links and specifying allowed domains.
 *
 * Renders controls to toggle blocking all links, add or remove allowed domains, and displays the current list of allowed domains. Updates moderation settings via the provided callback when changes are made.
 *
 * @param settings - The current moderation rule settings to display and modify.
 * @param updateSettings - Callback to update the moderation rule settings when changes occur.
 */
export function LinkSettings({ settings, updateSettings }: LinkSettingsProps) {
	const [newDomain, setNewDomain] = useState("");
	const allowedDomains = settings.customSettings?.allowedDomains || [];
	const blockAllLinks = settings.customSettings?.blockAllLinks || false;

	const addDomain = () => {
		if (!newDomain.trim()) return;

		// Simple domain validation
		const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
		if (!domainRegex.test(newDomain.trim())) {
			toast.error("Invalid domain", {
				description: "Please enter a valid domain (e.g., example.com)",
			});
			return;
		}

		const updatedDomains = [...allowedDomains, newDomain.trim().toLowerCase()];
		updateSettings({
			...settings,
			customSettings: {
				...settings.customSettings,
				allowedDomains: updatedDomains,
			},
		});
		setNewDomain("");
	};

	const removeDomain = (domain: string) => {
		const updatedDomains = allowedDomains.filter((d) => d !== domain);
		updateSettings({
			...settings,
			customSettings: {
				...settings.customSettings,
				allowedDomains: updatedDomains,
			},
		});
	};

	const toggleBlockAllLinks = (value: boolean) => {
		updateSettings({
			...settings,
			customSettings: {
				...settings.customSettings,
				blockAllLinks: value,
			},
		});
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<Label htmlFor="block-all-links" className="font-medium">
						Block All Links
					</Label>
					<p className="text-sm text-gray-400">
						Block all links except those in the allowed list
					</p>
				</div>
				<Switch
					id="block-all-links"
					checked={blockAllLinks}
					onCheckedChange={toggleBlockAllLinks}
					className="data-[state=checked]:bg-blue-500"
				/>
			</div>

			<div>
				<Label htmlFor="allowed-domains" className="mb-2 block">
					Allowed Domains
				</Label>
				<div className="flex gap-2">
					<Input
						id="allowed-domains"
						value={newDomain}
						onChange={(e) => setNewDomain(e.target.value)}
						placeholder="example.com"
						className="bg-[#2b2d3a] border-[#3a3d4a]"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addDomain();
							}
						}}
					/>
					<Button
						onClick={addDomain}
						variant="secondary"
						className="bg-[#2b2d3a] hover:bg-[#3a3d4a]"
					>
						Add
					</Button>
				</div>
			</div>

			<div className="flex flex-wrap gap-2 mt-2">
				{allowedDomains.length === 0 ? (
					<p className="text-sm text-gray-400">No allowed domains added yet.</p>
				) : (
					allowedDomains.map((domain) => (
						<Badge
							key={domain}
							variant="secondary"
							className="bg-[#2b2d3a] hover:bg-[#3a3d4a] group"
						>
							{domain}
							<button
								onClick={() => removeDomain(domain)}
								className="ml-1 text-gray-400 group-hover:text-white"
								aria-label={`Remove ${domain}`}
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))
				)}
			</div>
		</div>
	);
}
