<template>
  <div v-if="showTwoPoints" class="dm-form-label dm-label-block">
    {{ $t(label) }}:
  </div>

  <div v-else class="dm-form-label dm-label-block">
    {{ $t(label) }}
  </div>
</template>

<script>
export default {
  name: 'DMLabel',
  props: {
    label: { type: String, default: '' },
    showTwoPoints: { type: Boolean, default: true }
  }
}
</script>

<style lang="scss" scoped>
.dm-label-block {
  margin: 8px 0 8px 0;
}
</style>
