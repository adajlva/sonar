const state = {
  userClient: 'demo-client',
  userProfile: 'admin_sistema',
  userCpf: null,
  userId: null,
  name: 'Usuário',
  locale: 'pt-BR',
  isMaster: false,
  canViewCollaboratorsInWorkplace: true,
  updatePerson: false,
  ecosystems: [],
  userTermsOfUse: true,
  userUnit: [],
  userHierarchy: [],
  userValidClients: [],
  updateClient: false
}

const getters = {
  userClient: (state) => state.userClient,
  userProfile: (state) => state.userProfile,
  userCpf: (state) => state.userCpf,
  locale: (state) => state.locale,
  isMaster: (state) => state.isMaster,
  canViewCollaboratorsInWorkplace: (state) => state.canViewCollaboratorsInWorkplace,
  userEcosystems: (state) => state.ecosystems
}

const mutations = {
  SET_USER_CLIENT: (state, payload) => {
    state.userClient = payload
  },
  SET_USER_PROFILE: (state, payload) => {
    state.userProfile = payload
  },
  SET_ECOSYSTEMS: (state, payload) => {
    state.ecosystems = payload
  },
  SET_UPDATECLIENT: (state, payload) => {
    state.updateClient = payload
  }
}

const actions = {
  async updateEcosystems() {},
  async updateIsCycleManager() {},
  async updateTermsOfUse({ state }, value) {
    state.userTermsOfUse = value
  },
  async logout() {
    console.log('Logout called')
  },
  setUserClient({ commit }, client) {
    commit('SET_USER_CLIENT', client)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
