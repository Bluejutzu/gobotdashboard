"use client";

import { useCallback, useEffect, useState } from "react";
import {
	AlertCircle,
	Check,
	CheckCircle,
	Clock,
	FileText,
	Search,
	X,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import supabase from "@/lib/supabase/client";

interface DataRequest {
	id: string;
	request_type: string;
	request_reason: string;
	status: string;
	created_at: string;
	updated_at: string;
	rejection_reason?: string;
	data_url?: string;
	expires_at?: string;
	user: {
		username: string;
		email: string;
	};
	server: {
		name: string;
	};
}

interface DataRequestsAdminProps {
	mockRequests?: DataRequest[];
}

export function DataRequestsAdmin({ mockRequests }: DataRequestsAdminProps) {
	const [requests, setRequests] = useState<DataRequest[]>(mockRequests || []);
	const [loading, setLoading] = useState(!mockRequests);
	const [filter, setFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [rejectionReason, setRejectionReason] = useState("");
	const [, setDataUrl] = useState("");
	const [processingRequestId, setProcessingRequestId] = useState<string | null>(
		null,
	);
	const [isProcessing, setIsProcessing] = useState(false);

	const fetchRequests = useCallback(async () => {
		// If mock data is provided, use it and skip the API call
		if (mockRequests) {
			setRequests(
				mockRequests.filter((request) => {
					if (filter !== "all") {
						return request.status === filter;
					}
					return true;
				}),
			);
			setLoading(false);
			return;
		}

		try {
			setLoading(true);

			let query = supabase
				.from("data_requests")
				.select(`
          id,
          request_type,
          request_reason,
          status,
          created_at,
          updated_at,
          rejection_reason,
          data_url,
          expires_at,
          user:user_id2 (username, email),
          server:server_id (name)
        `)
				.order("created_at", { ascending: false });

			if (filter !== "all") {
				query = query.eq("status", filter);
			}

			const { data, error } = await query.overrideTypes<DataRequest[]>();

			if (error) throw error;
			console.log(typeof setRequests);
			setRequests(data);
		} catch (error) {
			console.error("Error fetching data requests:", error);
			toast("Error", {
				description: "Failed to load data requests. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	}, [filter, mockRequests]);

	useEffect(() => {
		fetchRequests();
	}, [filter, fetchRequests]);

	const handleApproveRequest = async (requestId: string) => {
		setProcessingRequestId(requestId);
		setIsProcessing(true);

		try {
			const mockDataUrl = "https://example.com/data-export.zip";
			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + 7);

			// Handle mock data scenario
			if (mockRequests) {
				// Update the local state directly
				setRequests((prevRequests) =>
					prevRequests.map((req) =>
						req.id === requestId
							? {
									...req,
									status: "approved",
									data_url: mockDataUrl,
									expires_at: expiresAt.toISOString(),
									updated_at: new Date().toISOString(),
								}
							: req,
					),
				);

				toast("Request approved", {
					description:
						"The data request has been approved and the user has been notified.",
				});

				setProcessingRequestId(null);
				setIsProcessing(false);
				setDataUrl("");
				return;
			}

			// Original Supabase update for real data
			const { error } = await supabase
				.from("data_requests")
				.update({
					status: "approved",
					data_url: mockDataUrl,
					expires_at: expiresAt.toISOString(),
					updated_at: new Date().toISOString(),
				})
				.eq("id", requestId);

			if (error) throw error;

			toast("Request approved", {
				description:
					"The data request has been approved and the user has been notified.",
			});

			fetchRequests();
		} catch (error) {
			console.error("Error approving request:", error);
			toast("Error", {
				description: "Failed to approve request. Please try again.",
			});
		} finally {
			setProcessingRequestId(null);
			setIsProcessing(false);
			setDataUrl("");
		}
	};

	const handleRejectRequest = async (requestId: string) => {
		if (!rejectionReason.trim()) {
			toast("Rejection reason required", {
				description: "Please provide a reason for rejecting this request.",
			});
			return;
		}

		setProcessingRequestId(requestId);
		setIsProcessing(true);

		try {
			// Handle mock data scenario
			if (mockRequests) {
				// Update the local state directly
				setRequests((prevRequests) =>
					prevRequests.map((req) =>
						req.id === requestId
							? {
									...req,
									status: "rejected",
									rejection_reason: rejectionReason,
									updated_at: new Date().toISOString(),
								}
							: req,
					),
				);

				toast("Request rejected", {
					description:
						"The data request has been rejected and the user has been notified.",
				});

				setProcessingRequestId(null);
				setIsProcessing(false);
				setRejectionReason("");
				return;
			}

			// Original Supabase update for real data
			const { error } = await supabase
				.from("data_requests")
				.update({
					status: "rejected",
					rejection_reason: rejectionReason,
					updated_at: new Date().toISOString(),
				})
				.eq("request_id", requestId);

			if (error) throw error;

			toast("Request rejected", {
				description:
					"The data request has been rejected and the user has been notified.",
			});

			fetchRequests();
		} catch (error) {
			console.error("Error rejecting request:", error);
			toast("Error", {
				description: "Failed to reject request. Please try again.",
			});
		} finally {
			setProcessingRequestId(null);
			setIsProcessing(false);
			setRejectionReason("");
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge variant="outline" className="flex items-center gap-1">
						<Clock className="h-3 w-3" /> Pending
					</Badge>
				);
			case "approved":
				return (
					<Badge
						variant="default"
						className="flex items-center gap-1 bg-green-500"
					>
						<CheckCircle className="h-3 w-3" /> Approved
					</Badge>
				);
			case "rejected":
				return (
					<Badge variant="destructive" className="flex items-center gap-1">
						<XCircle className="h-3 w-3" /> Rejected
					</Badge>
				);
			default:
				return (
					<Badge variant="secondary" className="flex items-center gap-1">
						<AlertCircle className="h-3 w-3" /> {status}
					</Badge>
				);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getRequestTypeLabel = (type: string) => {
		switch (type) {
			case "full_export":
				return "Full Data Export";
			case "analytics_only":
				return "Analytics Only";
			case "logs_only":
				return "Command Logs Only";
			case "settings_only":
				return "Settings Only";
			default:
				return type;
		}
	};

	const filteredRequests = requests?.filter((request) => {
		if (!searchQuery) return true;

		const searchLower = searchQuery.toLowerCase();
		return (
			request.server.name.toLowerCase().includes(searchLower) ||
			request.user.username.toLowerCase().includes(searchLower) ||
			request.user.email.toLowerCase().includes(searchLower) ||
			request.request_reason.toLowerCase().includes(searchLower)
		);
	});

	useEffect(() => {
		// When using mock data, we need to update filteredRequests when searchQuery changes
		if (mockRequests) {
			fetchRequests();
		}
	}, [searchQuery, mockRequests, fetchRequests]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Data Requests</CardTitle>
				<CardDescription>
					Manage data export requests from users
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex flex-col sm:flex-row gap-4 justify-between">
						<Tabs
							defaultValue="all"
							value={filter}
							onValueChange={setFilter}
							className="w-full sm:w-auto"
						>
							<TabsList>
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value="pending">Pending</TabsTrigger>
								<TabsTrigger value="approved">Approved</TabsTrigger>
								<TabsTrigger value="rejected">Rejected</TabsTrigger>
							</TabsList>
						</Tabs>

						<div className="relative w-full sm:w-64">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search requests..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					{loading ? (
						<div className="space-y-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="border rounded-lg p-4 space-y-2">
									<div className="flex justify-between">
										<Skeleton className="h-5 w-32" />
										<Skeleton className="h-5 w-24" />
									</div>
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
							))}
						</div>
					) : !filteredRequests || filteredRequests.length === 0 ? (
						<div className="text-center py-10 border rounded-lg">
							<FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium mb-2">No requests found</h3>
							<p className="text-sm text-muted-foreground">
								{filter === "all"
									? "There are no data requests to display."
									: `There are no ${filter} requests to display.`}
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{filteredRequests.map((request) => (
								<div
									key={request.id}
									className="border rounded-lg p-4 space-y-3"
								>
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
										<div>
											<div className="flex items-center gap-2">
												<span className="font-medium">
													{request.user.username}
												</span>
												<span className="text-xs text-muted-foreground">
													({request.user.email})
												</span>
											</div>
											<div className="text-sm text-muted-foreground">
												Server: {request.server.name}
											</div>
										</div>
										<div className="flex items-center gap-2">
											{getStatusBadge(request.status)}
											<span className="text-xs text-muted-foreground">
												{formatDate(request.created_at)}
											</span>
										</div>
									</div>

									<div className="text-sm">
										<div className="font-medium text-xs text-muted-foreground mb-1">
											Request Type: {getRequestTypeLabel(request.request_type)}
										</div>
										<div className="font-medium text-xs text-muted-foreground mb-1">
											Reason:
										</div>
										<p className="bg-muted/50 p-2 rounded">
											{request.request_reason}
										</p>
									</div>

									{request.status === "rejected" &&
										request.rejection_reason && (
											<div className="text-sm bg-destructive/10 p-2 rounded">
												<div className="font-medium text-xs text-destructive mb-1">
													Rejection Reason:
												</div>
												<p className="text-destructive-foreground">
													{request.rejection_reason}
												</p>
											</div>
										)}

									{request.status === "approved" && request.data_url && (
										<div className="text-sm bg-green-500/10 p-2 rounded">
											<div className="font-medium text-xs text-green-600 mb-1">
												Data URL:
											</div>
											<p className="text-green-700 break-all">
												{request.data_url}
											</p>
											{request.expires_at && (
												<p className="text-xs text-muted-foreground mt-1">
													Expires: {formatDate(request.expires_at)}
												</p>
											)}
										</div>
									)}

									{request.status === "pending" && (
										<div className="flex justify-end gap-2">
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="outline" size="sm">
														<X className="mr-2 h-4 w-4" />
														Reject
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Reject Data Request</DialogTitle>
														<DialogDescription>
															Please provide a reason for rejecting this
															request. This will be sent to the user.
														</DialogDescription>
													</DialogHeader>
													<div className="py-4">
														<Textarea
															placeholder="Rejection reason..."
															value={rejectionReason}
															onChange={(e) =>
																setRejectionReason(e.target.value)
															}
															rows={4}
														/>
													</div>
													<DialogFooter>
														<Button
															variant="destructive"
															onClick={() => handleRejectRequest(request.id)}
															disabled={isProcessing || !rejectionReason.trim()}
														>
															{isProcessing &&
															processingRequestId === request.id
																? "Rejecting..."
																: "Reject Request"}
														</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>

											<Button
												size="sm"
												onClick={() => handleApproveRequest(request.id)}
												disabled={isProcessing}
											>
												<Check className="mr-2 h-4 w-4" />
												{isProcessing && processingRequestId === request.id
													? "Approving..."
													: "Approve"}
											</Button>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
