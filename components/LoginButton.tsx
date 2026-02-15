"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Fetch current session on mount
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data?.session?.user || null)
    }
    fetchSession()

    // Listen for auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const loginWithGoogle = async () => {
    // Use environment variable for redirect URL
    const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl }
    })
    if (error) console.log("OAuth Error:", error.message)
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.log("Logout error:", error.message)
    setUser(null)
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-6 py-3 rounded-lg"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={loginWithGoogle}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Login with Google
        </button>
      )}
    </div>
  )
}
