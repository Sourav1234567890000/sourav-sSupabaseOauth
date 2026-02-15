"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);

  // Fetch session on mount & listen for auth changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Determine redirect URL dynamically
  const getRedirectUrl = () => {
    // Use Vercel URL in production, fallback to localhost in dev
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }
    if (process.env.NEXT_PUBLIC_REDIRECT_URL) {
      return process.env.NEXT_PUBLIC_REDIRECT_URL;
    }
    console.error("No redirect URL configured!");
    return undefined;
  };

  const loginWithGoogle = async () => {
    const redirectUrl = getRedirectUrl();
    if (!redirectUrl) return;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });

    if (error) console.error("OAuth Error:", error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
    setUser(null);
  };

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
  );
}
