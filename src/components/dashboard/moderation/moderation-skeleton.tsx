import { Skeleton } from "@/components/ui/skeleton"

/**
 * Displays a skeleton placeholder for the moderation tab layout.
 *
 * Renders three vertical skeleton blocks and a smaller skeleton element aligned to the right, indicating loading content in the moderation tab.
 */
export function ModerationTabSkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full bg-[#232530]" />
            ))}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32 bg-[#232530]" />
            </div>
        </div>
    )
}
