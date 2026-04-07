import api from './api'

export const positionRoleService = {
  async getByClient(client) {
    return api.get(`/position-role/client/${client}`)
  }
}
