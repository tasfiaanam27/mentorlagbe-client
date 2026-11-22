
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  PlusCircle,
  Users,
  ClipboardList,
  CreditCard,
  UserCircle,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Home,
  LoaderCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const dashboardMenus = {
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "My Applications", href: "/dashboard/student/my-applications", icon: FileText },
    { label: "My Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
  tutor: [
    { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard },
    { label: "Post Tuition", href: "/dashboard/tutor/post-tuition", icon: PlusCircle },
    { label: "My Tuitions", href: "/dashboard/tutor/my-tuitions", icon: BookOpen },
    { label: "Applicants", href: "/dashboard/tutor/applicants", icon: Users },
    { label: "My Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Tuitions", href: "/dashboard/admin/tuitions", icon: ClipboardList },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
    { label: "My Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
};

const roleHome = {
  student: "/dashboard/student",
  tutor: "/dashboard/tutor",
  admin: "/dashboard/admin",
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const user = session?.user;
  const role = user?.role;
  const menus = dashboardMenus[role] || [];

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      const callbackURL = pathname || "/dashboard";
      router.replace(
        `/sign-in?callbackURL=${encodeURIComponent(callbackURL)}`
      );
      return;
    }

    if (roleHome[role]) {
      const isSharedProfile = pathname === "/dashboard/profile";
      const isCorrectRole =
        pathname === roleHome[role] ||
        pathname.startsWith(`${roleHome[role]}/`);

      if (!isSharedProfile && !isCorrectRole && pathname !== "/dashboard") {
        router.replace(roleHome[role]);
      }
    } else {
      router.replace("/");
    }
  }, [isPending, user, role, pathname, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await authClient.signOut();
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
      setSigningOut(false);
    }
  };

  if (isPending || !user || !roleHome[role]) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5FA]">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
          <p className="text-sm font-medium text-[#756B80]">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const displayName = user.name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F5FA] text-[#30213D]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#EAE4F0] bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-[#F0ECF4] px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8066A8] text-white">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-[#30213D]">
                MentorLagbe
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[2px] text-[#9A8BAA]">
                Learning together
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#A69AAF]">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {menus.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== roleHome[role] &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#EEE8F5] text-[#70558F]"
                      : "text-[#756B80] hover:bg-[#F7F4FA] hover:text-[#70558F]"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                  {active && (
                    <ChevronRight className="ml-auto" size={16} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#F0ECF4] p-5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#756B80] transition hover:bg-[#F7F4FA] hover:text-[#70558F]"
          >
            <Home size={19} />
            Back to Website
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut size={19} />
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-[#EAE4F0] bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[#EAE4F0] p-2.5 text-[#70558F] hover:bg-[#F7F4FA] lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-sm font-bold text-[#30213D] sm:text-base">
                {pathname === "/dashboard/profile"
                  ? "My Profile"
                  : "Dashboard"}
              </p>
              <p className="hidden text-xs text-[#9A8BAA] sm:block">
                Manage your MentorLagbe account
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-[170px] truncate text-sm font-bold text-[#30213D]">
                {displayName}
              </p>
              <p className="text-xs capitalize text-[#95879F]">{role}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#E8DFF0] bg-[#EEE8F5] text-sm font-bold text-[#70558F]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-7 lg:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}
