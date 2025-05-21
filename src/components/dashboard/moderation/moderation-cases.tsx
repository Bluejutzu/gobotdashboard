"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getModerationCases } from "@/lib/redis-service/moderation-service";
import type { ModerationCase } from "@/lib/types/types";

/**
 * Displays a table of moderation cases for a specified server.
 *
 * Fetches and lists moderation actions taken on users within the given server. Shows a loading skeleton while data is being retrieved and a message if no cases exist.
 *
 * @param serverId - The unique identifier of the server whose moderation cases are displayed.
 */
export function ModerationCases({ serverId }: { serverId: string }) {
	const [cases, setCases] = useState<ModerationCase[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCases = async () => {
			try {
				setLoading(true);
				const data = await getModerationCases(serverId);
				setCases(data || []);
			} catch (err) {
				console.error("Failed to load moderation cases:", err);
				toast.error("Failed to load moderation cases");
			} finally {
				setLoading(false);
			}
		};

		fetchCases();
	}, [serverId]);

	if (loading) {
		return (
			<div className="space-y-4">
				{[...Array(5)].map((_, i) => (
					<Skeleton key={i} className="h-12 w-full bg-[#232530]" />
				))}
			</div>
		);
	}

	if (cases.length === 0) {
		return (
			<div className="flex justify-center items-center p-12">
				<div className="text-center space-y-4">
					<h3 className="text-xl font-medium">No Moderation Cases</h3>
					<p className="text-gray-400 max-w-md">
						There are no moderation cases for this server yet. Cases will appear
						here when moderators take action.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<Table>
				<TableHeader>
					<TableRow className="border-[#3a3d4a] hover:bg-[#232530]">
						<TableHead className="text-gray-400">User</TableHead>
						<TableHead className="text-gray-400">Type</TableHead>
						<TableHead className="text-gray-400">Reason</TableHead>
						<TableHead className="text-gray-400">Moderator</TableHead>
						<TableHead className="text-gray-400">Date</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{cases.map((case_) => (
						<TableRow
							key={case_.id}
							className="border-[#3a3d4a] hover:bg-[#232530]"
						>
							<TableCell className="font-medium">{case_.user_id}</TableCell>
							<TableCell>
								<Badge
									variant="outline"
									className={`
                    ${case_.action === "WARN" ? "border-yellow-500 text-yellow-500" : ""}
                    ${case_.action === "MUTE" ? "border-orange-500 text-orange-500" : ""}
                    ${case_.action === "KICK" ? "border-red-500 text-red-500" : ""}
                    ${case_.action === "BAN" ? "border-purple-500 text-purple-500" : ""}
                  `}
								>
									{case_.action}
								</Badge>
							</TableCell>
							<TableCell>{case_.reason}</TableCell>
							<TableCell>Moderator</TableCell>
							<TableCell>
								{new Date(`${case_.created_at}`).toLocaleDateString()}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
