export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_BYTES = 72

const COMMON_PASSWORDS = new Set([
  "12345678",
  "123456789",
  "1234567890",
  "password",
  "password1",
  "qwerty123",
  "senha123",
  "senha1234",
])

export function getPasswordValidationError(password: unknown) {
  if (typeof password !== "string") {
    return "Informe uma senha válida"
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`
  }

  if (new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES) {
    return "A senha deve ter no máximo 72 bytes"
  }

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return "Essa senha é muito comum. Escolha uma senha mais segura"
  }

  const characterGroups = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length

  if (characterGroups < 3) {
    return "Use pelo menos 3 tipos: letra minúscula, maiúscula, número e símbolo"
  }

  return null
}
