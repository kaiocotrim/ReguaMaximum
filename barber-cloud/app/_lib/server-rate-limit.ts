import "server-only"

import { createHash } from "node:crypto"

type HeaderSource =
  | Pick<Headers, "get">
  | Record<string, string | string[] | undefined>

type RateLimitOptions = {
  namespace: string
  identifier: string
  limit: number
  windowMs: number
}

type RateLimitBucket = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  retryAfterSeconds: number
}

const MAX_BUCKETS = 10_000
const globalRateLimit = globalThis as typeof globalThis & {
  barberCloudRateLimit?: Map<string, RateLimitBucket>
  barberCloudRateLimitChecks?: number
}

const buckets =
  globalRateLimit.barberCloudRateLimit ??
  new Map<string, RateLimitBucket>()

globalRateLimit.barberCloudRateLimit = buckets

function readHeader(headers: HeaderSource, name: string) {
  const headersObject = headers as Pick<Headers, "get">

  if (typeof headersObject.get === "function") {
    return headersObject.get(name)
  }

  const headersRecord = headers as Record<
    string,
    string | string[] | undefined
  >
  const value = headersRecord[name] ?? headersRecord[name.toLowerCase()]
  return Array.isArray(value) ? value[0] : value ?? null
}

function cleanupExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key)
    }
  }
}

function createBucketKey(namespace: string, identifier: string) {
  return createHash("sha256")
    .update(`${namespace}:${identifier}`)
    .digest("hex")
}

export function getClientIp(headers: HeaderSource) {
  const forwardedFor = readHeader(headers, "x-forwarded-for")
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim()

  return (
    firstForwardedIp ||
    readHeader(headers, "x-real-ip")?.trim() ||
    "unknown"
  )
}

export function consumeRateLimit({
  namespace,
  identifier,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  if (typeof window !== "undefined") {
    throw new Error("Rate limiting só pode ser executado no servidor")
  }

  const now = Date.now()
  globalRateLimit.barberCloudRateLimitChecks =
    (globalRateLimit.barberCloudRateLimitChecks ?? 0) + 1

  if (
    globalRateLimit.barberCloudRateLimitChecks % 100 === 0 ||
    buckets.size >= MAX_BUCKETS
  ) {
    cleanupExpiredBuckets(now)
  }

  const key = createBucketKey(namespace, identifier)
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      const oldestKey = buckets.keys().next().value
      if (oldestKey) buckets.delete(oldestKey)
    }

    buckets.set(key, { count: 1, resetAt: now + windowMs })

    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - 1),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    }
  }

  current.count += 1

  return {
    allowed: current.count <= limit,
    limit,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000),
    ),
  }
}
