const state = {
  visitedViews: [],
  cachedViews: []
}

const mutations = {
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta || !view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  }
}

const actions = {
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
