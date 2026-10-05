// Browser-only flags for the welcome popup. Storage can be blocked (private
// mode, cleared site data), so every access is guarded and fails quietly.

const MEMBER_KEY = 'rr_member'
const SNOOZE_KEY = 'rr_popup_snooze_until'

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

export function readSnoozeUntil(): number {
  try {
    return Number(localStorage.getItem(SNOOZE_KEY)) || 0
  } catch {
    return 0
  }
}

export function writeSnoozeUntil(ms: number) {
  try {
    localStorage.setItem(SNOOZE_KEY, String(ms))
  } catch {}
}
