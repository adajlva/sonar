const tabs = {
  list: () => import('@/views/dossier/requests/RequestsList.vue'),
  view: () => import('@/views/dossier/requests/RequestAnswerView.vue')
}

const state = {
  tabs,
  currentWorkpleceRequestsTab: tabs.list,
  alert: { type: '', message: '' }
}

const mutations = {
  SET_TABS: (state, tab) => {
    state.currentWorkpleceRequestsTab = state.tabs[tab]
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
  setCurrentWorkplaceRequestsTab({ commit }, tab) {
    commit('SET_TABS', tab)
  }
}

const factoryPreCalback =
  (pre) =>
    (next) =>
      async (...args) => {
        await pre(...args)
        await next(...args)
      }

const preCustomFormLoad = factoryPreCalback(({ dispatch }, form) =>
  dispatch('workplaceRequests/load', form, { root: true })
)

const factoryTabNavigation =
  (tabName) =>
    ({ dispatch }) =>
      dispatch('setCurrentWorkplaceRequestsTab', tabName)

const goToView = preCustomFormLoad(factoryTabNavigation('view'))

const preCustomFormClear = factoryPreCalback(({ dispatch }) =>
  dispatch('workplaceRequests/clear', null, { root: true })
)

const goToList = preCustomFormClear(factoryTabNavigation('list'))

const tabNavigationActions = {
  goToList,
  goToView
}

Object.assign(actions, tabNavigationActions)

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
