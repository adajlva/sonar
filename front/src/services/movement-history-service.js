import api from './api'

export const movementHistoryService = {
  async getByClientAndDocument(client, document, params) {
    return api.get(`/movement-history/client/${client}/document/${document}`, { params })
  },
  async getWorksheetByClientAndDocument(client, document, locale) {
    return api.get(`/movement-history/worksheet/client/${client}/document/${document}`, {
      params: { locale }
    })
  }
}
