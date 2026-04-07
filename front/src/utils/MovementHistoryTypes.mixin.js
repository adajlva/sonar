export const MovementHistoryTypesMixin = {
  computed: {
    movementHistoryTypes() {
      return {
        ADMISSION: 'admission',
        DISMISSAL: 'dismissal',
        TRANSFER: 'transfer',
        RISE: 'rise',
        BONDCHANGE: 'bondChange',
        ABSENCE: 'absence',
        VACATION: 'vacation',
        RETURN: 'return',
        STATUS_CHANGE: 'statusChange'
      }
    },
    movementHistoryTypeLabels() {
      return [
        { value: 'admission', text: this.$t ? this.$t('admissao') : 'Admissão' },
        { value: 'dismissal', text: 'Demissão' },
        { value: 'transfer', text: 'Transferência' },
        { value: 'rise', text: 'Promoção' },
        { value: 'bondChange', text: 'Mudança de vínculo' },
        { value: 'absence', text: 'Afastamento' },
        { value: 'vacation', text: 'Férias' },
        { value: 'return', text: 'Retorno' },
        { value: 'statusChange', text: 'Mudança de status' }
      ]
    }
  }
}
