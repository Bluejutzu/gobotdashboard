"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { Suspense, type Usable } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { createNewCommand, deleteCommand, editCommand } from "./actions";

function CommandsLoading() {
	return (
		<div className="space-y-4">
			{[1, 2, 3].map((i) => (
				<Card key={i} className="overflow-hidden bg-card/50">
					<div className="p-6">
						<div className="flex items-center justify-between">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-9 w-24" />
						</div>
						<Skeleton className="mt-3 h-4 w-3/4" />
						<div className="mt-4 flex justify-end">
							<Skeleton className="h-9 w-20 mr-2" />
							<Skeleton className="h-9 w-20" />
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}

interface CommandItemProps {
	cmd: {
		id: string;
		name: string;
		description: string;
	};
	serverId: string;
}

function CommandItem({ cmd, serverId }: CommandItemProps) {
	return (
		<Card className="overflow-hidden transition-all hover:shadow-md">
			<CardContent className="p-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<Badge variant="secondary" className="font-mono text-sm">
								/{cmd.name}
							</Badge>
							<p className="text-sm text-muted-foreground line-clamp-2">
								{cmd.description || "No description provided"}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 self-end sm:self-center">
						<form action={editCommand}>
							<input type="hidden" name="serverId" value={serverId} />
							<input type="hidden" name="commandId" value={cmd.id} />
							<Button type="submit" size="sm" variant="outline">
								<Pencil className="h-4 w-4 mr-1" />
								Edit
							</Button>
						</form>
						<form
							action={deleteCommand}
							onSubmit={(e) => {
								if (!confirm("Are you sure you want to delete this command?")) {
									e.preventDefault();
								}
							}}
						>
							<input type="hidden" name="serverId" value={serverId} />
							<input type="hidden" name="commandId" value={cmd.id} />
							<Button type="submit" size="sm" variant="destructive">
								<Trash2 className="h-4 w-4 mr-1" />
								Delete
							</Button>
						</form>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

interface Command {
	id: string;
	name: string;
	description: string;
	server_id: string;
}

function CommandsList({ serverId }: { serverId: string }) {
	const [commands, setCommands] = useState<Command[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchCommands = async () => {
			try {
				const { data, error } = await supabase
					.from("commands")
					.select("*")
					.eq("server_id", serverId)
					.order("name", { ascending: true });

				if (error) {
					setError(error.message);
					return;
				}

				setCommands(data || []);
			} catch (err) {
				setError("Failed to load commands");
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCommands();
	}, [serverId]);

	if (isLoading) {
		return <CommandsLoading />;
	}

	if (error) {
		return (
			<Card className="bg-destructive/10 border-destructive/20">
				<CardContent className="p-6">
					<p className="text-destructive font-medium">
						Failed to load commands
					</p>
					<p className="text-sm text-muted-foreground mt-1">{error}</p>
				</CardContent>
			</Card>
		);
	}

	if (!commands || commands.length === 0) {
		return (
			<Card className="border-dashed">
				<CardContent className="p-6 flex flex-col items-center justify-center text-center py-16">
					<div className="rounded-full bg-primary/10 p-3 mb-4">
						<Plus className="h-6 w-6 text-primary" />
					</div>
					<h3 className="font-medium text-lg mb-1">No commands yet</h3>
					<p className="text-muted-foreground text-sm max-w-md mb-4">
						{`Create your first command to get started with your bot's functionality.`}
					</p>
					<form action={createNewCommand}>
						<input type="hidden" name="serverId" value={serverId} />
						<Button type="submit">
							<Plus className="h-4 w-4 mr-1" />
							Create First Command
						</Button>
					</form>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{commands.map((cmd) => (
				<CommandItem key={cmd.id} cmd={cmd} serverId={serverId} />
			))}
		</div>
	);
}

export default function CommandsPage({
	params,
}: { params: Usable<{ id: string }> }) {
	const { id: serverId } = React.use(params);

	return (
		<div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Commands</h1>
					<p className="text-muted-foreground mt-1">{`Manage your bot's slash commands for this server`}</p>
				</div>
				<form action={createNewCommand}>
					<input type="hidden" name="serverId" value={serverId} />
					<Button type="submit" className="w-full sm:w-auto">
						<Plus className="h-4 w-4 mr-1" />
						Create Command
					</Button>
				</form>
			</div>

			<Suspense fallback={<CommandsLoading />}>
				<CommandsList serverId={serverId} />
			</Suspense>
		</div>
	);
}
