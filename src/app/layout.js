
import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: "MentorLagbe | Find Your Ideal Tutor",
  description:
    "MentorLagbe connects students with qualified tutors for personalized learning, online tuition, home tuition, and mentorship.",
  keywords: [
    "MentorLagbe",
    "Online Tuition",
    "Home Tutor",
    "Mentorship",
    "Education",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F8F5] text-[#142B3B] antialiased">
        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  );
}
