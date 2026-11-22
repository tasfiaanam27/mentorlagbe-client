import Link from "next/link";
import {
  ArrowRight,
  Search,
  BookOpen,
  Users,
  GraduationCap,
  Monitor,
  MapPin,
  CheckCircle2,
  Star,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FeaturedTuitions from "@/components/home/FeaturedTuitions";

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
    title: "Explore Tuitions",
    description: "Browse available tuition opportunities and find a suitable match.",
  },
  {
    number: "02",
    title: "Apply to Connect",
    description: "Submit your application with your preferred schedule and details.",
  },
  {
    number: "03",
    title: "Start Learning",
    description: "Connect with your tutor and begin your learning journey.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#F3EFF9]">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-[#D9CDED]/40 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#EACFC7]/30 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white border border-[#EAE4EF] text-[#75619E] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-7">
                <Sparkles size={16} />
                Your learning journey starts here
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#30213D] leading-tight tracking-tight">
                Find the right tutor.
                <span className="block text-[#8B78B5] mt-2">
                  Unlock your potential.
                </span>
              </h1>

              <p className="text-[#64748B] text-base sm:text-lg leading-8 mt-7 max-w-2xl mx-auto">
                Discover qualified tutors, explore tuition opportunities and
                find the learning support you need to achieve your goals.
              </p>

              <form
                action="/tuitions"
                method="GET"
                className="mt-10 bg-white p-2 rounded-2xl shadow-lg shadow-[#30213D]/5 border border-[#EAE4EF] flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
              >
                <div className="flex items-center gap-3 flex-1 px-4 py-3">
                  <Search size={21} className="text-[#8B78B5] shrink-0" />
                  <input
                    type="search"
                    name="search"
                    placeholder="Search by subject, class or tutor..."
                    className="w-full bg-transparent outline-none text-sm text-[#30213D] placeholder:text-[#94A3B8]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#8B78B5] hover:bg-[#75619E] text-white font-semibold px-7 py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  Find Tutors
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-[#64748B]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#8B78B5]" />
                  Online & Offline
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#8B78B5]" />
                  Flexible Schedules
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#8B78B5]" />
                  Personalized Learning
                </span>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/tuitions"
                  className="inline-flex justify-center items-center gap-2 bg-[#30213D] hover:bg-[#443354] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition"
                >
                  Browse Tuitions
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex justify-center items-center gap-2 bg-white border border-[#D9CDED] text-[#30213D] hover:border-[#8B78B5] px-7 py-3.5 rounded-xl font-semibold text-sm transition"
                >
                  Become a Tutor
                  <GraduationCap size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FeaturedTuitions />

        {/* Benefits Section */}
        <section className="py-20 lg:py-24 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-[#8B78B5] font-semibold text-sm mb-3">
                WHY MENTORLAGBE
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#30213D]">
                Learning made simpler
              </h2>
              <p className="text-[#64748B] mt-4 leading-7">
                Everything you need to find the right learning opportunity in
                one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="bg-white border border-[#EAE4EF] rounded-2xl p-8 hover:shadow-lg hover:shadow-[#30213D]/5 transition"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#F3EFF9] flex items-center justify-center mb-6">
                      <Icon size={26} className="text-[#8B78B5]" />
                    </div>

                    <h3 className="text-xl font-bold text-[#30213D] mb-3">
                      {benefit.title}
                    </h3>

                    <p className="text-sm text-[#64748B] leading-7">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-[#8B78B5] font-semibold text-sm mb-3">
                GET STARTED
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#30213D]">
                How it works
              </h2>
              <p className="text-[#64748B] mt-4 leading-7">
                Finding your ideal tutor is simple. Get started in three steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative text-center px-5">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F3EFF9] text-[#8B78B5] flex items-center justify-center text-xl font-bold mb-6">
                    {step.number}
                  </div>

                  <h3 className="text-xl font-bold text-[#30213D] mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#64748B] leading-7">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tutor CTA */}
        <section className="py-16 bg-[#F3EFF9]">
          <div className="max-w-5xl mx-auto px-5 lg:px-8">
            <div className="bg-[#30213D] rounded-3xl p-9 sm:p-14 text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-10 w-64 h-64 bg-[#8B78B5]/20 rounded-full blur-2xl" />

              <div className="relative">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <GraduationCap size={28} className="text-[#D9CDED]" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  Ready to share your knowledge?
                </h2>

                <p className="text-white/65 mt-4 max-w-xl mx-auto leading-7">
                  Join MentorLagbe as a tutor, connect with students and make
                  a difference through education.
                </p>

                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 mt-8 bg-white text-[#30213D] hover:bg-[#F3EFF9] px-7 py-3.5 rounded-xl font-semibold text-sm transition"
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
