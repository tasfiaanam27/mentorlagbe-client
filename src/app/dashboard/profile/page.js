"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  UserRound,
  Camera,
  Mail,
  Phone,
  FileText,
  ShieldCheck,
  Crown,
  Save,
  RefreshCw,
  LoaderCircle,
  ImagePlus,
  X,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getInitials(name) {
  return (name || "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function RoleBadge({ role }) {
  const styles = {
    student: "bg-blue-50 text-blue-700",
    tutor: "bg-purple-50 text-purple-700",
    admin: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[role] || "bg-gray-100 text-gray-600"
      }`}
    >
      {role || "User"}
    </span>
  );
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/api/profile`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load profile.");
      }

      const data = result.data;

      setProfile(data);
      setName(data.name || "");
      setPhone(data.phone || "");
      setBio(data.bio || "");
      setImageUrl(data.image || "");
      setImageBase64("");
      setPreview(data.image || "");
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error(error.message || "Could not load your profile.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && session?.user) {
      fetchProfile();
    }
  }, [isPending, session, fetchProfile]);

  const handleImageSelection = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = String(reader.result || "");

      setImageBase64(dataUrl);
      setImageUrl("");
      setPreview(dataUrl);
    };

    reader.onerror = () => {
      toast.error("Could not read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (value) => {
    setImageUrl(value);
    setImageBase64("");
    setPreview(value);
  };

  const removeImage = () => {
    setImageUrl("");
    setImageBase64("");
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      };

      if (imageBase64) {
        payload.imageBase64 = imageBase64;
      } else {
        payload.imageUrl = imageUrl.trim();
      }

      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile.");
      }

      const updated = result.data;

      setProfile(updated);
      setName(updated.name || "");
      setPhone(updated.phone || "");
      setBio(updated.bio || "");
      setImageUrl(updated.image || "");
      setImageBase64("");
      setPreview(updated.image || "");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Your profile has been updated.");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
          <p className="text-sm text-[#887D92]">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="rounded-2xl border border-[#EAE4F0] bg-white p-8 text-center">
        <UserRound className="mx-auto mb-3 h-10 w-10 text-[#8066A8]" />
        <h2 className="font-bold text-[#30213D]">
          Sign in to view your profile
        </h2>
        <p className="mt-2 text-sm text-[#887D92]">
          Your account information will appear here after signing in.
        </p>
      </div>
    );
  }

  const currentRole = profile?.role || session.user.role;
  const currentPlan = profile?.plan || "free";

  return (
    <div className="mx-auto max-w-5xl space-y-7">

      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#8066A8]">
            <UserRound size={17} />
            Account Settings
          </div>

          <h1 className="text-2xl font-bold text-[#30213D] sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-[#887D92]">
            Manage your personal information and profile picture.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchProfile(true)}
          disabled={refreshing || saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E1EF] bg-white px-4 py-3 text-sm font-semibold text-[#70558F] transition hover:bg-[#F7F4FA] disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh Profile
        </button>
      </div>

      {/* Profile summary */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE4F0] bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-[#8066A8] via-[#A18BC0] to-[#D5C9E5]" />

        <div className="px-5 pb-5 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#EEE8F5] text-2xl font-bold text-[#8066A8] shadow-sm">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile picture"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(name || profile?.name)
                )}
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="break-words text-xl font-bold text-[#30213D]">
                  {name || profile?.name || "Your Name"}
                </h2>
                <p className="mt-1 break-all text-sm text-[#887D92]">
                  {profile?.email || session.user.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pb-1">
              <RoleBadge role={currentRole} />

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF3E5] px-3 py-1 text-xs font-semibold capitalize text-[#9A6B1C]">
                <Crown size={13} />
                {currentPlan} Plan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Edit profile form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal information */}
        <section className="rounded-2xl border border-[#EAE4F0] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#30213D]">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-[#95879F]">
              Update the information associated with your account.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-semibold text-[#493B56]"
              >
                Full Name <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <UserRound
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69AAF]"
                />

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={100}
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#E8E1EF] py-3 pl-11 pr-4 text-sm text-[#30213D] outline-none transition placeholder:text-[#B0A5B9] focus:border-[#8066A8] focus:ring-2 focus:ring-[#8066A8]/10"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-semibold text-[#493B56]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69AAF]"
                />

                <input
                  id="profile-email"
                  type="email"
                  value={profile?.email || session.user.email || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-[#E8E1EF] bg-[#F9F7FB] py-3 pl-11 pr-4 text-sm text-[#95879F] outline-none"
                />
              </div>

              <p className="mt-1.5 text-xs text-[#A096A9]">
                Your account email cannot be changed here.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="profile-phone"
                className="mb-2 block text-sm font-semibold text-[#493B56]"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69AAF]"
                />

                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  maxLength={30}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-[#E8E1EF] py-3 pl-11 pr-4 text-sm text-[#30213D] outline-none transition placeholder:text-[#B0A5B9] focus:border-[#8066A8] focus:ring-2 focus:ring-[#8066A8]/10"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="profile-bio"
                className="mb-2 block text-sm font-semibold text-[#493B56]"
              >
                Bio
              </label>

              <div className="relative">
                <FileText
                  size={17}
                  className="absolute left-4 top-4 text-[#A69AAF]"
                />

                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Write a short introduction about yourself..."
                  className="w-full resize-y rounded-xl border border-[#E8E1EF] py-3 pl-11 pr-4 text-sm leading-6 text-[#30213D] outline-none transition placeholder:text-[#B0A5B9] focus:border-[#8066A8] focus:ring-2 focus:ring-[#8066A8]/10"
                />
              </div>

              <p className="mt-1.5 text-right text-xs text-[#A096A9]">
                {bio.length}/500 characters
              </p>
            </div>
          </div>
        </section>

        {/* Profile picture */}
        <section className="rounded-2xl border border-[#EAE4F0] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#30213D]">
              Profile Picture
            </h2>
            <p className="mt-1 text-sm text-[#95879F]">
              Upload an image to ImgBB or provide an image URL.
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E8E1EF] bg-[#F7F4FA] text-[#8066A8]">
              {preview ? (
                <img
                  src={preview}
                  alt="Selected profile picture preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus size={35} />
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#8066A8] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#70558F]"
                >
                  <Camera size={16} />
                  Upload Picture
                </button>

                {preview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <X size={16} />
                    Remove Picture
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelection}
                className="hidden"
              />

              <p className="text-xs leading-5 text-[#95879F]">
                JPG, PNG, GIF or WebP. Maximum file size: 5 MB.
              </p>
            </div>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#EEE8F5]" />
            <span className="text-xs font-medium text-[#A096A9]">
              OR USE AN IMAGE URL
            </span>
            <div className="h-px flex-1 bg-[#EEE8F5]" />
          </div>

          <label
            htmlFor="profile-image-url"
            className="mb-2 block text-sm font-semibold text-[#493B56]"
          >
            Image URL
          </label>

          <input
            id="profile-image-url"
            type="url"
            value={imageUrl}
            onChange={(event) =>
              handleImageUrlChange(event.target.value)
            }
            placeholder="https://example.com/profile-picture.jpg"
            className="w-full rounded-xl border border-[#E8E1EF] px-4 py-3 text-sm text-[#30213D] outline-none transition placeholder:text-[#B0A5B9] focus:border-[#8066A8] focus:ring-2 focus:ring-[#8066A8]/10"
          />

          <p className="mt-2 text-xs text-[#A096A9]">
            If you upload a picture, it will take priority over the image URL.
          </p>
        </section>

        {/* Account information */}
        <section className="rounded-2xl border border-[#EAE4F0] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#30213D]">
              Account Information
            </h2>
            <p className="mt-1 text-sm text-[#95879F]">
              Your current platform role and subscription plan.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#FAF8FC] p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#95879F]">
                <ShieldCheck size={15} />
                Account Role
              </p>
              <RoleBadge role={currentRole} />
            </div>

            <div className="rounded-xl bg-[#FAF8FC] p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#95879F]">
                <Crown size={15} />
                Subscription Plan
              </p>
              <span className="text-sm font-bold capitalize text-[#493B56]">
                {currentPlan} Plan
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#E8E1EF] bg-[#F9F7FB] p-3">
            <CheckCircle2
              size={16}
              className="mt-0.5 shrink-0 text-[#8066A8]"
            />
            <p className="text-xs leading-5 text-[#756B80]">
              Your role and subscription plan are managed by the platform.
              Contact an administrator if your account role needs to change.
            </p>
          </div>
        </section>

        {/* Save button */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => fetchProfile()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E1EF] bg-white px-6 py-3 text-sm font-semibold text-[#70558F] transition hover:bg-[#F7F4FA] disabled:opacity-60"
          >
            Reset Changes
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8066A8] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#70558F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Saving Profile...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
