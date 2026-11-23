"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock3,
  CheckCircle2,
  XCircle,
  Wallet,
  RefreshCw,
  LoaderCircle,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  } catch {
    return `${currency || "USD"} ${Number(amount || 0).toLocaleString()}`;
  }
}

export default function AdminDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/api/admin/overview`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Could not load admin statistics."
        );
      }

      setStats(result.data);
    } catch (error) {
      console.error("Admin overview error:", error);
      toast.error(error.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      fetchOverview();
    }
  }, [isPending, session, fetchOverview]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
          <p className="text-sm text-[#887D92]">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h2 className="font-bold text-[#30213D]">
          Admin access required
        </h2>
        <p className="mt-2 text-sm text-[#887D92]">
          You do not have permission to view this dashboard.
        </p>
      </div>
    );
  }

  const revenue = stats?.revenueByCurrency || [];
  const tuitionStats = stats?.tuitions || {};

  const statCards = [
    {
      title: "Total Users",
      value: Number(stats?.totalUsers || 0).toLocaleString(),
      description: "Registered platform users",
      icon: Users,
      iconColor: "text-[#8066A8]",
      iconBg: "bg-[#EEE8F5]",
    },
    {
      title: "Total Tutors",
      value: Number(stats?.totalTutors || 0).toLocaleString(),
      description: "Registered tutor accounts",
      icon: GraduationCap,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Pending Tuitions",
      value: Number(tuitionStats.pending || 0).toLocaleString(),
      description: "Waiting for admin review",
      icon: Clock3,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      title: "Approved Tuitions",
      value: Number(tuitionStats.approved || 0).toLocaleString(),
      description: "Approved tuition listings",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-7">

      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#8066A8]">
            <ShieldCheck size={17} />
            Administration
          </div>

          <h1 className="text-2xl font-bold text-[#30213D] sm:text-3xl">
            Admin Overview
          </h1>

          <p className="mt-2 text-sm text-[#887D92]">
            Monitor users, tuition listings, and platform revenue.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOverview(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E1EF] bg-white px-4 py-3 text-sm font-semibold text-[#70558F] transition hover:bg-[#F7F4FA] disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh Statistics
        </button>
      </div>

      {/* Main statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-[#EAE4F0] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#887D92]">
                    {card.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-[#30213D]">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon size={23} />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#A096A9]">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tuition approval summary and rejected count */}
      <section className="rounded-2xl border border-[#EAE4F0] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#30213D]">
              Tuition Approval Summary
            </h2>
            <p className="mt-1 text-sm text-[#95879F]">
              Current status of all tuition listings
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEE8F5] text-[#8066A8]">
            <BookOpen size={21} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Clock3 size={17} />
              <span className="text-sm font-semibold">Pending</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-800">
              {Number(tuitionStats.pending || 0).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 size={17} />
              <span className="text-sm font-semibold">Approved</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-green-800">
              {Number(tuitionStats.approved || 0).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle size={17} />
              <span className="text-sm font-semibold">Rejected</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-red-800">
              {Number(tuitionStats.rejected || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Stripe revenue */}
      <section className="rounded-2xl border border-[#EAE4F0] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#8066A8]">
              <Wallet size={19} />
              <span className="text-sm font-semibold">
                Stripe Revenue
              </span>
            </div>

            <h2 className="mt-2 text-xl font-bold text-[#30213D]">
              Total Subscription Revenue
            </h2>

            <p className="mt-1 text-sm text-[#95879F]">
              Based on recorded successful payments
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEE8F5] text-[#8066A8]">
            <Wallet size={23} />
          </div>
        </div>

        {revenue.length > 0 ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {revenue.map((item) => (
              <div
                key={item.currency}
                className="rounded-xl border border-[#EEE8F5] bg-[#FAF8FC] p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#95879F]">
                  {item.currency}
                </p>

                <p className="mt-2 text-2xl font-bold text-[#30213D]">
                  {formatMoney(item.totalRevenue, item.currency)}
                </p>

                <p className="mt-2 text-xs text-[#95879F]">
                  {Number(item.transactionCount || 0).toLocaleString()} successful payments
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-[#DCD1E7] bg-[#FAF8FC] px-4 py-8 text-center">
            <AlertCircle className="mx-auto mb-2 h-6 w-6 text-[#A69AAF]" />
            <p className="text-sm font-medium text-[#756B80]">
              No successful payments recorded yet.
            </p>
          </div>
        )}
      </section>

      {/* Admin management shortcuts */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-[#30213D]">
          Management
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Manage Users",
              description: "View registered users and manage their roles.",
              href: "/dashboard/admin/users",
              icon: Users,
            },
            {
              title: "Manage Tuitions",
              description: "Review, approve, or reject tuition listings.",
              href: "/dashboard/admin/tuitions",
              icon: BookOpen,
            },
            {
              title: "Transactions",
              description: "Review subscription payment records.",
              href: "/dashboard/admin/transactions",
              icon: Wallet,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[#EAE4F0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#CFC1DF] hover:shadow-md"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[#8066A8]">
                    <Icon size={19} />
                    <h3 className="font-bold text-[#30213D]">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs leading-5 text-[#95879F]">
                    {item.description}
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-[#A69AAF] transition group-hover:translate-x-1 group-hover:text-[#8066A8]"
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
