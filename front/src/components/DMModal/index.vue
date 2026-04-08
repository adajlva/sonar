<template>
  <b-modal
    :id="options.id"
    ref="modal"
    :title="options.title"
    :ok-only="okOnly"
    :cancel-title="$t('cancel')"
    @hide="hide"
    @ok="ok"
  >
    <pre>{{ options.content }}</pre>
    <slot name="custom-content" />
  </b-modal>
</template>

<script>
export default {
  name: 'DMModal',
  props: {
    okOnly: { type: Boolean, default: false }
  },
  data() {
    return {
      options: {
        id: '',
        title: '',
        content: ''
      }
    }
  },
  mounted() {
    this.$parent.$on('showModal', this.show)
    this.$parent.$on('hideModal', this.hide)
  },
  methods: {
    show(options = {}) {
      this.options = Object.assign(this.options, options)
      this.$refs.modal.show()
    },
    hide() {
      this.options = Object.assign({}, { id: '', title: '', content: '' })
      this.$refs.modal.hide()
    },
    ok() {
      this.$emit('ok', this.options)
      this.hide()
    }
  }
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  font-family: Poppins, sans-serif;
}

::v-deep .modal {
  font-family: Poppins, sans-serif;
}

::v-deep .modal-header {
  border-bottom: none;
}

::v-deep .modal-title {
  width: 100%;
  text-align: center;
}

::v-deep .modal-body {
  width: 100%;
  justify-content: center;
}

::v-deep .modal-footer {
  border-top: none;
  justify-content: center;
}

::v-deep .modal-footer button {
  width: 10vw;
}
</style>
