"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { Suspense, useEffect, useState } from "react"
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import axios from "axios"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User>()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [progress, setProgress] = useState<number>(0)

  const searchParams = useSearchParams()

  const logged = searchParams.get("logged")

  useEffect(() => {
    const checkSession = async () => {
      try {
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 300)

        const {
          data: { session },
        } = await supabase.auth.getSession()
        console.log(session?.user)

        if (!session) {
          clearInterval(progressInterval)
          setStatus("error")
          setErrorMessage("No active session found. Please try logging in again.")
          return
        }

        const userToken = session.provider_token;

        if (userToken || logged == "true") {
          setStatus("success")

          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        } else {
          setUser(session.user);
          setProgress(95);

          try {
            await axios.post(
              "/api/save-token",
              {
                session: session,
                token: session.provider_token,
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            )

            setProgress(100)
            setStatus("success")

            setTimeout(() => {
              router.push("/dashboard")
            }, 1000)

          } catch (err) {
            clearInterval(progressInterval)
            setStatus("error")
            setErrorMessage("Failed to save authentication token. Please try again.")
            console.error("Failed to save token:", err)
          }
        }
      } catch (err) {
        setStatus("error")
        setErrorMessage("An unexpected error occurred during authentication.")
        console.error("Auth error:", err)
      }
    }

    checkSession()
  }, [router, supabase, logged])

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md px-4">
        <Card className="overflow-hidden">
          <div className="h-2 bg-primary relative">
            <div
              className="h-full bg-primary-foreground/20 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <CardHeader className="text-center pb-2">
            <Badge
              variant={status === "loading" ? "outline" : status === "success" ? "default" : "destructive"}
              className="mb-2 mx-auto"
            >
              {status === "loading" ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Authenticating
                </span>
              ) : status === "success" ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Authenticated
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Authentication Failed
                </span>
              )}
            </Badge>
            <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-background shadow-lg">
              <AvatarImage
                src={user?.user_metadata.avatar_url || "/placeholder.svg"}
                alt={user?.email || "User"}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {user?.user_metadata.name?.charAt(0) || user?.email?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <CardTitle>
              {status === "loading" ? "Authenticating..." :
                status === "success" ? "Authentication Successful" :
                  "Authentication Failed"}
            </CardTitle>
            <CardDescription>
              {user ? (
                <span className="flex flex-col items-center gap-1">
                  <span className="font-medium">{user.user_metadata.name || user.email}</span>
                  {user.user_metadata.name && <span className="text-xs opacity-70">{user.email}</span>}
                </span>
              ) : (
                "Verifying your credentials"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-6">
            {status === "loading" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1 items-center justify-center">
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full border-4 border-primary/30"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-primary"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Connecting to Discord and setting up your dashboard...
                  </p>
                </div>
                <div className="flex justify-center space-x-1 mt-2">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Authentication successful! Redirecting you to your dashboard...
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {errorMessage}
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" onClick={() => router.push("/auth/login")}>
                    Try Again
                  </Button>
                  <Button asChild>
                    <Link href="/">Return Home</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>
            Having trouble? <Link href="/help" className="text-primary hover:underline">Get help</Link> or{" "}
            <Link href="/contact" className="text-primary hover:underline">contact support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthCallbackWithSuspense() {
  return (
    <Suspense fallback={<div>Loading search parameters...</div>}>
      <AuthCallback />
    </Suspense>
  )
}