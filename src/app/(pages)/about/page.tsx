import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
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
                                ABOUT Gobot
                            </Badge>
                            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-6 animate-slide-in">
                                The Story Behind Gobot
                            </h1>
                            <p className="text-xl text-muted-foreground animate-slide-in animation-delay-500">
                                Gobot was created with a simple mission: to provide Discord server owners with the most
                                powerful, customizable, and user-friendly bot experience possible.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 md:py-24 bg-muted/50 relative overflow-hidden">
                    <div className="container relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6 animate-fade-in-up">
                                <h2 className="text-3xl font-bold">Our Mission</h2>
                                <p className="text-lg text-muted-foreground">
                                    At Gobot, we believe that Discord communities should have access to powerful tools
                                    without complicated setup or premium paywalls. Our mission is to empower server
                                    owners with everything they need to create engaging, safe, and thriving communities.
                                </p>
                                <p className="text-lg text-muted-foreground">
                                    {`We're committed to continuous improvement, listening to our users, and implementing features that make`}
                                    a real difference in how Discord communities operate.
                                </p>
                            </div>
                            <div className="relative h-[300px] animate-float-slow">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-48 h-48 bg-blue-500/30 rounded-full flex items-center justify-center">
                                            <div className="w-32 h-32 bg-blue-500/40 rounded-full flex items-center justify-center">
                                                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="w-10 h-10"
                                                    >
                                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 md:py-24 relative">
                    <div className="container relative z-10">
                        <div className="text-center mb-12 animate-fade-in-up">
                            <Badge variant="outline" className="mb-4">
                                THE TEAM
                            </Badge>
                            <h2 className="text-3xl font-bold md:text-4xl">Meet the people behind Gobot</h2>
                            <p className="mt-4 text-xl text-muted-foreground">
                                Our dedicated team works tirelessly to make Gobot the best Discord bot available.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
                            {[
                                {
                                    name: "Alex Johnson",
                                    role: "Founder & Lead Developer",
                                    avatar: "/placeholder.svg?height=100&width=100",
                                    delay: "0"
                                },
                                {
                                    name: "Sam Rodriguez",
                                    role: "Backend Engineer",
                                    avatar: "/placeholder.svg?height=100&width=100",
                                    delay: "100"
                                },
                                {
                                    name: "Taylor Kim",
                                    role: "UI/UX Designer",
                                    avatar: "/placeholder.svg?height=100&width=100",
                                    delay: "200"
                                },
                                {
                                    name: "Jordan Patel",
                                    role: "Community Manager",
                                    avatar: "/placeholder.svg?height=100&width=100",
                                    delay: "300"
                                }
                            ].map((member, index) => (
                                <Card
                                    key={index}
                                    className={`hover-lift animate-fade-in-up animation-delay-${member.delay}`}
                                >
                                    <CardHeader className="text-center pb-2">
                                        <Avatar className="w-24 h-24 mx-auto mb-4">
                                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <CardTitle>{member.name}</CardTitle>
                                        <CardDescription>{member.role}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <div className="flex justify-center space-x-4">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
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
                                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                    <rect x="2" y="9" width="4" height="12"></rect>
                                                    <circle cx="4" cy="4" r="2"></circle>
                                                </svg>
                                                <span className="sr-only">LinkedIn</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
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
                                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                                </svg>
                                                <span className="sr-only">GitHub</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
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
                                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                                </svg>
                                                <span className="sr-only">Twitter</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 md:py-24 bg-muted/50 relative overflow-hidden">
                    <div className="container relative z-10">
                        <div className="text-center mb-12 animate-fade-in-up">
                            <Badge variant="outline" className="mb-4">
                                FAQ
                            </Badge>
                            <h2 className="text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
                            <p className="mt-4 text-xl text-muted-foreground">
                                Everything you need to know about Gobot.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto animate-fade-in-up">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Is Gobot really free?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes! Gobot is completely free to use with all core features available to
                                        everyone. We believe in providing powerful tools without paywalls.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>How do I add Gobot to my server?</AccordionTrigger>
                                    <AccordionContent>
                                        {` Adding Gobot is simple! Just click the "Add to Discord" button on our homepage, authorize the bot`}
                                        with your Discord account, and select the server you want to add it to.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>What permissions does Gobot need?</AccordionTrigger>
                                    <AccordionContent>
                                        {`Gobot requires certain permissions to function properly, such as "Read Messages," "Send
                                        Messages," and "Manage Roles" for role management features. You can review all permissions during`}
                                        the bot installation process.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>How can I customize Gobot for my server?</AccordionTrigger>
                                    <AccordionContent>
                                        After adding Gobot to your server, you can access the dashboard to customize all
                                        aspects of the bot, including prefix, welcome messages, auto-roles, moderation
                                        settings, and more.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger>
                                        Is there a limit to how many servers can use Gobot?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {`No, there's no limit! Gobot can be added to as many servers as you manage, and each server can`}
                                        have its own unique configuration.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-6">
                                    <AccordionTrigger>How do I report issues or suggest features?</AccordionTrigger>
                                    <AccordionContent>
                                        You can report issues or suggest features through our support server on Discord
                                        or by using the contact form on our website. We value community feedback and
                                        actively implement suggested improvements.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
                    <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.2)_0%,_transparent_70%)]"></div>
                    </div>
                    <div className="container relative z-10 text-center">
                        <h2 className="text-3xl font-bold md:text-4xl mb-6 animate-fade-in">
                            Ready to enhance your Discord server?
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-500">
                            Join thousands of servers already using Gobot to improve their Discord experience.
                        </p>
                        <Button size="lg" variant="secondary" className="animate-fade-in animation-delay-1000" asChild>
                            <Link href="/auth/login">Add to Discord</Link>
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    );
}
