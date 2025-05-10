import { Skeleton } from "@/components/ui/skeleton"

export function ModerationTabSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-2">
                <Skeleton className="h-6 w-48 bg-[#232530]" />
                <Skeleton className="h-4 w-full max-w-md bg-[#232530]" />
            </div>

            <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-[#232530]" />
                <Skeleton className="h-32 w-full bg-[#232530]" />
                <Skeleton className="h-32 w-full bg-[#232530]" />
                <Skeleton className="h-12 w-full bg-[#232530]" />
            </div>

            <div className="flex justify-end">
                <Skeleton className="h-10 w-32 bg-[#232530]" />
            </div>
        </div>
    )
}

export function CaseDetailSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full bg-[#232530]" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48 bg-[#232530]" />
                    <Skeleton className="h-4 w-32 bg-[#232530]" />
                </div>
            </div>

            <Skeleton className="h-10 w-full bg-[#232530]" />

            <div className="space-y-2">
                <Skeleton className="h-5 w-32 bg-[#232530]" />
                <Skeleton className="h-32 w-full bg-[#232530]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-[#232530]" />
                    <Skeleton className="h-10 w-full bg-[#232530]" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-[#232530]" />
                    <Skeleton className="h-10 w-full bg-[#232530]" />
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-24 bg-[#232530]" />
                <Skeleton className="h-10 w-24 bg-[#232530]" />
            </div>
        </div>
    )
}
