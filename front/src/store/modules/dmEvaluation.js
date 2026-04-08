import { customEvaluationService } from '@/services/custom-evaluation-service'
import _ from 'lodash'

const defaultEvaluation = () => ({
  client: '',
  module: null,
  name: '',
  maximumScore: null,
  hasScore: false,
  minimumScore: null,
  maximumTime: null,
  description: '',
  weightedAnswers: false,
  formTemplate: {
    groups: [],
    fields: [],
    queries: []
  },
  answered: 0
})

const state = {
  evaluation: defaultEvaluation(),
  evaluations: [],
  totalPages: 0,
  view: 'list', // list | form | form_view,
  module: '',
  keyword: ''
}

const getters = {}

function computeCustomForm(customForm) {
  // set ecosystems
  if (customForm.ecosystems && Array.isArray(customForm.ecosystems)) {
    state.Ecosystems = customForm.ecosystems

    customForm.ecosystems = customForm.ecosystems.map(ecosystem => {
      if (typeof ecosystem === 'object' && ecosystem._id) {
        return ecosystem._id
      }
      return ecosystem
    })
  } else {
    state.Ecosystems = []
  }

  customForm.isGlobal = customForm.client === 'global'

  if (customForm.isGlobal) {
    if (Array.isArray(customForm.ecosystems) && customForm.ecosystems.length > 0) {
      customForm.globalVisibility = 'byEcosystems'
    } else {
      customForm.globalVisibility = 'global'
    }
  } else {
    customForm.globalVisibility = null
  }

  return customForm
}

const mutations = {
  SET_EVALUATION_LIST: (state, { evaluations, totalPages }) => {
    state.evaluations = evaluations
    state.totalPages = totalPages
  },

  SET_EVALUATION: (state, { evaluation }) => {
    if (!evaluation || _.isEmpty(evaluation)) {
      state.evaluation = evaluation
      return
    }

    evaluation.formTemplate.createdByAdmin = evaluation.createdByAdmin
    computeCustomForm(evaluation)
    state.evaluation = evaluation
  },

  SAVE_EVALUATION: (state, { data }) => {
    state.evaluation = data
  },

  DELETE_EVALUATION: (state, { id }) => {
    state.evaluations = state.evaluations.filter((item) => item._id !== id)
  },

  APPEND_TO_EVALUATION_LIST: (state, { evaluations, totalPages }) => {
    state.evaluations = state.evaluations.concat(evaluations)
    state.totalPages = totalPages
  },

  SET_VIEW_TO_FORM: (state) => {
    state.view = 'form'
  },

  SET_VIEW_TO_FORM_VIEW: (state) => {
    state.view = 'form_view'
  },

  SET_VIEW_TO_LIST: (state) => {
    state.view = 'list'
  },

  SET_VIEW_TO_FORM_CONSULT: (state) => {
    state.view = 'form_consult'
  },

  SET_MODULE: (state, { module }) => {
    state.module = module
  }
}

const actions = {
  async getByModuleAndClient({ commit }, { module, pageNumber }) {
    const { data } = await customEvaluationService.getByModuleAndClient(
      module,
      pageNumber
    )
    const { docs, totalPages } = data
    if (pageNumber === 1) {
      commit('SET_EVALUATION_LIST', {
        evaluations: docs,
        totalPages: totalPages
      })
    } else {
      commit('APPEND_TO_EVALUATION_LIST', {
        evaluations: docs,
        totalPages: totalPages
      })
    }
  },

  async getByKeyword({ commit }, { module, keyword }) {
    const { data } = await customEvaluationService.getByModuleAndClient(
      module,
      1,
      20,
      keyword
    )
    const { docs, totaldocs } = data
    commit('SET_EVALUATION_LIST', {
      evaluations: docs,
      totalPages: totaldocs
    })
  },

  async loadEvaluation({ commit }, { id }) {
    const { data: evaluation } = await customEvaluationService.getById(id)
    commit('SET_EVALUATION', { evaluation })
  },

  async save({ commit, dispatch, rootGetters, state }, { module, evaluation }) {
    evaluation = Object.assign(defaultEvaluation(), evaluation)

    evaluation.createdByAdmin = state.evaluation._id ? evaluation.createdByAdmin : rootGetters.userProfile === 'admin_sistema'
    evaluation.formTemplate.createdByAdmin = evaluation.createdByAdmin

    module = module || (state.evaluation && state.evaluation.module) || state.module

    const { data } = await customEvaluationService.save({
      ...state.evaluation,
      ...evaluation,
      module
    })
    commit('SAVE_EVALUATION', { data })

    dispatch('getByModuleAndClient', { module, pageNumber: 1 })

    dispatch('loadEvaluation', { id: data._id })
  },

  clear({ commit }) {
    commit('SET_EVALUATION', {})
  },

  async deleteEvaluation({ commit }, { id }) {
    await customEvaluationService.delete(id)
    commit('DELETE_EVALUATION', { id })
  },

  async setViewToForm({ commit }, payload) {
    const { newEvaluation } = payload || {}
    if (newEvaluation) commit('SET_EVALUATION', { evaluation: {}})
    commit('SET_VIEW_TO_FORM')
  },

  async setViewToFormView({ commit }) {
    commit('SET_VIEW_TO_FORM_VIEW')
  },

  async setViewToList({ commit }) {
    commit('SET_VIEW_TO_LIST')
  },

  async setViewToFormConsult({ commit }) {
    commit('SET_VIEW_TO_FORM_CONSULT')
  },

  async setModule({ commit, dispatch }, { module }) {
    commit('SET_MODULE', { module })
    dispatch('clear')
    await dispatch('getByModuleAndClient', { module, pageNumber: 1 })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
