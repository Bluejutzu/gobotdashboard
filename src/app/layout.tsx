import type React from "react";
import "./globals.css";
import "../../public/fonts/minecraft.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/contexts/theme-context";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter"
});

export const metadata = {
    title: "Gobot - Discord Bot",
    description: "Multi-purpose Discord Bot. Fully customizable. Completely free."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={inter.variable}>
            <body className={`${inter.className} antialiased`}>
                <ThemeProvider>
                    <SiteHeader />
                    {children}
                    <SiteFooter />
                    <Toaster className="dark" />
                    <Analytics />
                    <SpeedInsights />
                </ThemeProvider>
            </body>
        </html>
    );
}
