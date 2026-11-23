
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  RefreshCw,
  LoaderCircle,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  MapPin,
  CalendarDays,
  GraduationCap,
  UserRound,
  Wallet,
  Inbox,
  Monitor,
  Eye,
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

function ApprovalBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const icons = {
    pending: Clock3,
    approved: CheckCircle2,
    rejected: XCircle,
  };

  const Icon = icons[status] || Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] || "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      <Icon size={13} />
      {status || "Unknown"}
    </span>
  );
}

export default function AdminTuitionsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTuition, setSelectedTuition] = useState(null);

  const fetchTuitions = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await apiFetch("/api/admin/tuitions", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load tuition posts.");
      }

      setTuitions(result.data || []);
    } catch (error) {
      console.error("Admin tuitions fetch error:", error);
      toast.error(error.message || "Could not load tuition posts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      fetchTuitions();
    }
  }, [isPending, session, fetchTuitions]);

  const counts = useMemo(
    () => ({
      all: tuitions.length,
      pending: tuitions.filter(
        (item) => item.approvalStatus === "pending"
      ).length,
      approved: tuitions.filter(
        (item) => item.approvalStatus === "approved"
      ).length,
      rejected: tuitions.filter(
        (item) => item.approvalStatus === "rejected"
      ).length,
    }),
    [tuitions]
  );

  const filteredTuitions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tuitions.filter((tuition) => {
      const matchesSearch =
        !query ||
        [
          tuition.title,
          tuition.subject,
          tuition.classLevel,
          tuition.tutorName,
          tuition.tutorEmail,
          tuition.location,
          tuition.mode,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesFilter =
        filter === "all" || tuition.approvalStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tuitions, search, filter]);

  const handleApproval = async (tuition, approvalStatus) => {
    const action = approvalStatus === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${tuition.title}"?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(tuition._id);

      const response = await apiFetch(
        `/api/admin/tuitions/${tuition._id}/approval`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ approvalStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update tuition status."
        );
      }

      setTuitions((previous) =>
        previous.map((item) =>
          item._id === tuition._id ? result.data : item
        )
      );

      setSelectedTuition((previous) =>
        previous?._id === tuition._id ? result.data : previous
      );

      toast.success(
        approvalStatus === "approved"
          ? "Tuition post approved successfully."
          : "Tuition post rejected successfully."
      );
    } catch (error) {
      console.error("Tuition approval error:", error);
      toast.error(error.message || "Could not update tuition status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
          <p className="text-sm text-[#887D92]">
            Loading tuition posts...
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
          You do not have permission to manage tuition posts.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#8066A8]">
            <ShieldCheck size={17} />
            Administration
          </div>

          <h1 className="text-2xl font-bold text-[#30213D] sm:text-3xl">
            Manage Tuitions
          </h1>

          <p className="mt-2 text-sm text-[#887D92]">
            Review tutor submissions and manage tuition approvals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchTuitions(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E1EF] bg-white px-4 py-3 text-sm font-semibold text-[#70558F] transition hover:bg-[#F7F4FA] disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh Tuitions
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total Tuitions",
            value: counts.all,
            icon: BookOpen,
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
            label: "Approved",
            value: counts.approved,
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
            placeholder="Search title, subject, tutor or location..."
            className="w-full rounded-xl border border-[#E8E1EF] bg-white py-3 pl-11 pr-4 text-sm text-[#30213D] outline-none transition placeholder:text-[#B0A5B9] focus:border-[#8066A8] focus:ring-2 focus:ring-[#8066A8]/10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["all", `All (${counts.all})`],
            ["pending", `Pending (${counts.pending})`],
            ["approved", `Approved (${counts.approved})`],
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

      {/* Tuition list */}
      {filteredTuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCD1E7] bg-white px-5 py-16 text-center">
          <Inbox className="mx-auto mb-4 h-10 w-10 text-[#A69AAF]" />
          <h2 className="text-lg font-bold text-[#30213D]">
            {tuitions.length === 0
              ? "No tuition posts found"
              : "No matching tuition posts"}
          </h2>
          <p className="mt-2 text-sm text-[#95879F]">
            {tuitions.length === 0
              ? "Tuition posts submitted by tutors will appear here."
              : "Try changing your search or approval filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredTuitions.map((tuition) => {
            const isUpdating = updatingId === tuition._id;

            return (
              <article
                key={tuition._id}
                className="overflow-hidden rounded-2xl border border-[#EAE4F0] bg-white shadow-sm"
              >
                {tuition.bannerImage ? (
                  <img
                    src={tuition.bannerImage}
                    alt={tuition.title || "Tuition banner"}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center bg-[#EEE8F5] text-[#8066A8]">
                    <BookOpen size={38} />
                  </div>
                )}

                <div className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-[#30213D]">
                        {tuition.title}
                      </h2>
                      <p className="mt-1 text-sm text-[#887D92]">
                        {tuition.subject || "Subject not specified"}
                      </p>
                    </div>

                    <ApprovalBadge status={tuition.approvalStatus} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#FAF8FC] p-4">
                    <div className="flex items-center gap-2 text-sm text-[#756B80]">
                      <GraduationCap size={16} className="shrink-0 text-[#8066A8]" />
                      <span>{tuition.classLevel || "—"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#756B80]">
                      <Monitor size={16} className="shrink-0 text-[#8066A8]" />
                      <span>{tuition.mode || "—"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#756B80]">
                      <MapPin size={16} className="shrink-0 text-[#8066A8]" />
                      <span className="break-words">
                        {tuition.location || "—"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#756B80]">
                      <CalendarDays size={16} className="shrink-0 text-[#8066A8]" />
                      <span>{tuition.daysPerWeek || "—"} days/week</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#A096A9]">
                        Monthly Fee
                      </p>
                      <p className="mt-1 flex items-center gap-1 font-bold text-[#30213D]">
                        <Wallet size={15} className="text-[#8066A8]" />
                        ৳{Number(tuition.monthlyFee || 0).toLocaleString("en-BD")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#A096A9]">
                        Listing Status
                      </p>
                      <p
                        className={`mt-1 text-sm font-semibold ${
                          tuition.isActive
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {tuition.isActive ? "Active" : "Closed"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#F0ECF4] pt-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#A096A9]">
                      <UserRound size={14} />
                      Posted By
                    </p>

                    <p className="text-sm font-semibold text-[#493B56]">
                      {tuition.tutorName || "Tutor"}
                    </p>

                    <p className="mt-1 break-all text-xs text-[#95879F]">
                      {tuition.tutorEmail}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-[#F0ECF4] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedTuition(tuition)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E1EF] px-4 py-2.5 text-sm font-semibold text-[#70558F] transition hover:bg-[#F7F4FA]"
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    {tuition.approvalStatus === "pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleApproval(tuition, "rejected")
                          }
                          disabled={isUpdating}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:flex-none"
                        >
                          {isUpdating ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : (
                            <XCircle size={15} />
                          )}
                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleApproval(tuition, "approved")
                          }
                          disabled={isUpdating}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#8066A8] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#70558F] disabled:opacity-50 sm:flex-none"
                        >
                          {isUpdating ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={15} />
                          )}
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Tuition details modal */}
      {selectedTuition && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedTuition(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tuition-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {selectedTuition.bannerImage && (
              <img
                src={selectedTuition.bannerImage}
                alt={selectedTuition.title || "Tuition banner"}
                className="h-52 w-full object-cover"
              />
            )}

            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2
                    id="tuition-detail-title"
                    className="text-xl font-bold text-[#30213D]"
                  >
                    {selectedTuition.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#887D92]">
                    {selectedTuition.subject}
                  </p>
                </div>

                <ApprovalBadge status={selectedTuition.approvalStatus} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Class Level", selectedTuition.classLevel],
                  ["Mode", selectedTuition.mode],
                  ["Location", selectedTuition.location],
                  ["Monthly Fee", `৳${Number(selectedTuition.monthlyFee || 0).toLocaleString("en-BD")}`],
                  ["Days per Week", selectedTuition.daysPerWeek],
                  ["Posted Date", formatDate(selectedTuition.createdAt)],
                  ["Listing Status", selectedTuition.isActive ? "Active" : "Closed"],
                  ["Tutor Name", selectedTuition.tutorName],
                  ["Tutor Email", selectedTuition.tutorEmail],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-[#FAF8FC] p-3"
                  >
                    <p className="text-xs text-[#A096A9]">{label}</p>
                    <p className="mt-1 break-words text-sm font-semibold text-[#493B56]">
                      {value || "—"}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-2 text-sm font-bold text-[#493B56]">
                  Description
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#756B80]">
                  {selectedTuition.description || "No description provided."}
                </p>
              </div>

              {selectedTuition.approvalStatus === "pending" && (
                <div className="flex flex-col gap-3 border-t border-[#F0ECF4] pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleApproval(selectedTuition, "rejected")
                    }
                    disabled={updatingId === selectedTuition._id}
                    className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Reject Tuition
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleApproval(selectedTuition, "approved")
                    }
                    disabled={updatingId === selectedTuition._id}
                    className="rounded-xl bg-[#8066A8] px-5 py-3 text-sm font-bold text-white hover:bg-[#70558F] disabled:opacity-50"
                  >
                    Approve Tuition
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedTuition(null)}
                className="w-full rounded-xl border border-[#E8E1EF] px-5 py-3 text-sm font-semibold text-[#756B80] hover:bg-[#F7F4FA]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
