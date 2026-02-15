"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  // Get logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) console.error(error)
      else setUserId(data?.user?.id || null)
    }
    fetchUser()
  }, [])

  const fetchBookmarks = async () => {
    if (!userId) return

    const { data, error } = await supabase
      .from("bookmarksTable")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) console.error("Error fetching bookmarks:", error)
    else setBookmarks(data || [])
  }

  // Realtime subscription
  useEffect(() => {
    if (!userId) return
    fetchBookmarks()

    const channel = supabase
      .channel("public:bookmarksTable")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarksTable" },
        () => {
          fetchBookmarks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  // Delete bookmark (RLS safe)
  const handleDelete = async (id: string) => {
    if (!userId) return

    const { error } = await supabase
      .from("bookmarksTable")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) console.error("Error deleting bookmark:", error)
  }

  if (!userId) return <p>Please log in to see your bookmarks.</p>

  return (
    <div className="mt-4 flex flex-col gap-2">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex justify-between border px-2 py-1 rounded"
        >
          <a href={b.url} target="_blank" className="font-semibold">
            {b.title}
          </a>
          <button
            onClick={() => handleDelete(b.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
