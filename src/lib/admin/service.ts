import { createClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client for admin/server-only surfaces.
 * Uses the service key — NEVER import this into client components.
 * Centralises what used to be duplicated inline in every admin route/page.
 */
export function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
