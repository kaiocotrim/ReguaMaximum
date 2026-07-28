import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin

  const supabaseUrl =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const secretKey =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!supabaseUrl || !secretKey) {
    throw new Error("O armazenamento de imagens não está configurado.")
  }

  supabaseAdmin = createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })

  return supabaseAdmin
}
