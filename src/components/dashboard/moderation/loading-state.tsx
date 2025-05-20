import { Skeleton } from "@/components/ui/skeleton"

/**
 * Displays a placeholder UI with skeleton elements to indicate a loading state.
 *
 * Renders a vertical stack of skeleton components with pulsing animation, simulating the layout of content while data is being loaded.
 */
export function LoadingState() {
    return (
        <div className="space-y-6 animate-pulse">
            <Skeleton className="h-16 w-full bg-[#232530]" />
            {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full bg-[#232530]" />
            ))}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32 bg-[#232530]" />
            </div>
        </div>
    )
}
