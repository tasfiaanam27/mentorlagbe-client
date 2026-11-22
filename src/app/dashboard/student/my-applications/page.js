"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  RefreshCw,
  CalendarDays,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatFee = (fee) => {
  const amount = Number(fee);

  if (!Number.isFinite(amount)) return "Not specified";

  return `৳${amount.toLocaleString("en-BD")}/month`;
};

export default function MyApplicationsPage() {
  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchApplications = useCallback(async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/applications/my-applications`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load applications.");
      }

      setApplications(result.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (sessionPending) return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    fetchApplications();
  }, [sessionPending, session, fetchApplications]);

  const handleCancel = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this tuition application? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setCancellingId(applicationId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/api/applications/${applicationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel application.");
      }

      setApplications((previous) =>
        previous.filter(
          (application) => application._id !== applicationId
        )
      );

      setSuccessMessage("Your application has been cancelled successfully.");
    } catch (err) {
      setError(err.message || "Could not cancel this application.");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter(
          (application) => application.status === filter
        );

  const pendingCount = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  if (sessionPending || loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3">
        <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
        <p className="text-sm font-medium text-[#756B80]">
          Loading your applications...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-[#95879F]">
            <Link
              href="/dashboard/student"
              className="hover:text-[#8066A8]"
            >
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-medium text-[#70558F]">
              My Applications
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#30213D] sm:text-3xl">
            My Applications
          </h1>

          <p className="mt-2 text-sm text-[#95879F]">
            Track and manage all your tuition applications.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#EAE4F0] bg-white px-4 py-3 text-sm font-semibold text-[#70558F] transition hover:bg-[#F7F4FA] disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          <CheckCircle2 size={19} />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} />
          {error}
        </div>
      )}

      {/* Application statistics */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          {
            label: "Total Applications",
            value: applications.length,
            icon: FileText,
            color: "bg-[#F0EAF7] text-[#8066A8]",
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: Clock,
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Accepted",
            value: acceptedCount,
            icon: CheckCircle2,
            color: "bg-green-50 text-green-600",
          },
          {
            label: "Rejected",
            value: rejectedCount,
            icon: XCircle,
            color: "bg-red-50 text-red-500",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-[#EAE4F0] bg-white p-4 sm:p-5"
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon size={20} />
              </div>

              <p className="text-xs font-medium text-[#95879F] sm:text-sm">
                {item.label}
              </p>

              <p className="mt-1 text-2xl font-bold text-[#30213D]">
                {item.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Application list */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE4F0] bg-white">
        <div className="border-b border-[#F0ECF4] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#30213D]">
                Application History
              </h2>
              <p className="mt-1 text-sm text-[#95879F]">
                {applications.length} application
                {applications.length === 1 ? "" : "s"} submitted
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["all", "pending", "accepted", "rejected"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${
                    filter === item
                      ? "bg-[#8066A8] text-white"
                      : "bg-[#F7F4FA] text-[#756B80] hover:bg-[#EEE8F5]"
                  }`}
                >
                  {item === "all" ? "All" : item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0EAF7] text-[#8066A8]">
              <BookOpen size={30} />
            </div>

            <h3 className="text-lg font-bold text-[#30213D]">
              No applications yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#95879F]">
              You haven't applied for any tuition opportunities yet. Explore
              available tuitions and find the right learning opportunity.
            </p>

            <Link
              href="/tuitions"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8066A8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#70558F]"
            >
              Browse Tuitions <ArrowRight size={17} />
            </Link>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Search className="mx-auto mb-3 h-8 w-8 text-[#B5A8C3]" />
            <h3 className="font-bold text-[#30213D]">
              No {filter} applications
            </h3>
            <p className="mt-2 text-sm text-[#95879F]">
              There are no applications with this status.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0ECF4]">
            {filteredApplications.map((application) => (
              <article
                key={application._id}
                className="p-5 transition hover:bg-[#FCFAFD] sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-[#F0EAF7] px-3 py-1 text-xs font-bold text-[#70558F]">
                        {application.subject || "General"}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${
                          statusStyles[application.status] ||
                          "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#30213D]">
                      {application.tuitionTitle || "Tuition opportunity"}
                    </h3>

                    <div className="mt-4 grid gap-3 text-sm text-[#756B80] sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <FileText
                          size={16}
                          className="shrink-0 text-[#A28CB9]"
                        />
                        <span className="break-all">
                          Tutor: {application.tutorEmail || "Not available"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <BookOpen
                          size={16}
                          className="shrink-0 text-[#A28CB9]"
                        />
                        <span>{formatFee(application.monthlyFee)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="shrink-0 text-[#A28CB9]"
                        />
                        <span>
                          Applied: {formatDate(application.appliedAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock
                          size={16}
                          className="shrink-0 text-[#A28CB9]"
                        />
                        <span className="break-words">
                          {application.preferredSchedule || "Schedule not provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 lg:flex-col lg:items-end">
                    {application.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancel(application._id)}
                        disabled={cancellingId === application._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancellingId === application._id ? (
                          <LoaderCircle
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Cancel Application
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[#A69AAF]">
          Application information is retrieved from your account.
        </p>

        <Link
          href="/tuitions"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8066A8] hover:text-[#5F477F]"
        >
          Explore more tuitions <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
