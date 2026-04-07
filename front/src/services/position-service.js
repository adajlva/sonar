import api from './api'

export async function getSimplePositionsByClient(client, fields) {
  return api.get(`/position/client/${client}`, { params: { fields } })
}

export async function getPositionsWithDeletedByClient(client, fields) {
  return api.get(`/position/client/${client}?includeDeleted=true`, { params: { fields } })
}
