
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  ImagePlus,
  X,
  LoaderCircle,
  BookOpen,
  MapPin,
  Wallet,
  CalendarDays,
  FileText,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const initialForm = {
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

const labelClass =
  "mb-2 block text-sm font-semibold text-[#493B56]";

export default function PostTuitionPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const { data: session } = authClient.useSession();

  const [form, setForm] = useState(initialForm);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const user = session?.user;
  const isPro = user?.plan === "pro";

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
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
      toast.error("Banner image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setBannerFile(null);
    setBannerPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const validateForm = () => {
    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.classLevel.trim() ||
      !form.monthlyFee ||
      !form.description.trim()
    ) {
      toast.error("Please complete all required fields.");
      return false;
    }

    const fee = Number(form.monthlyFee);
    const days = Number(form.daysPerWeek);

    if (!Number.isFinite(fee) || fee <= 0 || fee > 1000000) {
      toast.error("Please enter a valid monthly fee.");
      return false;
    }

    if (!Number.isInteger(days) || days < 1 || days > 7) {
      toast.error("Days per week must be between 1 and 7.");
      return false;
    }

    if (form.mode === "Offline" && !form.location.trim()) {
      toast.error("Please provide the tuition location.");
      return false;
    }

    if (form.description.trim().length < 20) {
      toast.error("Description must contain at least 20 characters.");
      return false;
    }

    if (!bannerFile) {
      toast.error("Please upload a tuition banner image.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const bannerImage = await convertImageToBase64(bannerFile);

      // apiFetch automatically obtains and attaches the BetterAuth JWT.
      const response = await apiFetch("/api/tutor/tuitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          monthlyFee: Number(form.monthlyFee),
          daysPerWeek: Number(form.daysPerWeek),
          bannerImage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.code === "FREE_PLAN_LIMIT_REACHED") {
          toast.error(result.message, {
            duration: 5000,
            action: {
              label: "View Plans",
              onClick: () => router.push("/pricing?role=tutor"),
            },
          });
          return;
        }

        throw new Error(result.message || "Failed to post tuition.");
      }

      toast.success("Tuition submitted for admin approval!");

      setForm(initialForm);
      removeImage();

      router.push("/dashboard/tutor/my-tuitions");
      router.refresh();
    } catch (error) {
      console.error("Post tuition error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">

      {/* Page Heading */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#8066A8]">
          <BookOpen size={17} />
          Tutor Workspace
        </div>

        <h1 className="text-2xl font-bold text-[#30213D] sm:text-3xl">
          Post a New Tuition
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#887D92]">
          Find the right students by sharing your tuition requirements.
          Your listing will be reviewed by an administrator before
          appearing publicly.
        </p>
      </div>

      {/* Plan Information */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E8DFF0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEE8F5] text-[#8066A8]">
            {isPro ? <Crown size={22} /> : <BookOpen size={22} />}
          </div>

          <div>
            <p className="font-bold text-[#30213D]">
              {isPro ? "Tutor Pro Plan" : "Tutor Free Plan"}
            </p>

            <p className="mt-1 text-xs text-[#887D92]">
              {isPro
                ? "You can create unlimited tuition posts."
                : "You can create up to 2 tuition posts."}
            </p>
          </div>
        </div>

        {!isPro && (
          <button
            type="button"
            onClick={() => router.push("/pricing?role=tutor")}
            className="rounded-xl bg-[#8066A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#70558F]"
          >
            Upgrade to Pro
          </button>
        )}
      </div>

      {/* Tuition Form */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-[#EAE4F0] bg-white shadow-sm"
      >
        <div className="border-b border-[#F0ECF4] px-5 py-5 sm:px-8">
          <h2 className="text-lg font-bold text-[#30213D]">
            Tuition Details
          </h2>

          <p className="mt-1 text-sm text-[#95879F]">
            Fields marked with * are required.
          </p>
        </div>

        <div className="space-y-7 p-5 sm:p-8">

          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Tuition Title *
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={updateField}
              placeholder="e.g. Need a Mathematics Tutor for Class 10"
              maxLength={120}
              required
              className={inputClass}
            />
          </div>

          {/* Subject and Class Level */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="subject" className={labelClass}>
                Subject *
              </label>

              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={updateField}
                placeholder="e.g. Mathematics"
                maxLength={80}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="classLevel" className={labelClass}>
                Class Level *
              </label>

              <input
                id="classLevel"
                name="classLevel"
                type="text"
                value={form.classLevel}
                onChange={updateField}
                placeholder="e.g. Class 9-10, HSC, University"
                maxLength={80}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Mode */}
          <div>
            <label htmlFor="mode" className={labelClass}>
              Tuition Mode *
            </label>

            <select
              id="mode"
              name="mode"
              value={form.mode}
              onChange={updateField}
              className={inputClass}
              required
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className={labelClass}>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} />
                Location {form.mode === "Offline" ? "*" : "(Optional)"}
              </span>
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={updateField}
              placeholder={
                form.mode === "Online"
                  ? "Optional: e.g. Dhaka"
                  : "e.g. Dhanmondi, Dhaka"
              }
              maxLength={150}
              required={form.mode === "Offline"}
              className={inputClass}
            />
          </div>

          {/* Monthly Fee and Days */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="monthlyFee" className={labelClass}>
                <span className="inline-flex items-center gap-2">
                  <Wallet size={16} />
                  Monthly Fee (BDT) *
                </span>
              </label>

              <input
                id="monthlyFee"
                name="monthlyFee"
                type="number"
                min="1"
                max="1000000"
                step="1"
                value={form.monthlyFee}
                onChange={updateField}
                placeholder="e.g. 8000"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="daysPerWeek" className={labelClass}>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  Days per Week *
                </span>
              </label>

              <select
                id="daysPerWeek"
                name="daysPerWeek"
                value={form.daysPerWeek}
                onChange={updateField}
                required
                className={inputClass}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <option key={day} value={day}>
                    {day} {day === 1 ? "Day" : "Days"} per week
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              <span className="inline-flex items-center gap-2">
                <FileText size={16} />
                Tuition Description *
              </span>
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Describe the tuition requirements, teaching expectations, preferred tutor qualifications, schedule and other important details..."
              rows={6}
              minLength={20}
              maxLength={3000}
              required
              className={`${inputClass} resize-y`}
            />

            <p className="mt-1 text-right text-xs text-[#A69AAF]">
              {form.description.length}/3000 characters
            </p>
          </div>

          {/* Banner Image */}
          <div>
            <label className={labelClass}>
              Tuition Banner Image *
            </label>

            <p className="mb-3 text-xs text-[#95879F]">
              Upload a JPG, PNG or WEBP image. Maximum file size: 5 MB.
              Your image will be uploaded to ImgBB.
            </p>

            {bannerPreview ? (
              <div className="relative overflow-hidden rounded-2xl border border-[#E8E1EF]">
                <img
                  src={bannerPreview}
                  alt="Tuition banner preview"
                  className="h-56 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:bg-red-50"
                  aria-label="Remove banner image"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3 text-sm text-white">
                  {bannerFile?.name}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#DCD1E7] bg-[#FBF9FD] px-5 py-12 text-center transition hover:border-[#8066A8] hover:bg-[#F7F3FA]"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE8F5] text-[#8066A8]">
                  <ImagePlus size={27} />
                </div>

                <p className="text-sm font-bold text-[#493B56]">
                  Click to upload banner image
                </p>

                <p className="mt-1 text-xs text-[#A69AAF]">
                  JPG, PNG or WEBP · Maximum 5 MB
                </p>

                <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#8066A8] px-5 py-2.5 text-sm font-semibold text-white">
                  <Upload size={16} />
                  Choose Image
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Form Footer */}
        <div className="flex flex-col gap-3 border-t border-[#F0ECF4] bg-[#FCFAFD] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs leading-5 text-[#95879F]">
            Your tuition will be submitted for admin review before
            becoming publicly visible.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#8066A8] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#70558F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Submit Tuition
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
