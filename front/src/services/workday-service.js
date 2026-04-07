import api from './api'

export async function getWorkdaysByClient(client) {
  return api.get(`/workday/client/${client}`)
}
