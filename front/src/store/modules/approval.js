const state = {
  approval: null
}

const mutations = {
  SET_APPROVAL: (state, approval) => {
    state.approval = approval
  },
  CLEAR_APPROVAL: (state) => {
    state.approval = null
  }
}

const actions = {
  async loadApproval({ commit }) {
    commit('SET_APPROVAL', null)
  },
  clearApproval({ commit }) {
    commit('CLEAR_APPROVAL')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
