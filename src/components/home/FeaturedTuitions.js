"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, Users } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FeaturedTuitions() {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/tuitions?limit=6`);

        if (!response.ok) {
          throw new Error("Unable to load tuition listings.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to load tuitions.");
        }

        setTuitions(result.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchTuitions();
  }, []);

  const formatFee = (fee) =>
    `৳${Number(fee || 0).toLocaleString("en-BD")}`;

  return (
    <section className="bg-[#FAF8F5] py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8B78B5]">
              Explore opportunities
            </p>
            <h2 className="text-3xl font-bold text-[#30213D] sm:text-4xl">
              Featured Tuitions
            </h2>
            <p className="mt-3 max-w-xl text-[#64748B]">
              Discover tuition opportunities and find the right learning
              support for your academic goals.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 font-semibold text-[#8B78B5] transition hover:text-[#75619E]"
          >
            Browse all tuitions <ArrowRight size={18} />
          </Link>
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
            <p className="mt-2 text-sm text-red-600">
              Please check that the backend server is running.
            </p>
          </div>
        )}

        {!loading && !error && tuitions.length === 0 && (
          <div className="rounded-2xl border border-[#EAE4EF] bg-white p-10 text-center">
            <BookOpen className="mx-auto mb-3 text-[#8B78B5]" size={32} />
            <h3 className="text-lg font-semibold text-[#30213D]">
              No featured tuitions yet
            </h3>
            <p className="mt-2 text-sm text-[#64748B]">
              Approved tuition listings will appear here.
            </p>
          </div>
        )}

        {!loading && !error && tuitions.length > 0 && (
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <article
                key={tuition._id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAE4EF] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-44 shrink-0 overflow-hidden bg-[#EAE4EF]">
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

                  <h3 className="mb-3 line-clamp-2 text-xl font-bold text-[#30213D]">
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
      </div>
    </section>
  );
}
