const state = {
  validPersonalData: true
}

const mutations = {
  SET_VALID_PERSONAL_DATA: (state, payload) => {
    state.validPersonalData = payload
  }
}

const actions = {
  savePerson() {},
  clearPerson() {},
  setValidPersonalData({ commit }, value) {
    commit('SET_VALID_PERSONAL_DATA', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
