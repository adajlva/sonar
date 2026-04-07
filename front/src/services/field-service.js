import api from './api'

export const fieldService = {
  async getByClient(client) {
    return api.get(`/field/client/${client}`)
  }
}
