import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, MessageSquare, UserPlus, Settings, BarChart, Vote, ArrowRight, ChevronRight } from "lucide-react"
import { ToastDemo } from "@/components/ui/toast-demo"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string;
  description: string;
  color: string;
  delay?: number;
}

interface FeatureTabProps {
  value: string;
  icon: React.ReactNode;
  label: string;
}

interface FeatureTabContentProps {
  value: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  learnMoreLink: string;
  demoContent: React.ReactNode;
}

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
            <div className="absolute -top-20 -left-20 h-[40rem] w-[40rem] rounded-full bg-primary/5 animate-blob will-change-transform"></div>
            <div className="absolute top-40 -right-20 h-[35rem] w-[35rem] rounded-full bg-blue-500/5 animate-blob animation-delay-2000 will-change-transform"></div>
            <div className="absolute -bottom-40 left-20 h-[30rem] w-[30rem] rounded-full bg-indigo-500/5 animate-blob animation-delay-4000 will-change-transform"></div>
          </div>

          {/* Floating elements with improved animations */}
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-500/10 rounded-full animate-float-rotate animation-delay-1000 will-change-transform"></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-indigo-500/10 rounded-full animate-float animation-delay-2000 will-change-transform"></div>
          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-primary/10 rounded-full animate-float-reverse animation-delay-3000 will-change-transform"></div>
          <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-blue-500/10 rounded-full animate-float animation-delay-4000 will-change-transform"></div>

          <div className="container relative z-10">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
              <div className="space-y-8 animate-fade-in will-change-transform">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-md flex items-center justify-center animate-pulse-shadow will-change-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-10 h-10 text-white animate-pulse-slow will-change-transform"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className="mb-2 animate-scale-in animation-delay-500 will-change-transform"
                    >
                      Next-Gen Discord Bot
                    </Badge>
                    <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl animate-slide-in will-change-transform">
                      Gobot
                    </h1>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xl md:text-2xl text-muted-foreground animate-slide-in animation-delay-1000 will-change-transform">
                    Multi-purpose Discord Bot.
                  </p>
                  <p className="text-xl md:text-2xl text-muted-foreground animate-slide-in animation-delay-1500 will-change-transform">
                    Fully customizable.
                  </p>
                  <p className="text-xl md:text-2xl text-muted-foreground animate-slide-in animation-delay-2000 will-change-transform">
                    Completely free.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-2500 will-change-transform">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden animate-pulse-shadow transition-all duration-300 hover:scale-105 will-change-transform"
                    asChild
                  >
                    <Link href="/auth/login">
                      <span className="relative z-10">Add to Discord</span>
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                      <span className="absolute inset-0 w-full h-full animate-shine"></span>
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
                    asChild
                  >
                    <Link href="/features">
                      <span className="relative z-10">Explore features</span>
                      <span className="absolute inset-0 bg-primary/10 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px]">
                {/* Floating elements with improved animations */}
                <div
                  className="absolute w-32 h-32 bg-blue-500/20 rounded-2xl -top-10 right-20 animate-float-rotate will-change-transform"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="absolute w-24 h-24 bg-blue-500/30 rounded-2xl top-40 right-10 animate-float will-change-transform"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute w-16 h-16 bg-blue-500/40 rounded-2xl top-20 right-40 animate-float-reverse will-change-transform"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute w-20 h-20 bg-blue-500/20 rounded-2xl top-60 right-60 animate-float will-change-transform"
                  style={{ animationDelay: "1.5s" }}
                ></div>

                {/* Additional floating elements */}
                <div
                  className="absolute w-28 h-28 bg-indigo-500/20 rounded-full top-10 left-20 animate-float-rotate will-change-transform"
                  style={{ animationDelay: "2.5s" }}
                ></div>
                <div
                  className="absolute w-14 h-14 bg-indigo-500/30 rounded-full top-60 left-10 animate-float will-change-transform"
                  style={{ animationDelay: "3s" }}
                ></div>
                <div
                  className="absolute w-10 h-10 bg-primary/40 rounded-full top-30 left-40 animate-float-reverse will-change-transform"
                  style={{ animationDelay: "3.5s" }}
                ></div>

                {/* Discord-like interface mockup with enhanced animations */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[350px] bg-background border rounded-lg shadow-xl overflow-hidden animate-float-slow animate-pulse-shadow will-change-transform">
                  <div className="h-12 bg-muted flex items-center px-4 border-b">
                    <div className="w-6 h-6 bg-blue-500 rounded-full mr-2 animate-pulse-slow"></div>
                    <div className="font-medium">Gobot Bot</div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-2 animate-slide-in-left animation-delay-1000 will-change-transform">
                      <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0"></div>
                      <div className="bg-muted rounded-lg p-2 text-sm">!help</div>
                    </div>
                    <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-2000 will-change-transform">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
                        G
                      </div>
                      <div className="bg-primary/10 rounded-lg p-2 text-sm max-w-[200px]">
                        <div className="font-medium text-primary mb-1">Gobot Help</div>
                        <div className="text-xs">
                          Available commands:
                          <ul className="list-disc pl-4 mt-1 space-y-1">
                            <li className="animate-fade-in animation-delay-2500 will-change-transform">
                              !ban - Ban a user
                            </li>
                            <li className="animate-fade-in animation-delay-3000 will-change-transform">
                              !kick - Kick a user
                            </li>
                            <li className="animate-fade-in animation-delay-3500 will-change-transform">
                              !mute - Mute a user
                            </li>
                            <li className="animate-fade-in animation-delay-4000 will-change-transform">
                              !poll - Create a poll
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave SVG with animation */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
              <path
                fill="currentColor"
                fillOpacity="0.1"
                d="M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,133.3C672,128,768,96,864,106.7C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                className="animate-wave will-change-transform"
              ></path>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-muted/50 relative overflow-hidden">
          <div className="container relative z-10">
            <div className="text-center mb-12 animate-fade-in-up will-change-transform">
              <Badge variant="outline" className="mb-4 animate-scale-in will-change-transform">
                TRUSTED WORLDWIDE
              </Badge>
              <h2 className="text-3xl font-bold md:text-4xl">Trusted by your favorite servers.</h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Gobot is in over <span className="font-bold">866,600 servers</span>, reaching more than{" "}
                <span className="font-bold">297.3 million users</span>.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <StatCard title="866,600+" description="Discord Servers" color="blue-500" delay={500} />
              <StatCard title="297.3M+" description="Discord Users" color="indigo-500" delay={1000} />
              <StatCard title="99.9%" description="Uptime" color="primary" delay={1500} />
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
              <div className="flex justify-center mb-8 overflow-x-auto pb-2 scrollbar-thin">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full max-w-3xl">
                  <FeatureTab value="moderation" icon={<Shield className="h-5 w-5" />} label="Moderation" />
                  <FeatureTab value="commands" icon={<MessageSquare className="h-5 w-5" />} label="Commands" />
                  <FeatureTab value="welcome" icon={<UserPlus className="h-5 w-5" />} label="Welcome" />
                  <FeatureTab value="roles" icon={<Settings className="h-5 w-5" />} label="Roles" />
                  <FeatureTab value="polls" icon={<Vote className="h-5 w-5" />} label="Polls" />
                  <FeatureTab value="analytics" icon={<BarChart className="h-5 w-5" />} label="Analytics" />
                </TabsList>
              </div>

              <FeatureTabContent
                value="moderation"
                title="Advanced Moderation"
                description="Keep your server safe with powerful moderation tools. Ban, kick, mute, and warn users with ease."
                features={[
                  "Auto-moderation for spam and inappropriate content",
                  "Customizable word filters and link detection",
                  "Detailed moderation logs and history",
                ]}
                icon={<Shield className="h-5 w-5 text-primary" />}
                learnMoreLink="/features/moderation"
                demoContent={<ModDemoContent />}
              />

              <FeatureTabContent
                value="commands"
                title="Custom Commands"
                description="Create custom commands for your server's unique needs. No coding required."
                features={[
                  "Easy-to-use command creator",
                  "Support for text, embeds, and reactions",
                  "Command usage analytics",
                ]}
                icon={<MessageSquare className="h-5 w-5 text-primary" />}
                learnMoreLink="/features/commands"
                demoContent={<CommandsDemoContent />}
              />

              <FeatureTabContent
                value="welcome"
                title="Welcome Messages"
                description="Greet new members with customizable welcome messages and images."
                features={[
                  "Customizable text and embed welcome messages",
                  "Dynamic variables for personalization",
                  "Optional DM welcomes",
                ]}
                icon={<UserPlus className="h-5 w-5 text-primary" />}
                learnMoreLink="/features/welcome"
                demoContent={<WelcomeDemoContent />}
              />

              <FeatureTabContent
                value="roles"
                title="Role Management"
                description="Automatically assign roles to new members and manage role assignments."
                features={[
                  "Auto-role assignment for new members",
                  "Reaction roles for self-assignment",
                  "Level-based role progression",
                ]}
                icon={<Settings className="h-5 w-5 text-primary" />}
                learnMoreLink="/features/roles"
                demoContent={<RolesDemoContent />}
              />

              <FeatureTabContent
                value="polls"
                title="Interactive Polls"
                description="Create polls and let your members vote on decisions."
                features={[
                  "Multiple choice polls with reactions",
                  "Timed polls with automatic results",
                  "Poll analytics and result visualization",
                ]}
                icon={<Vote className="h-5 w-5 text-primary" />}
                learnMoreLink="/features/polls"
                demoContent={<PollsDemoContent />}
              />

              <FeatureTabContent
                value="analytics"
                title="Detailed Analytics"
                description="Track your server's activity and growth with detailed analytics."
                features={["Member growth and activity tracking", "Channel usage statistics", "Command usage insights"]}
                icon={<BarChart className="h-5 w-5 text-primary" />}
                learnMoreLink="/features/analytics"
                demoContent={<AnalyticsDemoContent />}
              />
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.2)_0%,_transparent_70%)]"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_70%,_rgba(255,255,255,0.2)_0%,_transparent_60%)]"></div>
          </div>
          <div className="container relative z-10 text-center">
            <h2 className="text-3xl font-bold md:text-4xl mb-6 animate-fade-in will-change-transform">
              Ready to enhance your Discord server?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-500 will-change-transform">
              Join thousands of servers already using Gobot to improve their Discord experience.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="animate-fade-in animation-delay-1000 relative overflow-hidden group will-change-transform animate-pulse-shadow transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/auth/login">
                <span className="relative z-10 flex items-center">
                  Add to Discord
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 w-full h-full animate-shine"></span>
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

