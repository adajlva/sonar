<template>
  <b-icon
    :id="id"
    v-b-tooltip.hover.top
    title="Ver exemplo"
    icon="question-circle-fill"
    variant="dark"
    style="cursor: pointer"
    @click="showModal = true"
  />
</template>

<script>
export default {
  name: 'DMCNHTooltip',
  props: {
    id: {
      type: String,
      required: true
    },
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showModal: false
    }
  }
}
</script>
