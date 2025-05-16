import { Suspense } from "react"

import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CaseDetailSkeleton } from "@/components/dashboard/moderation/moderation-skeleton"
import { CaseDetail } from "@/components/dashboard/moderation/case-details"

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string; caseId: string }> }) {
    const { id, caseId }: { id: string; caseId: string } = await params
    return (
        <div className="container p-4 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-[#232530] border-[#3a3c47] text-white hover:bg-[#2a2c37]"
                >
                    <Link href={`/dashboard/servers/${id}/moderation`}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Moderation
                    </Link>
                </Button>
            </div>

            <Card className="border-0 bg-[#1a1c23] shadow-md overflow-hidden">
                <div className="p-6">
                    <Suspense fallback={<CaseDetailSkeleton />}>
                        <CaseDetail serverId={id} caseId={caseId} />
                    </Suspense>
                </div>
            </Card>
        </div>
    )
}
