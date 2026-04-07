import api from './api'

export const unityService = {
  async getByClient(client) {
    return api.get(`/unity/client/${client}`)
  },
  async getTreeByHierarchy(client) {
    return api.get(`/unity/tree/${client}`)
  },
  async getFullTreeByClient(client, fields) {
    return api.get(`/unity/full-tree/${client}`, { params: { fields } })
  },
  async getByReferenceId(referenceId) {
    return api.get(`/unity/reference/${referenceId}`)
  },
  getSuperiorHierarchyByUnity(unity, units) {
    if (!unity || !units) return '-'
    const found = units.find(u => u.referenceId === unity || u._id === unity)
    return found ? found.name : '-'
  }
}
