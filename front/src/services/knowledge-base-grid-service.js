import api from './api'

export const knowledgeBaseGridService = {
  async getByClient(client) {
    return api.get(`/knowledge-base-grids?client=${client}`)
  },
  async getTreeByClient(client) {
    return api.get(`/knowledge-base-grids/tree?client=${client}`)
  },
  async getTreeByEcosystems(client) {
    return api.get(`/knowledge-base-grids/tree/ecosystems?client=${client}`)
  },
  async save(grid) {
    if (grid._id) {
      return api.put(`/knowledge-base-grids/${grid._id}`, grid)
    }
    return api.post('/knowledge-base-grids', grid)
  },
  async delete(id) {
    return api.delete(`/knowledge-base-grids/${id}`)
  },
  getSuperiorHierarchyByGrid(grid, grids) {
    if (!grid || !grids) return ''
    return grid.hierarchy || grid.name || ''
  }
}
