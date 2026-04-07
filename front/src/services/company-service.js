import api from './api'

export const companyService = {
  async getByClient(client) {
    return api.get(`/company/client/${client}`)
  }
}
