const DEFAULT_INDEX = null
const DEFAULT_PERSON = null
const DEFAULT_ADMISSION = null
const DEFAULT_PERSON_BOND = null
const DEFAULT_PERSON_BOND_STATUS = null
const DEFAULT_USER_PERSON_ID = null

const state = {
  index: DEFAULT_INDEX,
  person: DEFAULT_PERSON,
  admission: DEFAULT_ADMISSION,
  personBond: DEFAULT_PERSON_BOND,
  userPersonId: DEFAULT_USER_PERSON_ID,
  personBondStatus: DEFAULT_PERSON_BOND_STATUS
}

const getters = {}

const mutations = {
  SET_INDEX: (state, payload) => {
    state.index = payload
  },
  SET_PERSON: (state, payload) => {
    state.person = payload
  },
  SET_ADMISSION: (state, payload) => {
    state.admission = payload
  },
  SET_PERSON_BOND: (state, payload) => {
    state.personBond = payload
  },
  SET_PERSON_BOND_STATUS: (state, payload) => {
    state.personBondStatus = payload
  },
  SET_USER_PERSON_ID: (state, payload) => {
    state.userPersonId = payload
  }
}

const actions = {
  goto({ commit }, index) {
    commit('SET_INDEX', index)
  },
  gotoFirst({ dispatch }) {
    dispatch('goto', 0)
  },
  setPerson({ commit, dispatch }, person) {
    commit('SET_PERSON', person)
    dispatch('gotoFirst')
  },
  setUserPersonId({ commit }, personId) {
    commit('SET_USER_PERSON_ID', personId)
  },
  setAdmission({ commit }, admissionId) {
    commit('SET_ADMISSION', admissionId)
  },
  gotoHome({ commit, dispatch }) {
    dispatch('goto', DEFAULT_INDEX)
    commit('SET_PERSON', DEFAULT_PERSON)
    commit('SET_ADMISSION', DEFAULT_ADMISSION)
    commit('SET_PERSON_BOND', DEFAULT_PERSON_BOND)
    commit('SET_USER_PERSON_ID', DEFAULT_USER_PERSON_ID)
  },
  gotoFunctionalData({ dispatch }) {
    dispatch('goto', 1)
  },
  gotoSocialData({ dispatch }) {
    dispatch('goto', 2)
  },
  async update({ state }) {
    // Stub for API call
    console.log('[registrationDataTabs] update person:', state.person?._id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
