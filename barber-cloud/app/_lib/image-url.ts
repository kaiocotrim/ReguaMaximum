import "server-only"

const ALLOWED_IMAGE_HOSTS = new Set([
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

const MAX_IMAGE_URL_LENGTH = 2048

function configuredSupabaseHost() {
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
        return url.hostname.toLowerCase()
      }
    } catch {
      continue
    }
  }

  return null
}

const CONFIGURED_SUPABASE_HOST = configuredSupabaseHost()

function isAllowedHost(hostname: string) {
  const normalizedHostname = hostname.toLowerCase()

  return (
    ALLOWED_IMAGE_HOSTS.has(normalizedHostname) ||
    normalizedHostname.endsWith(".fbcdn.net") ||
    normalizedHostname === CONFIGURED_SUPABASE_HOST
  )
}

export function normalizeAllowedImageUrl(value: unknown) {
  if (typeof value !== "string") return null

  const candidate = value.trim()
  if (!candidate || candidate.length > MAX_IMAGE_URL_LENGTH) return null

  try {
    const url = new URL(candidate)

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      !isAllowedHost(url.hostname)
    ) {
      return null
    }

    return url.href
  } catch {
    return null
  }
}

export function assertAllowedImageUrl(
  value: unknown,
  message = "URL da imagem inválida.",
) {
  const imageUrl = normalizeAllowedImageUrl(value)

  if (!imageUrl) {
    throw new Error(message)
  }

  return imageUrl
}
