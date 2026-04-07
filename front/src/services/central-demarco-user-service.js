export const centralDemarcoUserService = {
  async getByReferenceId(referenceId) {
    try {
      const api = (await import('./api')).default
      return await api.get(`/central-demarco-user/by_reference_id/${referenceId}`)
    } catch {
      return { data: { termsOfUse: true } }
    }
  },

  async save(user) {
    try {
      const api = (await import('./api')).default
      return await api.put(`/central-demarco-user/${user.id}`, user)
    } catch {
      return { data: user }
    }
  }
}
