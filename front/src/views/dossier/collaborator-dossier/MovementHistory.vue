<template>
  <div class="quadro">
    <DMAlert />

    <div v-if="personBond" class="quadro">
      <h6 class="mb-3">
        <b>{{ $t("dadosdocolaborador") }}</b>
      </h6>

      <b-col md="12" sm="12">
        <b-row class="analisys-header">
          <div class="label-icon mb-2 mr-2">{{ $t("nome") }}:</div>
          <div class="label mb-2">{{ personBond.person.name }}</div>

          <div class="label-icon mb-2 mr-2 ml-4">{{ $t("documento") }}:</div>
          <div class="label mb-2">{{ personBond.person.document }}</div>

          <template v-if="personBond.leadership">
            <div class="label-icon mb-2 mr-2 ml-4">{{ $t("lideranca") }}:</div>
            <div class="label mb-2">
              {{ personBond.leadership.person.name }}
            </div>
          </template>
        </b-row>
        <b-row class="analisys-header">
          <div class="label-icon mb-2 mr-2">
            {{ $t("situacaoatualcolaborador") }}:
          </div>
          <div class="label mb-2">
            <b-button class="mr-1 btn-status" size="sm" :variant="getVariantByCollabStatus(status)" disabled>
              {{
                personBondStatus.find((st) => st.value === status)
                  ? personBondStatus.find((st) => st.value === status).text
                  : "-"
              }}
            </b-button>
          </div>
        </b-row>
      </b-col>
    </div>

    <div class="person-fields mx-2 mt-4">
      <b-col md="12" sm="12">
        <DMExportExcel class="d-inline-block mr-3 mb-4" @getDataToExport="getWorksheet" />
      </b-col>

      <b-col v-if="unitsHierarchy && unitsHierarchy.length > 0" md="6" sm="12">
        <b-form-group label-for="estrutura">
          <template v-slot:label> {{ $t("estrutura") }}: </template>
          <Treeselect
            v-model="filter.unity"
            :multiple="false"
            :options="unitsHierarchy"
            :placeholder="'-- ' + $t('selecione') + ' ' + $t('a') + ' ' + $t('estruturamin') + ' --'"
            :normalizer="normalizer"
            :clearable="true"
            :searchable="true"
            :sort-value-by="'LEVEL'"
            :always-open="false"
          />
        </b-form-group>
      </b-col>

      <b-col v-if="positions && positions.length > 0" md="6" sm="12">
        <b-form-group label-for="admission-position">
          <template v-slot:label> {{ $t("cargo") }}: </template>
          <b-form-select id="filter-positions" v-model="filter.position">
            <template>
              <b-form-select-option v-if="positions.length === 0" :value="null" :preselect-first="true">
                {{ $t("cadastre") }} {{ $t("um") }} {{ $t("cargomin") }}
              </b-form-select-option>
              <b-form-select-option v-else :value="null">-- {{ $t("selecione") }} {{ $t("o") }} {{ $t("cargomin") }} --</b-form-select-option>
              <b-form-select-option v-for="(p, key) in positions" :key="key" :value="p._id">
                {{ p.name }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col v-if="bonds && bonds.length > 0" md="6" sm="12">
        <b-form-group label-for="filter-bond">
          <template v-slot:label>{{ $t("vinculo") }}:</template>
          <b-form-select id="filter-bond" v-model="filter.bond">
            <template>
              <b-form-select-option v-if="bonds.length === 0" :value="null" :preselect-first="true">
                {{ $t("cadastre") }} {{ $t("um") }} {{ $t("vinculomin") }}
              </b-form-select-option>
              <b-form-select-option v-else :value="null">-- {{ $t("selecione") }} {{ $t("o") }} {{ $t("vinculomin") }} --</b-form-select-option>
              <b-form-select-option v-for="(b, key) in bonds" :key="key" :value="b._id">
                {{ b.name }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col md="6" sm="12">
        <b-form-group label-for="filter-movementType">
          <template v-slot:label> {{ $t("tipodemovimentacao") }}: </template>
          <b-form-select id="filter-movementType" v-model="filter.movementType">
            <template>
              <b-form-select-option :value="null">-- {{ $t("selecioneotipodemovimentacao") }} --</b-form-select-option>
              <b-form-select-option
                v-for="movementType in movementHistoryTypeLabels"
                :key="movementType.value"
                :value="movementType.value"
              >
                {{ movementType.text }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col md="6" sm="12">
        <b-form-group label-for="filter-status">
          <template v-slot:label> {{ $t("status") }}: </template>
          <b-form-select id="filter-status" v-model="filter.status">
            <template>
              <b-form-select-option :value="null">-- {{ $t("selecione") }} {{ $t("o") }} {{ $t("statusmin") }} --</b-form-select-option>
              <b-form-select-option
                v-for="movementHistoryStatus in movementHistoryStatusLabels"
                :key="movementHistoryStatus.value"
                :value="movementHistoryStatus.value"
              >
                {{ movementHistoryStatus.text }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col md="3" sm="12">
        <b-form-group label-for="filter-startDate">
          <template v-slot:label> {{ $t("datainicial") }}: </template>
          <b-form-input
            id="filter-startDate"
            v-model="filter.startDate"
            type="date"
            max="2099-12-31"
            :placeholder="$t('informedataincial')"
            @blur="validateEndDate"
          />
        </b-form-group>
      </b-col>

      <b-col md="3" sm="12">
        <b-form-group label-for="filter-endDate">
          <template v-slot:label> {{ $t("datafinal") }}: </template>
          <b-form-input
            id="filter-endDate"
            v-model="filter.endDate"
            type="date"
            max="2099-12-31"
            :placeholder="$t('informedatafinal')"
            @blur="validateEndDate"
          />
        </b-form-group>
      </b-col>

      <b-col md="12" sm="12" xs="12">
        <div class="d-flex flex-row justify-content-start align-items-end h-100" style="margin-top: 6px">
          <span id="disabled-wrapper-admission-list" class="d-inline-block mr-3 mb-4" tabindex="0">
            <b-button class="save" variant="primary" @click="search">{{ $t("filtrar") }}</b-button>
          </span>
        </div>
      </b-col>
    </div>

    <div v-if="movementsNormalized && movementsNormalized.length > 0" class="quadro mt-3">
      <b-table
        id="table-movement-history"
        ref="table-movement-history"
        class="dm-paginated-table"
        :fields="fields"
        :items="movementsNormalized"
        :current-page="0"
        :per-page="0"
        :no-local-sorting="true"
        :responsive="true"
        small
        striped
        show-empty
        stacked="sm"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        @sort-changed="(sort) => fetchMovements(1, sort)"
        @filtered="search"
      >
        <template v-slot:cell(status)="row">
          <b-button class="mr-1 btn-status" size="sm" :variant="getVariantByStatus(row.item.status)" disabled>
            {{
              movementHistoryStatusLabels.find((status) => status.value === row.item.status)
                ? movementHistoryStatusLabels.find((status) => status.value === row.item.status).text
                : "-"
            }}
          </b-button>
        </template>
      </b-table>

      <b-col class="my-1" md="12" sm="6">
        <b-pagination
          v-model="page"
          :per-page="limit"
          :total-rows="totalRows"
          align="center"
          aria-controls="generalTable"
          class="my-0"
          size="sm"
          @input="fetchMovements"
        />
      </b-col>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import * as _ from 'lodash'
import moment from 'moment'
import { hideLoader, showLoader } from '@/utils/loading'
import DMAlert from '@/components/DMAlert'
import DMExportExcel from '@/components/DMExport/Excel'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { MovementHistoryTypesMixin } from '@/utils/MovementHistoryTypes.mixin'
import { MovementHistoryStatusMixin } from '@/utils/MovementHistoryStatus.mixin'
import { downloadData, getDate } from '@/services/utils-service'
import { unityService } from '@/services/unity-service'
import { getBondsWithDeletedByClient } from '@/services/person-bond-service'
import { getPositionsWithDeletedByClient } from '@/services/position-service'
import { movementHistoryService } from '@/services/movement-history-service'
import {
  getStatusByPersonBond,
  movementHistoryGetByDocumentAndClientWithDeleted
} from '@/services/person-bond-service'

const SORT_BY_DEFAULT = 'startDate'
const SORT_DESC_DEFAULT = false

export default {
  name: 'MovementHistory',
  components: { DMAlert, Treeselect, DMExportExcel },
  mixins: [MovementHistoryTypesMixin, MovementHistoryStatusMixin],
  data() {
    return {
      sortBy: SORT_BY_DEFAULT,
      sortDesc: SORT_DESC_DEFAULT,
      movements: [],
      bonds: null,
      status: null,
      positions: null,
      personBond: null,
      unitsHierarchy: null,
      filter: {
        bond: null,
        unity: null,
        status: null,
        endDate: null,
        position: null,
        startDate: null,
        movementType: null
      },
      currentFilter: {
        bond: null,
        unity: null,
        status: null,
        endDate: null,
        position: null,
        startDate: null,
        movementType: null
      },
      normalizer(node) {
        return {
          id: node.referenceId,
          label: node.name,
          children: node.children || []
        }
      },
      page: 1,
      limit: 20,
      totalRows: 1
    }
  },
  computed: {
    ...mapState({
      person: (state) => state.collaboratorDossierTabs.person,
      tabIndex: (state) => state.collaboratorDossierTabs.index,
      userPersonId: (state) => state.collaboratorDossierTabs.userPersonId
    }),
    ...mapGetters(['userClient']),

    personBondStatus() {
      return [
        { text: this.$t('statusativo'), value: 'active', variant: 'success' },
        { text: this.$t('statusafastado'), value: 'away', variant: 'warning' },
        { text: this.$t('statusausente'), value: 'absent', variant: 'warning' },
        { text: this.$t('statusferias'), value: 'vacation', variant: 'warning' },
        { text: this.$t('statusdemitido'), value: 'dismissed', variant: 'danger' }
      ]
    },

    fields() {
      const formatDateWithTime = (date) => {
        if (!date) return ' - '
        return moment(date).utc(true).format(this.$t('templatededatacomhorario')).toString()
      }

      return [
        { key: 'currentUnity.superiorHierarchy', label: this.$t('estrutura'), sortable: false, class: 'text-center', formatter: (value) => value || ' - ' },
        { key: 'startDate', label: this.$t('datamovimentacao'), sortable: true, class: 'text-center', formatter: getDate },
        { key: 'movementType', label: this.$t('tipodemovimentacao'), sortable: false, class: 'text-center',
          formatter: (value) => {
            const type = this.movementHistoryTypeLabels.find(t => t.value === value)
            return type ? type.text : ' - '
          }
        },
        { key: 'currentPosition.name', label: this.$t('cargo'), sortable: false, class: 'text-center', formatter: (value) => value || ' - ' },
        { key: 'currentBond.name', label: this.$t('vinculo'), sortable: false, class: 'text-center', formatter: (value) => value || ' - ' },
        { key: 'status', label: this.$t('status'), sortable: false, class: 'text-center' },
        { key: 'createDate', label: this.$t('datacadastro'), sortable: true, class: 'text-center', formatter: formatDateWithTime },
        { key: 'whoCreated.name', label: this.$t('cadastradopor'), sortable: true, class: 'text-center', formatter: (value) => value || ' - ' },
        { key: 'updateDate', label: this.$t('dataatualizacao'), sortable: false, class: 'text-center', formatter: formatDateWithTime },
        { key: 'whoUpdated.name', label: this.$t('atualizadopor'), sortable: false, class: 'text-center', formatter: (value) => value || ' - ' },
        { key: 'deleteDate', label: this.$t('dataexclusao'), sortable: false, class: 'text-center', formatter: formatDateWithTime },
        { key: 'whoDeleted.name', label: this.$t('excluidopor'), sortable: true, class: 'text-center', formatter: (value) => value || ' - ' }
      ]
    },

    movementsNormalized() {
      return this.movements.reduce((rows, movement) => {
        if (movement.endDate && movement.movementType === this.movementHistoryTypes.ABSENCE) {
          const startDate = moment(movement.startDate)
          const endDate = moment(movement.endDate)
          for (let m = moment(endDate); m.isSameOrAfter(startDate); m.subtract(1, 'days')) {
            const endMovement = { ..._.cloneDeep(movement), startDate: m.toISOString() }
            rows.push(endMovement)
          }
        } else if (movement.endDate || [
          this.movementHistoryTypes.RISE,
          this.movementHistoryTypes.TRANSFER,
          this.movementHistoryTypes.BONDCHANGE,
          this.movementHistoryTypes.VACATION
        ].includes(movement.movementType)) {
          const endMovement = {
            ..._.cloneDeep(movement),
            startDate: movement.endDate || movement.startDate,
            currentUnity: movement.newUnity || movement.currentUnity,
            currentPosition: movement.newPosition || movement.currentPosition,
            currentBond: movement.newBond || movement.currentBond
          }
          rows.push(endMovement)
          rows.push(movement)
        } else {
          rows.push(movement)
        }
        return rows
      }, [])
    }
  },
  watch: {
    tabIndex(value) {
      if (value === 3) this.clearFilter()
    }
  },
  async created() {
    this.movements = this.mockMovements()
    this.totalRows = this.movements.length
    this.personBond = {
      person: {
        name: (this.person && this.person.name) || 'Colaborador Exemplo',
        document: (this.person && this.person.document) || '-'
      },
      leadership: null
    }
    this.status = 'active'
    await Promise.all([
      this.fetchUnitsHierarchy(),
      this.fetchPositions(),
      this.fetchBonds()
    ])
  },
  methods: {
    getVariantByCollabStatus(status) {
      const found = this.personBondStatus.find((option) => option.value === status)
      return found ? found.variant : null
    },

    getVariantByStatus(status) {
      const found = this.movementHistoryStatusLabels.find((option) => option.value === status)
      return found ? found.variant : 'secondary'
    },

    async fetchMovements(page, sort) {
      showLoader()
      try {
        const filter = {}
        for (const prop in this.currentFilter) {
          let value = this.currentFilter[prop]
          if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            value = new Date(value).toISOString()
          }
          if (value && !_.isEmpty(value)) filter[prop] = value
        }

        if (sort) {
          this.sortBy = sort.sortBy
          this.sortDesc = sort.sortDesc
        }
        if (this.sortBy) {
          const mapSortingNames = { startDate: 'movementDate', 'whoCreated.name': 'whoCreated', 'whoDeleted.name': 'whoDeleted' }
          const sortingName = mapSortingNames[this.sortBy] || this.sortBy
          filter[sortingName] = this.sortDesc ? 'ascending' : 'descending'
        }

        if (page) this.page = page

        const { data } = await movementHistoryService.getByClientAndDocument(
          this.$store.getters.userClient,
          this.person.document,
          { ...filter, limit: this.limit, page: this.page }
        )

        this.movements = data.docs
        this.totalRows = data.totalDocs
      } catch (e) {
        console.log(e)
      } finally {
        hideLoader()
      }
    },

    search() {
      this.currentFilter = _.cloneDeep(this.filter)
      return this.fetchMovements(1, { sortBy: SORT_BY_DEFAULT, sortDesc: SORT_DESC_DEFAULT })
    },

    async fetchBonds() {
      try {
        const { data } = await getBondsWithDeletedByClient(this.$store.getters.userClient)
        this.bonds = data
      } catch {
        this.bonds = [
          { _id: 'bond-1', name: 'CLT' },
          { _id: 'bond-2', name: 'PJ' },
          { _id: 'bond-3', name: 'Temporário' }
        ]
      }
    },

    async fetchPositions() {
      try {
        const { data } = await getPositionsWithDeletedByClient(this.userClient, 'name')
        this.positions = data
      } catch {
        this.positions = [
          { _id: 'pos-1', name: 'Analista RH' },
          { _id: 'pos-2', name: 'Ajudante Distribuição' },
          { _id: 'pos-3', name: 'Coordenador RH' }
        ]
      }
    },

    async fetchUnitsHierarchy() {
      try {
        const { data } = await unityService.getFullTreeByClient(this.userClient, '_id referenceId name companies')
        this.unitsHierarchy = data
      } catch {
        this.unitsHierarchy = [
          { referenceId: 'unity-ref-1', name: 'AMBEV BRASIL', children: [
            { referenceId: 'unity-ref-2', name: 'AMBEV BRASIL - SP', children: [] }
          ] }
        ]
      }
    },

    async fetchPersonBond() {
      try {
        const { data } = await movementHistoryGetByDocumentAndClientWithDeleted(this.person.document, this.userClient)
        this.personBond = data
      } catch (e) { console.log(e) }
    },

    async fetchCollabStatus() {
      try {
        const { data } = await getStatusByPersonBond(this.person._id)
        this.status = data
      } catch (e) { console.log(e) }
    },

    validateEndDate() {
      const startDate = new Date(this.filter.startDate).getTime()
      const endDate = new Date(this.filter.endDate).getTime()
      if (endDate && endDate < startDate) {
        this.filter.endDate = null
      }
    },

    async getWorksheet() {
      showLoader()
      try {
        const { data } = await movementHistoryService.getWorksheetByClientAndDocument(
          this.$store.getters.userClient,
          this.person.document,
          this.$store.getters.locale
        )
        downloadData(data, this.personBond ? this.personBond.person.name.toUpperCase() + '.xlsx' : 'historico.xlsx')
      } catch (error) {
        Promise.reject(error)
      } finally {
        hideLoader()
      }
    },

    clearFilter() {
      this.sortBy = SORT_BY_DEFAULT
      this.sortDesc = SORT_DESC_DEFAULT
      this.filter = { bond: null, unity: null, status: null, endDate: null, position: null, startDate: null, movementType: null }
    },

    mockMovements() {
      const personId = this.person && this.person._id

      const ALANNA_MOVEMENTS = [
        {
          _id: 'mv-a1',
          currentUnity: { superiorHierarchy: 'AMBEV BRASIL' },
          startDate: '2024-09-03T00:00:00.000Z',
          endDate: null,
          movementType: 'admission',
          currentPosition: { name: 'Analista RH' },
          currentBond: { name: 'CLT' },
          status: 'approved',
          createDate: '2024-09-03T10:00:00.000Z',
          whoCreated: { name: 'Administrador' },
          updateDate: '2024-09-03T10:00:00.000Z',
          whoUpdated: { name: 'Administrador' },
          deleteDate: null,
          whoDeleted: null
        },
        {
          _id: 'mv-a2',
          currentUnity: { superiorHierarchy: 'AMBEV BRASIL' },
          newUnity: { superiorHierarchy: 'AMBEV BRASIL' },
          startDate: '2025-03-01T00:00:00.000Z',
          endDate: '2025-03-01T00:00:00.000Z',
          movementType: 'rise',
          currentPosition: { name: 'Analista RH' },
          newPosition: { name: 'Analista RH Pleno' },
          currentBond: { name: 'CLT' },
          newBond: { name: 'CLT' },
          status: 'approved',
          createDate: '2025-02-28T09:00:00.000Z',
          whoCreated: { name: 'Gestor Ferreira' },
          updateDate: '2025-03-01T08:00:00.000Z',
          whoUpdated: { name: 'Gestor Ferreira' },
          deleteDate: null,
          whoDeleted: null
        }
      ]

      const ALEXANDRE_MOVEMENTS = [
        {
          _id: 'mv-x1',
          currentUnity: { superiorHierarchy: 'AMBEV BRASIL' },
          startDate: '2025-01-15T00:00:00.000Z',
          endDate: null,
          movementType: 'admission',
          currentPosition: { name: 'Ajudante Distribuição' },
          currentBond: { name: 'CLT' },
          status: 'approved',
          createDate: '2025-01-15T08:00:00.000Z',
          whoCreated: { name: 'RH Central' },
          updateDate: '2025-01-15T08:00:00.000Z',
          whoUpdated: { name: 'RH Central' },
          deleteDate: null,
          whoDeleted: null
        },
        {
          _id: 'mv-x2',
          currentUnity: { superiorHierarchy: 'AMBEV BRASIL' },
          newUnity: { superiorHierarchy: 'AMBEV BRASIL - SP' },
          startDate: '2025-04-01T00:00:00.000Z',
          endDate: '2025-04-01T00:00:00.000Z',
          movementType: 'transfer',
          currentPosition: { name: 'Ajudante Distribuição' },
          newPosition: { name: 'Ajudante Distribuição' },
          currentBond: { name: 'CLT' },
          newBond: { name: 'CLT' },
          status: 'approved',
          createDate: '2025-03-28T10:00:00.000Z',
          whoCreated: { name: 'Administrador' },
          updateDate: '2025-04-01T07:00:00.000Z',
          whoUpdated: { name: 'Administrador' },
          deleteDate: null,
          whoDeleted: null
        }
      ]

      if (personId === 'person-alanna') return ALANNA_MOVEMENTS
      if (personId === 'person-alexandre') return ALEXANDRE_MOVEMENTS
      return ALANNA_MOVEMENTS
    }
  }
}
</script>

<style scoped>
.analisys-header {
  display: flex;
  flex-direction: row;
}
</style>
