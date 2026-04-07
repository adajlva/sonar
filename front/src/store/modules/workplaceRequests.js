const state = {
  requestForm: null
}

const mutations = {
  SET_REQUEST_FORM: (state, form) => {
    state.requestForm = form
  }
}

const actions = {
  load({ commit }, form) {
    commit('SET_REQUEST_FORM', form)
  },
  clear({ commit }) {
    commit('SET_REQUEST_FORM', null)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
