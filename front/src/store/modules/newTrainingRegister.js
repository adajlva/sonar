import { newTrainingService } from '@/services/new-training-service'
import _ from 'lodash'

const defaultNewTraining = () => ({
  _id: '',
  name: '',
  referenceYear: null,
  objective: null,
  indicator: null,
  value: null,
  keywords: [],
  type: null,
  accountInPerformanceModule: false,
  isRecurringPlanning: false,
  isRequired: false,
  qtdDaysAfterTheStartService: null,
  qtdNewTrainingSchedules: null,
  certificateTemplate: null,
  newTrainingGrid: null,
  unities: null,
  bonds: null,
  positionTypes: null,
  positions: null,
  personBonds: [],
  positionRoles: null,
  correspondingIdInPerformanceModule: null,
  createdByAdmin: false,
  unitiesCadastro: [],
  plannedUnityRefs: []
})

const state = {
  newTraining: defaultNewTraining()
}

const mutations = {
  SET_NEW_TRAINING: (state, payload) => {
    state.newTraining = payload
  }
}

const actions = {
  async load({ commit }, dados) {
    const { id, options, includesDeletedPersonBonds } = dados

    const { data } = await newTrainingService.getById(id, options, includesDeletedPersonBonds)
    commit('SET_NEW_TRAINING', data)
  },

  async save({ rootState }, newTraining) {
    newTraining.client = rootState.user.userClient

    return newTrainingService.save(_.cloneDeep(newTraining))
  },

  async saveSchedules({ commit, rootState }, newTraining) {
    const { _id, schedules, unities } = newTraining

    await newTrainingService.updateSchedules(_id, {
      schedules: _.cloneDeep(schedules),
      unities,
      client: rootState.user.userClient
    })

    const { data } = await newTrainingService.getById(_id)
    commit('SET_NEW_TRAINING', data)
    return data
  },

  async removePlannedUnityRefs({ commit }, { _id, refs }) {
    await newTrainingService.removePlannedUnityRefs(_id, refs || [])
    const { data } = await newTrainingService.getById(_id)
    commit('SET_NEW_TRAINING', data)
    return data
  },

  clear({ commit }) {
    commit('SET_NEW_TRAINING', defaultNewTraining())
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
