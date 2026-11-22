"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(
        `/sign-in?callbackURL=${encodeURIComponent("/dashboard")}`
      );
      return;
    }

    const role = session.user.role;

    if (role === "student") {
      router.replace("/dashboard/student");
    } else if (role === "tutor") {
      router.replace("/dashboard/tutor");
    } else if (role === "admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/");
    }
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
      <p className="text-sm font-medium text-[#756B80]">
        Taking you to your dashboard...
      </p>
    </div>
  );
}
