<template>
  <div class="quadro">
    <b-card no-body>
      <b-tabs :value="tabIndex" :input="goto" card lazy fixed="top">
        <b-tab
          :title="$t('pessoais')"
          :title-link-class="linkClass(0)"
          @click="goto(0)"
        >
          <PersonalData />
        </b-tab>

        <b-tab
          :title="$t('funcionais')"
          :title-link-class="linkClass(1)"
          :disabled="hasDuplicates"
          @click="goto(1)"
        >
          <FunctionalData />
        </b-tab>

        <b-tab
          :title="$t('sociais')"
          :title-link-class="linkClass(2)"
          :disabled="hasDuplicates"
          @click="goto(2)"
        >
          <SocialData />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import PersonalData from './registration-data/PersonalData.vue'
import FunctionalData from './registration-data/FunctionalData.vue'
import SocialData from './registration-data/SocialData.vue'

export default {
  name: 'RegistrationDataTabs',
  components: {
    PersonalData,
    FunctionalData,
    SocialData
  },
  computed: {
    ...mapState({
      tabIndex: (state) => state.registrationDataTabs.index
    }),

    ...mapGetters('contactDuplicates', ['hasDuplicates'])
  },
  methods: {
    ...mapActions('registrationDataTabs', ['goto']),

    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['bg-primary', 'text-light']
      } else {
        return ['bg-light', 'text-info2']
      }
    }
  }
}
</script>
