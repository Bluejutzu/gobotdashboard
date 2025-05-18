"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeSelector } from "@/components/themes/theme-selector"
import { ThemedButton } from "@/components/themes/themed-button"
import { ThemedCard } from "@/components/themes/themed-card"
import { ThemedBadge } from "@/components/themes/themed-badge"
import { useThemeContext } from "@/contexts/theme-context"
import { ThemeWrapper } from "@/components/themes/theme-wrapper"

export default function ThemeDemoPage() {
    const { currentTheme } = useThemeContext()
    const [activeTab, setActiveTab] = useState("tailwind")

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader className="absolute top-0 left-0 right-0 z-50 bg-transparent" />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-background py-24 md:py-32">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute -top-20 -left-20 h-[40rem] w-[40rem] rounded-full bg-primary/5 animate-blob"></div>
                        <div className="absolute top-40 -right-20 h-[35rem] w-[35rem] rounded-full bg-blue-500/5 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-40 left-20 h-[30rem] w-[30rem] rounded-full bg-indigo-500/5 animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="container relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <Badge variant="outline" className="mb-4 animate-fade-in">
                                THEMING SYSTEM
                            </Badge>
                            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl mb-6 animate-slide-in">Dynamic Theme Demo</h1>
                            <p className="text-xl text-muted-foreground animate-slide-in animation-delay-500">
                                Explore how the theming system applies across different components
                            </p>
                            <div className="mt-8">
                                <ThemeSelector />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Demo Section */}
                <section className="py-16 md:py-24 relative">
                    <div className="container relative z-10">
                        <Tabs defaultValue="tailwind" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                                <TabsTrigger value="tailwind">Tailwind Integration</TabsTrigger>
                                <TabsTrigger value="css-vars">CSS Variables</TabsTrigger>
                                <TabsTrigger value="inline">Inline Styles</TabsTrigger>
                            </TabsList>

                            <TabsContent value="tailwind" className="animate-fade-in">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Tailwind Integration</CardTitle>
                                            <CardDescription>Using Tailwind CSS with our theme variables</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-medium">Buttons</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <Button>Default Button</Button>
                                                    <Button variant="outline">Outline Button</Button>
                                                    <Button variant="ghost">Ghost Button</Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-lg font-medium">Cards</h3>
                                                <Card className="w-full max-w-sm">
                                                    <CardHeader>
                                                        <CardTitle>Card Title</CardTitle>
                                                        <CardDescription>Card description goes here</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p>This is a standard card using Tailwind classes.</p>
                                                    </CardContent>
                                                    <CardFooter>
                                                        <Button>Action</Button>
                                                    </CardFooter>
                                                </Card>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-lg font-medium">Badges</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge>Default Badge</Badge>
                                                    <Badge variant="outline">Outline Badge</Badge>
                                                    <Badge variant="secondary">Secondary Badge</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Current Theme</CardTitle>
                                            <CardDescription>Details of the currently applied theme</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium mb-1">Theme Name</h3>
                                                <p className="text-lg">{currentTheme.name}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-1">Primary Color</h3>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full border"
                                                        style={{ backgroundColor: currentTheme.primary }}
                                                    ></div>
                                                    <code className="text-sm">{currentTheme.primary}</code>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-1">Secondary Color</h3>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full border"
                                                        style={{ backgroundColor: currentTheme.secondary }}
                                                    ></div>
                                                    <code className="text-sm">{currentTheme.secondary}</code>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-1">Accent Color</h3>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full border"
                                                        style={{ backgroundColor: currentTheme.accent }}
                                                    ></div>
                                                    <code className="text-sm">{currentTheme.accent}</code>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-1">Border Radius</h3>
                                                <p className="text-lg">{currentTheme.borderRadius}px</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="css-vars" className="animate-fade-in">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>CSS Variables</CardTitle>
                                            <CardDescription>Using CSS variables for theming</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-medium">Themed Cards</h3>
                                                <ThemedCard className="p-4">
                                                    <h4 className="font-medium mb-2">Default Card</h4>
                                                    <p className="text-sm text-muted-foreground">This card uses CSS variables for styling.</p>
                                                </ThemedCard>

                                                <ThemedCard variant="outline" className="p-4 mt-4">
                                                    <h4 className="font-medium mb-2">Outline Card</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        This card has a border using the primary theme color.
                                                    </p>
                                                </ThemedCard>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-lg font-medium">Custom Elements</h3>
                                                <div
                                                    className="p-4 bg-[var(--theme-primary)] text-white"
                                                    style={{ borderRadius: "var(--theme-radius)" }}
                                                >
                                                    <p>This element uses CSS variables directly in the className and style.</p>
                                                </div>

                                                <div
                                                    className="p-4 mt-4 border border-[var(--theme-accent)]"
                                                    style={{ borderRadius: "var(--theme-radius)" }}
                                                >
                                                    <p style={{ color: "var(--theme-accent)" }}>Another example with border and text color.</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>CSS Variables Usage</CardTitle>
                                            <CardDescription>How to use CSS variables in your code</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium mb-1">In Tailwind Classes</h3>
                                                <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                                                    {`<div className="bg-[var(--theme-primary)] text-white">
  Themed content
</div>`}
                                                </pre>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-1">In Inline Styles</h3>
                                                <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                                                    {`<div style={{ 
  backgroundColor: 'var(--theme-secondary)',
  borderRadius: 'var(--theme-radius)'
}}>
  Themed content
</div>`}
                                                </pre>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-1">In CSS/SCSS</h3>
                                                <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                                                    {`.my-component {
  background-color: var(--theme-primary);
  color: white;
  border-radius: var(--theme-radius);
}`}
                                                </pre>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-1">Available Variables</h3>
                                                <ul className="text-sm space-y-1">
                                                    <li>
                                                        <code>--theme-primary</code>: Primary color (hex)
                                                    </li>
                                                    <li>
                                                        <code>--theme-secondary</code>: Secondary color (hex)
                                                    </li>
                                                    <li>
                                                        <code>--theme-accent</code>: Accent color (hex)
                                                    </li>
                                                    <li>
                                                        <code>--theme-radius</code>: Border radius (with px)
                                                    </li>
                                                    <li>
                                                        <code>--primary</code>: Primary color (HSL)
                                                    </li>
                                                    <li>
                                                        <code>--secondary</code>: Secondary color (HSL)
                                                    </li>
                                                    <li>
                                                        <code>--accent</code>: Accent color (HSL)
                                                    </li>
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="inline" className="animate-fade-in">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Inline Styles</CardTitle>
                                            <CardDescription>Using inline styles with theme values</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-medium">Themed Buttons</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <ThemedButton>Primary Button</ThemedButton>
                                                    <ThemedButton variant="outline">Outline Button</ThemedButton>
                                                    <ThemedButton variant="ghost">Ghost Button</ThemedButton>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    <ThemedButton colorScheme="secondary">Secondary</ThemedButton>
                                                    <ThemedButton colorScheme="accent">Accent</ThemedButton>
                                                    <ThemedButton size="sm">Small</ThemedButton>
                                                    <ThemedButton size="lg">Large</ThemedButton>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-lg font-medium">Themed Badges</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <ThemedBadge>Default Badge</ThemedBadge>
                                                    <ThemedBadge variant="outline">Outline Badge</ThemedBadge>
                                                    <ThemedBadge variant="secondary">Secondary Badge</ThemedBadge>
                                                    <ThemedBadge variant="accent">Accent Badge</ThemedBadge>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-lg font-medium">Theme Wrapper</h3>
                                                <ThemeWrapper applyBorderRadius={true} applyBackground={true} className="p-4 text-white">
                                                    <p>This content is wrapped with themed styles</p>
                                                </ThemeWrapper>

                                                <ThemeWrapper
                                                    applyBorderRadius={true}
                                                    applyBorder={true}
                                                    applyTextColor={true}
                                                    className="p-4 mt-4 border"
                                                >
                                                    <p>Another example with border and text color</p>
                                                </ThemeWrapper>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Custom Components</CardTitle>
                                            <CardDescription>Creating themed components with hooks</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium mb-1">useThemeStyles Hook</h3>
                                                <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                                                    {`import { useThemeStyles } from "@/hooks/use-theme-styles"

function MyComponent() {
  const styles = useThemeStyles()
  
  return (
    <div style={{ 
      backgroundColor: styles.primary,
      borderRadius: styles.borderRadius
    }}>
      Themed content
    </div>
  )
}`}
                                                </pre>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-1">ThemeWrapper Component</h3>
                                                <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                                                    {`<ThemeWrapper
  applyBorderRadius={true}
  applyBackground={true}
  className="p-4"
>
  Content with themed styles
</ThemeWrapper>`}
                                                </pre>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-1">Custom Themed Components</h3>
                                                <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                                                    {`<ThemedButton
  variant="outline"
  colorScheme="accent"
  size="lg"
>
  Custom Themed Button
</ThemedButton>

<ThemedBadge variant="secondary">
  Themed Badge
</ThemedBadge>`}
                                                </pre>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-1">Direct Context Usage</h3>
                                                <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                                                    {`import { useThemeContext } from "@/contexts/theme-context"

function MyComponent() {
  const { currentTheme } = useThemeContext()
  
  return (
    <div style={{ 
      backgroundColor: currentTheme.primary,
      borderRadius: \`\${currentTheme.borderRadius}px\`
    }}>
      Themed content
    </div>
  )
}`}
                                                </pre>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </main>
        </div>
    )
}
