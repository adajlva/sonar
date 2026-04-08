const defaultCurrentTrainingRecordsTabIndex = 0

const state = {
  currentTrainingRecordsTabIndex: defaultCurrentTrainingRecordsTabIndex
}

const getters = {}

const mutations = {
  SET_CURRENTTRAININGRECORDSTABINDEX: (state, payload) => {
    state.currentTrainingRecordsTabIndex = payload
  }
}

const actions = {
  setCurrentTrainingRecordsTabIndex({ commit }, currentTabIndex) {
    commit('SET_CURRENTTRAININGRECORDSTABINDEX', currentTabIndex)
  },
  clearCurrentTrainingRecordsTabIndex({ commit }) {
    const defCurrentTrainingRecordsTabIndex = 0
    commit('SET_CURRENTTRAININGRECORDSTABINDEX', defCurrentTrainingRecordsTabIndex)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
