import { supabaseAdmin } from '@/lib/supabase/admin'

export type UsageEventName =
  | 'recommendations_viewed'
  | 'saved_job_added'
  | 'saved_job_removed'
  | 'ai_generation_started'
  | 'pdf_downloaded'

type UsageValue = string | number | boolean | null

const EVENT_NAMES = new Set<UsageEventName>([
  'recommendations_viewed',
  'saved_job_added',
  'saved_job_removed',
  'ai_generation_started',
  'pdf_downloaded',
])

function safeMetadata(metadata: Record<string, UsageValue>) {
  const entries = Object.entries(metadata)
    .filter(([key, value]) => /^[a-z][a-z0-9_]{0,40}$/.test(key) && (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'))
    .map(([key, value]) => [key, typeof value === 'string' ? value.slice(0, 120) : value] as const)

  const result = Object.fromEntries(entries)
  return JSON.stringify(result).length <= 1000 ? result : {}
}

export async function recordUsageEvent(
  userId: string,
  eventName: UsageEventName,
  metadata: Record<string, UsageValue> = {},
) {
  if (!userId || !EVENT_NAMES.has(eventName)) return

  try {
    const { error } = await supabaseAdmin.from('usage_events').insert({
      user_id: userId,
      event_name: eventName,
      metadata: safeMetadata(metadata),
    })

    if (error) console.error('[usageEvents] event write failed', { eventName })
  } catch {
    console.error('[usageEvents] event write failed', { eventName })
  }
}
