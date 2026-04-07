<template>
  <component :is="currentWorkpleceRequestsTab" />
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'WorkplaceRequests',
  computed: mapState({
    currentWorkpleceRequestsTab: (state) =>
      state.workplaceRequestsTabs.currentWorkpleceRequestsTab
  })
}
</script>
