"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Crown,
  GraduationCap,
  Loader2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const plans = {
  student: {
    label: "Student",
    icon: Users,
    price: "$10",
    description: "Make your learning journey more rewarding.",
    freeFeatures: [
      "Browse all tuition listings",
      "View tutor and batch details",
      "Apply to available batches",
      "Save up to 5 favorite tuitions",
    ],
    proFeatures: [
      "Everything in the Free plan",
      "Priority booking",
      "Unlimited saved tuitions",
      "Priority access to opportunities",
    ],
  },
  tutor: {
    label: "Tutor",
    icon: GraduationCap,
    price: "$15",
    description: "Grow your teaching presence and reach more students.",
    freeFeatures: [
      "Create up to 2 tuition listings",
      "Receive student applications",
      "Manage your tutor profile",
      "Basic platform visibility",
    ],
    proFeatures: [
      "Everything in the Free plan",
      "Unlimited tuition listings",
      "Verified tutor badge",
      "Higher profile visibility",
    ],
  },
};

export default function PricingPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [selectedRole, setSelectedRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const user = session?.user;
  const userRole = user?.role;
  const userPlan = user?.plan || "free";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedRole = params.get("role");

    if (requestedRole === "student" || requestedRole === "tutor") {
      setSelectedRole(requestedRole);
    } else if (userRole === "student" || userRole === "tutor") {
      setSelectedRole(userRole);
    }
  }, [userRole]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in before subscribing.");
      router.push(`/sign-in?callbackURL=${encodeURIComponent(`/pricing?role=${selectedRole}`)}`);
      return;
    }

    if (user.role !== selectedRole) {
      toast.error(`This plan is available only to ${selectedRole}s.`);
      return;
    }

    if (userPlan === "pro") {
      toast.info("Your account already has the Pro plan.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.url) {
        throw new Error(result.message || "Unable to start checkout.");
      }

      window.location.href = result.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Unable to start checkout. Please try again.");
      setLoading(false);
    }
  };

  const currentPlan = plans[selectedRole];
  const PlanIcon = currentPlan.icon;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF8F5]">
        <section className="relative overflow-hidden bg-[#F3EFF9] px-5 py-16 sm:px-8 lg:py-20">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D9CDED]/50 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#EACFC7]/30 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EAE4EF] bg-white px-4 py-2 text-xs font-bold text-[#75619E] sm:text-sm">
              <Sparkles size={16} />
              MENTORLAGBE PRO
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#30213D] sm:text-5xl">
              Invest in Your
              <span className="block text-[#8B78B5]">Learning & Teaching Journey</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#64748B]">
              Choose a plan that fits your goals. Get more opportunities,
              greater visibility, and a better MentorLagbe experience.
            </p>

            <div className="mx-auto mt-8 inline-flex rounded-2xl border border-[#EAE4EF] bg-white p-1.5 shadow-sm">
              {["student", "tutor"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-xl px-6 py-3 text-sm font-semibold capitalize transition ${
                    selectedRole === role
                      ? "bg-[#8B78B5] text-white shadow-sm"
                      : "text-[#64748B] hover:bg-[#F3EFF9]"
                  }`}
                >
                  {role} plans
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          {isPending ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#8B78B5]" size={32} />
            </div>
          ) : (
            <>
              {user && user.role !== "admin" && user.role !== selectedRole && (
                <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
                  You are signed in as a {user.role}. Switch to your account's
                  plan to subscribe.
                </div>
              )}

              {user?.role === "admin" && (
                <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
                  Admin accounts cannot purchase Student or Tutor Pro plans.
                </div>
              )}

              <div className="mb-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0ECF6] text-[#8B78B5]">
                  <PlanIcon size={28} />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-[#30213D]">
                  {currentPlan.label} Membership
                </h2>
                <p className="mt-2 text-sm text-[#64748B]">
                  {currentPlan.description}
                </p>
              </div>

              <div className="grid items-stretch gap-6 md:grid-cols-2">
                <div className="flex flex-col rounded-3xl border border-[#EAE4EF] bg-white p-7 shadow-sm">
                  <div>
                    <span className="text-sm font-bold text-[#64748B]">FREE PLAN</span>
                    <h3 className="mt-3 text-3xl font-bold text-[#30213D]">Free</h3>
                    <p className="mt-2 text-sm text-[#64748B]">
                      Get started with the essentials.
                    </p>
                  </div>

                  <div className="my-7 h-px bg-[#EAE4EF]" />

                  <ul className="flex-1 space-y-4">
                    {currentPlan.freeFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-[#475569]">
                        <Check size={18} className="mt-0.5 shrink-0 text-[#8B78B5]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/sign-up"
                    className="mt-9 inline-flex items-center justify-center rounded-xl border border-[#D9CDED] px-5 py-3.5 text-sm font-bold text-[#30213D] transition hover:bg-[#F3EFF9]"
                  >
                    Get Started
                  </Link>
                </div>

                <div className="relative flex flex-col rounded-3xl border-2 border-[#8B78B5] bg-white p-7 shadow-xl shadow-[#8B78B5]/10">
                  <span className="absolute -top-3 right-7 rounded-full bg-[#8B78B5] px-4 py-1.5 text-xs font-bold text-white">
                    RECOMMENDED
                  </span>

                  <div>
                    <span className="flex items-center gap-2 text-sm font-bold text-[#8B78B5]">
                      <Crown size={17} />
                      PRO MEMBERSHIP
                    </span>

                    <div className="mt-3 flex items-baseline gap-2">
                      <h3 className="text-4xl font-bold text-[#30213D]">
                        {currentPlan.price}
                      </h3>
                      <span className="text-sm text-[#64748B]">/ month</span>
                    </div>

                    <p className="mt-2 text-sm text-[#64748B]">
                      More opportunities with premium benefits.
                    </p>
                  </div>

                  <div className="my-7 h-px bg-[#EAE4EF]" />

                  <ul className="flex-1 space-y-4">
                    {currentPlan.proFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-[#475569]">
                        <Check size={18} className="mt-0.5 shrink-0 text-[#8B78B5]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {userPlan === "pro" && user?.role === selectedRole ? (
                    <div className="mt-9 flex items-center justify-center gap-2 rounded-xl bg-[#F0ECF6] px-5 py-3.5 text-sm font-bold text-[#75619E]">
                      <ShieldCheck size={19} />
                      Your Pro plan is active
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={
                        loading ||
                        (user && user.role !== selectedRole) ||
                        user?.role === "admin"
                      }
                      className="mt-9 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B78B5] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#75619E] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Connecting to Stripe...
                        </>
                      ) : (
                        <>
                          Subscribe with Stripe
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  )}

                  <p className="mt-4 text-center text-xs text-[#94A3B8]">
                    Secure subscription checkout powered by Stripe.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex items-start gap-3 rounded-2xl border border-[#EAE4EF] bg-white p-5">
                <ShieldCheck size={22} className="mt-0.5 shrink-0 text-[#8B78B5]" />
                <p className="text-sm leading-7 text-[#64748B]">
                  Payments are securely processed by Stripe. Your Pro access
                  is activated only after the payment is verified by our server.
                  The subscription renews monthly according to its selected price.
                </p>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
