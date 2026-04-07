<template>
  <div class="quadro">
    <div class="mb-3 d-flex flex-row justify-content-start align-items-center">
      <DMExportExcel label="exportarparaexcel" :disabled="true" />
    </div>

    <b-table
      class="dm-paginated-table"
      :fields="fields"
      :items="documents"
      responsive
      small
      striped
      show-empty
    >
      <template v-slot:cell(actions)="{ item }">
        <b-button
          v-b-tooltip.hover.bottom
          :title="$t('visualizar')"
          size="sm"
          class="mr-1 mb-1"
          variant="outline-primary"
          :href="item.url"
          target="_blank"
        >
          <b-icon icon="eye" variant="primary" />
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DMExportExcel from '@/components/DMExport/Excel'

export default {
  name: 'CollaboratorDocumentation',
  components: { DMExportExcel },
  data() {
    return {
      documents: [
        {
          _id: 'doc-1',
          name: 'CPF',
          description: 'Cadastro de Pessoa Física',
          type: 'Documento Pessoal',
          uploadDate: '2024-09-03T00:00:00.000Z',
          uploadedBy: 'Administrador',
          url: '#'
        },
        {
          _id: 'doc-2',
          name: 'RG',
          description: 'Registro Geral - 12.345.678-9',
          type: 'Documento Pessoal',
          uploadDate: '2024-09-03T00:00:00.000Z',
          uploadedBy: 'Administrador',
          url: '#'
        },
        {
          _id: 'doc-3',
          name: 'CTPS',
          description: 'Carteira de Trabalho e Previdência Social',
          type: 'Documento Trabalhista',
          uploadDate: '2024-09-03T00:00:00.000Z',
          uploadedBy: 'RH Central',
          url: '#'
        },
        {
          _id: 'doc-4',
          name: 'Comprovante de Residência',
          description: 'Conta de energia - Av. Paulista, 1578',
          type: 'Comprovante',
          uploadDate: '2024-09-10T00:00:00.000Z',
          uploadedBy: 'Administrador',
          url: '#'
        },
        {
          _id: 'doc-5',
          name: 'Contrato de Trabalho',
          description: 'Contrato CLT assinado',
          type: 'Documento Trabalhista',
          uploadDate: '2024-09-03T00:00:00.000Z',
          uploadedBy: 'RH Central',
          url: '#'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      person: (state) => state.collaboratorDossierTabs.person
    }),
    fields() {
      return [
        { key: 'name', label: this.$t('nome'), class: 'text-center' },
        { key: 'description', label: this.$t('descricao'), class: 'text-center' },
        { key: 'type', label: this.$t('tipo'), class: 'text-center' },
        { key: 'uploadDate', label: this.$t('datacadastro'), class: 'text-center',
          formatter: (v) => v ? new Date(v).toLocaleDateString('pt-BR') : '-' },
        { key: 'uploadedBy', label: this.$t('cadastradopor'), class: 'text-center' },
        { key: 'actions', label: this.$t('acoes'), class: 'text-center' }
      ]
    }
  }
}
</script>
