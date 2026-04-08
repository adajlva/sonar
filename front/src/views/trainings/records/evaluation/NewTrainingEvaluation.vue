<template>
  <div class="p-3 poppins">
    <b-alert show variant="light" class="border mb-3">
      {{ $t('dadosmockadosavaliacoes') }}
    </b-alert>
    <b-table
      small
      striped
      hover
      responsive
      :items="tableItems"
      :fields="fields"
    >
      <template #cell(answered)="{ item }">
        {{ item.answered }}
      </template>
      <template #cell(actions)>
        <b-button size="sm" variant="outline-secondary" disabled>
          {{ $t('ver') }}
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'NewTrainingEvaluation',
  computed: {
    ...mapState('dmEvaluation', ['evaluations']),
    tableItems() {
      if (this.evaluations && this.evaluations.length) {
        return this.evaluations
      }
      return [
        {
          _id: 'eval-fallback-1',
          name: 'Avaliação de reação — mock',
          description: 'Dados estáticos quando a lista da store está vazia.',
          hasScore: true,
          maximumScore: 10,
          answered: 0
        }
      ]
    },
    fields() {
      return [
        { key: 'name', label: this.$t('nome') },
        { key: 'description', label: this.$t('descricao') },
        { key: 'answered', label: this.$t('respostas') },
        { key: 'actions', label: '', tdClass: 'text-right' }
      ]
    }
  },
  async created() {
    const module = this.$store.state.modules.modules['integracaotreinamento']
    await this.setModule({ module })
  },
  methods: {
    ...mapActions('dmEvaluation', ['setModule'])
  }
}
</script>
