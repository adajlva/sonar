<template>
  <div>
    <b-alert
      v-if="alertData"
      :show="alertData.timer || true"
      :variant="alertData.type || 'info'"
      dismissible
      :class="visibleClass"
      @dismissed="dismiss"
    >
      {{ alertData.message }}
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'DMAlert',
  props: {
    visibleClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      alertData: null
    }
  },
  methods: {
    alert({ message, type, timer, keepAlert }) {
      this.alertData = { message, type, timer, keepAlert }
      if (timer && !keepAlert) {
        setTimeout(() => {
          this.alertData = null
        }, timer * 1000)
      }
    },
    dismiss() {
      this.alertData = null
    }
  }
}
</script>
