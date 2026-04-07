export const MovementHistoryStatusMixin = {
  computed: {
    movementHistoryStatusLabels() {
      return [
        { value: 'active', text: this.$t ? this.$t('statusativo') : 'Ativo', variant: 'success' },
        { value: 'away', text: this.$t ? this.$t('statusafastado') : 'Afastado', variant: 'warning' },
        { value: 'absent', text: this.$t ? this.$t('statusausente') : 'Ausente', variant: 'warning' },
        { value: 'vacation', text: this.$t ? this.$t('statusferias') : 'Férias', variant: 'warning' },
        { value: 'dismissed', text: this.$t ? this.$t('statusdemitido') : 'Demitido', variant: 'danger' }
      ]
    }
  }
}
