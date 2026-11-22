"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing / Pro Plans", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

const getDashboardPath = (role) => {
  return `/dashboard/${role || "student"}`;
};

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const user = session?.user;
  const role = user?.role || "student";

  const roleLabel = {
    student: "Student",
    tutor: "Tutor",
    admin: "Admin",
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "Unable to sign out.");
        return;
      }

      closeMenus();
      toast.success("Signed out successfully.");
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSigningOut(false);
    }
  };

  const ProfileAvatar = ({ size = "normal" }) => {
    const dimension = size === "small" ? "w-9 h-9" : "w-10 h-10";

    return (
      <div
        className={`${dimension} rounded-full overflow-hidden bg-[#F3EFF9] border border-[#EAE4EF] flex items-center justify-center shrink-0`}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || "User profile"}
            width={40}
            height={40}
            unoptimized
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[#75619E] font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAE4EF]">
      <nav className="max-w-7xl mx-auto px-5 lg:px-8 min-h-20 flex items-center justify-between gap-5">
        {/* Brand */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#64748B] hover:text-[#8B78B5] transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication State */}
        <div className="hidden lg:flex items-center gap-3">
          {isPending ? (
            <div className="w-28 h-10 rounded-xl bg-[#F3EFF9] animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F7F4FA] transition"
              >
                <ProfileAvatar />

                <div className="text-left">
                  <p className="text-sm font-semibold text-[#30213D] max-w-28 truncate">
                    {user.name}
                  </p>
                  <span className="text-xs text-[#8B78B5] font-medium">
                    {roleLabel[role] || "Student"}
                  </span>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-[#64748B] transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl border border-[#EAE4EF] shadow-xl p-3">
                  <div className="px-3 py-3 border-b border-[#EAE4EF] mb-2">
                    <p className="font-semibold text-sm text-[#30213D] truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#64748B] truncate mt-1">
                      {user.email}
                    </p>
                    <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-[#F3EFF9] text-[#75619E] text-xs font-semibold">
                      {roleLabel[role] || "Student"}
                    </span>
                  </div>

                  <Link
                    href={getDashboardPath(role)}
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#30213D] hover:bg-[#F7F4FA] transition"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#30213D] hover:bg-[#F7F4FA] transition"
                  >
                    <UserRound size={18} />
                    Update Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                  >
                    <LogOut size={18} />
                    {signingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-5 py-2.5 text-sm font-semibold text-[#30213D] hover:text-[#8B78B5] transition"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="px-5 py-2.5 rounded-xl bg-[#8B78B5] text-white text-sm font-semibold hover:bg-[#75619E] transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#30213D] hover:bg-[#F3EFF9]"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-[#EAE4EF] px-5 py-5 space-y-4 shadow-lg">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className="text-sm font-medium text-[#30213D] hover:text-[#8B78B5] transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-[#EAE4EF] pt-4">
            {isPending ? (
              <div className="h-10 bg-[#F3EFF9] rounded-xl animate-pulse" />
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ProfileAvatar />
                  <div>
                    <p className="text-sm font-semibold text-[#30213D]">
                      {user.name}
                    </p>
                    <span className="text-xs text-[#8B78B5] font-medium">
                      {roleLabel[role] || "Student"}
                    </span>
                  </div>
                </div>

                <Link
                  href={getDashboardPath(role)}
                  onClick={closeMenus}
                  className="flex items-center gap-3 text-sm text-[#30213D] py-2"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 text-sm text-[#30213D] py-2"
                >
                  <UserRound size={18} />
                  Update Profile
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex items-center gap-3 text-sm text-red-600 py-2 disabled:opacity-60"
                >
                  <LogOut size={18} />
                  {signingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/sign-in"
                  onClick={closeMenus}
                  className="text-center border border-[#EAE4EF] text-[#30213D] px-5 py-3 rounded-xl text-sm font-semibold"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenus}
                  className="text-center bg-[#8B78B5] text-white px-5 py-3 rounded-xl text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
