const state = {
  duplicatedFields: []
}

const getters = {
  hasDuplicates: (state) => state.duplicatedFields.length > 0
}

const mutations = {
  ADD_DUPLICATED_FIELD: (state, field) => {
    if (!state.duplicatedFields.includes(field)) {
      state.duplicatedFields.push(field)
    }
  },
  REMOVE_DUPLICATED_FIELD: (state, field) => {
    state.duplicatedFields = state.duplicatedFields.filter(f => f !== field)
  },
  CLEAR_DUPLICATES: (state) => {
    state.duplicatedFields = []
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
