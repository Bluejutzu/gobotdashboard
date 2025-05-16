"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// List of all demo pages
const demoPages = [
    {
        name: "Theme Category Demo",
        path: "/theme-cat-demo",
        description: "A demo showcasing theme category functionality"
    },
    {
        name: "Theme EI Demo",
        path: "/theme-ei-demo",
        description: "A demo showcasing theme EI features"
    },
    {
        name: "Codeblock Demo",
        path: "/codeblock-demo",
        description: "A demo showcasing codeblock functionality"
    },
    {
        name: "Custom Themes V2",
        path: "/custom-themesv2",
        description: "The latest version of custom themes"
    },
    {
        name: "Pricing Demo",
        path: "/pricing-demo",
        description: "A demo showcasing pricing features"
    },
    {
        name: "Error Demo",
        path: "/error-demo",
        description: "A demo showcasing error handling"
    }
]

export default function DemoListPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Demo Pages</h1>
                <p className="text-muted-foreground">
                    Explore all available demo pages and their features
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoPages.map((demo) => (
                    <Card key={demo.path} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>{demo.name}</CardTitle>
                            <CardDescription>{demo.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href={demo.path} className="flex items-center justify-center gap-2">
                                    View Demo
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 