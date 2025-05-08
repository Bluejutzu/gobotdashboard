import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ServerCrash } from "lucide-react"

export function ServerLoading() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                    <ServerCrash className="h-10 w-10 text-primary animate-pulse" />
                    <h2 className="text-xl font-semibold">Loading server data...</h2>
                    <div className="text-sm text-muted-foreground">Please wait while we fetch your server information</div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-20 mb-2" />
                            <Skeleton className="h-4 w-40" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="border rounded-md">
                    <Skeleton className="h-[200px] w-full" />
                </div>
            </div>
        </div>
    )
}
