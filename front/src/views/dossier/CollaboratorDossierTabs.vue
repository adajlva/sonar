<template>
  <div class="quadro">
    <b-alert v-if="hasDuplicates" show variant="danger" class="duplicate-alert mb-3">{{ $t('duplicateContactAlert') }}
    </b-alert>

    <b-card no-body>
      <b-tabs :value="tabIndex" :input="goto" card lazy fixed="top">
        <b-tab :title="$t('pessoais')" :title-link-class="linkClass(0)" @click="goto(0)">
          <PersonalData :fields="fields" />
        </b-tab>

        <b-tab :title="$t('funcionais')" :title-link-class="linkClass(1)" :disabled="hasDuplicates" @click="goto(1)">
          <FunctionalData :fields="fields" />
        </b-tab>

        <b-tab :title="$t('sociais')" :title-link-class="linkClass(2)" :disabled="hasDuplicates" @click="goto(2)">
          <SocialData :fields="fields" />
        </b-tab>

        <b-tab :title="$t('historicomovimentacao')" :title-link-class="linkClass(3)" @click="goto(3)">
          <MovementHistory />
        </b-tab>

        <b-tab :title="$t('documentacao')" :title-link-class="linkClass(4)" @click="goto(4)">
          <Documentation />
        </b-tab>

        <b-tab :title="$t('treinamentos')" :title-link-class="linkClass(5)" @click="goto(5)">
          <Treinamentos />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import PersonalData from './collaborator-dossier/PersonalData.vue'
import FunctionalData from './collaborator-dossier/FunctionalData.vue'
import SocialData from './collaborator-dossier/SocialData.vue'
import MovementHistory from './collaborator-dossier/MovementHistory.vue'
import Documentation from './collaborator-dossier/Documentation.vue'
import Treinamentos from './collaborator-dossier/Treinamentos.vue'

import { fieldService } from '@/services/field-service'
import { hideLoader, showLoader } from '@/utils/loading'

export default {
  name: 'CollaboratorDossierTabs',
  components: {
    PersonalData,
    FunctionalData,
    SocialData,
    MovementHistory,
    Documentation,
    Treinamentos
  },
  data() {
    return {
      fields: []
    }
  },
  computed: {
    ...mapState({
      tabIndex: (state) => state.collaboratorDossierTabs.index,
      userPersonId: (state) => state.collaboratorDossierTabs.userPersonId,
      person: (state) => state.collaboratorDossierTabs.person
    }),

    ...mapGetters('contactDuplicates', ['hasDuplicates']),

    isUserData() {
      return this.userPersonId === this.person._id
    }
  },
  created() {
    showLoader()
    this.fetchFields()
    hideLoader()
  },
  methods: {
    ...mapActions('collaboratorDossierTabs', ['goto', 'clear']),

    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['bg-primary', 'text-light']
      } else {
        return ['bg-light', 'text-info2']
      }
    },

    async fetchFields() {
      try {
        const { data } = await fieldService.getByClient(
          this.$store.getters.userClient
        )

        this.fields = data.map((customField) => {
          customField.field.disabled = !this.isUserData
          customField.field.readonly = !this.isUserData
          return customField
        })
      } catch (e) {
        this.fields = []
      }
    }
  }
}
</script>
