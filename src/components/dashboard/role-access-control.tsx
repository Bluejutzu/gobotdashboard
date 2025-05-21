"use client";

import { useEffect, useState } from "react";
import { Info, Plus, Shield, Trash2 } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import supabase from "@/lib/supabase/client";

interface Role {
	id: string;
	name: string;
	color: string;
	position: number;
	permissions: string;
}

interface ServerAccessRole {
	id: string;
	discord_role_id: string;
	access_level: string;
}

interface RoleAccessControlProps {
	serverId: string;
}

export function RoleAccessControl({ serverId }: RoleAccessControlProps) {
	const [roles, setRoles] = useState<Role[]>([]);
	const [accessRoles, setAccessRoles] = useState<ServerAccessRole[]>([]);
	const [, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [selectedRoleId, setSelectedRoleId] = useState("");
	const [selectedAccessLevel, setSelectedAccessLevel] = useState("view");

	// Fetch server roles and access settings
	useEffect(() => {
		const fetchRolesAndAccess = async () => {
			try {
				// In a real app, you would fetch Discord roles from the Discord API
				// For this demo, we'll use mock data
				const mockRoles: Role[] = [
					{
						id: "1234567890",
						name: "Admin",
						color: "#ff0000",
						position: 5,
						permissions: "8",
					},
					{
						id: "2345678901",
						name: "Moderator",
						color: "#00ff00",
						position: 4,
						permissions: "4",
					},
					{
						id: "3456789012",
						name: "Member",
						color: "#0000ff",
						position: 3,
						permissions: "2",
					},
					{
						id: "4567890123",
						name: "New Member",
						color: "#ffff00",
						position: 2,
						permissions: "1",
					},
					{
						id: "5678901234",
						name: "Bot",
						color: "#ff00ff",
						position: 1,
						permissions: "0",
					},
				];

				setRoles(mockRoles);

				// Fetch existing access roles from database
				const { data, error } = await supabase
					.from("server_access_roles")
					.select("*")
					.eq("server_id", serverId)
					.overrideTypes<ServerAccessRole[]>();

				if (error) throw error;

				setAccessRoles(data || []);
			} catch (error) {
				console.error("Error fetching roles and access settings:", error);
				toast.error("Error", {
					description:
						"Failed to load roles and access settings. Please try again.",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchRolesAndAccess();
	}, [serverId]);

	const handleAddRole = async () => {
		if (!selectedRoleId) return;

		// Check if role is already added
		if (accessRoles.some((role) => role.discord_role_id === selectedRoleId)) {
			toast.error("Role already added", {
				description: "This role already has access settings configured.",
			});
			return;
		}

		setSaving(true);

		try {
			const { data, error } = await supabase
				.from("server_access_roles")
				.insert({
					server_id: serverId,
					discord_role_id: selectedRoleId,
					access_level: selectedAccessLevel,
				})
				.select()
				.returns<ServerAccessRole[]>();

			if (error) throw error;

			setAccessRoles([...accessRoles, data[0]]);
			setSelectedRoleId("");

			toast.success("Role added", {
				description: "The role has been added with the specified access level.",
			});
		} catch (error) {
			console.error("Error adding role:", error);
			toast.error("Error", {
				description: "Failed to add role. Please try again.",
			});
		} finally {
			setSaving(false);
		}
	};

	const handleRemoveRole = async (roleId: string) => {
		setSaving(true);

		try {
			const { error } = await supabase
				.from("server_access_roles")
				.delete()
				.eq("id", roleId);

			if (error) throw error;

			setAccessRoles(accessRoles.filter((role) => role.id !== roleId));

			toast.success("Role removed", {
				description: "The role has been removed from access control.",
			});
		} catch (error) {
			console.error("Error removing role:", error);
			toast.error("Error", {
				description: "Failed to remove role. Please try again.",
			});
		} finally {
			setSaving(false);
		}
	};

	const handleUpdateAccessLevel = async (roleId: string, newLevel: string) => {
		setSaving(true);

		try {
			const { error } = await supabase
				.from("server_access_roles")
				.update({ access_level: newLevel })
				.eq("id", roleId);

			if (error) throw error;

			setAccessRoles(
				accessRoles.map((role) =>
					role.id === roleId ? { ...role, access_level: newLevel } : role,
				),
			);

			toast.success("Access updated", {
				description: "The role's access level has been updated.",
			});
		} catch (error) {
			console.error("Error updating access level:", error);
			toast.error("Error", {
				description: "Failed to update access level. Please try again.",
			});
		} finally {
			setSaving(false);
		}
	};

	const getRoleName = (roleId: string) => {
		const role = roles.find((r) => r.id === roleId);
		return role ? role.name : "Unknown Role";
	};

	const getRoleColor = (roleId: string) => {
		const role = roles.find((r) => r.id === roleId);
		return role ? role.color : "#cccccc";
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="h-5 w-5" />
					Role-Based Access Control
				</CardTitle>
				<CardDescription>
					Control which Discord roles can access your Sapphire dashboard
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Alert>
					<Info className="h-4 w-4" />
					<AlertTitle>How it works</AlertTitle>
					<AlertDescription>
						Users with these roles in your Discord server will be able to access
						the dashboard with the specified permission level.
						<ul className="mt-2 list-disc pl-5 space-y-1">
							<li>
								<strong>View:</strong> Can only view data and analytics
							</li>
							<li>
								<strong>Manage:</strong> Can modify settings but not critical
								ones
							</li>
							<li>
								<strong>Admin:</strong> Full access to all features
							</li>
						</ul>
					</AlertDescription>
				</Alert>

				<div className="space-y-4">
					<h3 className="text-sm font-medium">Current Access Roles</h3>

					{accessRoles.length === 0 ? (
						<div className="text-sm text-muted-foreground border rounded-md p-4 text-center">
							No roles have been added yet. Add a role below to grant dashboard
							access.
						</div>
					) : (
						<div className="space-y-2">
							{accessRoles.map((accessRole) => (
								<div
									key={accessRole.id}
									className="flex items-center justify-between border rounded-md p-3"
								>
									<div className="flex items-center gap-2">
										<div
											className="w-3 h-3 rounded-full"
											style={{
												backgroundColor: getRoleColor(
													accessRole.discord_role_id,
												),
											}}
										/>
										<span className="font-medium">
											{getRoleName(accessRole.discord_role_id)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Select
											value={accessRole.access_level}
											onValueChange={(value) =>
												handleUpdateAccessLevel(accessRole.id, value)
											}
											disabled={saving}
										>
											<SelectTrigger className="w-[120px]">
												<SelectValue placeholder="Access Level" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="view">View Only</SelectItem>
												<SelectItem value="manage">Manage</SelectItem>
												<SelectItem value="admin">Admin</SelectItem>
											</SelectContent>
										</Select>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleRemoveRole(accessRole.id)}
											disabled={saving}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="pt-4 border-t">
					<h3 className="text-sm font-medium mb-3">Add Role Access</h3>
					<div className="flex flex-col sm:flex-row gap-2">
						<Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
							<SelectTrigger className="flex-1">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								{roles.map((role) => (
									<SelectItem key={role.id} value={role.id}>
										<div className="flex items-center gap-2">
											<div
												className="w-2 h-2 rounded-full"
												style={{ backgroundColor: role.color }}
											/>
											{role.name}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={selectedAccessLevel}
							onValueChange={setSelectedAccessLevel}
						>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Access Level" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="view">View Only</SelectItem>
								<SelectItem value="manage">Manage</SelectItem>
								<SelectItem value="admin">Admin</SelectItem>
							</SelectContent>
						</Select>
						<Button
							onClick={handleAddRole}
							disabled={!selectedRoleId || saving}
							className="sm:w-auto w-full"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Role
						</Button>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between border-t pt-4">
				<div className="text-sm text-muted-foreground">
					Server owners always have full access
				</div>
			</CardFooter>
		</Card>
	);
}
