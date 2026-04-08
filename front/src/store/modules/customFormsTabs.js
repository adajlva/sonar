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
  currentCustomFormsTab: tabs.list,
  alert: { type: '', message: '' }
}

const mutations = {
  SET_TABS: (state, tab) => {
    state.currentCustomFormsTab = state.tabs[tab]
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
  setCurrentCustomFormsTab({ commit }, tab) {
    commit('SET_TABS', tab)
  },

  goToCreate({ dispatch }) {
    dispatch('customForms/clear', null, { root: true })
    dispatch('setCurrentCustomFormsTab', 'config')
  },
  async goToUpdate({ dispatch }, form) {
    await dispatch('formBuilderTabs/goToBuilder', form, { root: true })
    dispatch('setCurrentCustomFormsTab', 'builder')
  },
  goToList({ dispatch }) {
    dispatch('customForms/clear', null, { root: true })
    dispatch('setCurrentCustomFormsTab', 'list')
  },
  async goToView({ dispatch }, form) {
    await dispatch('customForms/load', form, { root: true })
    dispatch('setCurrentCustomFormsTab', 'view')
  },
  async goToAnswers({ dispatch }, form) {
    await dispatch('customForms/load', form, { root: true })
    dispatch('setCurrentCustomFormsTab', form.integratesWithGEG ? 'geganswers' : 'answers')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
