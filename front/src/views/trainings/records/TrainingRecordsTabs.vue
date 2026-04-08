<template>
  <div class="quadro poppins">
    <b-card no-body>
      <b-tabs :value="currentTrainingRecordsTabIndex" fixed="top" card lazy>
        <b-tab
          :title="$t('treinamentos')"
          :title-link-class="linkClass(0)"
          @click="
            setCurrentTrainingRecordsTabIndex(0);
            goToTrainingList();
          "
        >
          <template v-slot:title>
            {{ $t("treinamentos") }}
          </template>

          <TrainingRecords />
        </b-tab>

        <b-tab
          :title="$t('gradetreinamentos')"
          :title-link-class="linkClass(1)"
          @click="setCurrentTrainingRecordsTabIndex(1)"
        >
          <template v-slot:title>
            {{ $t("grade") }}
          </template>

          <TrainingGridManager />
        </b-tab>

        <b-tab
          :title="$t('formularios')"
          :title-link-class="linkClass(2)"
          @click="
            setCurrentTrainingRecordsTabIndex(2);
            goToList();
          "
        >
          <template v-slot:title>
            {{ $t("formularios") }}
          </template>

          <NewTrainingForm />
        </b-tab>

        <b-tab
          :title="$t('avaliacoes')"
          :title-link-class="linkClass(3)"
          @click="
            setCurrentTrainingRecordsTabIndex(3);
            setViewToList();
          "
        >
          <template v-slot:title>
            {{ $t("avaliacoes") }}
          </template>

          <NewTrainingEvaluation />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import TrainingRecords from './training'
import TrainingGridManager from './grid/TrainingGridManager'
import NewTrainingForm from './form/NewTrainingForm.vue'
import NewTrainingEvaluation from './evaluation/NewTrainingEvaluation.vue'

export default {
  name: 'TrainingRecordsTabs',
  components: {
    TrainingRecords,
    TrainingGridManager,
    NewTrainingForm,
    NewTrainingEvaluation
  },
  computed: {
    ...mapState({
      currentTrainingRecordsTabIndex: (state) =>
        state.currentTrainingRecordsTabIndex.currentTrainingRecordsTabIndex
    })
  },
  methods: {
    ...mapActions('currentTraingRegisterTab', ['goToTrainingList']),

    ...mapActions('newTrainingFormTabs', ['goToList']),

    ...mapActions('dmEvaluation', ['setViewToList']),

    ...mapActions('currentTrainingRecordsTabIndex', [
      'setCurrentTrainingRecordsTabIndex',
      'clearCurrentTrainingRecordsTabIndex'
    ]),

    linkClass(idx) {
      if (this.currentTrainingRecordsTabIndex === idx) {
        return ['bg-primary', 'text-light']
      } else {
        return ['bg-light', 'text-info2']
      }
    }
  }
}
</script>
