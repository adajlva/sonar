<template>
  <component
    :is="tab"
    :module="trainingModule"
    :answer-path="answerPath"
    :screen="screenId"

    :store-manager-path="storeManagerPath"
    :multiple-copy="true"

    :read-only="true"
  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NewTrainingForm',
  computed: {
    ...mapState({
      screens: state => state.screens.screens,

      tab: (state) => state.newTrainingFormTabs.tab
    }),

    trainingModule() {
      return this.$store.state.modules.modules['integracaotreinamento']
    },
    screenId() {
      return this.screens.training
    },
    answerPath() {
      return 'new-training-form-answer'
    },
    storeManagerPath() {
      return 'newTrainingFormTabs'
    }
  }
}
</script>
