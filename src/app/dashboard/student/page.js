"use client";

import Link from "next/link";
import {
  BookOpen,
  FileText,
  Search,
  Crown,
  ArrowRight,
  GraduationCap,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const quickActions = [
  {
    title: "Browse Tuitions",
    description: "Explore available tuition opportunities and find the right tutor.",
    href: "/tuitions",
    icon: Search,
  },
  {
    title: "My Applications",
    description: "View your submitted applications and their current status.",
    href: "/dashboard/student/my-applications",
    icon: FileText,
  },
  {
    title: "Upgrade to Pro",
    description: "Unlock unlimited bookmarks with the Student Pro plan.",
    href: "/pricing?role=student",
    icon: Crown,
  },
];

export default function StudentDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isPro = user?.plan === "pro";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#70558F] to-[#9B83BB] p-7 text-white shadow-sm sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 text-sm font-medium text-white/80">
            Student Workspace
          </p>

          <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Welcome back, {user?.name?.split(" ")[0] || "Student"}!
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
            Your next learning opportunity is waiting. Explore tuition
            opportunities, manage your applications and connect with tutors.
          </p>

          <Link
            href="/tuitions"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#70558F] transition hover:bg-[#F3EDF9]"
          >
            Find a Tuition <ArrowRight size={17} />
          </Link>
        </div>

        <GraduationCap
          className="absolute -bottom-8 -right-4 h-44 w-44 text-white/10 sm:h-56 sm:w-56"
          strokeWidth={1}
        />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#30213D]">
              Your Account
            </h2>
            <p className="mt-1 text-sm text-[#95879F]">
              Your current membership and account information.
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
              isPro
                ? "bg-amber-100 text-amber-700"
                : "bg-[#EEE8F5] text-[#70558F]"
            }`}
          >
            {isPro ? <Crown size={15} /> : <GraduationCap size={15} />}
            {isPro ? "STUDENT PRO" : "FREE STUDENT PLAN"}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#EAE4F0] bg-white p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EAF7] text-[#8066A8]">
              <FileText size={21} />
            </div>
            <p className="text-sm text-[#95879F]">Applications</p>
            <p className="mt-1 text-lg font-bold text-[#30213D]">
              Manage Applications
            </p>
            <p className="mt-2 text-sm leading-5 text-[#95879F]">
              Review the tuitions you've applied for and follow their progress.
            </p>
            <Link
              href="/dashboard/student/my-applications"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8066A8] hover:text-[#5F477F]"
            >
              View applications <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-2xl border border-[#EAE4F0] bg-white p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EAF7] text-[#8066A8]">
              <BookOpen size={21} />
            </div>
            <p className="text-sm text-[#95879F]">Membership</p>
            <p className="mt-1 text-lg font-bold text-[#30213D]">
              {isPro ? "Pro Membership" : "Free Membership"}
            </p>
            <p className="mt-2 text-sm leading-5 text-[#95879F]">
              {isPro
                ? "You have access to unlimited tuition bookmarks."
                : "Your free plan includes up to 5 tuition bookmarks."}
            </p>
            <Link
              href="/pricing?role=student"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8066A8] hover:text-[#5F477F]"
            >
              View membership <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#30213D]">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-[#95879F]">
            Everything you need to get started.
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
            <Clock size={21} />
          </div>
          <div>
            <h2 className="font-bold text-[#30213D]">
              Your learning journey starts here
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#95879F]">
              Find a suitable tuition, submit an application and keep track of
              tutor responses from your dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
