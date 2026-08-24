import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/admin'

export type ProtectedOperation = 'ai_generation' | 'public_suggestions'

type AbuseControlResult =
  | { allowed: true }
  | { allowed: false; reason: 'disabled' | 'limited' | 'unavailable' }

const OPERATION_LABELS: Record<ProtectedOperation, string> = {
  ai_generation: 'resume generation',
  public_suggestions: 'suggestions',
}

function fingerprint(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 32)
}

async function requestIdentity() {
  try {
    const requestHeaders = await headers()
    const realIp = requestHeaders.get('x-real-ip')?.trim()
    const forwarded = requestHeaders.get('x-forwarded-for')
      ?.split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .at(-1)
    const candidate = realIp || forwarded || 'unknown'
    return fingerprint(candidate.slice(0, 200))
  } catch {
    // A missing request context must share a conservative bucket, not bypass limits.
    return fingerprint('unknown')
  }
}

async function isOperationEnabled(operation: ProtectedOperation) {
  const { data, error } = await supabaseAdmin.rpc('is_operation_enabled', { p_key: operation })
  if (error || typeof data !== 'boolean') return false
  return data
}

async function consume(bucketKey: string, windowSeconds: number, maximum: number) {
  const { data, error } = await supabaseAdmin.rpc('consume_rate_limit', {
    p_bucket_key: bucketKey,
    p_window_seconds: windowSeconds,
    p_max_requests: maximum,
  })
  if (error || typeof data !== 'boolean') return null
  return data
}

export async function checkAbuseControl({
  operation,
  userId,
  ipLimit,
  userLimit,
}: {
  operation: ProtectedOperation
  userId?: string
  ipLimit: number
  userLimit?: number
}): Promise<AbuseControlResult> {
  if (!(await isOperationEnabled(operation))) {
    return { allowed: false, reason: 'disabled' }
  }

  const ipResult = await consume(
    `operation:${operation}:ip:${await requestIdentity()}`,
    60 * 60,
    ipLimit,
  )
  if (ipResult === null) return { allowed: false, reason: 'unavailable' }
  if (!ipResult) return { allowed: false, reason: 'limited' }

  if (userId && userLimit) {
    const userResult = await consume(
      `operation:${operation}:user:${fingerprint(userId)}`,
      24 * 60 * 60,
      userLimit,
    )
    if (userResult === null) return { allowed: false, reason: 'unavailable' }
    if (!userResult) return { allowed: false, reason: 'limited' }
  }

  return { allowed: true }
}

export function abuseControlMessage(operation: ProtectedOperation, reason: Exclude<AbuseControlResult, { allowed: true }>['reason']) {
  if (reason === 'disabled') return `${OPERATION_LABELS[operation]} are temporarily paused. Please try again later.`
  if (reason === 'limited') return `Please wait before submitting more ${operation === 'ai_generation' ? 'resume requests' : 'suggestions'}.`
  return 'This feature is temporarily unavailable. Please try again later.'
}
