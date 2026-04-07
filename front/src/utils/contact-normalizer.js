export function normalizeEmail(email) {
  if (!email) return null
  return email.toLowerCase().trim()
}

export function normalizePhone(phone) {
  if (!phone) return null
  return phone.replace(/\D/g, '')
}
