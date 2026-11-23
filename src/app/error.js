
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("MentorLagbe application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7FC] px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#E8E1EF] bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFF1EC]">
          <AlertTriangle size={38} className="text-[#D97757]" />
        </div>

        <p className="mt-7 text-sm font-semibold uppercase tracking-widest text-[#D97757]">
          Something went wrong
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#30243D]">
          Unexpected Error
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#81758E]">
          We're sorry! Something unexpected happened while loading this page.
          You can try again or return to the homepage.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B6BB1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#76569D]"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E1EF] px-6 py-3 text-sm font-semibold text-[#554367] transition hover:bg-[#F8F5FB]"
          >
            <Home size={17} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
