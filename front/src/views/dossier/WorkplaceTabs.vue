<template>
  <div class="quadro poppins">
    <b-card no-body>
      <b-tabs v-model="tabIndex" card lazy fixed="top">
        <b-tab
          :title="$t('feed')"
          :title-link-class="linkClass(0)"
          :title-item-class="$can('read', screens.feed) ? '' : 'd-none'"
          @click="setCurrentWorkplaceTabIndex(0)"
        >
          <template v-if="$can('read', screens.feed)" v-slot:title>
            {{ $t("feed") }}
          </template>
        </b-tab>

        <b-tab
          :title="$t('prontuariodocolaborador')"
          :title-link-class="linkClass(1)"
          :title-item-class="
            $can('read', screens.consultCollaborators) ? '' : 'd-none'
          "
          @click="gotoActiveBondsSearch"
        >
          <template
            v-if="$can('read', screens.consultCollaborators)"
            v-slot:title
          >
            {{ $t("prontuariodocolaborador") }}
          </template>

          <div v-if="$can('read', screens.consultCollaborators)">
            <CollaboratorDossierTabs v-if="personReportTabIndex !== null" />
            <RegistrationDataTabs
              v-else-if="registrationDataTabIndex !== null"
            />
            <active-bonds-search v-else />
          </div>
        </b-tab>

        <b-tab
          :title="$t('consultahierarquia')"
          :title-link-class="linkClass(2)"
          :title-item-class="
            $can('read', screens.consultHierarchies) ? '' : 'd-none'
          "
          @click="gotoActiveBondsSearchByHierarchy"
        >
          <template
            v-if="$can('read', screens.consultHierarchies)"
            v-slot:title
          >
            {{ $t("consultahierarquia") }}
          </template>

          <div v-if="$can('read', screens.consultHierarchies)">
            <active-bonds-search-by-hierarchy
              v-if="personReportTabIndex === null"
            />
            <CollaboratorDossierTabs v-else />
          </div>
        </b-tab>

        <b-tab
          v-if="
            $can('read', screens.files_inWorkplaceModule) ||
              $can('read', screens.grid_inWorkplaceModule) ||
              $can('read', screens.registerFiles_inWorkplaceModule)
          "
          :title="$t('baseconhecimento')"
          :title-link-class="linkClass(3)"
          :title-item-class="
            $can('read', screens.files_inWorkplaceModule) ||
            $can('read', screens.grid_inWorkplaceModule) ||
            $can('read', screens.registerFiles_inWorkplaceModule)
              ? ''
              : 'd-none'
          "
          @click="gotoKnowledgeBase"
        >
          <template v-slot:title>
            {{ $t("baseconhecimento") }}
          </template>

          <knowledge-base-tabs />
        </b-tab>

        <b-tab
          v-if="$can('read', screens.requests_inWorkplaceModule)"
          :title="$t('solicitacoes')"
          :title-link-class="linkClass(4)"
          :title-item-class="
            $can('read', screens.requests_inWorkplaceModule) ? '' : 'd-none'
          "
          @click="gotoRequests"
        >
          <template v-slot:title>
            {{ $t("solicitacoes") }}
          </template>
          <Requests />
        </b-tab>

        <b-tab
          :title="$t('planodereversao')"
          :title-link-class="linkClass(5)"
          :title-item-class="''"
          @click="gotorollbackplan"
        >
          <template v-slot:title>
            {{ $t("planodereversao") }}
          </template>
          <RollbackPlan />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import KnowledgeBaseTabs from './KnowledgeBaseTabs'
import ActiveBondsSearch from './ActiveBondsSearch'
import ActiveBondsSearchByHierarchy from './ActiveBondsSearchByHierarchy'
import CollaboratorDossierTabs from './CollaboratorDossierTabs'
import RegistrationDataTabs from './RegistrationDataTabs'
import Requests from './requests/'
import RollbackPlan from './rolback-plan'

export default {
  name: 'WorkplaceTabs',
  components: {
    KnowledgeBaseTabs,
    ActiveBondsSearch,
    CollaboratorDossierTabs,
    ActiveBondsSearchByHierarchy,
    Requests,
    RegistrationDataTabs,
    RollbackPlan
  },
  data() {
    return {
      tabIndex: 0
    }
  },
  computed: {
    ...mapState({
      screens: (state) => state.screens.screens,
      currentWorkplaceTabIndex: (state) =>
        state.currentWorkplaceTabIndex.currentWorkplaceTabIndex,
      currentKnowledgeBaseTabIndex: (state) =>
        state.currentKnowledgeBaseTabIndex.currentKnowledgeBaseTabIndex,
      personReportTabIndex: (state) => state.collaboratorDossierTabs.index,
      registrationDataTabIndex: (state) => state.registrationDataTabs.index
    })
  },
  created() {
    if (
      !this.$can('read', this.screens.feed) &&
      this.$can('read', this.screens.consultCollaborators)
    ) {
      this.tabIndex = 1
    } else if (
      !this.$can('read', this.screens.feed) &&
      !this.$can('read', this.screens.consultCollaborators) &&
      this.$can('read', this.screens.consultHierarchies)
    ) {
      this.tabIndex = 2
    } else if (
      !this.$can('read', this.screens.feed) &&
      !this.$can('read', this.screens.consultCollaborators) &&
      !this.$can('read', this.screens.consultHierarchies) &&
      (this.$can('read', this.screens.files_inWorkplaceModule) ||
        this.$can('read', this.screens.grid_inWorkplaceModule) ||
        this.$can('read', this.screens.registerFiles_inWorkplaceModule))
    ) {
      this.tabIndex = 3
    }
  },
  methods: {
    ...mapActions('currentWorkplaceTabIndex', [
      'setCurrentWorkplaceTabIndex',
      'clearCurrentWorkplaceTabIndex'
    ]),
    ...mapActions('currentKnowledgeBaseTabIndex', [
      'setCurrentKnowledgeBaseTabIndex',
      'clearCurrentKnowledgeBaseTabIndex'
    ]),
    ...mapActions('workplaceRequestsTabs', ['goToList']),

    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['bg-primary', 'text-light']
      } else {
        return ['bg-light', 'text-info2']
      }
    },

    gotoKnowledgeBase() {
      this.setCurrentKnowledgeBaseTabIndex(0)
      this.setCurrentWorkplaceTabIndex(3)
    },
    gotoActiveBondsSearch() {
      this.$store.dispatch('registrationDataTabs/gotoHome')
      this.$store.dispatch('collaboratorDossierTabs/gotoHome')
      this.setCurrentWorkplaceTabIndex(1)
    },
    gotoActiveBondsSearchByHierarchy() {
      this.$store.dispatch('collaboratorDossierTabs/gotoHome')
      this.setCurrentWorkplaceTabIndex(2)
    },
    gotoRequests() {
      this.setCurrentWorkplaceTabIndex(4)
      this.goToList()
    },
    gotorollbackplan() {
      this.setCurrentWorkplaceTabIndex(5)
    }
  }
}
</script>
