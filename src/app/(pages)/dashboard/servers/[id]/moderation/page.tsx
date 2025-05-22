import { Suspense } from "react";
import { FileText, Flag, Shield, Terminal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

import { ModerationHeader } from "@/components/dashboard/moderation/moderation-header";
import { ModerationTabSkeleton } from "@/components/dashboard/moderation/moderation-skeleton";
import { CustomFlagging } from "@/components/dashboard/moderation/custom-flagging";
import { ModerationCases } from "@/components/dashboard/moderation/moderation-cases";
import { ModerationCommands } from "@/components/dashboard/moderation/moderation-commands";
import { AutoModeration } from "@/components/dashboard/moderation/auto-moderation";

/**
 * Renders the moderation dashboard page with tabbed navigation for different moderation tools.
 *
 * Displays a header and a card containing tabs for Auto Moderation, Custom Flags, Cases, and Commands. Each tab loads its content asynchronously with a loading skeleton fallback.
 *
 * @param params - A promise resolving to an object containing the server ID.
 * @returns The moderation dashboard React component.
 */
export default async function ModerationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id }: { id: string } = await params;
    return (
        <div className="container p-4 space-y-6 max-w-7xl mx-auto">
            <ModerationHeader />

            <Card className="border-0 bg-[#1a1c23] shadow-md overflow-hidden">
                <Tabs defaultValue="auto" className="w-full">
                    <TabsList className="w-full bg-[#111218] p-0 h-auto flex rounded-none border-b border-[#2a2c37]">
                        <TabsTrigger
                            value="auto"
                            className="flex-1 py-4 rounded-none data-[state=active]:bg-[#1a1c23] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none transition-all"
                        >
                            <Shield className="mr-2 h-4 w-4" />
                            Auto Moderation
                        </TabsTrigger>
                        <TabsTrigger
                            value="flags"
                            className="flex-1 py-4 rounded-none data-[state=active]:bg-[#1a1c23] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none transition-all"
                        >
                            <Flag className="mr-2 h-4 w-4" />
                            Custom Flags
                        </TabsTrigger>
                        <TabsTrigger
                            value="cases"
                            className="flex-1 py-4 rounded-none data-[state=active]:bg-[#1a1c23] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none transition-all"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Cases
                        </TabsTrigger>
                        <TabsTrigger
                            value="commands"
                            className="flex-1 py-4 rounded-none data-[state=active]:bg-[#1a1c23] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none transition-all"
                        >
                            <Terminal className="mr-2 h-4 w-4" />
                            Commands
                        </TabsTrigger>
                    </TabsList>

                    <div className="p-6">
                        <TabsContent value="auto" className="mt-0 space-y-4">
                            <Suspense fallback={<ModerationTabSkeleton />}>
                                <AutoModeration serverId={id} />
                            </Suspense>
                        </TabsContent>

                        <TabsContent value="flags" className="mt-0 space-y-4">
                            <Suspense fallback={<ModerationTabSkeleton />}>
                                <CustomFlagging />
                            </Suspense>
                        </TabsContent>

                        <TabsContent value="cases" className="mt-0 space-y-4">
                            <Suspense fallback={<ModerationTabSkeleton />}>
                                <ModerationCases serverId={id} />
                            </Suspense>
                        </TabsContent>

                        <TabsContent value="commands" className="mt-0 space-y-4">
                            <Suspense fallback={<ModerationTabSkeleton />}>
                                <ModerationCommands />
                            </Suspense>
                        </TabsContent>
                    </div>
                </Tabs>
            </Card>
        </div>
    );
}
