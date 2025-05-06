"use client"

import type React from "react"

import { useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ToastDemoProps {
    title: string
    description: string
    action?: React.ReactNode
    autoShow?: boolean
    delay?: number
}

export function ToastDemo({
    title,
    description,
    action,
    autoShow = false,
    delay = 1000,
}: ToastDemoProps) {
    const showToast = () => {
        toast(title, {
            description,
            action,
        })
    }

    useEffect(() => {
        if (autoShow) {
            const timer = setTimeout(() => {
                showToast()
            }, delay)

            return () => clearTimeout(timer)
        }
    }, [autoShow, delay])

    if (autoShow) return null

    return (
        <Button variant="outline" onClick={showToast}>
            Show Toast
        </Button>
    )
}
