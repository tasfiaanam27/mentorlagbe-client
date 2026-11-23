"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    FileText,
    Search,
    Crown,
    ArrowRight,
    GraduationCap,
    Clock,
    CheckCircle2,
    XCircle,
    LoaderCircle,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StudentDashboard() {
    useEffect(() => {
        const testBackendJWT = async () => {
            try {
                const { data, error } = await authClient.token();

                if (error || !data?.token) {
                    console.error("JWT generation failed:", error);
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/jwt-test/student",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${data.token}`,
                        },
                    }
                );

                const result = await response.json();

                console.log("Backend JWT verification:", response.status, result);
            } catch (error) {
                console.error("JWT test failed:", error);
            }
        };

        testBackendJWT();
    }, []);

    const { data: session, isPending: sessionPending } =
        authClient.useSession();

    const user = session?.user;

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchApplications = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/applications/my-applications`,
                { credentials: "include" }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to load your statistics.");
            }

            setApplications(result.data || []);
        } catch (err) {
            setError(err.message || "Unable to load dashboard statistics.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (sessionPending) return;

        if (!user) {
            setLoading(false);
            return;
        }

        fetchApplications();
    }, [sessionPending, user, fetchApplications]);

    const totalApplied = applications.length;
    const acceptedApplications = applications.filter(
        (application) => application.status === "accepted"
    ).length;
    const pendingApplications = applications.filter(
        (application) => application.status === "pending"
    ).length;
    const isPro = user?.plan === "pro";

    const stats = [
        {
            title: "Total Applied Tuitions",
            value: totalApplied,
            description: "Tuitions you have applied for",
            icon: FileText,
            color: "bg-[#F0EAF7] text-[#8066A8]",
        },
        {
            title: "Accepted Applications",
            value: acceptedApplications,
            description: "Applications accepted by tutors",
            icon: CheckCircle2,
            color: "bg-green-50 text-green-600",
        },
        {
            title: "Pending Applications",
            value: pendingApplications,
            description: "Applications awaiting a response",
            icon: Clock,
            color: "bg-amber-50 text-amber-600",
        },
        {
            title: "Current Plan",
            value: isPro ? "Pro" : "Free",
            description: isPro
                ? "Student Pro membership"
                : "Student Free membership",
            icon: Crown,
            color: "bg-purple-50 text-purple-600",
        },
    ];

    const quickActions = [
        {
            title: "Browse Tuitions",
            description:
                "Explore available tuition opportunities and find the right tutor.",
            href: "/tuitions",
            icon: Search,
        },
        {
            title: "My Applications",
            description:
                "View your submitted applications and their current status.",
            href: "/dashboard/student/my-applications",
            icon: FileText,
        },
        {
            title: "Update Profile",
            description:
                "Keep your personal information and contact details up to date.",
            href: "/dashboard/profile",
            icon: GraduationCap,
        },
    ];

    if (sessionPending || loading) {
        return (
            <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3">
                <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
                <p className="text-sm font-medium text-[#756B80]">
                    Loading your student dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#70558F] to-[#9B83BB] p-7 text-white shadow-sm sm:p-10">
                <div className="relative z-10 max-w-2xl">
                    <p className="mb-3 text-sm font-medium text-white/80">
                        Student Dashboard
                    </p>

                    <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                        Welcome back, {user?.name?.split(" ")[0] || "Student"}!
                    </h1>

                    <p className="mt-3 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
                        Track your tuition applications, discover new learning
                        opportunities and connect with tutors through MentorLagbe.
                    </p>

                    <Link
                        href="/tuitions"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#70558F] transition hover:bg-[#F3EDF9]"
                    >
                        Browse Tuitions <ArrowRight size={17} />
                    </Link>
                </div>

                <GraduationCap
                    className="absolute -bottom-8 -right-4 h-44 w-44 text-white/10 sm:h-56 sm:w-56"
                    strokeWidth={1}
                />
            </section>

            {error && (
                <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={19} />
                        {error}
                    </div>

                    <button
                        type="button"
                        onClick={fetchApplications}
                        className="inline-flex items-center gap-2 self-start font-semibold hover:underline"
                    >
                        <RefreshCw size={15} />
                        Try again
                    </button>
                </div>
            )}

            <section>
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-[#30213D]">
                        Dashboard Overview
                    </h2>
                    <p className="mt-1 text-sm text-[#95879F]">
                        Your tuition application and membership statistics.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-[#EAE4F0] bg-white p-5 transition hover:shadow-md hover:shadow-[#70558F]/5"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
                                    >
                                        <Icon size={21} />
                                    </div>

                                    <span className="text-2xl font-bold text-[#30213D]">
                                        {item.value}
                                    </span>
                                </div>

                                <h3 className="mt-5 text-sm font-bold text-[#30213D]">
                                    {item.title}
                                </h3>

                                <p className="mt-1 text-xs leading-5 text-[#95879F]">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-[#30213D]">
                        Quick Actions
                    </h2>
                    <p className="mt-1 text-sm text-[#95879F]">
                        Manage your learning activities.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group rounded-2xl border border-[#EAE4F0] bg-white p-5 transition hover:-translate-y-1 hover:border-[#CFC0DF] hover:shadow-lg hover:shadow-[#70558F]/5"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EAF7] text-[#8066A8] transition group-hover:bg-[#8066A8] group-hover:text-white">
                                    <Icon size={22} />
                                </div>

                                <h3 className="font-bold text-[#30213D]">
                                    {action.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-[#95879F]">
                                    {action.description}
                                </p>

                                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8066A8]">
                                    Open <ArrowRight size={16} />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-2xl border border-[#EAE4F0] bg-white p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0EAF7] text-[#8066A8]">
                        <BookOpen size={21} />
                    </div>

                    <div>
                        <h2 className="font-bold text-[#30213D]">
                            Keep your learning journey moving
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-[#95879F]">
                            Explore tuition opportunities, submit applications and
                            monitor tutor responses from your dashboard.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
