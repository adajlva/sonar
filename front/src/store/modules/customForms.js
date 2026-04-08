import { customFormService } from '@/services/custom-form-service'

const defaultCustomForm = () => ({
  _id: null,
  client: '',
  module: null,
  answerPath: '',
  name: '',
  description: '',
  maximumTime: null,
  durationTime: null,
  weightedAnswers: false,
  multAnswersPerUser: false,
  anonymousAnswers: false,
  hasPlanning: false,
  answerType: 'ownanswer',
  evaluationRecipient: null,
  evaluationPriority: null,
  integratesWithGEG: false,
  canCreateOccurrenceByAnswer: false,
  isGlobal: false,
  globalVisibility: null,
  ecosystems: null,
  formTemplate: {
    groups: [],
    fields: [],
    queries: [],
    createdByAdmin: false
  },
  answered: 0
})

const state = {
  CustomForm: defaultCustomForm(),
  Ecosystems: []
}

const getters = {
  hasCustomForm: (state) => state.CustomForm._id != null,
  hasFormTemplate: state => !!state.CustomForm.formTemplate.groups.length
}

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
  SET_CUSTOM_FORM: (state, payload) => {
    let customForm = null
    if (payload._doc) {
      customForm = Object.assign(state.CustomForm, payload._doc)
      customForm.formTemplate = payload.formTemplate
    } else customForm = payload

    customForm.formTemplate.createdByAdmin = customForm.createdByAdmin
    computeCustomForm(customForm)
    state.CustomForm = customForm
  },
  UPDATE_FORM_TEMPLATE: (state, { fields, groups }) => {
    state.CustomForm.formTemplate = {
      ...state.CustomForm.formTemplate,
      fields,
      groups
    }
  }
}

const actions = {
  async load({ commit }, customForm) {
    const { data } = await customFormService.getById(customForm._id)
    commit('SET_CUSTOM_FORM', data)
  },
  clear({ commit }) {
    commit('SET_CUSTOM_FORM', defaultCustomForm())
  },
  async save({ rootGetters, state, dispatch }, customForm) {
    customForm = Object.assign(defaultCustomForm(), customForm)
    customForm.createdByAdmin = state.CustomForm._id ? customForm.createdByAdmin : rootGetters.userProfile === 'admin_sistema'

    if (state.CustomForm._id) {
      customForm._id = state.CustomForm._id
    }

    if (!customForm._id) delete customForm._id

    const { data } = await customFormService.save(customForm)
    await dispatch('load', data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
