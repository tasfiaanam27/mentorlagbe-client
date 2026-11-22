"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  BookOpen,
  Users,
  GraduationCap,
  Monitor,
  CheckCircle2,
  Sparkles,
  Calculator,
  Atom,
  Code2,
  BookText,
  Check,
  Star,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FeaturedTuitions from "@/components/home/FeaturedTuitions";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const benefits = [
  {
    icon: Search,
    title: "Find the Right Tutor",
    description:
      "Discover tutors based on your subject, class level, budget and preferred learning mode.",
  },
  {
    icon: Users,
    title: "Personalized Learning",
    description:
      "Connect with tutors who understand your learning goals and help you progress.",
  },
  {
    icon: Monitor,
    title: "Flexible Learning",
    description:
      "Choose between online sessions and in-person tuition that fits your schedule.",
  },
];

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Explore Tuitions",
    description:
      "Browse available tuition opportunities and find a suitable match.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Apply to Connect",
    description:
      "Submit your application with your preferred schedule and details.",
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Start Learning",
    description:
      "Connect with your tutor and begin your learning journey.",
  },
];

const subjects = [
  {
    name: "Math",
    icon: Calculator,
    description: "Build strong problem-solving skills.",
  },
  {
    name: "Physics",
    icon: Atom,
    description: "Understand concepts with expert guidance.",
  },
  {
    name: "Programming",
    icon: Code2,
    description: "Develop practical coding skills.",
  },
  {
    name: "IELTS",
    icon: BookText,
    description: "Prepare for your language goals.",
  },
];

const studentFeatures = [
  "Browse all tuition listings",
  "View tutor and batch details",
  "Apply to batches",
  "Basic platform support",
];

const studentProFeatures = [
  "Everything in Free",
  "Priority application",
  "Save favorite tuitions",
  "Get batch updates and alerts",
];

const tutorFeatures = [
  "Create and manage up to 2 tuition listings",
  "Receive applications",
  "Basic profile visibility",
  "Platform support",
];

const tutorProFeatures = [
  "Everything in Free",
  "Create unlimited tuition listings",
  "Higher visibility (Featured)",
  "Reach more students",
];

