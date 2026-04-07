import api from './api'

export const clientService = {
  async get() {
    return api.get(`/client`)
  },

  async getByUserToken() {
    try {
      return await api.get('/client/user_clients_by_token')
    } catch {
      return { data: [] }
    }
  },

  async getByCode(code) {
    try {
      return await api.get(`/client/by_code/${code}`)
    } catch {
      return { data: null }
    }
  }
}
