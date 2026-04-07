import api from './api'

export const customFormService = {
  async getWorkplaceFormsByKeyword(client, cpf, limit, page, keyword) {
    return api.get(`/custom-form/workplace`, {
      params: { client, cpf, limit, page, keyword }
    })
  }
}
