"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import supabase from "@/lib/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DataRequestFormProps {
	serverId: string;
	serverName: string;
}

export function DataRequestForm({
	serverId,
	serverName,
}: DataRequestFormProps) {
	const [requestType, setRequestType] = useState("full_export");
	const [requestReason, setRequestReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Get current user
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				throw new Error("User not authenticated");
			}

			// Get user ID from database
			const { data: userData } = await supabase
				.from("users")
				.select("discord_id")
				.eq("discord_id", user.user_metadata.sub)
				.single();

			if (!userData) {
				throw new Error("User not found in database");
			}

			// Create data request
			const { error } = await supabase.from("data_requests").insert({
				user_id2: userData.discord_id,
				server_id: serverId,
				request_type: requestType,
				request_reason: requestReason,
				status: "pending",
			});

			if (error) {
				console.error("Error inserting data request:", error);
				toast.error("Error", {
					description: "Failed to submit data request. Please try again.",
				});
				return;
			}

			toast.success("Data request submitted", {
				description:
					"Your request has been submitted and will be reviewed by an administrator.",
			});

			// Refresh the page to show the new request
			router.refresh();
		} catch (error) {
			console.error("Error submitting data request:", error);
			toast.error("Error", {
				description: "Failed to submit data request. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Request Server Data</CardTitle>
				<CardDescription>
					Request an export of data for {serverName}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Alert>
						<Info className="h-4 w-4" />
						<AlertTitle>Information</AlertTitle>
						<AlertDescription>
							Data requests are reviewed by administrators. You will be notified
							when your request is processed.
						</AlertDescription>
					</Alert>

					<div className="space-y-2">
						<label htmlFor="request-type" className="text-sm font-medium">
							Request Type
						</label>
						<Select value={requestType} onValueChange={setRequestType}>
							<SelectTrigger id="request-type">
								<SelectValue placeholder="Select request type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="full_export">Full Data Export</SelectItem>
								<SelectItem value="analytics_only">Analytics Only</SelectItem>
								<SelectItem value="logs_only">Command Logs Only</SelectItem>
								<SelectItem value="settings_only">Settings Only</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label htmlFor="request-reason" className="text-sm font-medium">
							Reason for Request
						</label>
						<Textarea
							id="request-reason"
							placeholder="Please explain why you need this data export..."
							value={requestReason}
							onChange={(e) => setRequestReason(e.target.value)}
							rows={4}
							required
						/>
						<p className="text-xs text-muted-foreground">
							Providing a clear reason helps administrators process your request
							faster.
						</p>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button
					type="submit"
					onClick={handleSubmit}
					disabled={isSubmitting || !requestReason.trim()}
				>
					<FileText className="mr-2 h-4 w-4" />
					{isSubmitting ? "Submitting..." : "Submit Request"}
				</Button>
			</CardFooter>
		</Card>
	);
}
