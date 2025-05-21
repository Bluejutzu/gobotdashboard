"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ExtendedAutoModerationRule } from "@/lib/types/types";

interface SpamSettingsProps {
	settings: ExtendedAutoModerationRule;
	updateSettings: (settings: ExtendedAutoModerationRule) => void;
}

/**
 * Renders controls for configuring spam detection settings in an auto-moderation rule.
 *
 * Provides a slider to set the message threshold for spam detection and radio buttons to select the action taken when spam is detected (delete message or mute user for 5 minutes). Updates are propagated via the provided callback.
 *
 * @param settings - The current auto-moderation rule settings, including spam configuration and actions.
 * @param updateSettings - Callback to apply updated settings when the user changes the threshold or action.
 *
 * @returns A React element containing the spam settings UI.
 */
export function SpamSettings({ settings, updateSettings }: SpamSettingsProps) {
	const spamThreshold = settings.customSettings?.spamSettings?.threshold || 5;
	const spamAction = settings.actions?.find((a) => a.type === 3)
		? "mute"
		: "delete";

	const handleThresholdChange = (value: number[]) => {
		updateSettings({
			...settings,
			customSettings: {
				...settings.customSettings,
				spamSettings: {
					enabled: settings.customSettings?.spamSettings?.enabled || true,
					threshold: value[0],
				},
			},
		});
	};

	const handleActionChange = (value: string) => {
		let newActions = [...(settings.actions || [])];

		// Remove existing spam actions
		newActions = newActions.filter((a) => a.type !== 2 && a.type !== 3);

		// Add the selected action
		if (value === "delete") {
			newActions.push({ type: 2 }); // Delete message
		} else if (value === "mute") {
			newActions.push({ type: 3, metadata: { duration_seconds: 300 } }); // Mute for 5 minutes
		}

		updateSettings({
			...settings,
			actions: newActions,
		});
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label className="mb-2 block">Message Threshold</Label>
				<div className="flex items-center gap-4">
					<Slider
						value={[spamThreshold]}
						min={3}
						max={10}
						step={1}
						onValueChange={handleThresholdChange}
						className="flex-1"
					/>
					<span className="w-8 text-center">{spamThreshold}</span>
				</div>
				<p className="text-sm text-gray-400">
					Number of similar messages in a short time to trigger spam detection
				</p>
			</div>

			<div className="space-y-2">
				<Label className="mb-2 block">Action on Spam</Label>
				<RadioGroup
					value={spamAction}
					onValueChange={handleActionChange}
					className="flex flex-col space-y-2"
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem
							value="delete"
							id="delete"
							className="border-[#3a3d4a]"
						/>
						<Label htmlFor="delete" className="cursor-pointer">
							Delete message only
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem
							value="mute"
							id="mute"
							className="border-[#3a3d4a]"
						/>
						<Label htmlFor="mute" className="cursor-pointer">
							Mute user (5 minutes)
						</Label>
					</div>
				</RadioGroup>
			</div>
		</div>
	);
}
