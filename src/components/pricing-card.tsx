import { ArrowRight, Check, Clock, Star, XCircle } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export function PricingCard({
    title,
    price,
    period,
    description,
    features,
    buttonText,
    buttonLink,
    gradient,
    popular,
    trending,
    limited,
    bestValue,
    available = true,
    unavailableReason,
}: {
    title: string
    price: string
    period?: string
    description: string
    features: ReactNode[] | string[]
    buttonText: string
    buttonLink: string
    gradient: string
    popular?: boolean
    trending?: boolean
    limited?: boolean
    bestValue?: boolean
    available?: boolean
    unavailableReason?: string
}) {
    // Determine badge type and content
    const getBadgeContent = () => {
        if (!available) return { text: "UNAVAILABLE", color: "bg-gradient-to-r from-gray-500 to-gray-600" }
        if (popular) return { text: "MOST POPULAR", color: "bg-gradient-to-r from-purple-500 to-purple-600" }
        if (trending) return { text: "TRENDING", color: "bg-gradient-to-r from-blue-500 to-blue-600" }
        if (limited) return { text: "LIMITED TIME", color: "bg-gradient-to-r from-red-500 to-red-600" }
        if (bestValue) return { text: "BEST VALUE", color: "bg-gradient-to-r from-emerald-500 to-emerald-600" }
        return null
    }

    const badge = getBadgeContent()

    // Determine button style based on card type
    const getButtonStyle = () => {
        if (!available) return "bg-gray-500/30 text-white/50 cursor-not-allowed"
        if (popular)
            return "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]"
        if (trending)
            return "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        if (limited)
            return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
        if (bestValue)
            return "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        return "bg-white/10 hover:bg-white/20 text-white"
    }

    // Determine border style based on card type
    const getBorderStyle = () => {
        if (!available) return "border-gray-500/20"
        if (popular) return "border-purple-500/30"
        if (trending) return "border-blue-500/30"
        if (limited) return "border-red-500/30"
        if (bestValue) return "border-emerald-500/30"
        return "border-white/10"
    }

    // Determine shadow style based on card type
    const getShadowStyle = () => {
        if (!available) return ""
        if (popular) return "shadow-[0_0_30px_rgba(124,58,237,0.15)]"
        if (trending) return "shadow-[0_0_30px_rgba(59,130,246,0.15)]"
        if (limited) return "shadow-[0_0_30px_rgba(239,68,68,0.15)]"
        if (bestValue) return "shadow-[0_0_30px_rgba(16,185,129,0.15)]"
        return ""
    }

    // Button component or link based on availability
    const ButtonComponent = () => {
        if (!available) {
            return (
                <Button className={cn("w-full rounded-full py-6 transition-all duration-300", getButtonStyle())} disabled>
                    <span className="flex items-center justify-center">{unavailableReason || "Currently Unavailable"}</span>
                </Button>
            )
        }

        return (
            <Button className={cn("w-full rounded-full py-6 transition-all duration-300", getButtonStyle())} asChild>
                <Link href={buttonLink}>
                    <span className="flex items-center justify-center">
                        {buttonText}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </Link>
            </Button>
        )
    }

    return (
        <div
            className={cn(
                "relative bg-white/5 backdrop-blur-sm border rounded-2xl transition-all duration-300 group",
                getBorderStyle(),
                getShadowStyle(),
                !available ? "opacity-70 grayscale hover:grayscale-0 hover:opacity-80" : "hover:-translate-y-1",
                (popular || trending || limited || bestValue) && available && "hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]",
            )}
        >
            {/* Badge */}
            {badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div
                        className={cn("text-white text-xs font-bold py-1.5 px-4 rounded-full flex items-center gap-1", badge.color)}
                    >
                        {popular && available && <Star className="h-3 w-3 fill-white" />}
                        {!available && <XCircle className="h-3 w-3" />}
                        {badge.text}
                    </div>
                </div>
            )}

            {/* Unavailable overlay */}
            {!available && (
                <div className="absolute inset-0 bg-black/20 rounded-2xl backdrop-blur-[1px] z-0 pointer-events-none"></div>
            )}

            {/* Card Content */}
            <div className="p-1 relative z-10">
                <div
                    className={cn(
                        "rounded-xl overflow-hidden",
                        (popular || trending || limited || bestValue) && available
                            ? "bg-gradient-to-b from-white/5 to-white/0"
                            : "",
                    )}
                >
                    {/* Header */}
                    <div
                        className={cn(
                            "p-6 text-center relative overflow-hidden",
                            (popular || trending || limited || bestValue) && available
                                ? "bg-gradient-to-br from-white/10 to-transparent"
                                : "",
                        )}
                    >
                        {/* Subtle background effect */}
                        <div className="absolute inset-0 opacity-20">
                            <div
                                className={cn(
                                    "absolute inset-0 bg-gradient-to-br",
                                    !available ? "from-gray-500/20 to-gray-600/20" : gradient,
                                )}
                            ></div>
                        </div>

                        {/* Title and Price */}
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">{title}</h3>
                            <div className="flex items-center justify-center">
                                {price !== "Custom" && <span className="text-sm mr-1">$</span>}
                                <span className="text-5xl font-bold tracking-tight">{price}</span>
                                {period && <span className="text-sm text-white/70 ml-1.5 self-end mb-1.5">/{period}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-white/70 text-center mb-6 min-h-[48px]">{description}</p>

                        {/* Feature list */}
                        <ul className="space-y-3 mb-8">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3 text-white/80 group/feature">
                                    <div
                                        className={cn(
                                            "mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                                            !available
                                                ? "bg-gray-500/20 text-gray-400"
                                                : popular
                                                    ? "bg-purple-500/20 text-purple-400"
                                                    : trending
                                                        ? "bg-blue-500/20 text-blue-400"
                                                        : limited
                                                            ? "bg-red-500/20 text-red-400"
                                                            : bestValue
                                                                ? "bg-emerald-500/20 text-emerald-400"
                                                                : "bg-white/10 text-white/60",
                                        )}
                                    >
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span
                                        className={cn(available ? "group-hover/feature:text-white transition-colors" : "text-white/60")}
                                    >
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Button */}
                        <ButtonComponent />
                    </div>
                </div>
            </div>

            {/* Coming soon indicator for unavailable plans */}
            {!available && unavailableReason && unavailableReason.toLowerCase().includes("coming") && (
                <div className="absolute bottom-3 right-3 bg-gray-500/30 text-white/70 text-xs py-1 px-2 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Coming Soon
                </div>
            )}

            {/* Highlight border effect for featured cards */}
            {(popular || trending || limited || bestValue) && available && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                        className={cn(
                            "absolute inset-0 rounded-2xl border-2",
                            popular
                                ? "border-purple-500/50"
                                : trending
                                    ? "border-blue-500/50"
                                    : limited
                                        ? "border-red-500/50"
                                        : "border-emerald-500/50",
                        )}
                    ></div>
                </div>
            )}
        </div>
    )
}
