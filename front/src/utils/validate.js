export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validCPF(cpf) {
  if (!cpf) return false
  const stripped = cpf.replace(/[^\d]/g, '')
  if (stripped.length !== 11) return false
  if (/^(\d)\1{10}$/.test(stripped)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(stripped[i]) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(stripped[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(stripped[i]) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  return remainder === parseInt(stripped[10])
}
