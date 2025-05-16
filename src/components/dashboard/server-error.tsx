"use client"

import { Home, RefreshCw, ServerOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ServerErrorProps {
    title?: string
    message?: string
    code?: string
    retry?: () => void
}

export function ServerError({
    title = "Error Loading Server",
    message = "We encountered an issue while loading your server data.",
    code,
    retry,
}: ServerErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-destructive/10 rounded-full p-4 mb-4">
                <ServerOff className="h-12 w-12 text-destructive" />
            </div>

            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">{message}</p>

            {code && (
                <Alert variant="destructive" className="mb-6 max-w-md">
                    <AlertTitle>Error Code</AlertTitle>
                    <AlertDescription className="font-mono text-sm">{code}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                {retry && (
                    <Button onClick={retry} className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                )}

                <Button variant="outline" asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Return to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    )
}
