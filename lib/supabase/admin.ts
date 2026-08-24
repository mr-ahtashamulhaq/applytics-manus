import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase server environment is not configured')
  }

  client = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return client
}

/**
 * Server-side Supabase admin client (uses the service-role key).
 * The proxy keeps existing call sites compatible while deferring client
 * creation until a request actually needs the database.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, property, receiver) {
    const value = Reflect.get(getSupabaseAdmin(), property, receiver)
    return typeof value === 'function' ? value.bind(getSupabaseAdmin()) : value
  },
})
