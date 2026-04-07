import api from './api'

export const leadershipHierarchyService = {
  async getActiveBondsByLeadershipWorksheetSummary(client, locale) {
    return api.post(`/leadership-hierarchy/worksheet/summary`, { client, locale })
  },
  async getActiveBondsByLeadershipWorksheetComplete(client, locale) {
    return api.post(`/leadership-hierarchy/worksheet/complete`, { client, locale })
  }
}
