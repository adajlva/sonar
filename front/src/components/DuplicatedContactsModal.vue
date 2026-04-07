<template>
  <b-modal
    :visible="visible"
    title="Contatos duplicados"
    ok-only
    @hide="$emit('close')"
  >
    <p>Existem contatos duplicados para o campo: <strong>{{ duplicatedField }}</strong></p>
    <b-button variant="primary" @click="$emit('saved')">Resolver duplicado</b-button>
  </b-modal>
</template>

<script>
export default {
  name: 'DuplicatedContactsModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    duplicatedField: {
      type: String,
      default: null
    },
    currentEmail: {
      type: String,
      default: null
    },
    currentPhone: {
      type: String,
      default: null
    },
    client: {
      type: String,
      default: null
    },
    excludePersonId: {
      type: String,
      default: null
    }
  }
}
</script>
