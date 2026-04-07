import api from './api'

export async function getBondsByClient(client) {
  return api.get(`/bond/client/${client}`)
}

export async function getBondsWithDeletedByClient(client) {
  return api.get(`/bond/client/${client}?includeDeleted=true`)
}
