"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RefreshCw,
  LoaderCircle,
  CheckCircle2,
  XCircle,
  Clock3,
  Mail,
  Phone,
  CalendarDays,
  BookOpen,
  MessageSquare,
  GraduationCap,
  UserRound,
  ClipboardList,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const Icon = {
    pending: Clock3,
    accepted: CheckCircle2,
    rejected: XCircle,
  }[status] || Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] || "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      <Icon size={13} />
      {status || "Pending"}
    </span>
  );
}

export default function TutorApplicantsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await apiFetch("/api/tutor-applicants", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load applicants.");
      }

      setApplications(result.data || []);
    } catch (error) {
      console.error("Fetch applicants error:", error);
      toast.error(error.message || "Could not load applicants.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && session?.user?.role === "tutor") {
      fetchApplicants();
    }
  }, [isPending, session, fetchApplicants]);

  const handleStatusUpdate = async (application, status) => {
    const studentName = application.studentName || "this student";

    const confirmed = window.confirm(
      `Are you sure you want to ${status} the application from ${studentName}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(application._id);

      const response = await apiFetch(
        `/api/tutor-applicants/${application._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update application."
        );
      }

      setApplications((previous) =>
        previous.map((item) =>
          item._id === application._id
            ? result.data
            : item
        )
      );

      toast.success(
        status === "accepted"
          ? "Student application accepted."
          : "Student application rejected."
      );
    } catch (error) {
      console.error("Update application status error:", error);
      toast.error(error.message || "Could not update application.");
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    all: applications.length,
    pending: applications.filter(
      (item) => item.status === "pending"
    ).length,
    accepted: applications.filter(
      (item) => item.status === "accepted"
    ).length,
    rejected: applications.filter(
      (item) => item.status === "rejected"
    ).length,
  };

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase();

    const matchesSearch = [
      application.studentName,
      application.studentEmail,
      application.studentPhone,
      application.tuitionTitle,
      application.preferredSchedule,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );

    const matchesFilter =
      filter === "all" || application.status === filter;

    return matchesSearch && matchesFilter;
  });

  if (isPending || loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
          <p className="text-sm text-[#887D92]">
            Loading applicants...
          </p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "tutor") {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">
          This page is only available to tutors.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7">

      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#8066A8]">
            <Users size={17} />
            Tutor Workspace
          </div>

          <h1 className="text-2xl font-bold text-[#30213D] sm:text-3xl">
            Manage Applicants
          </h1>

          <p className="mt-2 text-sm text-[#887D92]">
            Review student applications for your tuition listings
            and decide who to accept.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchApplicants(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E1EF] bg-white px-4 py-3 text-sm font-semibold text-[#70558F] transition hover:bg-[#F7F4FA] disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total Applicants",
            value: counts.all,
            icon: Users,
            color: "text-[#8066A8]",
            bg: "bg-[#EEE8F5]",
          },
          {
            label: "Pending",
            value: counts.pending,
            icon: Clock3,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Accepted",
            value: counts.accepted,
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Rejected",
            value: counts.rejected,
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-[#EAE4F0] bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-[#95879F]">
                  {item.label}
                </p>

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                >
                  <Icon size={18} />
                </div>
              </div>

              <p className="mt-2 text-2xl font-bold text-[#30213D]">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search and filters */}
      <div className="space-y-4 rounded-2xl border border-[#EAE4F0] bg-white p-4 sm:p-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69AAF]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student, email or tuition title..."
            className="w-full rounded-xl border border-[#E8E1EF] bg-white py-3 pl-11 pr-4 text-sm text-[#30213D] outline-none transition placeholder:text-[#B0A5B9] focus:border-[#8066A8] focus:ring-2 focus:ring-[#8066A8]/10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["all", `All (${counts.all})`],
            ["pending", `Pending (${counts.pending})`],
            ["accepted", `Accepted (${counts.accepted})`],
            ["rejected", `Rejected (${counts.rejected})`],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                filter === value
                  ? "bg-[#8066A8] text-white"
                  : "border border-[#E8E1EF] bg-white text-[#756B80] hover:bg-[#F7F4FA]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Applicant Cards */}
      {filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCD1E7] bg-white px-5 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE8F5] text-[#8066A8]">
            <Inbox size={27} />
          </div>

          <h2 className="text-lg font-bold text-[#30213D]">
            {applications.length === 0
              ? "No applicants yet"
              : "No matching applications"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#95879F]">
            {applications.length === 0
              ? "When students apply to your tuition listings, their applications will appear here."
              : "Try a different search term or status filter."}
          </p>

          {applications.length === 0 && (
            <Link
              href="/dashboard/tutor/my-tuitions"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#8066A8] px-5 py-3 text-sm font-bold text-white hover:bg-[#70558F]"
            >
              <BookOpen size={17} />
              View My Tuitions
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {filteredApplications.map((application) => {
            const isUpdating = updatingId === application._id;

            return (
              <article
                key={application._id}
                className="rounded-2xl border border-[#EAE4F0] bg-white p-5 shadow-sm sm:p-6"
              >
                {/* Card header */}
                <div className="flex flex-col gap-3 border-b border-[#F0ECF4] pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEE8F5] text-[#8066A8]">
                      <UserRound size={23} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-bold text-[#30213D]">
                        {application.studentName || "Student"}
                      </h2>

                      <p className="mt-1 break-all text-sm text-[#887D92]">
                        {application.studentEmail}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={application.status} />
                </div>

                {/* Application details */}
                <div className="grid gap-5 py-5 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#A69AAF]">
                        <BookOpen size={15} />
                        Tuition Applied For
                      </p>

                      <p className="text-sm font-semibold text-[#493B56]">
                        {application.tuitionTitle || "Tuition"}
                      </p>

                      {application.subject && (
                        <p className="mt-1 text-xs text-[#95879F]">
                          {application.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#A69AAF]">
                        <Phone size={15} />
                        Phone Number
                      </p>

                      <p className="text-sm text-[#493B56]">
                        {application.studentPhone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#A69AAF]">
                        <CalendarDays size={15} />
                        Preferred Schedule
                      </p>

                      <p className="text-sm text-[#493B56]">
                        {application.preferredSchedule || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#A69AAF]">
                        <Mail size={15} />
                        Student Email
                      </p>

                      <p className="break-all text-sm text-[#493B56]">
                        {application.studentEmail || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#A69AAF]">
                        <GraduationCap size={15} />
                        Applied Date
                      </p>

                      <p className="text-sm text-[#493B56]">
                        {formatDate(application.appliedAt)}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#A69AAF]">
                        <ClipboardList size={15} />
                        Monthly Tuition Fee
                      </p>

                      <p className="text-sm font-semibold text-[#493B56]">
                        ৳{Number(application.monthlyFee || 0).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student Note */}
                <div className="rounded-xl bg-[#F9F7FB] p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#A69AAF]">
                    <MessageSquare size={15} />
                    Student Note
                  </p>

                  <p className="whitespace-pre-wrap text-sm leading-6 text-[#756B80]">
                    {application.studentNote?.trim() ||
                      "No additional note provided."}
                  </p>
                </div>

                {/* Accept / Reject */}
                {application.status === "pending" && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-[#F0ECF4] pt-4 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(application, "rejected")
                      }
                      disabled={isUpdating}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdating ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <XCircle size={16} />
                      )}
                      Reject
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(application, "accepted")
                      }
                      disabled={isUpdating}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8066A8] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#70558F] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdating ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      Accept Application
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}