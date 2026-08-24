'use server'

import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { findOwnedAccount, loadAccountExport } from '@/lib/account/data'
import { accountStorageReferences } from '@/lib/account/storage'

const deleteAccountSchema = z.object({
  confirmation: z.literal('DELETE MY ACCOUNT'),
})

export interface DeleteAccountResult {
  success: boolean
  error?: string
}

export async function deleteAccount(rawInput: { confirmation: string }): Promise<DeleteAccountResult> {
  const parsed = deleteAccountSchema.safeParse(rawInput)
  if (!parsed.success) return { success: false, error: 'Type DELETE MY ACCOUNT to confirm account deletion.' }

  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  try {
    const account = await findOwnedAccount(userId)
    if (account) {
      const exportData = await loadAccountExport(userId)
      if (!exportData) return { success: false, error: 'Account data is not available. Please try again.' }

      const references = accountStorageReferences(exportData.profile, exportData.generated_resumes)
      for (const bucket of ['resumes', 'generated'] as const) {
        const paths = references
          .filter((reference) => reference.bucket === bucket)
          .map((reference) => reference.path)
        if (paths.length === 0) continue

        const { error } = await supabaseAdmin.storage.from(bucket).remove(paths)
        if (error) {
          console.error('[deleteAccount] storage cleanup failed', { bucket })
          return { success: false, error: 'We could not complete account deletion. Please try again.' }
        }
      }

      for (const table of ['applications', 'saved_jobs', 'generated_resumes', 'job_inputs', 'profiles'] as const) {
        const { error } = await supabaseAdmin.from(table).delete().eq('user_id', account.id)
        if (error) {
          console.error('[deleteAccount] data cleanup failed', { table })
          return { success: false, error: 'We could not complete account deletion. Please try again.' }
        }
      }

      const { error: userDeleteError } = await supabaseAdmin.from('users').delete().eq('id', account.id)
      if (userDeleteError) {
        console.error('[deleteAccount] user cleanup failed')
        return { success: false, error: 'We could not complete account deletion. Please try again.' }
      }
    }

    try {
      const client = await clerkClient()
      await client.users.deleteUser(userId)
    } catch {
      console.error('[deleteAccount] Clerk cleanup failed')
      return { success: false, error: 'Your app data was removed, but the account provider did not finish. Please contact support.' }
    }

    revalidatePath('/app/account')
    return { success: true }
  } catch {
    console.error('[deleteAccount] unexpected error')
    return { success: false, error: 'We could not complete account deletion. Please try again.' }
  }
}

