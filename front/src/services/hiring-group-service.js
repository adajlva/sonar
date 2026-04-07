import api from './api'

export async function getHiringGroupsByClient(client) {
  return api.get(`/hiring-group/client/${client}`)
}
