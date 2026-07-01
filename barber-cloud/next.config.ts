// import type { NextConfig } from "next"

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "utfs.io" },
//       { protocol: "https", hostname: "images.unsplash.com" },
//       { protocol: "https", hostname: "www.barbeariamedina.com.br" },
//       { protocol: "https", hostname: "d2zdpiztbgorvt.cloudfront.net" },
//       { protocol: "https", hostname: "avatars.githubusercontent.com" },
//     ],
//   },
// }

// // next.config.js
// const nextConfig = {
//   images: {
//     domains: ["utfs.io"],
//   },
// }

// export default nextConfig

// next.config.ts (ou next.config.js)

//
/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["172.16.1.109"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hbqxheedmamrmqiasflv.supabase.co",
      },

      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.barbeariamedina.com.br" },
      { protocol: "https", hostname: "d2zdpiztbgorvt.cloudfront.net" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
}

module.exports = nextConfig
