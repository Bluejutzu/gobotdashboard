import { Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Server } from "@/lib/types/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServerCardProps {
    server: Server;
}

/**
 * Displays a card with details and management options for a server.
 *
 * Shows the server's icon or initial, name, member count, and ID, along with a button linking to the server management page.
 *
 * @param server - The server object containing details to display.
 */
export function ServerCard({ server }: ServerCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    {server.icon ? (
                        <Image
                            src={server.icon || "/placeholder.svg"}
                            alt={server.name}
                            className="w-10 h-10 rounded-full"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="font-medium text-lg">{server.name.charAt(0)}</span>
                        </div>
                    )}
                    <div>
                        <CardTitle className="text-lg">{server.name}</CardTitle>
                        <CardDescription>{server.approximate_member_count.toLocaleString()} members</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground">Server ID: {server.id}</div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/dashboard/servers/${server.id}`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
