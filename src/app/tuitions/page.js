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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ITEMS_PER_PAGE = 6;

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

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: ITEMS_PER_PAGE,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchTuitions = useCallback(
    async (filters = {}, pageNumber = 1) => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (filters.search?.trim()) {
          params.set("search", filters.search.trim());
        }

        if (filters.subject && filters.subject !== "All Subjects") {
          params.set("subject", filters.subject);
        }

        if (filters.classLevel) {
          params.set("classLevel", filters.classLevel);
        }

        if (filters.mode) {
          params.set("mode", filters.mode);
        }

        params.set("page", String(pageNumber));
        params.set("perPage", String(ITEMS_PER_PAGE));

        const response = await fetch(
          `${API_URL}/api/tuitions?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch tuition listings.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to load tuitions.");
        }

        setTuitions(result.data || []);

        const paginationData = result.pagination || {
          currentPage: pageNumber,
          perPage: ITEMS_PER_PAGE,
          totalItems: result.count || 0,
          totalPages: Math.ceil((result.count || 0) / ITEMS_PER_PAGE),
          hasNextPage: false,
          hasPrevPage: pageNumber > 1,
        };

        setPagination(paginationData);
        setCurrentPage(paginationData.currentPage);
      } catch (err) {
        setError(err.message || "Something went wrong.");
        setTuitions([]);
        setPagination({
          currentPage: 1,
          perPage: ITEMS_PER_PAGE,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTuitions({}, 1);
  }, [fetchTuitions]);

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    fetchTuitions({ search, subject, classLevel, mode }, 1);
  };

  const handleReset = () => {
    setSearch("");
    setSubject("");
    setClassLevel("");
    setMode("");
    setCurrentPage(1);
    fetchTuitions({}, 1);
  };

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > pagination.totalPages ||
      pageNumber === currentPage ||
      loading
    ) {
      return;
    }

    setCurrentPage(pageNumber);
    fetchTuitions(
      { search, subject, classLevel, mode },
      pageNumber
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatFee = (fee) =>
    `৳${Number(fee || 0).toLocaleString("en-BD")}`;

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
  };

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
          {/* Search and filters */}
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
                    disabled={loading}
                    className="h-12 rounded-xl border border-[#EAE4EF] px-4 text-sm font-semibold text-[#64748B] transition hover:bg-[#F7F3FA]"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Results heading */}
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
                {pagination.totalItems}{" "}
                {pagination.totalItems === 1 ? "result" : "results"}
              </p>
            )}
          </div>

          {/* Loading skeleton */}
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

          {/* Error state */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-medium text-red-700">{error}</p>
              <button
                onClick={() =>
                  fetchTuitions(
                    { search, subject, classLevel, mode },
                    currentPage
                  )
                }
                className="mt-4 rounded-xl bg-[#8B78B5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#75619E]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
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

          {/* Tuition cards */}
          {!loading && !error && tuitions.length > 0 && (
            <>
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

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  <p className="text-sm text-[#64748B]">
                    Showing{" "}
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      pagination.totalItems
                    )}{" "}
                    of {pagination.totalItems} tuitions
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage || loading}
                      className="inline-flex h-10 items-center gap-1 rounded-lg border border-[#EAE4EF] bg-white px-3 text-sm font-medium text-[#554367] transition hover:bg-[#F0ECF6] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={17} />
                      Previous
                    </button>

                    {getPageNumbers().map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={loading}
                        aria-current={
                          currentPage === pageNumber ? "page" : undefined
                        }
                        className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
                          currentPage === pageNumber
                            ? "bg-[#8B78B5] text-white shadow-sm"
                            : "border border-[#EAE4EF] bg-white text-[#554367] hover:bg-[#F0ECF6]"
                        } disabled:cursor-not-allowed`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage || loading}
                      className="inline-flex h-10 items-center gap-1 rounded-lg border border-[#EAE4EF] bg-white px-3 text-sm font-medium text-[#554367] transition hover:bg-[#F0ECF6] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

