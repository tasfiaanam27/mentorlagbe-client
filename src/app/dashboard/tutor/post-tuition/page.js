"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  PlusCircle,
  Search,
  MapPin,
  CalendarDays,
  Wallet,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  LoaderCircle,
  RefreshCw,
  X,
  ImagePlus,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const initialEditForm = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "Online",
  location: "",
  monthlyFee: "",
  daysPerWeek: "5",
  description: "",
};

const inputClass =
  "w-full rounded-xl border border-[#E8E1EF] bg-white px-4 py-3 text-sm text-[#30213D] outline-none transition placeholder:text-[#B0A5B9] focus:border-[#8066A8] focus:ring-2 focus:ring-[#8066A8]/10";

const labelClass = "mb-2 block text-sm font-semibold text-[#493B56]";

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatFee(fee) {
  return `৳${Number(fee || 0).toLocaleString("en-BD")}`;
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

  const Icon = icons[status] || AlertCircle;

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

function ActiveBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {isActive ? <Eye size={13} /> : <EyeOff size={13} />}
      {isActive ? "Active" : "Closed"}
    </span>
  );
}

export default function MyTuitionsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [editingTuition, setEditingTuition] = useState(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [newBanner, setNewBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const editFileRef = useRef(null);

  const fetchTuitions = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await apiFetch("/api/tutor/tuitions", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load your tuitions.");
      }

      setTuitions(result.data || []);
    } catch (error) {
      console.error("Fetch my tuitions error:", error);
      toast.error(error.message || "Could not load your tuitions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && session?.user?.role === "tutor") {
      fetchTuitions();
    }
  }, [isPending, session, fetchTuitions]);

  const filteredTuitions = tuitions.filter((tuition) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      tuition.title?.toLowerCase().includes(searchText) ||
      tuition.subject?.toLowerCase().includes(searchText) ||
      tuition.classLevel?.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && tuition.approvalStatus === "pending") ||
      (filter === "approved" && tuition.approvalStatus === "approved") ||
      (filter === "rejected" && tuition.approvalStatus === "rejected") ||
      (filter === "active" && tuition.isActive === true) ||
      (filter === "closed" && tuition.isActive === false);

    return matchesSearch && matchesFilter;
  });

  const openEditDialog = (tuition) => {
    setEditingTuition(tuition);

    setEditForm({
      title: tuition.title || "",
      subject: tuition.subject || "",
      classLevel: tuition.classLevel || "",
      mode: tuition.mode || "Online",
      location: tuition.location || "",
      monthlyFee: String(tuition.monthlyFee || ""),
      daysPerWeek: String(tuition.daysPerWeek || 5),
      description: tuition.description || "",
    });

    setNewBanner(null);
    setBannerPreview(tuition.bannerImage || "");
  };

  const closeEditDialog = () => {
    setEditingTuition(null);
    setEditForm(initialEditForm);
    setNewBanner(null);
    setBannerPreview("");

    if (editFileRef.current) {
      editFileRef.current.value = "";
    }
  };

  const updateEditField = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEditImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setNewBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () =>
        reject(new Error("Could not read the selected image."));

      reader.readAsDataURL(file);
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (
      !editForm.title.trim() ||
      !editForm.subject.trim() ||
      !editForm.classLevel.trim() ||
      !editForm.description.trim()
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    const fee = Number(editForm.monthlyFee);
    const days = Number(editForm.daysPerWeek);

    if (!Number.isFinite(fee) || fee <= 0 || fee > 1000000) {
      toast.error("Please enter a valid monthly fee.");
      return;
    }

    if (!Number.isInteger(days) || days < 1 || days > 7) {
      toast.error("Days per week must be between 1 and 7.");
      return;
    }

    if (editForm.mode === "Offline" && !editForm.location.trim()) {
      toast.error("Location is required for offline tuition.");
      return;
    }

    if (editForm.description.trim().length < 20) {
      toast.error("Description must contain at least 20 characters.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...editForm,
        monthlyFee: fee,
        daysPerWeek: days,
      };

      if (newBanner) {
        payload.bannerImage = await convertImageToBase64(newBanner);
      }

      const response = await apiFetch(
        `/api/tutor/tuitions/${editingTuition._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update tuition.");
      }

      setTuitions((previous) =>
        previous.map((tuition) =>
          tuition._id === editingTuition._id ? result.data : tuition
        )
      );

      toast.success("Tuition updated successfully.");
      closeEditDialog();
    } catch (error) {
      console.error("Update tuition error:", error);
      toast.error(error.message || "Could not update tuition.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (tuition) => {
    const nextStatus = !tuition.isActive;

    try {
      setTogglingId(tuition._id);

      const response = await apiFetch(
        `/api/tutor/tuitions/${tuition._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: nextStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not change tuition status.");
      }

      setTuitions((previous) =>
        previous.map((item) =>
          item._id === tuition._id
            ? { ...item, isActive: nextStatus }
            : item
        )
      );

      toast.success(
        nextStatus
          ? "Tuition is now active."
          : "Tuition has been closed."
      );
    } catch (error) {
      console.error("Toggle tuition status error:", error);
      toast.error(error.message || "Could not update status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (tuition) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${tuition.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(tuition._id);

      const response = await apiFetch(
        `/api/tutor/tuitions/${tuition._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete tuition.");
      }

      setTuitions((previous) =>
        previous.filter((item) => item._id !== tuition._id)
      );

      toast.success("Tuition deleted successfully.");
    } catch (error) {
      console.error("Delete tuition error:", error);
      toast.error(error.message || "Could not delete tuition.");
    } finally {
      setDeletingId(null);
    }
  };

  const counts = {
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
    active: tuitions.filter((item) => item.isActive).length,
    closed: tuitions.filter((item) => !item.isActive).length,
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
          <p className="text-sm text-[#887D92]">
            Loading your tuition listings...
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
            <BookOpen size={17} />
            Tutor Workspace
          </div>

          <h1 className="text-2xl font-bold text-[#30213D] sm:text-3xl">
            My Tuitions
          </h1>

          <p className="mt-2 text-sm text-[#887D92]">
            Manage your tuition listings, review approval status and
            control whether each listing is active.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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
            Refresh
          </button>

          <Link
            href="/dashboard/tutor/post-tuition"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8066A8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#70558F]"
          >
            <PlusCircle size={17} />
            Post New Tuition
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[
          { label: "Total Tuitions", value: counts.all },
          { label: "Pending Approval", value: counts.pending },
          { label: "Approved", value: counts.approved },
          { label: "Rejected", value: counts.rejected },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#EAE4F0] bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-[#95879F]">
              {item.label}
            </p>

            <p className="mt-2 text-2xl font-bold text-[#30213D]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
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
            placeholder="Search by tuition title, subject or class..."
            className={`${inputClass} pl-11`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["all", `All (${counts.all})`],
            ["pending", `Pending (${counts.pending})`],
            ["approved", `Approved (${counts.approved})`],
            ["rejected", `Rejected (${counts.rejected})`],
            ["active", `Active (${counts.active})`],
            ["closed", `Closed (${counts.closed})`],
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

      {/* Tuition Listings */}
      {filteredTuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCD1E7] bg-white px-5 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE8F5] text-[#8066A8]">
            <BookOpen size={26} />
          </div>

          <h2 className="text-lg font-bold text-[#30213D]">
            {tuitions.length === 0
              ? "No tuition listings yet"
              : "No matching tuitions found"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#95879F]">
            {tuitions.length === 0
              ? "Create your first tuition listing to start receiving applications from students."
              : "Try another search term or choose a different filter."}
          </p>

          {tuitions.length === 0 && (
            <Link
              href="/dashboard/tutor/post-tuition"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#8066A8] px-5 py-3 text-sm font-bold text-white hover:bg-[#70558F]"
            >
              <PlusCircle size={17} />
              Post Your First Tuition
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredTuitions.map((tuition) => (
            <article
              key={tuition._id}
              className="overflow-hidden rounded-2xl border border-[#EAE4F0] bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Banner */}
              <div className="relative h-44 bg-[#EEE8F5]">
                {tuition.bannerImage ? (
                  <img
                    src={tuition.bannerImage}
                    alt={tuition.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#8066A8]">
                    <BookOpen size={42} />
                  </div>
                )}

                <div className="absolute left-3 top-3">
                  <ApprovalBadge status={tuition.approvalStatus} />
                </div>

                <div className="absolute right-3 top-3">
                  <ActiveBadge isActive={tuition.isActive} />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 p-5">
                <div>
                  <h2 className="text-lg font-bold text-[#30213D]">
                    {tuition.title}
                  </h2>

                  <p className="mt-1 text-sm text-[#887D92]">
                    {tuition.subject} · {tuition.classLevel}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#756B80]">
                    <Wallet size={16} className="shrink-0 text-[#8066A8]" />
                    <span>{formatFee(tuition.monthlyFee)}/month</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#756B80]">
                    <CalendarDays
                      size={16}
                      className="shrink-0 text-[#8066A8]"
                    />
                    <span>{tuition.daysPerWeek} days/week</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#756B80]">
                    <MapPin size={16} className="shrink-0 text-[#8066A8]" />
                    <span className="truncate">
                      {tuition.mode}
                      {tuition.mode === "Offline" && tuition.location
                        ? ` · ${tuition.location}`
                        : ""}
                    </span>
                  </div>

                  <div className="text-sm text-[#756B80]">
                    Posted: {formatDate(tuition.createdAt)}
                  </div>
                </div>

                {tuition.approvalStatus === "pending" && (
                  <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                    Your tuition is awaiting admin approval. It will be
                    publicly visible after approval.
                  </p>
                )}

                {tuition.approvalStatus === "rejected" && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
                    This listing was rejected by the admin. You can edit
                    its details, but it will remain rejected until the
                    admin changes its approval status.
                  </p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 border-t border-[#F0ECF4] pt-4">
                  <button
                    type="button"
                    onClick={() => openEditDialog(tuition)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E8E1EF] px-3 py-2.5 text-sm font-semibold text-[#70558F] transition hover:bg-[#F7F4FA]"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(tuition)}
                    disabled={togglingId === tuition._id}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                      tuition.isActive
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {togglingId === tuition._id ? (
                      <LoaderCircle size={15} className="animate-spin" />
                    ) : tuition.isActive ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}

                    {tuition.isActive ? "Close" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(tuition)}
                    disabled={deletingId === tuition._id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                  >
                    {deletingId === tuition._id ? (
                      <LoaderCircle size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingTuition && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              closeEditDialog();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F0ECF4] bg-white px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-lg font-bold text-[#30213D]">
                  Edit Tuition
                </h2>
                <p className="mt-1 text-xs text-[#95879F]">
                  Update your tuition information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditDialog}
                disabled={saving}
                className="rounded-xl p-2 text-[#756B80] hover:bg-[#F7F4FA] disabled:opacity-50"
                aria-label="Close edit dialog"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5 p-5 sm:p-7">
              <div>
                <label htmlFor="edit-title" className={labelClass}>
                  Tuition Title *
                </label>
                <input
                  id="edit-title"
                  name="title"
                  value={editForm.title}
                  onChange={updateEditField}
                  maxLength={120}
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-subject" className={labelClass}>
                    Subject *
                  </label>
                  <input
                    id="edit-subject"
                    name="subject"
                    value={editForm.subject}
                    onChange={updateEditField}
                    maxLength={80}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="edit-class" className={labelClass}>
                    Class Level *
                  </label>
                  <input
                    id="edit-class"
                    name="classLevel"
                    value={editForm.classLevel}
                    onChange={updateEditField}
                    maxLength={80}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-mode" className={labelClass}>
                  Tuition Mode *
                </label>
                <select
                  id="edit-mode"
                  name="mode"
                  value={editForm.mode}
                  onChange={updateEditField}
                  className={inputClass}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-location" className={labelClass}>
                  Location {editForm.mode === "Offline" ? "*" : "(Optional)"}
                </label>
                <input
                  id="edit-location"
                  name="location"
                  value={editForm.location}
                  onChange={updateEditField}
                  maxLength={150}
                  required={editForm.mode === "Offline"}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-fee" className={labelClass}>
                    Monthly Fee (BDT) *
                  </label>
                  <input
                    id="edit-fee"
                    name="monthlyFee"
                    type="number"
                    min="1"
                    max="1000000"
                    step="1"
                    value={editForm.monthlyFee}
                    onChange={updateEditField}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="edit-days" className={labelClass}>
                    Days per Week *
                  </label>
                  <select
                    id="edit-days"
                    name="daysPerWeek"
                    value={editForm.daysPerWeek}
                    onChange={updateEditField}
                    className={inputClass}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <option key={day} value={day}>
                        {day} {day === 1 ? "Day" : "Days"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="edit-description" className={labelClass}>
                  Description *
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={5}
                  minLength={20}
                  maxLength={3000}
                  value={editForm.description}
                  onChange={updateEditField}
                  required
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Banner Image (Optional)
                </label>

                {bannerPreview && (
                  <div className="relative mb-3 overflow-hidden rounded-xl">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}

                <input
                  ref={editFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleEditImage}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => editFileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E8E1EF] px-4 py-3 text-sm font-semibold text-[#70558F] hover:bg-[#F7F4FA]"
                >
                  <ImagePlus size={17} />
                  {newBanner ? "Choose another image" : "Change banner image"}
                </button>

                <p className="mt-2 text-xs text-[#95879F]">
                  JPG, PNG or WEBP. Maximum 5 MB.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#F0ECF4] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditDialog}
                  disabled={saving}
                  className="rounded-xl border border-[#E8E1EF] px-5 py-3 text-sm font-semibold text-[#756B80] hover:bg-[#F7F4FA] disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8066A8] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#70558F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}