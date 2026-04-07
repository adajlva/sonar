const defaultCurrentKnowledgeBaseTabIndex = 0

const state = {
  currentKnowledgeBaseTabIndex: defaultCurrentKnowledgeBaseTabIndex
}

const getters = {}

const mutations = {
  SET_CURRENTKNOWLEDGEBASETABINDEX: (state, payload) => {
    state.currentKnowledgeBaseTabIndex = payload
  }
}

const actions = {
  setCurrentKnowledgeBaseTabIndex({ commit }, currentTabIndex) {
    commit('SET_CURRENTKNOWLEDGEBASETABINDEX', currentTabIndex)
  },
  clearCurrentKnowledgeBaseTabIndex({ commit }) {
    commit('SET_CURRENTKNOWLEDGEBASETABINDEX', 0)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
