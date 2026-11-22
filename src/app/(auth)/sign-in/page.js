
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (error) throw new Error(error.message);

      toast.success("Welcome back!");

      const { data: session } = await authClient.getSession();
      const role = session?.user?.role || "student";

      router.push(
        role === "admin"
          ? "/dashboard/admin"
          : role === "tutor"
          ? "/dashboard/tutor"
          : "/dashboard/student"
      );
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F8F5] flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <Link href="/" className="text-2xl font-bold text-[#142B3B]">
          MentorLagbe.
        </Link>

        <h1 className="text-3xl font-bold text-[#142B3B] mt-8">
          Welcome back
        </h1>
        <p className="text-slate-500 mt-2">
          Sign in to continue to your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0F9D8A]"
          />

          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0F9D8A]"
          />

          <button
            disabled={loading}
            className="w-full bg-[#0F9D8A] hover:bg-[#0b8274] text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-[#0F9D8A] font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
