"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Users,
  Crown,
  PlusCircle,
  ClipboardList,
  UserRound,
  ArrowRight,
  LoaderCircle,
  RefreshCw,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TutorDashboard() {
  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/dashboard/tutor`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load dashboard.");
      }

      setStats(result.data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (sessionPending) return;

    if (session?.user) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [sessionPending, session, fetchStats]);

  const isPro = stats?.plan === "pro";
  const tutorName =
    stats?.tutorName || session?.user?.name || "Tutor";

  const statCards = [
    {
      label: "Total Tuitions Posted",
      value: stats?.totalTuitions ?? 0,
      description: "All your tuition listings",
      icon: BookOpen,
      color: "bg-[#F0EAF7] text-[#8066A8]",
    },
    {
      label: "Active/Approved Tuitions",
      value: stats?.activeTuitions ?? 0,
      description: "Approved and active listings",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Applicants Received",
      value: stats?.totalApplicants ?? 0,
      description: "Students who applied to your tuitions",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Current Plan",
      value: stats?.plan === "pro" ? "Pro" : "Free",
      description: isPro
        ? "Tutor Pro membership"
        : "Tutor Free membership",
      icon: Crown,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const quickActions = [
    {
      title: "Post a Tuition",
      description: "Create a new tuition listing and find students.",
      href: "/dashboard/tutor/post-tuition",
      icon: PlusCircle,
    },
    {
      title: "My Tuitions",
      description: "Review and manage your existing tuition listings.",
      href: "/dashboard/tutor/my-tuitions",
      icon: ClipboardList,
    },
    {
      title: "Applicants",
      description: "See students who have applied to your tuitions.",
      href: "/dashboard/tutor/applicants",
      icon: Users,
    },
  ];

  if (sessionPending || loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3">
        <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
        <p className="text-sm font-medium text-[#756B80]">
          Loading your tutor dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#70558F] to-[#9B83BB] p-7 text-white shadow-sm sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 text-sm font-medium text-white/80">
            Tutor Dashboard
          </p>

          <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Welcome back, {tutorName.split(" ")[0]}!
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
            Manage your tuition opportunities, connect with students and
            grow your teaching journey with MentorLagbe.
          </p>

          <Link
            href="/dashboard/tutor/post-tuition"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#70558F] transition hover:bg-[#F3EDF9]"
          >
            <PlusCircle size={17} />
            Post a Tuition
          </Link>
        </div>

        <GraduationCap
          className="absolute -bottom-8 -right-4 h-44 w-44 text-white/10 sm:h-56 sm:w-56"
          strokeWidth={1}
        />
      </section>

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={19} />
            {error}
          </div>

          <button
            type="button"
            onClick={fetchStats}
            className="inline-flex items-center gap-2 self-start font-semibold hover:underline"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#30213D]">
              Dashboard Overview
            </h2>
            <p className="mt-1 text-sm text-[#95879F]">
              Your tuition, applicant and membership statistics.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchStats}
            className="inline-flex items-center gap-2 rounded-lg border border-[#EAE4F0] bg-white px-3 py-2 text-sm font-semibold text-[#8066A8] hover:bg-[#F7F4FA]"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-[#EAE4F0] bg-white p-5 transition hover:shadow-md hover:shadow-[#70558F]/5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon size={21} />
                  </div>

                  <span className="text-2xl font-bold text-[#30213D]">
                    {item.value}
                  </span>
                </div>

                <h3 className="mt-5 text-sm font-bold text-[#30213D]">
                  {item.label}
                </h3>

                <p className="mt-1 text-xs leading-5 text-[#95879F]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {!isPro && (
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#EAE4F0] bg-white p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Crown size={21} />
            </div>
            <div>
              <h2 className="font-bold text-[#30213D]">
                Upgrade to Tutor Pro
              </h2>
              <p className="mt-1 text-sm text-[#95879F]">
                Get unlimited tuition posts with Tutor Pro.
              </p>
            </div>
          </div>

          <Link
            href="/pricing?role=tutor"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8066A8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#70558F]"
          >
            View Pro Plan <ArrowRight size={16} />
          </Link>
        </section>
      )}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#30213D]">
            Manage Your Teaching
          </h2>
          <p className="mt-1 text-sm text-[#95879F]">
            Quick access to your tutor tools.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-[#EAE4F0] bg-white p-5 transition hover:-translate-y-1 hover:border-[#CFC0DF] hover:shadow-lg hover:shadow-[#70558F]/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EAF7] text-[#8066A8] transition group-hover:bg-[#8066A8] group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h3 className="font-bold text-[#30213D]">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#95879F]">
                  {action.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8066A8]">
                  Open <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-[#EAE4F0] bg-white p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0EAF7] text-[#8066A8]">
            <UserRound size={21} />
          </div>

          <div>
            <h2 className="font-bold text-[#30213D]">
              Grow your teaching profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#95879F]">
              Create detailed tuition listings, respond to student
              applications and keep your profile updated to build trust
              with learners.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
