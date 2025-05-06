import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, MessageSquare, UserPlus, Settings, BarChart, Vote, ArrowRight } from "lucide-react"
import { ToastDemo } from "@/components/ui/toast-demo"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Welcome Toast */}
        <ToastDemo
          title="Welcome to Gobot!"
          description="Explore our powerful Discord bot features."
          autoShow={true}
          delay={1500}
          action={
            <Button variant="outline" size="sm" asChild>
              <Link href="/features">Explore</Link>
            </Button>
          }
        />

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
          <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-blue-500/10 rounded-full animate-float animation-delay-4000"></div>

          <div className="container relative z-10">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-md flex items-center justify-center animate-pulse-slow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-10 h-10 text-white"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2 animate-slide-in animation-delay-500">
                      Next-Gen Discord Bot
                    </Badge>
                    <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl animate-slide-in">Gobot</h1>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xl md:text-2xl text-muted-foreground animate-slide-in animation-delay-1000">
                    Multi-purpose Discord Bot.
                  </p>
                  <p className="text-xl md:text-2xl text-muted-foreground animate-slide-in animation-delay-1500">
                    Fully customizable.
                  </p>
                  <p className="text-xl md:text-2xl text-muted-foreground animate-slide-in animation-delay-2000">
                    Completely free.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-2500">
                  <Button size="lg" className="group relative overflow-hidden" asChild>
                    <Link href="/auth/login">
                      Add to Discord
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="group" asChild>
                    <Link href="/features">
                      <span className="relative z-10">Explore features</span>
                      <span className="absolute inset-0 bg-primary/10 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px]">
                {/* Floating elements */}
                <div
                  className="absolute w-32 h-32 bg-blue-500/20 rounded-2xl -top-10 right-20 animate-float"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="absolute w-24 h-24 bg-blue-500/30 rounded-2xl top-40 right-10 animate-float"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute w-16 h-16 bg-blue-500/40 rounded-2xl top-20 right-40 animate-float"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute w-20 h-20 bg-blue-500/20 rounded-2xl top-60 right-60 animate-float"
                  style={{ animationDelay: "1.5s" }}
                ></div>

                {/* Additional floating elements */}
                <div
                  className="absolute w-28 h-28 bg-indigo-500/20 rounded-full top-10 left-20 animate-float"
                  style={{ animationDelay: "2.5s" }}
                ></div>
                <div
                  className="absolute w-14 h-14 bg-indigo-500/30 rounded-full top-60 left-10 animate-float"
                  style={{ animationDelay: "3s" }}
                ></div>
                <div
                  className="absolute w-10 h-10 bg-primary/40 rounded-full top-30 left-40 animate-float"
                  style={{ animationDelay: "3.5s" }}
                ></div>

                {/* Discord-like interface mockup */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[350px] bg-background border rounded-lg shadow-xl overflow-hidden animate-float-slow">
                  <div className="h-12 bg-muted flex items-center px-4 border-b">
                    <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                    <div className="font-medium">Gobot Bot</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0"></div>
                      <div className="bg-muted rounded-lg p-2 text-sm">!help</div>
                    </div>
                    <div className="flex items-start gap-2 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
                        S
                      </div>
                      <div className="bg-primary/10 rounded-lg p-2 text-sm max-w-[200px]">
                        <div className="font-medium text-primary mb-1">Gobot Help</div>
                        <div className="text-xs">
                          Available commands:
                          <ul className="list-disc pl-4 mt-1 space-y-1">
                            <li>!ban - Ban a user</li>
                            <li>!kick - Kick a user</li>
                            <li>!mute - Mute a user</li>
                            <li>!poll - Create a poll</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave SVG */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
              <path
                fill="currentColor"
                fillOpacity="0.1"
                d="M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,133.3C672,128,768,96,864,106.7C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-muted/50 relative overflow-hidden">
          <div className="container relative z-10">
            <div className="text-center mb-12 animate-fade-in-up">
              <Badge variant="outline" className="mb-4">
                TRUSTED WORLDWIDE
              </Badge>
              <h2 className="text-3xl font-bold md:text-4xl">Trusted by your favorite servers.</h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Gobot is in over <span className="font-bold">866,600 servers</span>, reaching more than{" "}
                <span className="font-bold">297.3 million users</span>.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="overflow-hidden animate-fade-in-up animation-delay-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold">866,600+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">Discord Servers</CardDescription>
                </CardContent>
                <div className="h-2 bg-blue-500"></div>
              </Card>
              <Card className="overflow-hidden animate-fade-in-up animation-delay-1000">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold">297.3M+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">Discord Users</CardDescription>
                </CardContent>
                <div className="h-2 bg-indigo-500"></div>
              </Card>
              <Card className="overflow-hidden animate-fade-in-up animation-delay-1500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold">99.9%</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">Uptime</CardDescription>
                </CardContent>
                <div className="h-2 bg-primary"></div>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container relative z-10">
            <div className="text-center mb-12 animate-fade-in-up">
              <Badge variant="outline" className="mb-4">
                POWERFUL FEATURES
              </Badge>
              <h2 className="text-3xl font-bold md:text-4xl">Everything you need</h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Comprehensive tools to manage and enhance your Discord server.
              </p>
            </div>

            <Tabs defaultValue="moderation" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full max-w-3xl">
                  <TabsTrigger value="moderation" className="flex flex-col items-center gap-1 py-2">
                    <Shield className="h-5 w-5" />
                    <span className="text-xs">Moderation</span>
                  </TabsTrigger>
                  <TabsTrigger value="commands" className="flex flex-col items-center gap-1 py-2">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">Commands</span>
                  </TabsTrigger>
                  <TabsTrigger value="welcome" className="flex flex-col items-center gap-1 py-2">
                    <UserPlus className="h-5 w-5" />
                    <span className="text-xs">Welcome</span>
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="flex flex-col items-center gap-1 py-2">
                    <Settings className="h-5 w-5" />
                    <span className="text-xs">Roles</span>
                  </TabsTrigger>
                  <TabsTrigger value="polls" className="flex flex-col items-center gap-1 py-2">
                    <Vote className="h-5 w-5" />
                    <span className="text-xs">Polls</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex flex-col items-center gap-1 py-2">
                    <BarChart className="h-5 w-5" />
                    <span className="text-xs">Analytics</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="moderation" className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Advanced Moderation</h3>
                    <p className="text-muted-foreground">
                      Keep your server safe with powerful moderation tools. Ban, kick, mute, and warn users with ease.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>Auto-moderation for spam and inappropriate content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>Customizable word filters and link detection</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>Detailed moderation logs and history</span>
                      </li>
                    </ul>
                    <Button className="mt-4" asChild>
                      <Link href="/features/moderation">Learn more</Link>
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex-shrink-0"></div>
                        <div className="bg-background rounded-lg p-2 text-sm">!ban @user Spamming</div>
                      </div>
                      <div className="flex items-start gap-2 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
                          S
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2 text-sm">
                          <div className="font-medium text-primary mb-1">Moderation</div>
                          <div className="text-xs">
                            User has been banned from the server.
                            <div className="mt-1 p-2 border rounded bg-background/50">
                              <div className="text-xs font-medium">Ban Information</div>
                              <div className="text-xs">User: @user</div>
                              <div className="text-xs">Reason: Spamming</div>
                              <div className="text-xs">Moderator: @admin</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="commands" className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Custom Commands</h3>
                    <p className="text-muted-foreground">
                      {`Create custom commands for your server's unique needs. No coding required.`}
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span>Easy-to-use command creator</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span>Support for text, embeds, and reactions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span>Command usage analytics</span>
                      </li>
                    </ul>
                    <Button className="mt-4" asChild>
                      <Link href="/features/commands">Learn more</Link>
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex-shrink-0"></div>
                        <div className="bg-background rounded-lg p-2 text-sm">
                          !createcommand rules Shows the server rules
                        </div>
                      </div>
                      <div className="flex items-start gap-2 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
                          S
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2 text-sm">
                          <div className="font-medium text-primary mb-1">Command Creator</div>
                          <div className="text-xs">
                            {` Custom command "rules" has been created!`}
                            <div className="mt-1 p-2 border rounded bg-background/50">
                              <div className="text-xs font-medium">Command Details</div>
                              <div className="text-xs">Trigger: !rules</div>
                              <div className="text-xs">Response: Shows the server rules</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="welcome" className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Welcome Messages</h3>
                    <p className="text-muted-foreground">
                      Greet new members with customizable welcome messages and images.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        <span>Customizable text and embed welcome messages</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        <span>Dynamic variables for personalization</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        <span>Optional DM welcomes</span>
                      </li>
                    </ul>
                    <Button className="mt-4" asChild>
                      <Link href="/features/welcome">Learn more</Link>
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
                          S
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2 text-sm">
                          <div className="font-medium text-primary mb-1">Welcome</div>
                          <div className="text-xs">
                            <div className="p-2 border rounded bg-background/50">
                              <div className="text-xs font-medium">Welcome to the server, @newuser!</div>
                              <div className="text-xs mt-1">
                                Please check out our rules in #rules and introduce yourself in #introductions.
                              </div>
                              <div className="text-xs mt-1">You are member #1,234</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="roles" className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Role Management</h3>
                    <p className="text-muted-foreground">
                      Automatically assign roles to new members and manage role assignments.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        <span>Auto-role assignment for new members</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        <span>Reaction roles for self-assignment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        <span>Level-based role progression</span>
                      </li>
                    </ul>
                    <Button className="mt-4" asChild>
                      <Link href="/features/roles">Learn more</Link>
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex-shrink-0"></div>
                        <div className="bg-background rounded-lg p-2 text-sm">!autorole Member</div>
                      </div>
                      <div className="flex items-start gap-2 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
                          S
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2 text-sm">
                          <div className="font-medium text-primary mb-1">Auto Role</div>
                          <div className="text-xs">
                            {` Auto role has been set to "Member". New members will automatically receive this role when`}
                            they join.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="polls" className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Interactive Polls</h3>
                    <p className="text-muted-foreground">Create polls and let your members vote on decisions.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Vote className="h-5 w-5 text-primary" />
                        <span>Multiple choice polls with reactions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Vote className="h-5 w-5 text-primary" />
                        <span>Timed polls with automatic results</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Vote className="h-5 w-5 text-primary" />
                        <span>Poll analytics and result visualization</span>
                      </li>
                    </ul>
                    <Button className="mt-4" asChild>
                      <Link href="/features/polls">Learn more</Link>
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex-shrink-0"></div>
                        <div className="bg-background rounded-lg p-2 text-sm">
                          {` !poll "What game should we play tonight?" "Minecraft" "Fortnite" "Among Us"`}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
                          S
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2 text-sm">
                          <div className="font-medium text-primary mb-1">Poll</div>
                          <div className="text-xs">
                            <div className="p-2 border rounded bg-background/50">
                              <div className="text-xs font-medium">What game should we play tonight?</div>
                              <div className="text-xs mt-1">1️⃣ Minecraft (3 votes)</div>
                              <div className="text-xs">2️⃣ Fortnite (1 vote)</div>
                              <div className="text-xs">3️⃣ Among Us (5 votes)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Detailed Analytics</h3>
                    <p className="text-muted-foreground">
                      {` Track your server's activity and growth with detailed analytics.`}
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        <span>Member growth and activity tracking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        <span>Channel usage statistics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        <span>Command usage insights</span>
                      </li>
                    </ul>
                    <Button className="mt-4" asChild>
                      <Link href="/features/analytics">Learn more</Link>
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex-shrink-0"></div>
                        <div className="bg-background rounded-lg p-2 text-sm">!analytics</div>
                      </div>
                      <div className="flex items-start gap-2 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
                          S
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2 text-sm">
                          <div className="font-medium text-primary mb-1">Server Analytics</div>
                          <div className="text-xs">
                            <div className="p-2 border rounded bg-background/50">
                              <div className="text-xs font-medium">Server Growth</div>
                              <div className="text-xs mt-1">New members: +24 this week</div>
                              <div className="text-xs">Active users: 156 (↑12%)</div>
                              <div className="text-xs">Messages: 1,245 (↑8%)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
      <SiteFooter />
    </div>
  )
}
