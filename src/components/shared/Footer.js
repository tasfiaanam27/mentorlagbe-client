import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import Logo from "./Logo";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing / Pro Plans", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Sign Up", href: "/sign-up" },
  { label: "Sign In", href: "/sign-in" },
];

function SocialIcon({ type }) {
  if (type === "x") {
    return (
      <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">
        <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.4L5.58 22H2.45l7.25-8.29L1.8 2h6.4l4.43 6.77L18.9 2Zm-1.1 18h1.73L7.27 3.88H5.41L17.8 20Z" />
      </svg>
    );
  }

  const paths = {
    facebook: "M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z",
    instagram: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z",
    linkedin: "M5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3.3 9h3.4v12H3.3V9Zm5.5 0h3.2v1.6h.1A3.5 3.5 0 0 1 15.3 9c3.5 0 4.2 2.3 4.2 5.3V21h-3.4v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H8.8V9Z",
  };

  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">
      <path d={paths[type]} />
    </svg>
  );
}

const socialLinks = [
  { name: "Facebook", type: "facebook", href: "https://www.facebook.com/" },
  { name: "Instagram", type: "instagram", href: "https://www.instagram.com/" },
  { name: "X", type: "x", href: "https://x.com/" },
  { name: "LinkedIn", type: "linkedin", href: "https://www.linkedin.com/" },
];

export default function Footer() {
  return (
    <footer className="bg-[#30213D] text-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          <div>
            <div className="mb-5">
              <Logo light />
            </div>

            <p className="text-sm leading-7 text-white/65 max-w-xs">
              Connecting students with the right tutors. Making quality
              education and personalized mentorship accessible to everyone.
            </p>

            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#8B78B5] text-white flex items-center justify-center transition"
                >
                  <SocialIcon type={social.type} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5">Quick Links</h3>
            <div className="space-y-3 text-sm text-white/65">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  {link.label}
                  <ArrowUpRight size={13} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5">Contact Us</h3>
            <div className="space-y-4 text-sm text-white/65">
              <p className="flex items-start gap-3">
                <Mail size={18} className="shrink-0 mt-0.5" />
                <span>tasfia.anam2002@gmail.com</span>
              </p>
              <p className="flex items-start gap-3">
                <Phone size={18} className="shrink-0 mt-0.5" />
                <span>+880 1626201849</span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-5">Join MentorLagbe</h3>
            <p className="text-sm leading-7 text-white/65 mb-5">
              Whether you are looking for academic support or sharing your
              knowledge, there is a place for you here.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-[#8B78B5] hover:bg-[#75619E] text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
            >
              Get Started
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/15 pt-7 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
          <p>Empowering learning, one connection at a time.</p>
        </div>
      </div>
    </footer>
  );
}
