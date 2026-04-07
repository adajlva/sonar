<template>
  <div class="quadro">
    <!-- Dados do colaborador -->
    <div v-if="personBond" class="quadro">
      <h6 class="mb-3">
        <b>{{ $t('dadosdocolaborador') }}</b>
      </h6>
      <b-col md="12" sm="12">
        <b-row class="analisys-header">
          <div class="label-icon mb-2 mr-2">{{ $t('nome') }}:</div>
          <div class="label mb-2">{{ personBond.name }}</div>

          <div class="label-icon mb-2 mr-2 ml-4">{{ $t('documento') }}:</div>
          <div class="label mb-2">{{ personBond.document }}</div>

          <template v-if="personBond.leadership">
            <div class="label-icon mb-2 mr-2 ml-4">{{ $t('lideranca') }}:</div>
            <div class="label mb-2">{{ personBond.leadership }}</div>
          </template>
        </b-row>
        <b-row class="analisys-header">
          <div class="label-icon mb-2 mr-2">{{ $t('situacaoatualcolaborador') }}:</div>
          <div class="label mb-2">
            <b-badge variant="success">{{ $t('statusativo') }}</b-badge>
          </div>
        </b-row>
      </b-col>
    </div>

    <!-- Filtros -->
    <div class="person-fields mx-2 mt-4">
      <b-col md="6" sm="12">
        <b-form-group label-for="filter-origem">
          <template v-slot:label>{{ $t('origem') }}:</template>
          <b-form-select id="filter-origem" v-model="filter.origem">
            <b-form-select-option :value="null">{{ $t('selecione') }}</b-form-select-option>
            <b-form-select-option
              v-for="o in origemOptions"
              :key="o.value"
              :value="o.value"
            >{{ o.text }}</b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col md="6" sm="12">
        <b-form-group label-for="filter-status">
          <template v-slot:label>{{ $t('statusdotreinamento') }}:</template>
          <b-form-select id="filter-status" v-model="filter.status">
            <b-form-select-option :value="null">{{ $t('selecione') }}</b-form-select-option>
            <b-form-select-option
              v-for="s in statusOptions"
              :key="s.value"
              :value="s.value"
            >{{ s.text }}</b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col md="6" sm="12">
        <b-form-group label-for="filter-treinamento">
          <template v-slot:label>{{ $t('nomedotreinamento') }}:</template>
          <b-form-select id="filter-treinamento" v-model="filter.treinamento">
            <b-form-select-option :value="null">{{ $t('selecione') }}</b-form-select-option>
            <b-form-select-option
              v-for="t in treinamentoOptions"
              :key="t.value"
              :value="t.value"
            >{{ t.text }}</b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col md="6" sm="12">
        <b-form-group label-for="filter-periodo">
          <template v-slot:label>{{ $t('periodo') }}:</template>
          <b-form-select id="filter-periodo" v-model="filter.periodo">
            <b-form-select-option :value="null">{{ $t('selecione') }}</b-form-select-option>
            <b-form-select-option
              v-for="p in periodoOptions"
              :key="p.value"
              :value="p.value"
            >{{ p.text }}</b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>

      <!-- Date range — visible only when "Data personalizada" is selected -->
      <template v-if="filter.periodo === 'custom'">
        <b-col md="6" sm="12">
          <b-form-group label-for="filter-startDate">
            <template v-slot:label>{{ $t('de') }}:</template>
            <b-form-input
              id="filter-startDate"
              v-model="filter.startDate"
              type="date"
              max="2099-12-31"
              :placeholder="$t('informedataincial')"
              @blur="validateDateRange"
            />
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="filter-endDate">
            <template v-slot:label>{{ $t('ate') }}:</template>
            <b-form-input
              id="filter-endDate"
              v-model="filter.endDate"
              type="date"
              max="2099-12-31"
              :placeholder="$t('informedatafinal')"
              @blur="validateDateRange"
            />
          </b-form-group>
        </b-col>
      </template>

      <b-col md="12" sm="12" xs="12">
        <div class="d-flex flex-row justify-content-start align-items-end h-100" style="margin-top: 6px">
          <span class="d-inline-block mr-3 mb-4" tabindex="0">
            <b-button variant="outline-secondary" class="mr-2" @click="clearFilters">
              {{ $t('limparfiltros') }}
            </b-button>
          </span>
          <span class="d-inline-block mr-3 mb-4" tabindex="0">
            <b-button class="save" variant="primary" @click="applyFilters">
              {{ $t('filtrar') }}
            </b-button>
          </span>
        </div>
      </b-col>
    </div>

    <!-- Tabela + Export -->
    <div class="quadro" style="margin-top: 32px;">
      <div style="margin-bottom: 16px;">
        <DMExportExcel @getDataToExport="exportExcel" />
      </div>

      <b-table
        class="dm-paginated-table"
        :fields="fields"
        :items="filteredTrainings"
        responsive
        small
        striped
        show-empty
      >
        <template v-slot:cell(status)="{ value }">
          <BadgeTrainingStatus :status="value" />
        </template>

        <template v-slot:cell(progresso)="{ item }">
          <span :style="{ color: item.status === 'completed' && item.current < item.total ? '#dc3545' : 'inherit', fontWeight: item.status === 'completed' && item.current < item.total ? 'bold' : 'normal' }">
            {{ item.current }}/{{ item.total }}
          </span>
        </template>

        <template v-slot:cell(actions)="{ item }">
          <b-button
            v-b-tooltip.hover.bottom
            :title="$t('veragendamentos')"
            size="sm"
            variant="outline-primary"
            @click="openAgendamentos(item)"
          >
            <b-icon icon="eye" variant="primary" />
          </b-button>
        </template>
      </b-table>

      <AgendamentosModal ref="agendamentosModal" />

      <b-col class="my-1" md="12" sm="6">
        <b-pagination
          v-model="page"
          :per-page="limit"
          :total-rows="totalRows"
          align="center"
          class="my-0"
          size="sm"
        />
      </b-col>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BadgeTrainingStatus from './BadgeTrainingStatus.vue'
