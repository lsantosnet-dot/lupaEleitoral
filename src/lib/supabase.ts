import { createClient } from '@supabase/supabase-js'

export const createClerkSupabaseClient = (clerkToken: string) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        // Send the custom Clerk JWT
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
    }
  )
}

// Client for public non-authenticated calls
export const supabasePublic = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
