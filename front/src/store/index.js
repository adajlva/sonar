import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import app from './modules/app'
import settings from './modules/settings'
import tagsView from './modules/tagsView'
import approval from './modules/approval'
import collaboratorDossierTabs from './modules/collaboratorDossierTabs'
import registrationDataTabs from './modules/registrationDataTabs'
import currentWorkplaceTabIndex from './modules/currentWorkplaceTabIndex'
import currentKnowledgeBaseTabIndex from './modules/currentKnowledgeBaseTabIndex'
import workplaceRequestsTabs from './modules/workplaceRequestsTabs'
import workplaceRequests from './modules/workplaceRequests'
import contactDuplicates from './modules/contactDuplicates'
import screens from './modules/screens'
import user from './modules/user'
import rollbackPlan from './modules/rollbackPlan'
import person from './modules/person'
import peopleTabs from './modules/peopleTabs'
import { constantRoutes } from '@/router'

export default new Vuex.Store({
  modules: {
    app,
    settings,
    tagsView,
    approval,
    collaboratorDossierTabs,
    registrationDataTabs,
    currentWorkplaceTabIndex,
    currentKnowledgeBaseTabIndex,
    workplaceRequestsTabs,
    workplaceRequests,
    contactDuplicates,
    screens,
    user,
    rollbackPlan,
    person,
    peopleTabs
  },
  getters: {
    sidebar: (state) => state.app.sidebar,
    device: (state) => state.app.device,
    permission_routes: () => constantRoutes.filter(r => !r.hidden),
    name: (state) => state.user.name || 'Usuário',
    avatar: () => '',
    hasFullAccess: () => true,
    userId: (state) => state.user.userId,
    userUnit: (state) => state.user.userUnit || [],
    userValidClients: (state) => state.user.userValidClients || [],
    updateClient: (state) => state.user.updateClient || false,
    userClient: (state) => state.user.userClient,
    userProfile: (state) => state.user.userProfile,
    userCpf: (state) => state.user.userCpf,
    userEcosystems: (state) => state.user.ecosystems,
    locale: (state) => state.user.locale,
    isMaster: (state) => state.user.isMaster,
    canViewCollaboratorsInWorkplace: (state) => state.user.canViewCollaboratorsInWorkplace
  }
})
