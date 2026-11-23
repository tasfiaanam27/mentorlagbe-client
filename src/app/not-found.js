
import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7FC] px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#E8E1EF] bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F1EAF8]">
          <SearchX size={38} className="text-[#8B6BB1]" />
        </div>

        <p className="mt-7 text-sm font-semibold uppercase tracking-widest text-[#9876B7]">
          Error 404
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#30243D]">
          Page Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#81758E]">
          Sorry, the page you are looking for does not exist or may have been moved.
          Let's get you back to MentorLagbe.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B6BB1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#76569D]"
        >
          <Home size={17} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
