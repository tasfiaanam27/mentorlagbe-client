"use client";

import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function PaymentCancelPage() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF8F5] px-5 py-16">
        <div className="w-full max-w-xl rounded-3xl border border-[#EAE4EF] bg-white p-8 text-center shadow-xl shadow-[#30213D]/5 sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F3EFF9] text-[#8B78B5]">
            <XCircle size={42} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-wider text-[#8B78B5]">
            Checkout Cancelled
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#30213D]">
            No Worries!
          </h1>

          <p className="mt-4 leading-7 text-[#64748B]">
            Your checkout was cancelled, and your account has not been upgraded.
            You can return whenever you're ready to explore MentorLagbe Pro.
          </p>

          <div className="mt-7 rounded-2xl border border-[#EAE4EF] bg-[#F8F5FC] p-5 text-left">
            <div className="flex items-start gap-3">
              <CreditCard size={21} className="mt-0.5 shrink-0 text-[#8B78B5]" />
              <div>
                <p className="font-bold text-[#30213D]">No completed payment</p>
                <p className="mt-1 text-sm leading-6 text-[#64748B]">
                  If you did not complete checkout, no subscription should be activated.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <ShieldCheck size={21} className="mt-0.5 shrink-0 text-[#8B78B5]" />
              <p className="text-sm leading-6 text-[#64748B]">
                Your existing account and plan remain unchanged.
              </p>
            </div>
          </div>

          <Link
            href="/pricing"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B78B5] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#75619E]"
          >
            <ArrowLeft size={18} />
            Return to Pricing
          </Link>

          <Link
            href="/"
            className="mt-4 inline-block text-sm font-semibold text-[#75619E] hover:text-[#30213D]"
          >
            Back to Homepage
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
