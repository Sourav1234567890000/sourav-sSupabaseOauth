"use client"

import { useState, useEffect } from "react"
import AddBookmark from "@/components/AddBookmark"
import BookmarkList from "@/components/BookMarkList"
import { supabase } from "@/lib/supabaseClient"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [reload, setReload] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false) // optional flag to force bookmark refresh

  // Refresh bookmark list after adding
  const handleAdded = () => setReload(!reload)

  // Fetch session on mount + listen for auth changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data?.session?.user || null)
    }
    fetchSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (!session) setLoggedOut(true) // clear bookmarks when logged out
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000" },
    })
    if (error) console.log(error.message)
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.log(error.message)
    setUser(null)
    setLoggedOut(true) // clear bookmarks
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>

      {user ? (
        <>
          {/* Logout button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>

          {/* Input fields */}
          <AddBookmark onAdded={handleAdded} />
        </>
      ) : (
        <button
          onClick={loginWithGoogle}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Login with Google
        </button>
      )}

      {/* Bookmark list */}
      <BookmarkList key={reload || loggedOut ? Math.random() : 0} />
    </div>
  )
}
