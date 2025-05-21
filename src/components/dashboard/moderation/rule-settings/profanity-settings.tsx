"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { ExtendedAutoModerationRule } from "@/lib/types/types";

interface ProfanitySettingsProps {
	settings: ExtendedAutoModerationRule;
	updateSettings: (settings: ExtendedAutoModerationRule) => void;
}

/**
 * React component for managing a list of blocked words in an auto-moderation rule.
 *
 * Provides an interface to add new blocked words and remove existing ones from the rule's keyword filter.
 *
 * @param settings - The current auto-moderation rule settings, including the keyword filter.
 * @param updateSettings - Callback to update the rule settings when the blocked words list changes.
 *
 * @returns The rendered profanity settings UI.
 */
export function ProfanitySettings({
	settings,
	updateSettings,
}: ProfanitySettingsProps) {
	const [newWord, setNewWord] = useState("");
	const keywords = settings.trigger_metadata?.keyword_filter || [];

	const addKeyword = () => {
		if (!newWord.trim()) return;

		const updatedKeywords = [...keywords, newWord.trim().toLowerCase()];
		updateSettings({
			...settings,
			trigger_metadata: {
				...settings.trigger_metadata,
				keyword_filter: updatedKeywords,
			},
		});
		setNewWord("");
	};

	const removeKeyword = (word: string) => {
		const updatedKeywords = keywords.filter((kw) => kw !== word);
		updateSettings({
			...settings,
			trigger_metadata: {
				...settings.trigger_metadata,
				keyword_filter: updatedKeywords,
			},
		});
	};

	return (
		<div className="space-y-4">
			<div>
				<Label htmlFor="profanity-words" className="mb-2 block">
					Blocked Words
				</Label>
				<div className="flex gap-2">
					<Input
						id="profanity-words"
						value={newWord}
						onChange={(e) => setNewWord(e.target.value)}
						placeholder="Add a word to block"
						className="bg-[#2b2d3a] border-[#3a3d4a]"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addKeyword();
							}
						}}
					/>
					<Button
						onClick={addKeyword}
						variant="secondary"
						className="bg-[#2b2d3a] hover:bg-[#3a3d4a]"
					>
						Add
					</Button>
				</div>
			</div>

			<div className="flex flex-wrap gap-2 mt-2">
				{keywords.length === 0 ? (
					<p className="text-sm text-gray-400">No blocked words added yet.</p>
				) : (
					keywords.map((word) => (
						<Badge
							key={word}
							variant="secondary"
							className="bg-[#2b2d3a] hover:bg-[#3a3d4a] group"
						>
							{word}
							<button
								onClick={() => removeKeyword(word)}
								className="ml-1 text-gray-400 group-hover:text-white"
								aria-label={`Remove ${word}`}
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
