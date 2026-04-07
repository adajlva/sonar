import api from '../api'

export const resignationRequestProcessService = {
  async getMyResignationRequest({ client, search }) {
    return api.get(`/v2/resignation-request-process/my`, {
      params: { client, search }
    })
  }
}
