const indexTable = {
  builder: 0,
  planning: 1
}

const state = {
  indexTable,
  currentFormsBuilderTab: indexTable.builder,
  alert: { type: '', message: '' }
}

const mutations = {
  SET_TABS: (state, tab) => {
    state.currentFormsBuilderTab = state.indexTable[tab]
  },
  SET_ALERT: (state, alert) => {
    state.alert.type = alert.type
    state.alert.message = alert.message
  }
}

const actions = {
  setAlert({ commit }, alert) {
    commit('SET_ALERT', alert)
  },
  popAlert({ commit, state }) {
    const alert = state.alert
    commit('SET_ALERT', { type: '', message: '' })
    return alert
  },
  setCurrentFormsBuilderTab({ commit }, tab) {
    commit('SET_TABS', tab)
  },

  goToCreate({ dispatch }) {
    dispatch('customForms/clear', null, { root: true })
    dispatch('setCurrentFormsBuilderTab', 'builder')
  },
  async goToBuilder({ dispatch }, form) {
    await dispatch('customForms/load', form, { root: true })
    dispatch('setCurrentFormsBuilderTab', 'builder')
  },
  async goToPlanning({ dispatch, rootState }, form) {
    await dispatch('customForms/load', form, { root: true })
    if (rootState.customForms.CustomForm.hasPlanning) {
      dispatch('setCurrentFormsBuilderTab', 'planning')
    } else {
      throw new Error('This form not have planning')
    }
  },
  goToList({ dispatch }) {
    dispatch('customForms/clear', null, { root: true })
    dispatch('customFormsTabs/goToList', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
