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

import type { NextConfig } from "next"

const configuredSupabaseHostname = (() => {
  for (const configuredUrl of [
    process.env.SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ]) {
    if (!configuredUrl) continue

    try {
      const url = new URL(configuredUrl)
      if (
        url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        !url.port
      ) {
        return url.hostname
      }
    } catch {
      continue
    }
  }

  return null
})()

const imageHostnames = new Set([
  "hbqxheedmamrmqiasflv.supabase.co",
  "utfs.io",
  "images.unsplash.com",
  "www.barbeariamedina.com.br",
  "d2zdpiztbgorvt.cloudfront.net",
  "avatars.githubusercontent.com",
  "yt3.googleusercontent.com",
  "lh3.googleusercontent.com",
  "encrypted-tbn0.gstatic.com",
  "platform-lookaside.fbsbx.com",
])

if (configuredSupabaseHostname) {
  imageHostnames.add(configuredSupabaseHostname)
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.16.1.109"],

  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },

  images: {
    remotePatterns: [
      ...Array.from(imageHostnames, (hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
}

export default nextConfig
