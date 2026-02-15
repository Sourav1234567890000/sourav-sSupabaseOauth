"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AddBookmark({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Get logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) console.error("Error fetching user:", error)
      else setUserId(data?.user?.id || null)
    }
    fetchUser()
  }, [])

  const handleAdd = async () => {
    if (!title || !url) return alert("Please fill both fields")
    if (!userId) return alert("You must be logged in")

    setLoading(true)
    const { data, error } = await supabase
      .from("bookmarksTable")
      .insert({
        title,
        url,
        user_id: userId, // real logged-in user ID
      })
    setLoading(false)

    if (error) {
      console.error("Supabase insert error:", error)
      alert("Failed to add bookmark: " + error.message)
      return
    }

    setTitle("")
    setUrl("")
    onAdded()
  }

  return (
    <div className="flex gap-2 mb-4">
      <input
        className="border px-2 py-1 rounded flex-1"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border px-2 py-1 rounded flex-1"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={handleAdd}
        className="bg-black text-white px-4 rounded"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  )
}
