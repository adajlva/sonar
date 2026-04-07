const state = {
  storageRollbackPlan: {
    actions: [],
    follows: []
  },
  rollbackPlan: null,
  collaboratorSelected: null
}

const mutations = {
  SET_ROLLBACK_PLAN(state, plan) {
    state.rollbackPlan = plan
    state.storageRollbackPlan = plan || { actions: [], follows: [] }
  },
  SET_COLLABORATOR(state, collaborator) {
    state.collaboratorSelected = collaborator
  },
  RESET_COLLABORATOR(state) {
    state.collaboratorSelected = null
  },
  CLEAR(state) {
    state.rollbackPlan = null
    state.storageRollbackPlan = { actions: [], follows: [] }
  }
}

const actions = {
  load({ commit }, plan) {
    commit('SET_ROLLBACK_PLAN', plan)
  },
  setColaborator({ commit }, collaborator) {
    commit('SET_COLLABORATOR', collaborator)
  },
  resetSelectedCollaborator({ commit }) {
    commit('RESET_COLLABORATOR')
  },
  clear({ commit }) {
    commit('CLEAR')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
