const mockTab = () =>
  import('@/views/trainings/records/form/TrainingFormFlowMock.vue')

const tabs = {
  list: mockTab,
  view: mockTab,
  builder: mockTab,
  config: mockTab,
  answers: mockTab,
  geganswers: mockTab
}

const state = {
  tabs,
  tab: tabs.list,
  alert: { type: '', message: '' }
}

const mutations = {
  SET_TAB: (state, tab) => {
    state.tab = state.tabs[tab]
  },
  SET_ALERT: (state, alert) => {
    state.alert = alert
  }
}

const actions = {
  setAlert({ commit }, alert) {
    commit('SET_ALERT', alert)
  },
  popAlert({ commit, state }) {
    const alert = state.alert
    commit('SET_ALERT', null)
    return alert
  },
  setTab({ commit }, tab) {
    commit('SET_TAB', tab)
  },

  goToCreate({ dispatch }) {
    dispatch('customForms/clear', null, { root: true })
    dispatch('setTab', 'config')
  },
  async goToUpdate({ dispatch }, form) {
    await dispatch('formBuilderTabs/goToBuilder', form, { root: true })
    dispatch('setTab', 'builder')
  },
  goToList({ dispatch }) {
    dispatch('customForms/clear', null, { root: true })
    dispatch('setTab', 'list')
  },
  async goToView({ dispatch }, form) {
    await dispatch('customForms/load', form, { root: true })
    dispatch('setTab', 'view')
  },
  async goToAnswers({ dispatch }, form) {
    await dispatch('customForms/load', form, { root: true })
    dispatch('setTab', form.integratesWithGEG ? 'geganswers' : 'answers')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
