<template>
  <div>
    <RollbackPlan
      v-if="selectedResignationRequestProcess"
      :resignation-request-process="selectedResignationRequestProcess"
      @clear="selectedResignationRequestProcess = null"
    />
    <RollbackPlanList v-else @select="selectResignationRequestProcess" />
  </div>
</template>

<script>
import RollbackPlan from './rollback-plan.vue'
import RollbackPlanList from './rollback-plan-list.vue'

export default {
  name: 'WorkplaceMyRollbackView',
  components: { RollbackPlan, RollbackPlanList },
  data() {
    return { selectedResignationRequestProcess: null }
  },
  methods: {
    selectResignationRequestProcess(data) {
      this.selectedResignationRequestProcess = data
    }
  }
}
</script>
