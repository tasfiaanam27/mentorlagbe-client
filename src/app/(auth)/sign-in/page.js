"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/shared/Logo";

export default function SignInPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim() || !formData.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Invalid email or password."
        );
        return;
      }

      // Confirm that the authenticated session is available.
      const sessionResult = await authClient.getSession();
      const user = sessionResult.data?.user;

      if (!user) {
        toast.error("Unable to retrieve your account information.");
        return;
      }

      // Ensure the account has a valid MentorLagbe role.
      const validRoles = ["student", "tutor", "admin"];

      if (!validRoles.includes(user.role)) {
        toast.error("Your account role is invalid. Please contact support.");
        return;
      }

      toast.success("Welcome back!");

      // Successful sign-in takes the user to the public homepage.
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
              Welcome back!
            </h1>

            <p className="text-[#64748B] mt-2 text-sm">
              Sign in to continue to your MentorLagbe account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#30213D]"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-[#8B78B5] hover:text-[#75619E] font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#EAE4EF] bg-white text-[#30213D] outline-none focus:ring-2 focus:ring-[#8B78B5] focus:border-transparent"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#8B78B5]"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B78B5] hover:bg-[#75619E] text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[#8B78B5] font-semibold hover:text-[#75619E]"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
