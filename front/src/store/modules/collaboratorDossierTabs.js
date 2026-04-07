const DEFAULT_INDEX = null
const DEFAULT_PERSON = null
const DEFAULT_USER_PERSON_ID = null
const DEFAULT_ADMISSION = null

const state = {
  index: DEFAULT_INDEX,
  person: DEFAULT_PERSON,
  userPersonId: DEFAULT_USER_PERSON_ID,
  admission: DEFAULT_ADMISSION
}

const getters = {}

const mutations = {
  SET_INDEX: (state, payload) => {
    state.index = payload
  },
  SET_PERSON: (state, payload) => {
    state.person = payload
  },
  SET_USER_PERSON_ID: (state, payload) => {
    state.userPersonId = payload
  },
  SET_ADMISSION: (state, payload) => {
    state.admission = payload
  }
}

const actions = {
  goto({ commit }, index) {
    commit('SET_INDEX', index)
  },
  gotoHome({ commit, dispatch }) {
    dispatch('goto', DEFAULT_INDEX)
    commit('SET_PERSON', DEFAULT_PERSON)
  },
  gotoFirst({ dispatch }) {
    dispatch('goto', 0)
  },
  setPerson({ commit, dispatch }, person) {
    commit('SET_PERSON', person)
    dispatch('gotoFirst')
  },
  setAdmission({ commit }, admissionId) {
    commit('SET_ADMISSION', admissionId)
  },
  setUserPersonId({ commit }, personId) {
    commit('SET_USER_PERSON_ID', personId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
