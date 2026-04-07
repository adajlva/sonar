import api from './api'

export const knowledgeBaseFileService = {
  async getFiles(client, limit, page, keyword, ecosystems, grid, startDate, endDate) {
    const params = { client, limit, page }
    if (keyword) params.keyword = keyword
    if (ecosystems) params.ecosystems = ecosystems
    if (grid) params.grid = grid
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    return api.get('/knowledge-base-files', { params })
  },
  async getByKeyword(client, limit, page, keyword) {
    return api.get('/knowledge-base-files', { params: { client, limit, page, keyword } })
  },
  async getClientConditions(id) {
    return api.get(`/knowledge-base-files/${id}/client-conditions`)
  },
  async save(file) {
    return api.post('/knowledge-base-files', file)
  },
  async delete(id) {
    return api.delete(`/knowledge-base-files/${id}`)
  }
}
