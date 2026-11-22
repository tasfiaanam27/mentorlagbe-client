
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import {
  ArrowRight,
  BookOpen,
  Search,
  SlidersHorizontal,
  MapPin,
  Users,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const subjects = [
  "Mathematics",
  "Physics",
  "English",
  "Programming",
  "Chemistry",
  "IELTS",
  "Biology",
  "Accounting",
  "ICT",
  "Economics",
  "All Subjects",
];

const classLevels = [
  "Class 1-5",
  "Class 6-8",
  "Class 9-10",
  "HSC",
  "University",
  "Admission",
];

export default function BrowseTuitionsPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [mode, setMode] = useState("");

  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTuitions = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (filters.search?.trim()) {
        params.set("search", filters.search.trim());
      }

      if (filters.subject) {
        params.set("subject", filters.subject);
      }

      if (filters.classLevel) {
        params.set("classLevel", filters.classLevel);
      }

      if (filters.mode) {
        params.set("mode", filters.mode);
      }

      const query = params.toString();
      const url = `${API_URL}/api/tuitions${query ? `?${query}` : ""}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to fetch tuition listings.");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to load tuitions.");
      }

      setTuitions(result.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setTuitions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTuitions();
  }, [fetchTuitions]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchTuitions({ search, subject, classLevel, mode });
  };

  const handleReset = () => {
    setSearch("");
    setSubject("");
    setClassLevel("");
    setMode("");
    fetchTuitions();
  };

  const formatFee = (fee) =>
    `৳${Number(fee || 0).toLocaleString("en-BD")}`;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF8F5]">
        <section className="bg-[#30213D] px-5 py-16 text-white sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#D6C9E8]">
              Find your learning opportunity
            </p>

            <h1 className="text-3xl font-bold sm:text-5xl">
              Browse Tuitions
            </h1>

            <p className="mt-4 max-w-2xl leading-relaxed text-[#E5DFEC]">
              Explore tuition batches and personalized mentorship
              opportunities from tutors. Find the right match for your
              learning goals.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="mb-8 rounded-2xl border border-[#EAE4EF] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-[#8B78B5]" />
              <h2 className="text-lg font-bold text-[#30213D]">
                Find Your Tuition
              </h2>
            </div>

            <form onSubmit={handleSearch}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-4">
                  <label
                    htmlFor="tuition-search"
                    className="mb-2 block text-sm font-medium text-[#30213D]"
                  >
                    Search by title or subject
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-[#EAE4EF] px-4 focus-within:border-[#8B78B5]">
                    <Search size={19} className="shrink-0 text-[#8B78B5]" />
                    <input
                      id="tuition-search"
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="e.g. HSC Physics, Mathematics..."
                      className="h-12 w-full bg-transparent text-sm text-[#30213D] outline-none placeholder:text-[#94A3B8]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject-filter"
                    className="mb-2 block text-sm font-medium text-[#30213D]"
                  >
                    Subject
                  </label>
                  <select
                    id="subject-filter"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#EAE4EF] bg-white px-3 text-sm text-[#30213D] outline-none focus:border-[#8B78B5]"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="class-filter"
                    className="mb-2 block text-sm font-medium text-[#30213D]"
                  >
                    Class Level
                  </label>
                  <select
                    id="class-filter"
                    value={classLevel}
                    onChange={(event) => setClassLevel(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#EAE4EF] bg-white px-3 text-sm text-[#30213D] outline-none focus:border-[#8B78B5]"
                  >
                    <option value="">All Class Levels</option>
                    {classLevels.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="mode-filter"
                    className="mb-2 block text-sm font-medium text-[#30213D]"
                  >
                    Tuition Mode
                  </label>
                  <select
                    id="mode-filter"
                    value={mode}
                    onChange={(event) => setMode(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#EAE4EF] bg-white px-3 text-sm text-[#30213D] outline-none focus:border-[#8B78B5]"
                  >
                    <option value="">All Modes</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div className="flex items-end gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 flex-1 rounded-xl bg-[#8B78B5] px-5 text-sm font-semibold text-white transition hover:bg-[#75619E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Search
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="h-12 rounded-xl border border-[#EAE4EF] px-4 text-sm font-semibold text-[#64748B] transition hover:bg-[#F7F3FA]"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#30213D]">
                Available Tuitions
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Explore approved and active tuition opportunities.
              </p>
            </div>

            {!loading && !error && (
              <p className="rounded-full bg-[#F0ECF6] px-4 py-2 text-sm font-semibold text-[#75619E]">
                {tuitions.length} {tuitions.length === 1 ? "result" : "results"}
              </p>
            )}
          </div>

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-[#EAE4EF] bg-white"
                >
                  <div className="h-44 bg-[#EAE4EF]" />
                  <div className="space-y-4 p-5">
                    <div className="h-5 w-3/4 rounded bg-[#EAE4EF]" />
                    <div className="h-4 w-1/2 rounded bg-[#EAE4EF]" />
                    <div className="h-4 w-full rounded bg-[#EAE4EF]" />
                    <div className="h-10 rounded-lg bg-[#EAE4EF]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-medium text-red-700">{error}</p>
              <button
                onClick={() => fetchTuitions({ search, subject, classLevel, mode })}
                className="mt-4 rounded-xl bg-[#8B78B5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#75619E]"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && tuitions.length === 0 && (
            <div className="rounded-2xl border border-[#EAE4EF] bg-white px-6 py-14 text-center">
              <BookOpen size={40} className="mx-auto mb-4 text-[#8B78B5]" />
              <h3 className="text-xl font-bold text-[#30213D]">
                No Tuitions Found
              </h3>
              <p className="mt-2 text-sm text-[#64748B]">
                Try changing your search keywords or filters.
              </p>
              <button
                onClick={handleReset}
                className="mt-5 rounded-xl bg-[#8B78B5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#75619E]"
              >
                Clear Filters
              </button>
            </div>
          )}

          {!loading && !error && tuitions.length > 0 && (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tuitions.map((tuition) => (
                <article
                  key={tuition._id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAE4EF] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 shrink-0 overflow-hidden bg-[#EAE4EF]">
                    {tuition.bannerImage ? (
                      <img
                        src={tuition.bannerImage}
                        alt={tuition.title || "Tuition"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#EAE4EF] to-[#DCD1E9]">
                        <BookOpen size={42} className="text-[#8B78B5]" />
                      </div>
                    )}

                    <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#75619E] shadow-sm">
                      {tuition.mode}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#F0ECF6] px-3 py-1 text-xs font-medium text-[#75619E]">
                        {tuition.subject}
                      </span>
                      <span className="rounded-full bg-[#F7F3EF] px-3 py-1 text-xs font-medium text-[#A66F5E]">
                        {tuition.classLevel}
                      </span>
                    </div>

                    <h3 className="mb-4 line-clamp-2 text-xl font-bold text-[#30213D]">
                      {tuition.title}
                    </h3>

                    <div className="mb-4 space-y-2 text-sm text-[#64748B]">
                      <p className="flex items-center gap-2">
                        <Users size={16} className="shrink-0 text-[#8B78B5]" />
                        Tutor: {tuition.tutorName}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="shrink-0 text-[#8B78B5]" />
                        {tuition.location || tuition.mode}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-[#EAE4EF] pt-4">
                      <div>
                        <p className="text-xs text-[#64748B]">Monthly fee</p>
                        <p className="text-lg font-bold text-[#30213D]">
                          {formatFee(tuition.monthlyFee)}
                        </p>
                      </div>

                      <Link
                        href={`/tuitions/${tuition._id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#8B78B5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#75619E]"
                      >
                        View Details <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
