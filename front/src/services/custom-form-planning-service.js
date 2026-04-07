import api from './api'

export const customFormPlanningService = {
  async validPlansByCustomForm(client, customFormId, userDocument) {
    return api.get(`/custom-form-planning/valid`, {
      params: { client, customFormId, userDocument }
    })
  }
}
