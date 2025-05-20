import { Skeleton } from "@/components/ui/skeleton"

/**
 * Displays a skeleton placeholder UI representing a loading state for the moderation dashboard.
 *
 * Renders animated skeleton elements arranged vertically to indicate content is loading.
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
