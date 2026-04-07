export const userClientConfigurationService = {
  async getByUserAndClient(user, client) {
    try {
      const api = (await import('./api')).default
      return await api.get(`/user-client-configuration/by_user_client?user=${user}&client=${client}`)
    } catch {
      return { data: null }
    }
  }
}
