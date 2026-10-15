// Browser-only flags for the welcome popup. Storage can be blocked (private
// mode, cleared site data), so every access is guarded and fails quietly.

const MEMBER_KEY = 'rr_member'
const SNOOZE_KEY = 'rr_popup_snooze_until'
// Which campaign the snooze was for — a new drop brings the popup back early.
const SNOOZE_CAMPAIGN_KEY = 'rr_popup_snooze_campaign'

export function isMember(): boolean {
  try {
    return localStorage.getItem(MEMBER_KEY) === '1'
  } catch {
    return false
  }
}

export function markMember() {
  try {
    localStorage.setItem(MEMBER_KEY, '1')
  } catch {}
}

export function readSnoozeUntil(campaign: string): number {
  try {
    if (localStorage.getItem(SNOOZE_CAMPAIGN_KEY) !== campaign) return 0
    return Number(localStorage.getItem(SNOOZE_KEY)) || 0
  } catch {
    return 0
  }
}

export function writeSnoozeUntil(ms: number, campaign: string) {
  try {
    localStorage.setItem(SNOOZE_KEY, String(ms))
    localStorage.setItem(SNOOZE_CAMPAIGN_KEY, campaign)
  } catch {}
}
