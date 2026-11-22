
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (error) throw new Error(error.message);

      toast.success("Account created successfully!");
      router.push("/sign-in");
    } catch (error) {
      toast.error(error.message || "Registration failed");
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
          Create your account
        </h1>
        <p className="text-slate-500 mt-2">
          Join MentorLagbe and start your learning journey.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0F9D8A]"
          />

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
            minLength={8}
            type="password"
            placeholder="Password (minimum 8 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0F9D8A]"
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-[#142B3B]">
              Register as
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 bg-white"
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#0F9D8A] hover:bg-[#0b8274] text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-[#0F9D8A] font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
