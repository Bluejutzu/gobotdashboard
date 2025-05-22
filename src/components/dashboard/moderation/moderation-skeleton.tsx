import { Skeleton } from "@/components/ui/skeleton";

/**
 * Displays a skeleton placeholder for the moderation tab while content is loading.
 *
 * Renders three full-width skeleton blocks and a smaller right-aligned skeleton to indicate loading state.
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
    );
}
