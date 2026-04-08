<template>
  <div class="training-form-flow-mock p-3 poppins">
    <b-alert show variant="light" class="border mb-3">
      {{ $t('dadosmockadosformularios') }}
    </b-alert>
    <b-table
      small
      striped
      hover
      responsive
      :items="mockForms"
      :fields="fields"
    >
      <template #cell(actions)>
        <b-button size="sm" variant="outline-secondary" disabled>
          {{ $t('ver') }}
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'TrainingFormFlowMock',
  props: {
    module: { type: [String, Object], default: null },
    answerPath: { type: String, default: '' },
    screen: { type: String, default: '' },
    storeManagerPath: { type: String, default: '' },
    multipleCopy: { type: Boolean, default: true },
    readOnly: { type: Boolean, default: false }
  },
  data() {
    return {
      mockForms: [
        {
          name: 'Checklist de presença — mock',
          description: 'Formulário de exemplo para cadastro de treinamentos.',
          integratesWithGEG: false
        },
        {
          name: 'Feedback pós-treinamento — mock',
          description: 'Coleta de percepção imediata após a sessão.',
          integratesWithGEG: false
        }
      ]
    }
  },
  computed: {
    fields() {
      return [
        { key: 'name', label: this.$t('nome') },
        { key: 'description', label: this.$t('descricao') },
        { key: 'actions', label: '', tdClass: 'text-right' }
      ]
    }
  }
}
</script>
