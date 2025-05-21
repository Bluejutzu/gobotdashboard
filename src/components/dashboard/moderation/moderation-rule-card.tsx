"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Filter, Link, MessageSquare, Shield } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { ExtendedAutoModerationRule } from "@/lib/types/types";
import { ProfanitySettings } from "../moderation/rule-settings/profanity-settings";
import { SpamSettings } from "../moderation/rule-settings/spam-settings";
import { LinkSettings } from "../moderation/rule-settings/link-settings";

interface ModerationRuleCardProps {
	title: string;
	description: string;
	icon: "filter" | "shield" | "link" | "message";
	enabled: boolean;
	onToggle: (enabled: boolean) => void;
	settings: ExtendedAutoModerationRule;
	updateSettings: (settings: ExtendedAutoModerationRule) => void;
	type: "profanity" | "spam" | "link";
}

/**
 * Renders a moderation rule card with toggleable activation and expandable settings.
 *
 * Displays an icon, title, description, and a switch to enable or disable the rule. When expanded and enabled, shows a settings panel specific to the rule type.
 *
 * @param title - The title of the moderation rule.
 * @param description - A brief description of the rule.
 * @param icon - The icon type to display for the rule.
 * @param enabled - Whether the rule is currently active.
 * @param onToggle - Callback invoked when the enabled state changes.
 * @param settings - The current settings for the rule.
 * @param updateSettings - Callback to update the rule's settings.
 * @param type - The type of moderation rule, determining which settings panel is shown.
 */
export function ModerationRuleCard({
	title,
	description,
	icon,
	enabled,
	onToggle,
	settings,
	updateSettings,
	type,
}: ModerationRuleCardProps) {
	const [expanded, setExpanded] = useState(false);

	const icons = {
		filter: <Filter className="h-5 w-5" />,
		shield: <Shield className="h-5 w-5" />,
		link: <Link className="h-5 w-5" />,
		message: <MessageSquare className="h-5 w-5" />,
	};

	return (
		<Card className="overflow-hidden border-[#3a3d4a] bg-[#232530] transition-all">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2b2d3a]">
							{icons[icon]}
						</div>
						<div>
							<CardTitle className="text-lg">{title}</CardTitle>
							<CardDescription>{description}</CardDescription>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<Switch
							checked={enabled}
							onCheckedChange={onToggle}
							className="data-[state=checked]:bg-blue-500"
						/>
						<button
							onClick={() => setExpanded(!expanded)}
							className="text-gray-400 hover:text-white transition-colors"
							aria-label={expanded ? "Collapse settings" : "Expand settings"}
						>
							<ChevronDown
								className={cn(
									"h-5 w-5 transition-transform",
									expanded ? "rotate-180" : "",
								)}
							/>
						</button>
					</div>
				</div>
			</CardHeader>
			{expanded && enabled && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: "auto", opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<CardContent className="pt-4">
						{type === "profanity" && (
							<ProfanitySettings
								settings={settings}
								updateSettings={updateSettings}
							/>
						)}
						{type === "spam" && (
							<SpamSettings
								settings={settings}
								updateSettings={updateSettings}
							/>
						)}
						{type === "link" && (
							<LinkSettings
								settings={settings}
								updateSettings={updateSettings}
							/>
						)}
					</CardContent>
				</motion.div>
			)}
		</Card>
	);
}
