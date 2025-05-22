import Link from "next/link";
import { AlertTriangle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function StatusPage() {
    const systems = [
        { name: "API", status: "operational", uptime: 99.98 },
        { name: "Bot Core", status: "operational", uptime: 99.99 },
        { name: "Dashboard", status: "operational", uptime: 99.95 },
        { name: "Database", status: "operational", uptime: 99.97 },
        { name: "Authentication", status: "operational", uptime: 100 }
    ];

    const incidents = [
        {
            id: 1,
            title: "API Performance Degradation",
            status: "resolved",
            date: "May 2, 2023",
            updates: [
                {
                    time: "14:30 UTC",
                    message: "Issue resolved. All systems operating normally."
                },
                {
                    time: "13:45 UTC",
                    message: "Identified the cause as a database connection issue. Working on a fix."
                },
                {
                    time: "13:15 UTC",
                    message: "Investigating reports of API slowdowns."
                }
            ]
        },
        {
            id: 2,
            title: "Scheduled Maintenance",
            status: "scheduled",
            date: "May 15, 2023",
            updates: [
                {
                    time: "Scheduled for 02:00-04:00 UTC",
                    message: "Database optimization and system upgrades."
                }
            ]
        }
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-background py-24 md:py-32">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute -top-20 -left-20 h-[40rem] w-[40rem] rounded-full bg-primary/5 animate-blob"></div>
                        <div className="absolute top-40 -right-20 h-[35rem] w-[35rem] rounded-full bg-blue-500/5 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-40 left-20 h-[30rem] w-[30rem] rounded-full bg-indigo-500/5 animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-500/10 rounded-full animate-float animation-delay-1000"></div>
                    <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-indigo-500/10 rounded-full animate-float animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-primary/10 rounded-full animate-float animation-delay-3000"></div>

                    <div className="container relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <Badge variant="outline" className="mb-4 animate-fade-in">
                                SYSTEM STATUS
                            </Badge>
                            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-6 animate-slide-in">
                                Gobot Status
                            </h1>
                            <div className="flex items-center justify-center gap-2 mb-6 animate-slide-in animation-delay-500">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                                <span className="text-xl font-medium">All Systems Operational</span>
                            </div>
                            <p className="text-lg text-muted-foreground animate-slide-in animation-delay-1000">
                                Last updated: {new Date().toLocaleString()}
                                <Button variant="ghost" size="icon" className="ml-2 animate-spin-slow">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Systems Status Section */}
                <section className="py-16 md:py-24 bg-muted/50 relative overflow-hidden">
                    <div className="container relative z-10">
                        <div className="text-center mb-12 animate-fade-in-up">
                            <h2 className="text-3xl font-bold md:text-4xl">System Status</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Current status of all Gobot systems and services.
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-4 animate-fade-in-up">
                            {systems.map((system, index) => (
                                <Card key={index} className="overflow-hidden hover-lift">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <h3 className="text-lg font-medium">{system.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">
                                                    Uptime: {system.uptime}%
                                                </span>
                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="h-4 w-4"
                                                            >
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                                            </svg>
                                                        </Button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-80">
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-semibold">
                                                                {system.name} Status History
                                                            </h4>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs">Last 24 hours</span>
                                                                    <span className="text-xs font-medium">
                                                                        {system.uptime}%
                                                                    </span>
                                                                </div>
                                                                <Progress value={system.uptime} className="h-1" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs">Last 7 days</span>
                                                                    <span className="text-xs font-medium">
                                                                        {system.uptime - 0.01}%
                                                                    </span>
                                                                </div>
                                                                <Progress
                                                                    value={system.uptime - 0.01}
                                                                    className="h-1"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs">Last 30 days</span>
                                                                    <span className="text-xs font-medium">
                                                                        {system.uptime - 0.02}%
                                                                    </span>
                                                                </div>
                                                                <Progress
                                                                    value={system.uptime - 0.02}
                                                                    className="h-1"
                                                                />
                                                            </div>
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Incidents Section */}
                <section className="py-16 md:py-24 relative">
                    <div className="container relative z-10">
                        <div className="text-center mb-12 animate-fade-in-up">
                            <h2 className="text-3xl font-bold md:text-4xl">Incident History</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Recent incidents and scheduled maintenance.
                            </p>
                        </div>

                        <Tabs defaultValue="incidents" className="max-w-4xl mx-auto animate-fade-in-up">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="incidents">Past Incidents</TabsTrigger>
                                <TabsTrigger value="scheduled">Scheduled Maintenance</TabsTrigger>
                            </TabsList>
                            <TabsContent value="incidents" className="mt-6 space-y-6">
                                {incidents
                                    .filter(i => i.status !== "scheduled")
                                    .map(incident => (
                                        <Card key={incident.id} className="overflow-hidden">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg">{incident.title}</CardTitle>
                                                    <Badge
                                                        variant={
                                                            incident.status === "resolved" ? "outline" : "destructive"
                                                        }
                                                    >
                                                        {incident.status === "resolved" ? (
                                                            <CheckCircle className="mr-1 h-3 w-3" />
                                                        ) : (
                                                            <AlertTriangle className="mr-1 h-3 w-3" />
                                                        )}
                                                        {incident.status.charAt(0).toUpperCase() +
                                                            incident.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <CardDescription>{incident.date}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {incident.updates.map((update, index) => (
                                                        <div key={index} className="border-l-2 border-muted pl-4 py-1">
                                                            <div className="text-sm font-medium">{update.time}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {update.message}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                {incidents.filter(i => i.status !== "scheduled").length === 0 && (
                                    <div className="text-center py-12">
                                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No incidents reported</h3>
                                        <p className="text-muted-foreground">
                                            All systems have been operating normally.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="scheduled" className="mt-6 space-y-6">
                                {incidents
                                    .filter(i => i.status === "scheduled")
                                    .map(incident => (
                                        <Card key={incident.id} className="overflow-hidden">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg">{incident.title}</CardTitle>
                                                    <Badge variant="secondary">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        Scheduled
                                                    </Badge>
                                                </div>
                                                <CardDescription>{incident.date}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {incident.updates.map((update, index) => (
                                                        <div key={index} className="border-l-2 border-muted pl-4 py-1">
                                                            <div className="text-sm font-medium">{update.time}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {update.message}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                {incidents.filter(i => i.status === "scheduled").length === 0 && (
                                    <div className="text-center py-12">
                                        <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No scheduled maintenance</h3>
                                        <p className="text-muted-foreground">
                                            There are no upcoming maintenance windows planned.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>

                {/* Subscribe Section */}
                <section className="py-16 md:py-24 bg-muted/50 relative overflow-hidden">
                    <div className="container relative z-10">
                        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
                            <h2 className="text-3xl font-bold md:text-4xl mb-6">Stay Updated</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Subscribe to receive notifications about system status and incidents.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="group" asChild>
                                    <Link href="https://discord.gg/Gobot">
                                        <svg
                                            className="mr-2 h-4 w-4"
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fab"
                                            data-icon="discord"
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 640 512"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"
                                            ></path>
                                        </svg>
                                        Join our Discord
                                    </Link>
                                </Button>
                                <Button variant="outline" className="group" asChild>
                                    <Link href="/status/subscribe">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-2 h-4 w-4"
                                        >
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                        Email Notifications
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
