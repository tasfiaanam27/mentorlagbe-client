/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
      // KEEP YOUR EXISTING TURBOPACK RULES HERE
    },
  },

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination:
          "https://mentorlagbe-server-ufzz.onrender.com/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;

