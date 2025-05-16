import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ServerCreatedProps {
    serverName: string
    serverId: string
}

export function ServerCreated({ serverName, serverId }: ServerCreatedProps) {
    return (
        <div className="flex justify-center py-12 px-4">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-green-100 dark:bg-green-900/20 rounded-full p-3 w-fit mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
                    </div>
                    <CardTitle className="text-2xl">Server Created Successfully!</CardTitle>
                    <CardDescription>Your server has been added to Sapphire</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="font-medium text-lg">{serverName}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Your server has been created successfully! Now let&apos;s add the bot to your Discord server.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Server ID: {serverId}</p>
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">{`What's Next?`}</h3>
                        <ul className="text-sm text-muted-foreground text-left list-disc pl-5 space-y-1">
                            <li>Configure your server settings</li>
                            <li>Set up moderation rules</li>
                            <li>Customize welcome messages</li>
                            <li>Explore analytics and commands</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href={`/dashboard/servers/${serverId}`} className="flex items-center justify-center gap-2">
                            Continue to Server Dashboard
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
