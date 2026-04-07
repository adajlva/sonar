<template>
  <h5>
    <b-badge
      :style="setStatusBtn(status)"
      class="badge-custom"
    >
      {{ getStatusName(status) }}
    </b-badge>
  </h5>
</template>

<script>
export default {
  name: 'BadgeTrainingStatus',
  props: {
    status: { type: String, default: '' }
  },
  computed: {
    statusOptions() {
      return [
        { text: this.$t('rascunho'), value: 'draft' },
        { text: this.$t('pendente'), value: 'pending' },
        { text: this.$t('agendado'), value: 'scheduled' },
        { text: this.$t('emandamento'), value: 'in_progress' },
        { text: this.$t('prorrogado'), value: 'extended' },
        { text: this.$t('concluido'), value: 'completed' }
      ]
    }
  },
  methods: {
    getStatusName(value) {
      const status = this.statusOptions.find(s => s.value === value)
      return status ? status.text : ''
    },

    setStatusBtn(value) {
      switch (value) {
        case 'completed':
          return 'background-color: #28A745'
        case 'in_progress':
          return 'background-color: #ffc107; color: black'
        case 'scheduled':
          return 'background-color: #0075ff; color: white'
        case 'pending':
        case 'extended':
        case 'draft':
          return 'background-color: red; color: white'
      }
    }
  }
}
</script>

<style>
.badge-custom {
  font-weight: normal;
  margin-right: 10px;
  margin-top: auto;
  margin-bottom: auto;
}

.badges {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 10px;
}
</style>
