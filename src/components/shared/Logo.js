import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
      <div className="w-10 h-10 rounded-xl bg-[#8B78B5] flex items-center justify-center shadow-sm group-hover:bg-[#75619E] transition-colors">
        <GraduationCap size={24} className="text-white" strokeWidth={2.2} />
      </div>

      <span
        className={`text-2xl font-bold tracking-tight ${
          light ? "text-white" : "text-[#30213D]"
        }`}
      >
        Mentor<span className="text-[#8B78B5]">Lagbe</span>
        <span className={light ? "text-white" : "text-[#30213D]"}>.</span>
      </span>
    </Link>
  );
}
