import { hideLoader, showLoader } from '@/utils/loading'

const tabs = {
  list: () =>
    import(
      '@/views/trainings/records/training/trainingsList/TrainingRecordsList.vue'
    ),
  register: () =>
    import('@/views/trainings/records/training/register/TrainingRegister.vue')
  // config: () => import('@/components/DMForm/FormConfig'),
}

const state = {
  tabs,
  currentTraingRegisterTab: tabs.list
}

const mutations = {
  SET_TABS: (state, tab) => {
    state.currentTraingRegisterTab = state.tabs[tab]
  }
}

const actions = {
  setCurrentTraingRegisterTab({ commit }, tab) {
    commit('SET_TABS', tab)
  },

  goToCreate({ dispatch }) {
    dispatch('setCurrentTraingRegisterTab', 'register')
  },

  async goToUpdate({ dispatch }, training) {
    try {
      showLoader()
      await dispatch(
        'newTrainingRegister/load',
        {
          id: training,
          options: { populate: 'personBonds certificateTemplate' },
          includesDeletedPersonBonds: true
        },
        { root: true }
      )
    } finally {
      hideLoader()
      dispatch('setCurrentTraingRegisterTab', 'register')
    }
  },

  async goToView({ dispatch }, training) {
    try {
      showLoader()
      await dispatch(
        'newTrainingRegister/load',
        {
          id: training._id,
          options: { populate: 'personBonds certificateTemplate' },
          includesDeletedPersonBonds: true
        },
        { root: true }
      )
    } finally {
      hideLoader()
      dispatch('setCurrentTraingRegisterTab', 'register')
    }
  },

  goToTrainingList({ dispatch }) {
    dispatch('setCurrentTraingRegisterTab', 'list')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