function PricingCard({
  title,
  price,
  features,
  highlighted = false,
  role,
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-6 transition duration-300 ${
        highlighted
          ? "border-[#8B78B5] bg-white shadow-lg shadow-[#8B78B5]/10"
          : "border-[#EAE4EF] bg-white"
      }`}
    >
      {highlighted && (
        <span className="mb-4 w-fit rounded-full bg-[#F0ECF6] px-3 py-1 text-xs font-bold text-[#75619E]">
          Recommended
        </span>
      )}

      <p className="text-sm font-semibold text-[#64748B]">{title}</p>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-[#30213D]">{price}</h3>
        {price !== "Free" && (
          <span className="text-sm text-[#64748B]">/ month</span>
        )}
      </div>

      <ul className="my-7 flex-1 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-[#475569]"
          >
            <Check size={17} className="mt-0.5 shrink-0 text-[#8B78B5]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {highlighted ? (
        <Link
          href={`/pricing?role=${role}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B78B5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#75619E]"
        >
          <span>Subscribe with Stripe</span>
          <ArrowRight size={17} />
        </Link>
      ) : (
        <Link
          href="/sign-up"
          className="inline-flex items-center justify-center rounded-xl border border-[#EAE4EF] px-4 py-3 text-sm font-semibold text-[#30213D] transition hover:border-[#8B78B5] hover:bg-[#F8F5FC]"
        >
          Get Started
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState({
    totalStudents: null,
    totalTutors: null,
  });

  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/stats`);

        if (!response.ok) {
          throw new Error("Unable to load platform statistics.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error("Unable to load platform statistics.");
        }

        setStats({
          totalStudents: result.data.totalStudents,
          totalTutors: result.data.totalTutors,
        });
      } catch (error) {
        console.error("Platform statistics error:", error);
        setStatsError(true);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Navbar />

      <main>
        {/* 1. HERO / BANNER SECTION */}
        <section className="relative overflow-hidden bg-[#F3EFF9]">
          <div className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-[#D9CDED]/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#EACFC7]/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:py-20">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#EAE4EF] bg-white px-4 py-2 text-xs font-semibold text-[#75619E] sm:text-sm">
                <Sparkles size={16} />
                Learn • Teach • Grow Together
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#30213D] sm:text-5xl lg:text-[3.5rem]">
                Find Your Ideal Tutor or
                <span className="mt-2 block text-[#8B78B5]">
                  Mentorship Batch Today
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-[#64748B] sm:text-lg">
                Connect with qualified tutors, explore subject-specific
                batches, and take the next step toward your academic goals.
              </p>

              <form
                action="/tuitions"
                method="GET"
                className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-[#EAE4EF] bg-white p-2 shadow-lg shadow-[#30213D]/5 sm:flex-row"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3">
                  <Search
                    size={21}
                    className="shrink-0 text-[#8B78B5]"
                  />
                  <input
                    type="search"
                    name="search"
                    placeholder="Search by subject, class or keyword..."
                    className="w-full bg-transparent text-sm text-[#30213D] outline-none placeholder:text-[#94A3B8]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B78B5] px-7 py-3 font-semibold text-white transition hover:bg-[#75619E]"
                >
                  Browse Tuitions
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#475569]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-[#8B78B5]" />
                  Verified Tutors
                </span>
                <span className="flex items-center gap-2">
                  <Users size={17} className="text-[#8B78B5]" />
                  Flexible Learning
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles size={17} className="text-[#8B78B5]" />
                  Subject-Specific Batches
                </span>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/tuitions"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#30213D] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#443354]"
                >
                  Explore Tuitions
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D9CDED] bg-white px-6 py-3.5 text-sm font-semibold text-[#30213D] transition hover:border-[#8B78B5]"
                >
                  Become a Tutor
                  <GraduationCap size={18} />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute inset-8 rounded-full bg-[#D9CDED]/60 blur-3xl" />

              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1100&q=85"
                alt="Students learning and collaborating together"
                className="relative h-[320px] w-full rounded-[2rem] object-cover shadow-xl sm:h-[400px] lg:h-[460px]"
              />

              <div className="absolute -bottom-5 left-4 rounded-2xl border border-[#EAE4EF] bg-white p-4 shadow-lg sm:left-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0ECF6] text-[#8B78B5]">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#30213D]">
                      Learn with Confidence
                    </p>
                    <p className="text-xs text-[#64748B]">
                      Your goals, your pace
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. DYNAMIC FEATURED TUITIONS SECTION */}
        <FeaturedTuitions />

        {/* WHY MENTORLAGBE */}
        <section className="bg-[#FAF8F5] py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold text-[#8B78B5]">
                WHY MENTORLAGBE
              </p>
              <h2 className="text-3xl font-bold text-[#30213D] sm:text-4xl">
                Learning Made Simpler
              </h2>
              <p className="mt-4 leading-7 text-[#64748B]">
                Everything you need to find the right learning opportunity in
                one place.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-[#EAE4EF] bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EFF9]">
                      <Icon size={26} className="text-[#8B78B5]" />
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-[#30213D]">
                      {benefit.title}
                    </h3>

                    <p className="text-sm leading-7 text-[#64748B]">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. PRICING / SUBSCRIPTION SECTION */}
        <section
          id="pricing"
          className="bg-[#F3EFF9] py-20 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#8B78B5]">
                Pricing & Subscription
              </p>

              <h2 className="text-3xl font-bold text-[#30213D] sm:text-4xl">
                Choose the Right Plan for You
              </h2>

              <p className="mt-4 leading-7 text-[#64748B]">
                Unlock more opportunities with MentorLagbe Pro. Separate
                plans for Students and Tutors.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Student Plans */}
              <div className="rounded-3xl border border-[#EAE4EF] bg-white/80 p-5 sm:p-7">
                <div className="mb-7 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3EFF9] text-[#8B78B5]">
                    <Users size={25} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#30213D]">
                      Student Plans
                    </h3>
                    <p className="mt-1 text-sm text-[#64748B]">
                      Find batches and get more from your learning.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <PricingCard
                    title="Student — Free"
                    price="Free"
                    features={studentFeatures}
                    role="student"
                  />

                  <PricingCard
                    title="Student — Pro"
                    price="$10"
                    features={studentProFeatures}
                    highlighted
                    role="student"
                  />
                </div>
              </div>

              {/* Tutor Plans */}
              <div className="rounded-3xl border border-[#EAE4EF] bg-white/80 p-5 sm:p-7">
                <div className="mb-7 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3EFF9] text-[#8B78B5]">
                    <GraduationCap size={27} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#30213D]">
                      Tutor Plans
                    </h3>
                    <p className="mt-1 text-sm text-[#64748B]">
                      Post batches and reach more students.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <PricingCard
                    title="Tutor — Free"
                    price="Free"
                    features={tutorFeatures}
                    role="tutor"
                  />

                  <PricingCard
                    title="Tutor — Pro"
                    price="$15"
                    features={tutorProFeatures}
                    highlighted
                    role="tutor"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW MENTORLAGBE WORKS */}
        <section
          id="how-it-works"
          className="bg-white py-20 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#8B78B5]">
                Simple Process
              </p>

              <h2 className="text-3xl font-bold text-[#30213D] sm:text-4xl">
                How MentorLagbe Works
              </h2>

              <p className="mt-4 leading-7 text-[#64748B]">
                Finding your ideal tutor or sharing your expertise is simple.
                Get started in three steps.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="rounded-2xl border border-[#EAE4EF] bg-[#FAF8F5] p-8 text-center"
                  >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0ECF6] text-[#8B78B5]">
                      <Icon size={29} />
                    </div>

                    <span className="mb-3 inline-block text-sm font-bold text-[#8B78B5]">
                      STEP {step.number}
                    </span>

                    <h3 className="mb-3 text-xl font-bold text-[#30213D]">
                      {step.title}
                    </h3>

                    <p className="text-sm leading-7 text-[#64748B]">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. TOP SUBJECTS AND PLATFORM STATISTICS */}
        <section className="bg-[#F3EFF9] py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Top Subjects */}
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#8B78B5]">
                  Top Subjects
                </p>

                <h2 className="text-3xl font-bold text-[#30213D]">
                  Explore Popular Subjects
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-[#64748B]">
                  Find tuition opportunities in the most in-demand subjects
                  on MentorLagbe.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {subjects.map((subject) => {
                    const Icon = subject.icon;

                    return (
                      <Link
                        key={subject.name}
                        href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
                        className="group flex flex-col items-center rounded-2xl border border-[#EAE4EF] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#8B78B5] hover:shadow-md"
                      >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3EFF9] text-[#8B78B5] transition group-hover:bg-[#8B78B5] group-hover:text-white">
                          <Icon size={25} />
                        </div>

                        <h3 className="font-bold text-[#30213D]">
                          {subject.name}
                        </h3>

                        <span className="mt-2 text-xs text-[#64748B]">
                          Explore
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Live Platform Statistics */}
              <div className="lg:border-l lg:border-[#D9CDED] lg:pl-12">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#8B78B5]">
                  Platform Statistics
                </p>

                <h2 className="text-3xl font-bold text-[#30213D]">
                  Our Growing Community
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#64748B]">
                  Real registration counts from the MentorLagbe platform.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#EAE4EF] bg-white p-6 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3EFF9] text-[#8B78B5]">
                      <Users size={25} />
                    </div>

                    <p className="text-3xl font-bold text-[#30213D]">
                      {stats.totalStudents === null
                        ? statsError
                          ? "—"
                          : "..."
                        : stats.totalStudents.toLocaleString()}
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#64748B]">
                      Registered Students
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#EAE4EF] bg-white p-6 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3EFF9] text-[#8B78B5]">
                      <GraduationCap size={26} />
                    </div>

                    <p className="text-3xl font-bold text-[#30213D]">
                      {stats.totalTutors === null
                        ? statsError
                          ? "—"
                          : "..."
                        : stats.totalTutors.toLocaleString()}
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#64748B]">
                      Registered Tutors
                    </p>
                  </div>
                </div>

                {statsError && (
                  <p className="mt-4 text-sm text-red-600">
                    Platform statistics are temporarily unavailable.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* TUTOR CALL TO ACTION */}
        <section className="bg-[#FAF8F5] py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-[#30213D] p-9 text-center sm:p-14">
              <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-[#8B78B5]/20 blur-2xl" />

              <div className="relative">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <GraduationCap size={28} className="text-[#D9CDED]" />
                </div>

                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Ready to Share Your Knowledge?
                </h2>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-white/70">
                  Join MentorLagbe as a tutor, connect with students and make
                  a difference through education.
                </p>

                <Link
                  href="/sign-up"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#30213D] transition hover:bg-[#F3EFF9]"
                >
                  Join as a Tutor
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
