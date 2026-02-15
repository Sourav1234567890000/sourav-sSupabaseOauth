"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Determine redirect URL based on environment
  const getRedirectUrl = () => {
    return process.env.NODE_ENV === "production"
      ? "https://sourav-s-supabase-oauth.vercel.app"
      : "http://localhost:3000";
  };

  // Fetch session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };

    fetchSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const loginWithGoogle = async () => {
    const redirectTo = getRedirectUrl();

    // Supabase OAuth
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      console.error("OAuth Error:", error.message);
      return;
    }

    // After login, Supabase will redirect here
  };

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
    setUser(null);
    // Optional: redirect to home page
    router.push("/");
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
