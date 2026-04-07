import api from './api'

export async function findBySource(source, type, client, limit, page) {
  return api.get(`/report`, { params: { source, type, client, limit, page } })
}