// Reusable components for better organization

function StatCard({ title, description, color, delay = 0 }: StatCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden animate-fade-in-up hover:shadow-lg transition-all duration-500 hover:translate-y-[-5px]",
        delay ? `animation-delay-${delay}` : "",
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-4xl font-bold animate-scale-in will-change-transform">
          <span className="inline-block animate-count-up" data-value={title}>
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardContent>
      <div className={`h-2 bg-${color} animate-shine will-change-transform`}></div>
    </Card>
  )
}

function FeatureTab({ value, icon, label }: FeatureTabProps) {
  return (
    <TabsTrigger
      value={value}
      className="flex flex-col items-center gap-1 py-2 transition-all duration-300 data-[state=active]:scale-105"
    >
      <div className="transition-transform duration-300 data-[state=active]:scale-110">{icon}</div>
      <span className="text-xs">{label}</span>
    </TabsTrigger>
  )
}

function FeatureTabContent({ value, title, description, features, icon, learnMoreLink, demoContent }: FeatureTabContentProps) {
  return (
    <TabsContent value={value} className="animate-fade-in will-change-transform">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2 animate-slide-in-left"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {icon}
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button className="mt-4 group" asChild>
            <Link href={learnMoreLink}>
              <span>Learn more</span>
              <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="bg-muted rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
          {demoContent}
        </div>
      </div>
    </TabsContent>
  )
}

