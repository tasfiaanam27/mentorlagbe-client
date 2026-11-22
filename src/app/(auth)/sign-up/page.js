"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/shared/Logo";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (!["student", "tutor"].includes(formData.role)) {
      toast.error("Please select a valid account role.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password: formData.password,
        role: formData.role,
      });

      if (result.error) {
        toast.error(result.error.message || "Unable to create account.");
        return;
      }

      // Verify that the newly registered user has an active session.
      const sessionResult = await authClient.getSession();
      const user = sessionResult.data?.user;

      if (!user) {
        toast.success("Account created successfully! Please sign in.");
        router.replace("/sign-in");
        return;
      }

      const validRoles = ["student", "tutor", "admin"];

      if (!validRoles.includes(user.role)) {
        toast.error("Unable to verify your account role.");
        return;
      }

      toast.success("Account created successfully! Welcome to MentorLagbe.");

      // New users land on the public homepage after registration.
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="bg-white border border-[#EAE4EF] rounded-2xl shadow-sm p-7 sm:p-9">
          <div className="text-center mb-7">
            <h1 className="text-3xl font-bold text-[#30213D]">
              Create your account
            </h1>
            <p className="text-[#64748B] mt-2 text-sm">
              Join MentorLagbe and start your learning journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#30213D] mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border border-[#EAE4EF] bg-white text-[#30213D] outline-none focus:ring-2 focus:ring-[#8B78B5] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#30213D] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-[#EAE4EF] bg-white text-[#30213D] outline-none focus:ring-2 focus:ring-[#8B78B5] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#30213D] mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#EAE4EF] bg-white text-[#30213D] outline-none focus:ring-2 focus:ring-[#8B78B5] focus:border-transparent"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#8B78B5]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#30213D] mb-2">
                I want to join as
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: "student" })
                  }
                  aria-pressed={formData.role === "student"}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition ${
                    formData.role === "student"
                      ? "border-[#8B78B5] bg-[#F3EFF9] text-[#75619E]"
                      : "border-[#EAE4EF] text-[#64748B] hover:border-[#8B78B5]"
                  }`}
                >
                  <UserRound size={18} />
                  Student
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: "tutor" })
                  }
                  aria-pressed={formData.role === "tutor"}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition ${
                    formData.role === "tutor"
                      ? "border-[#8B78B5] bg-[#F3EFF9] text-[#75619E]"
                      : "border-[#EAE4EF] text-[#64748B] hover:border-[#8B78B5]"
                  }`}
                >
                  <GraduationCap size={19} />
                  Tutor
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B78B5] hover:bg-[#75619E] text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-[#8B78B5] font-semibold hover:text-[#75619E]"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </main>
  );
}
