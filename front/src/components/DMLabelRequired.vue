<template>
  <span>
    <span v-if="twoPointsBefore">{{ $t(label) }}<span class="obrigatorio"> *</span>:</span>
    <span v-else>{{ $t(label) }}<span class="obrigatorio"> *</span></span>
  </span>
</template>

<script>
export default {
  name: 'DMLabelRequired',
  props: {
    label: {
      type: String,
      required: true
    },
    twoPointsBefore: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.obrigatorio { color: red; }
</style>
