<template>
  <component :is="currentTraingRegisterTab" class="quadro" />
</template>
<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    currentTraingRegisterTab: (state) =>
      state.currentTraingRegisterTab.currentTraingRegisterTab
  })
}
</script>
