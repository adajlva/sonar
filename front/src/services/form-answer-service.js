import api from './api'

export class FormAnswerService {
  constructor(path) {
    this.path = path
  }

  async save(formAnswers) {
    return api.post(`/${this.path}`, formAnswers)
  }

  async hasAnswerByCustomForm(client, customFormId, userDocument) {
    return api.get(`/${this.path}/check`, {
      params: { client, customFormId, userDocument }
    })
  }
}
