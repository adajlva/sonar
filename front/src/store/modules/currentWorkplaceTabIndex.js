const defaultCurrentWorkplaceTabIndex = 0

const state = {
  currentWorkplaceTabIndex: defaultCurrentWorkplaceTabIndex
}

const getters = {}

const mutations = {
  SET_CURRENTWORKPLACETABINDEX: (state, payload) => {
    state.currentWorkplaceTabIndex = payload
  }
}

const actions = {
  setCurrentWorkplaceTabIndex({ commit }, currentTabIndex) {
    commit('SET_CURRENTWORKPLACETABINDEX', currentTabIndex)
  },
  clearCurrentWorkplaceTabIndex({ commit }) {
    commit('SET_CURRENTWORKPLACETABINDEX', 0)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
