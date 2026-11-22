"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Monitor,
  Users,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TuitionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tuitionId = params.id;

  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [studentPhone, setStudentPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  useEffect(() => {
    if (!tuitionId) return;

    const fetchTuition = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/tuitions/${tuitionId}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Tuition not found.");
        }

        setTuition(result.data);
      } catch (err) {
        setError(err.message || "Unable to load tuition details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTuition();
  }, [tuitionId]);

  const formatFee = (fee) =>
    `৳${Number(fee || 0).toLocaleString("en-BD")}`;

  const handleApplication = async (event) => {
    event.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in as a student to apply.");
      router.push("/sign-in");
      return;
    }

    if (session.user.role !== "student") {
      toast.error("Only students can apply for tuitions.");
      return;
    }

    if (!studentPhone.trim() || !preferredSchedule.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          tuitionId,
          studentPhone,
          preferredSchedule,
          studentNote,
        }),
      });

      const result = await response.json();

      if (response.status === 409) {
        toast.error(result.message || "You have already applied.");
        setApplicationSubmitted(true);
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Application submission failed.");
      }

      toast.success("Your application has been submitted!");
      setApplicationSubmitted(true);
      setStudentPhone("");
      setPreferredSchedule("");
      setStudentNote("");
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF8F5]">
        {loading && (
          <div className="mx-auto max-w-7xl animate-pulse px-5 py-16 sm:px-8">
            <div className="mb-8 h-8 w-40 rounded bg-[#EAE4EF]" />
            <div className="h-72 rounded-2xl bg-[#EAE4EF]" />
            <div className="mt-8 h-10 w-2/3 rounded bg-[#EAE4EF]" />
            <div className="mt-4 h-5 w-1/2 rounded bg-[#EAE4EF]" />
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-3xl px-5 py-24 text-center">
            <BookOpen size={44} className="mx-auto mb-4 text-[#8B78B5]" />
            <h1 className="text-2xl font-bold text-[#30213D]">
              Tuition Not Found
            </h1>
            <p className="mt-3 text-[#64748B]">{error}</p>
            <Link
              href="/tuitions"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B78B5] px-5 py-3 font-semibold text-white hover:bg-[#75619E]"
            >
              <ArrowLeft size={17} /> Browse Tuitions
            </Link>
          </div>
        )}

        {!loading && !error && tuition && (
          <>
            <section className="bg-[#30213D] px-5 py-8 text-white sm:px-8">
              <div className="mx-auto max-w-7xl">
                <Link
                  href="/tuitions"
                  className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#D6C9E8] transition hover:text-white"
                >
                  <ArrowLeft size={17} /> Back to Browse Tuitions
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {tuition.subject}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {tuition.classLevel}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {tuition.mode}
                  </span>
                </div>

                <h1 className="mt-5 max-w-4xl text-3xl font-bold sm:text-5xl">
                  {tuition.title}
                </h1>

                <p className="mt-4 flex items-center gap-2 text-[#E5DFEC]">
                  <Users size={18} />
                  Posted by {tuition.tutorName}
                </p>
              </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.6fr_1fr]">
              <div>
                <div className="overflow-hidden rounded-2xl border border-[#EAE4EF] bg-white shadow-sm">
                  {tuition.bannerImage ? (
                    <img
                      src={tuition.bannerImage}
                      alt={tuition.title}
                      className="h-64 w-full object-cover sm:h-80"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-gradient-to-br from-[#EAE4EF] to-[#DCD1E9]">
                      <BookOpen size={64} className="text-[#8B78B5]" />
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-[#30213D]">
                      Tuition Overview
                    </h2>

                    <p className="mt-4 whitespace-pre-line leading-8 text-[#64748B]">
                      {tuition.description}
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-[#EAE4EF] bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-2xl font-bold text-[#30213D]">
                    Tuition Information
                  </h2>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <BookOpen className="mt-1 text-[#8B78B5]" size={20} />
                      <div>
                        <p className="text-sm text-[#64748B]">Subject</p>
                        <p className="mt-1 font-semibold text-[#30213D]">
                          {tuition.subject}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="mt-1 text-[#8B78B5]" size={20} />
                      <div>
                        <p className="text-sm text-[#64748B]">Class Level</p>
                        <p className="mt-1 font-semibold text-[#30213D]">
                          {tuition.classLevel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Monitor className="mt-1 text-[#8B78B5]" size={20} />
                      <div>
                        <p className="text-sm text-[#64748B]">Mode</p>
                        <p className="mt-1 font-semibold text-[#30213D]">
                          {tuition.mode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 text-[#8B78B5]" size={20} />
                      <div>
                        <p className="text-sm text-[#64748B]">Location</p>
                        <p className="mt-1 font-semibold text-[#30213D]">
                          {tuition.location || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-1 text-[#8B78B5]" size={20} />
                      <div>
                        <p className="text-sm text-[#64748B]">Days per Week</p>
                        <p className="mt-1 font-semibold text-[#30213D]">
                          {tuition.daysPerWeek} days
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="mt-1 text-[#8B78B5]" size={20} />
                      <div>
                        <p className="text-sm text-[#64748B]">Monthly Fee</p>
                        <p className="mt-1 font-semibold text-[#30213D]">
                          {formatFee(tuition.monthlyFee)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-[#EAE4EF] bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-2xl font-bold text-[#30213D]">
                    About the Tutor
                  </h2>

                  <div className="mt-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0ECF6] text-xl font-bold text-[#75619E]">
                      {tuition.tutorName?.charAt(0)?.toUpperCase() || "T"}
                    </div>

                    <div>
                      <p className="text-lg font-bold text-[#30213D]">
                        {tuition.tutorName}
                      </p>
                      <p className="text-sm text-[#64748B]">Tutor</p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm text-[#64748B]">
                    Contact information is shared through the application
                    process.
                  </p>
                </div>
              </div>

              <aside>
                <div className="sticky top-24 rounded-2xl border border-[#EAE4EF] bg-white p-6 shadow-sm sm:p-7">
                  <p className="text-sm font-medium text-[#64748B]">
                    Monthly Tuition Fee
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#30213D]">
                    {formatFee(tuition.monthlyFee)}
                  </p>

                  <p className="mt-1 text-sm text-[#64748B]">
                    per month
                  </p>

                  <div className="my-6 border-t border-[#EAE4EF]" />

                  {!sessionPending && !session?.user && (
                    <div>
                      <h2 className="text-xl font-bold text-[#30213D]">
                        Interested in this tuition?
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[#64748B]">
                        Sign in with your Student account to submit an
                        application.
                      </p>
                      <Link
                        href="/sign-in"
                        className="mt-5 block rounded-xl bg-[#8B78B5] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#75619E]"
                      >
                        Sign In to Apply
                      </Link>
                    </div>
                  )}

                  {!sessionPending && session?.user?.role === "student" && (
                    <div>
                      <h2 className="text-xl font-bold text-[#30213D]">
                        Apply for this Tuition
                      </h2>

                      {applicationSubmitted ? (
                        <div className="mt-5 rounded-xl bg-[#F0ECF6] p-5">
                          <CheckCircle2
                            size={30}
                            className="mb-2 text-[#75619E]"
                          />
                          <p className="font-semibold text-[#30213D]">
                            Application already submitted
                          </p>
                          <p className="mt-1 text-sm text-[#64748B]">
                            You have submitted an application for this
                            tuition.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleApplication} className="mt-5 space-y-4">
                          <div>
                            <label
                              htmlFor="studentPhone"
                              className="mb-2 block text-sm font-medium text-[#30213D]"
                            >
                              Phone Number *
                            </label>
                            <input
                              id="studentPhone"
                              type="tel"
                              required
                              value={studentPhone}
                              onChange={(event) =>
                                setStudentPhone(event.target.value)
                              }
                              placeholder="Your contact number"
                              className="h-12 w-full rounded-xl border border-[#EAE4EF] px-4 text-sm text-[#30213D] outline-none focus:border-[#8B78B5]"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="preferredSchedule"
                              className="mb-2 block text-sm font-medium text-[#30213D]"
                            >
                              Preferred Schedule *
                            </label>
                            <input
                              id="preferredSchedule"
                              type="text"
                              required
                              value={preferredSchedule}
                              onChange={(event) =>
                                setPreferredSchedule(event.target.value)
                              }
                              placeholder="e.g. Evening, 3 days/week"
                              className="h-12 w-full rounded-xl border border-[#EAE4EF] px-4 text-sm text-[#30213D] outline-none focus:border-[#8B78B5]"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="studentNote"
                              className="mb-2 block text-sm font-medium text-[#30213D]"
                            >
                              Learning Note
                            </label>
                            <textarea
                              id="studentNote"
                              rows={4}
                              value={studentNote}
                              onChange={(event) =>
                                setStudentNote(event.target.value)
                              }
                              placeholder="Tell the tutor about your learning goals..."
                              className="w-full resize-y rounded-xl border border-[#EAE4EF] px-4 py-3 text-sm text-[#30213D] outline-none focus:border-[#8B78B5]"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-[#8B78B5] px-5 py-3 font-semibold text-white transition hover:bg-[#75619E] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {submitting ? "Submitting..." : "Submit Application"}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {!sessionPending &&
                    session?.user &&
                    session.user.role !== "student" && (
                      <div className="rounded-xl bg-[#F7F3EF] p-5">
                        <h2 className="font-bold text-[#30213D]">
                          Student Applications Only
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[#64748B]">
                          You are signed in as a{" "}
                          <span className="font-semibold">
                            {session.user.role}
                          </span>
                          . Only Student accounts can apply for tuition
                          listings.
                        </p>
                      </div>
                    )}

                  {sessionPending && (
                    <div className="h-32 animate-pulse rounded-xl bg-[#EAE4EF]" />
                  )}
                </div>
              </aside>
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
