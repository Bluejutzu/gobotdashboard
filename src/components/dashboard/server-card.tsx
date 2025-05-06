import type { Server } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ServerCardProps {
    server: Server
}

export function ServerCard({ server }: ServerCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    {server.icon_url ? (
                        <Image src={server.icon_url || "/placeholder.svg"} alt={server.name} className="w-10 h-10 rounded-full" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="font-medium text-lg">{server.name.charAt(0)}</span>
                        </div>
                    )}
                    <div>
                        <CardTitle className="text-lg">{server.name}</CardTitle>
                        <CardDescription>{server.member_count.toLocaleString()} members</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground">Server ID: {server.discord_id}</div>
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
    )
}