// Demo content components for each feature tab

function ModDemoContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 animate-slide-in-left animation-delay-300 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex-shrink-0"></div>
        <div className="bg-background rounded-lg p-2 text-sm">!ban @user Spamming</div>
      </div>
      <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-600 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
          G
        </div>
        <div className="bg-primary/10 rounded-lg p-2 text-sm">
          <div className="font-medium text-primary mb-1">Moderation</div>
          <div className="text-xs">
            User has been banned from the server.
            <div className="mt-1 p-2 border rounded bg-background/50 animate-fade-in animation-delay-900 will-change-transform">
              <div className="text-xs font-medium">Ban Information</div>
              <div className="text-xs">User: @user</div>
              <div className="text-xs">Reason: Spamming</div>
              <div className="text-xs">Moderator: @admin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CommandsDemoContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 animate-slide-in-left animation-delay-300 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex-shrink-0"></div>
        <div className="bg-background rounded-lg p-2 text-sm">!createcommand rules Shows the server rules</div>
      </div>
      <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-600 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
          G
        </div>
        <div className="bg-primary/10 rounded-lg p-2 text-sm">
          <div className="font-medium text-primary mb-1">Command Creator</div>
          <div className="text-xs">
            {`Custom command "rules" has been created!`}
            <div className="mt-1 p-2 border rounded bg-background/50 animate-fade-in animation-delay-900 will-change-transform">
              <div className="text-xs font-medium">Command Details</div>
              <div className="text-xs">Trigger: !rules</div>
              <div className="text-xs">Response: Shows the server rules</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WelcomeDemoContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-300 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
          G
        </div>
        <div className="bg-primary/10 rounded-lg p-2 text-sm">
          <div className="font-medium text-primary mb-1">Welcome</div>
          <div className="text-xs">
            <div className="p-2 border rounded bg-background/50 animate-pulse-slow will-change-transform">
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
  )
}

function RolesDemoContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 animate-slide-in-left animation-delay-300 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex-shrink-0"></div>
        <div className="bg-background rounded-lg p-2 text-sm">!autorole Member</div>
      </div>
      <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-600 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
          G
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
  )
}

function PollsDemoContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 animate-slide-in-left animation-delay-300 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex-shrink-0"></div>
        <div className="bg-background rounded-lg p-2 text-sm">
          {`!poll "What game should we play tonight?" "Minecraft" "Fortnite" "Among Us"`}
        </div>
      </div>
      <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-600 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
          G
        </div>
        <div className="bg-primary/10 rounded-lg p-2 text-sm">
          <div className="font-medium text-primary mb-1">Poll</div>
          <div className="text-xs">
            <div className="p-2 border rounded bg-background/50">
              <div className="text-xs font-medium">What game should we play tonight?</div>
              <div className="text-xs mt-1 flex items-center">
                <span className="mr-2">1️⃣</span>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span>Minecraft</span>
                    <span className="ml-auto">(3 votes)</span>
                  </div>
                  <div
                    className="h-1.5 bg-blue-500 rounded-full mt-1 animate-grow-width"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <div className="text-xs mt-1 flex items-center">
                <span className="mr-2">2️⃣</span>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span>Fortnite</span>
                    <span className="ml-auto">(1 vote)</span>
                  </div>
                  <div
                    className="h-1.5 bg-blue-500 rounded-full mt-1 animate-grow-width animation-delay-300"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
              <div className="text-xs mt-1 flex items-center">
                <span className="mr-2">3️⃣</span>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span>Among Us</span>
                    <span className="ml-auto">(5 votes)</span>
                  </div>
                  <div
                    className="h-1.5 bg-blue-500 rounded-full mt-1 animate-grow-width animation-delay-600"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsDemoContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 animate-slide-in-left animation-delay-300 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex-shrink-0"></div>
        <div className="bg-background rounded-lg p-2 text-sm">!analytics</div>
      </div>
      <div className="flex items-start gap-2 flex-row-reverse animate-slide-in-right animation-delay-600 will-change-transform">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
          G
        </div>
        <div className="bg-primary/10 rounded-lg p-2 text-sm">
          <div className="font-medium text-primary mb-1">Server Analytics</div>
          <div className="text-xs">
            <div className="p-2 border rounded bg-background/50">
              <div className="text-xs font-medium">Server Growth</div>
              <div className="text-xs mt-2">
                <div className="flex items-center justify-between">
                  <span>New members:</span>
                  <span className="font-medium text-green-500">+24 this week</span>
                </div>
                <div className="h-1.5 bg-green-500 rounded-full mt-1 animate-grow-width" style={{ width: "70%" }}></div>
              </div>
              <div className="text-xs mt-2">
                <div className="flex items-center justify-between">
                  <span>Active users:</span>
                  <span className="font-medium text-blue-500">156 (↑12%)</span>
                </div>
                <div
                  className="h-1.5 bg-blue-500 rounded-full mt-1 animate-grow-width animation-delay-300"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <div className="text-xs mt-2">
                <div className="flex items-center justify-between">
                  <span>Messages:</span>
                  <span className="font-medium text-indigo-500">1,245 (↑8%)</span>
                </div>
                <div
                  className="h-1.5 bg-indigo-500 rounded-full mt-1 animate-grow-width animation-delay-600"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
