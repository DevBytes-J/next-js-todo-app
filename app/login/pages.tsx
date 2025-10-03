// app/login/page.tsx

"use client"; // This must be a Client Component to use state and hooks

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use this for redirects
import { supabase } from "@/lib/supabase"; // Import your shared client

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // SUCCESS! The session is now active and saved.
      // Redirect the user to the protected todos page.
      router.push("/todos");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignIn}
        className="p-8 bg-white shadow-md rounded-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded"
          required
        />

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 transition"
        >
          Sign In
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Dont have an account?
          <button
            onClick={() => router.push("/signup")}
            className="text-indigo-600 ml-1 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}
