<template>
  <b-modal
    id="dm-modal"
    ref="dmModal"
    :title="options.title || $t('atencao')"
    :ok-title="$t('sim')"
    :cancel-title="$t('nao')"
    @ok="$emit('ok', options)"
  >
    {{ options.content }}
  </b-modal>
</template>

<script>
export default {
  name: 'DMModal',
  data() {
    return {
      options: {}
    }
  },
  methods: {
    show(options = {}) {
      this.options = options
      this.$refs.dmModal.show()
    }
  }
}
</script>