import DMExportExcel from '@/components/DMExport/Excel'
import AgendamentosModal from './AgendamentosModal.vue'

export default {
  name: 'Treinamentos',
  components: { BadgeTrainingStatus, DMExportExcel, AgendamentosModal },
  data() {
    return {
      page: 1,
      limit: 10,
      filter: { origem: null, status: null, treinamento: null, periodo: null, startDate: null, endDate: null },
      activeFilter: { origem: null, status: null, treinamento: null, periodo: null, startDate: null, endDate: null }
    }
  },
  computed: {
    ...mapState({
      person: (state) => state.collaboratorDossierTabs.person
    }),

    personBond() {
      if (!this.person) return null
      return {
        name: this.person.name,
        document: this.person.document,
        leadership: this.person._id === 'person-alexandre' ? 'Líder Y' : null
      }
    },

    origemOptions() {
      return [
        { value: 'ambev-sudeste', text: 'AMBEV GENTE TESTE' },
        { value: 'ambev-sul', text: 'AMBEV GENTE SUL' }
      ]
    },

    statusOptions() {
      return [
        { value: 'draft', text: this.$t('rascunho') },
        { value: 'pending', text: this.$t('pendente') },
        { value: 'scheduled', text: this.$t('agendado') },
        { value: 'in_progress', text: this.$t('emandamento') },
        { value: 'extended', text: this.$t('prorrogado') },
        { value: 'completed', text: this.$t('concluido') }
      ]
    },

    treinamentoOptions() {
      const names = [...new Set(this.allTrainings.map(t => t.name))]
      return names.map(n => ({ value: n, text: n }))
    },

    periodoOptions() {
      return [
        { value: '30d', text: this.$t('ultimos30dias') },
        { value: '60d', text: this.$t('ultimos60dias') },
        { value: '90d', text: this.$t('ultimos90dias') },
        { value: '1y', text: this.$t('ultimoano') },
        { value: 'custom', text: this.$t('datapersonalizada') }
      ]
    },

    allTrainings() {
      const personId = this.person && this.person._id
      const ALANNA = [
        { _id: 'tr-a1', name: 'Treinamento A', origem: 'AMBEV GENTE TESTE >\nUnidade Sudeste', status: 'scheduled', current: 0, total: 10, prazo: '2026-10-15', conclusao: null },
        { _id: 'tr-a2', name: 'Treinamento B', origem: 'AMBEV GENTE TESTE >\nUnidade Sudeste', status: 'in_progress', current: 9, total: 15, prazo: '2026-07-21', conclusao: null },
        { _id: 'tr-a3', name: 'Treinamento C', origem: 'AMBEV GENTE TESTE >\nUnidade Sul', status: 'completed', current: 3, total: 5, prazo: '2025-10-15', conclusao: '2025-11-07' },
        { _id: 'tr-a4', name: 'Treinamento D', origem: 'AMBEV GENTE TESTE >\nUnidade Sul', status: 'completed', current: 5, total: 5, prazo: '2025-05-10', conclusao: '2025-06-20' }
      ]
      const ALEXANDRE = [
        { _id: 'tr-x1', name: 'NR-11 Operação de Empilhadeiras', origem: 'AMBEV GENTE TESTE >\nUnidade Sul', status: 'completed', current: 6, total: 6, prazo: '2025-03-01', conclusao: '2025-02-20' },
        { _id: 'tr-x2', name: 'NR-35 Trabalho em Altura', origem: 'AMBEV GENTE TESTE >\nUnidade Sul', status: 'completed', current: 4, total: 4, prazo: '2025-04-01', conclusao: '2025-03-28' },
        { _id: 'tr-x3', name: 'Segurança da Informação', origem: 'AMBEV GENTE TESTE >\nUnidade Sudeste', status: 'in_progress', current: 3, total: 8, prazo: '2026-06-30', conclusao: null },
        { _id: 'tr-x4', name: 'LGPD Fundamentos', origem: 'AMBEV GENTE TESTE >\nUnidade Sudeste', status: 'scheduled', current: 0, total: 5, prazo: '2026-09-15', conclusao: null }
      ]
      if (personId === 'person-alexandre') return ALEXANDRE
      return ALANNA
    },

    filteredTrainings() {
      return this.allTrainings.filter(t => {
        if (this.activeFilter.status && t.status !== this.activeFilter.status) return false
        if (this.activeFilter.treinamento && t.name !== this.activeFilter.treinamento) return false
        return true
      })
    },

    totalRows() {
      return this.filteredTrainings.length
    },

    fields() {
      return [
        { key: 'name', label: this.$t('nomedotreinamento'), class: 'text-center' },
        { key: 'origem', label: this.$t('origem'), class: 'text-center' },
        { key: 'status', label: this.$t('statusdotreinamento'), class: 'text-center' },
        { key: 'progresso', label: this.$t('progresso'), class: 'text-center' },
        { key: 'prazo', label: this.$t('prazo'), class: 'text-center',
          formatter: v => v ? new Date(v).toLocaleDateString('pt-BR') : '-' },
        { key: 'conclusao', label: this.$t('conclusao'), class: 'text-center',
          formatter: v => v ? new Date(v).toLocaleDateString('pt-BR') : '-' },
        { key: 'actions', label: this.$t('acoes'), class: 'text-center' }
      ]
    }
  },
  methods: {
    clearFilters() {
      this.filter = { origem: null, status: null, treinamento: null, periodo: null, startDate: null, endDate: null }
      this.activeFilter = { origem: null, status: null, treinamento: null, periodo: null, startDate: null, endDate: null }
    },

    applyFilters() {
      this.activeFilter = { ...this.filter }
      this.page = 1
    },

    validateDateRange() {
      if (this.filter.startDate && this.filter.endDate) {
        if (new Date(this.filter.endDate) < new Date(this.filter.startDate)) {
          this.filter.endDate = null
        }
      }
    },

    exportExcel() {},

    openAgendamentos(training) {
      const schedules = this.getMockSchedules(training._id)
      this.$refs.agendamentosModal.show({ name: training.name, schedules })
    },

    getMockSchedules(trainingId) {
      const MOCK = {
        'tr-a3': [
          { _id: 's5', index: 5, status: 'done_manually', realizedAt: null, startDate: null, endDate: null },
          { _id: 's4', index: 4, status: 'done_manually', realizedAt: null, startDate: null, endDate: null },
          { _id: 's3', index: 3, status: 'done', realizedAt: '26/10/2025', startDate: '26/10/2025', endDate: '28/10/2025' },
          { _id: 's2', index: 2, status: 'done', realizedAt: '20/10/2025', startDate: '17/10/2025', endDate: '25/10/2025' },
          { _id: 's1', index: 1, status: 'done', realizedAt: '15/10/2025', startDate: '15/10/2025', endDate: '16/10/2025' }
        ]
      }
      return MOCK[trainingId] || [
        { _id: 'sg1', index: 1, status: 'scheduled', realizedAt: null, startDate: null, endDate: null }
      ]
    }
  }
}
</script>

<style scoped>
.analisys-header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
</style>
