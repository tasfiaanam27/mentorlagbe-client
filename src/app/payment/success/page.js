"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  LayoutDashboard,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Verifying your subscription...");
  const [planName, setPlanName] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setStatus("unauthenticated");
      setMessage("Please sign in to verify your payment.");
      return;
    }

    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (!sessionId) {
      setStatus("error");
      setMessage("We could not find your Stripe Checkout Session.");
      return;
    }

    let cancelled = false;

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Payment verification failed.");
        }

        if (cancelled) return;

        setPlanName(result.data?.planName || "Pro");
        setMessage("Your payment has been verified and your Pro plan is active.");
        setStatus("success");
        await authClient.getSession();
      } catch (error) {
        if (cancelled) return;

        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage(
          error.message ||
            "We could not verify your payment. Please contact support if you were charged."
        );
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user]);

  return (
    <>
      <Navbar />

      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF8F5] px-5 py-16">
        <div className="w-full max-w-xl rounded-3xl border border-[#EAE4EF] bg-white p-8 text-center shadow-xl shadow-[#30213D]/5 sm:p-12">
          {status === "checking" && (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F3EFF9] text-[#8B78B5]">
                <Loader2 size={38} className="animate-spin" />
              </div>
              <h1 className="mt-7 text-2xl font-bold text-[#30213D]">
                Verifying Your Payment
              </h1>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={42} />
              </div>
              <p className="mt-7 text-sm font-bold uppercase tracking-wider text-[#8B78B5]">
                Payment Successful
              </p>
              <h1 className="mt-3 text-3xl font-bold text-[#30213D]">
                Welcome to MentorLagbe Pro!
              </h1>
              <p className="mt-4 leading-7 text-[#64748B]">{message}</p>

              <div className="mt-7 rounded-2xl border border-[#EAE4EF] bg-[#F8F5FC] p-5">
                <ShieldCheck size={28} className="mx-auto text-[#8B78B5]" />
                <p className="mt-3 font-bold text-[#30213D]">
                  {planName} Activated
                </p>
                <p className="mt-1 text-sm text-[#64748B]">
                  Your account now has access to Pro benefits.
                </p>
              </div>

              <Link
                href="/"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B78B5] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#75619E]"
              >
                Continue to MentorLagbe
                <ArrowRight size={18} />
              </Link>

              <Link
                href={`/dashboard/${session?.user?.role || "student"}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#75619E] hover:text-[#30213D]"
              >
                <LayoutDashboard size={17} />
                Go to Dashboard
              </Link>
            </>
          )}

          {status === "unauthenticated" && (
            <>
              <AlertCircle size={42} className="mx-auto text-amber-500" />
              <h1 className="mt-6 text-2xl font-bold text-[#30213D]">
                Sign In to Verify
              </h1>
              <p className="mt-3 leading-7 text-[#64748B]">{message}</p>
              <Link
                href="/sign-in?callbackURL=%2Fpayment%2Fsuccess"
                className="mt-7 inline-flex rounded-xl bg-[#8B78B5] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#75619E]"
              >
                Sign In
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle size={44} className="mx-auto text-amber-500" />
              <h1 className="mt-6 text-2xl font-bold text-[#30213D]">
                Verification Pending
              </h1>
              <p className="mt-3 leading-7 text-[#64748B]">{message}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.refresh()}
                  className="rounded-xl bg-[#8B78B5] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#75619E]"
                >
                  Try Again
                </button>
                <Link
                  href="/pricing"
                  className="rounded-xl border border-[#EAE4EF] px-6 py-3.5 text-sm font-bold text-[#30213D] hover:bg-[#F8F5FC]"
                >
                  Return to Pricing
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
