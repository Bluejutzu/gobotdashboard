"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Bot, MessageSquare, Shield, Users } from "lucide-react"
import Link from "next/link"
import { DiscordAuthButton } from "@/components/auth/discord-auth-button"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const features = [
        {
            icon: Shield,
            title: "Moderation",
            description: "Powerful tools to keep your server safe and clean",
        },
        {
            icon: BarChart3,
            title: "Analytics",
            description: "Detailed insights about your server activity",
        },
        {
            icon: MessageSquare,
            title: "Custom Commands",
            description: "Create personalized commands for your community",
        },
        {
            icon: Users,
            title: "Role Management",
            description: "Easily manage roles and permissions",
        },
    ]

    if (!isMounted) {
        return null
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/90">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Column - Login Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto w-full max-w-md"
                    >
                        <Card className="border-2 shadow-xl">
                            <CardHeader className="text-center pb-2">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
                                >
                                    <Bot className="h-8 w-8 text-primary" />
                                </motion.div>
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                                    Welcome to Gobot
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Sign in with Discord to manage your bot and server settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full"
                                >
                                    <DiscordAuthButton />
                                </motion.div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <Separator className="w-full" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" disabled className="text-sm">
                                        {/* <svg
                                        className="mr-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg> */}
                                        {`Well there isn't anything`}
                                    </Button>
                                    <Button variant="outline" disabled className="text-sm">
                                        {/* <svg
                                        className="mr-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                    </svg> */}
                                        else to login with
                                    </Button>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4 pt-0">
                                <p className="text-xs text-center text-muted-foreground">
                                    By signing in, you agree to our{" "}
                                    <Link href="/terms" className="underline underline-offset-2 hover:text-primary">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </CardFooter>
                        </Card>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Need help?{" "}
                                <Link href="/support" className="text-primary hover:underline">
                                    Contact Support
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column - Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="hidden md:block"
                    >
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold">Unlock the full potential of your Discord server</h2>
                                <p className="text-muted-foreground mt-2">
                                    Gobot provides powerful tools to enhance your Discord experience
                                </p>
                            </div>

                            <div className="grid gap-4">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                                    >
                                        <div className="rounded-full p-2 bg-primary/10 text-primary">
                                            <feature.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{feature.title}</h3>
                                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="rounded-lg border bg-card/50 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <p className="text-sm font-medium">Trusted by 10,000+ Discord servers</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Join thousands of server owners who trust Gobot to enhance their Discord communities
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Floating Particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                {isMounted && (
                    <>
                        {[...Array(10)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-primary/5"
                                initial={{
                                    width: Math.random() * 100 + 50,
                                    height: Math.random() * 100 + 50,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, Math.random() * 20 - 10],
                                    x: [0, Math.random() * 20 - 10],
                                }}
                                transition={{
                                    duration: Math.random() * 5 + 5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}
