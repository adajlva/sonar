<template>
  <div class="quadro">
    <DMAlert ref="dmAlert" visible-class="mx-2 mb-3" />

    <SummaryReportsDownloader ref="summaryReportsDownloader" :last-search="lastSearch" path="collaborator_summary_data_worksheet_report" />
    <CompleteReportsDownloader ref="completeReportsDownloader" :last-search="lastSearch" path="collaborator_complete_data_worksheet_report" />

    <div
      v-if="userBondId || isAdmin || canViewCollaboratorsInWorkplace"
      class="mx-3 d-flex flex-row justify-content-start aligm-items-center"
    >
      <DMExportExcel label="exportardadosresumidos" @getDataToExport="exportSummary" />
      <DMExportExcel label="exportardadoscompletos" @getDataToExport="exportComplete" />
    </div>

    <div v-if="isLeadership || isAdmin || canViewCollaboratorsInWorkplace" class="quadro mt-1 mb-2 ml-3 mr-3">
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label-for="file-grid">
            <template v-slot:label>
              <DMLabel label="colaborador" />
            </template>
            <AsyncPersonAutocomplete id="person-name" @onSelected="onSelectedPerson" />
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="unity">
            <template v-slot:label>
              <DMLabel label="estrutura" />
            </template>
            <template>
              <treeselect
                id="unity"
                v-model="filter.unity"
                :options="unityOptions"
                :normalizer="normalizer"
                label="name"
                track-by="id"
                :disabled="hasPerson"
                :multiple="false"
                :allow-empty="true"
                :close-on-select="true"
                :clear-on-select="false"
                :preselect-first="false"
                :preserve-search="true"
                :placeholder="$t('cliqueparaselecionar') + ' ' + $t('uma') + ' ' + $t('estruturamin')"
              />
            </template>
          </b-form-group>
        </b-col>

        <b-col md="12" sm="12">
          <span class="d-inline-block">
            <b-button class="save mb-3 mt-2" variant="primary" @click="fetch">{{
              $t("filtrar")
            }}</b-button>
          </span>
        </b-col>
      </b-row>
    </div>

    <DMPaginatedTable
      ref="dmPaginateTable"
      title-modal-list-b="cargos"
      title-modal-list-a="tiposcargos"
      :data="docs"
      :fields="fields"
      :page="page"
      :limit="limitTable"
      :total-rows="totalRows"
      :verify-admin-user="true"
      :show-update-buttom="false"
      :show-delete-buttom="false"
      @get="paginate"
    >
      <template v-slot:cell(personStatus)="{ value, item }">
        <b-badge v-if="value" :id="item._id" :variant="getStatusFormatter(value).variant" style="cursor: pointer">
          {{ getStatusFormatter(value).text }}
        </b-badge>
        <b-tooltip v-if="item.dismissalDate" :target="item._id">
          <strong>{{ $t("datademissao") }}:</strong>
          {{ item.dismissalDate ? getDate(item.dismissalDate) : null }}
        </b-tooltip>
      </template>

      <template v-slot:action="{ row }">
        <b-button
          v-if="$can('manage', screens.consultCollaborators)"
          v-b-tooltip.hover.bottom
          :title="$t('atualizardadoscadastrais')"
          size="sm"
          class="mr-1 mb-1"
          variant="outline-primary"
          @click="gotoRegistrationDataTabs(row.item)"
        >
          <b-icon icon="pencil" variant="primary" />
        </b-button>

        <b-button
          v-b-tooltip.hover.bottom
          :title="$t('dossiedocolaborador')"
          size="sm"
          class="mr-1 mb-1"
          variant="outline-primary"
          @click="gotoCollaboratorDossierTabs(row.item)"
        >
          <b-icon icon="file-person" variant="primary" />
        </b-button>
      </template>
    </DMPaginatedTable>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import * as _ from 'lodash'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import DMAlert from '@/components/DMAlert'
import DMLabel from '@/components/DMLabel'
import DMPaginatedTable from '@/components/DMPaginatedTable'
import AsyncPersonAutocomplete from '@/components/dmpeople/AsyncPersonAutocomplete'
import DMExportExcel from '@/components/DMExport/Excel'
import { hideLoader, showLoader } from '@/utils/loading'
import { getDate } from '@/services/utils-service'
import { unityService } from '@/services/unity-service'
import {
  getByDocumentAndClient,
  getBondsByAdmissionIdWithDeleted,
  getBondsSearch,
  getStatusByPersonBond
} from '@/services/person-bond-service'
import { getPersonById } from '@/services/person-service'
import SummaryReportsDownloader from './export-modals/SummaryReportsDownloader.vue'
import CompleteReportsDownloader from './export-modals/CompleteReportsDownloader.vue'

const INITIAL_PAGE = 1

export default {
  name: 'ActiveBondsSearch',
  components: {
    Treeselect,
    DMAlert,
    DMLabel,
    DMPaginatedTable,
    AsyncPersonAutocomplete,
    DMExportExcel,
    SummaryReportsDownloader,
    CompleteReportsDownloader
  },
  data() {
    return {
      totalRows: 2,
      limitTable: 20,
      limitService: 20,
      page: INITIAL_PAGE,
      filter: { unity: null },
      unityOptions: [],
      units: [],
      person: null,
      lastSearch: [null, null, null, null],
      docs: [
        {
          _id: 'mock-1',
          admissionId: 'adm-1',
          admissionDate: '2024-09-03T00:00:00.000Z',
          person: { _id: 'person-alanna', document: '14131847737', name: 'ALANNA STEFANI DOS SANTOS' },
          company: { _id: 'comp-1', tradeName: 'ALLIS LOGÍSTICA' },
          unity: 'AMBEV BRASIL',
          position: { _id: 'pos-1', name: 'Analista RH' },
          personStatus: 'active',
          dismissalDate: null
        },
        {
          _id: 'mock-2',
          admissionId: 'adm-2',
          admissionDate: '2025-01-15T00:00:00.000Z',
          person: { _id: 'person-alexandre', document: '132312123321', name: 'ALEXANDRE FATTORI JUNIOR' },
          company: { _id: 'comp-1', tradeName: 'ALLIS LOGÍSTICA' },
          unity: 'AMBEV BRASIL',
          position: { _id: 'pos-2', name: 'Ajudante Distribuição' },
          personStatus: 'active',
          dismissalDate: null
        }
      ],
      personSelected: null,
      userBondId: 'mock-user-bond-id',
      isLeadership: true
    }
  },
  computed: {
    ...mapGetters(['userProfile', 'userClient', 'locale', 'userCpf', 'canViewCollaboratorsInWorkplace', 'isMaster']),
    ...mapState({
      screens: (state) => state.screens.screens,
      userPersonId: (state) => state.collaboratorDossierTabs.userPersonId
    }),

    isAdmin() {
      return this.userProfile === 'admin_sistema' || this.isMaster
    },

    hasPerson() {
      return this.person !== null
    },

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
      const fillIfEmpty = (vl) => vl || ' - '
      return [
        { key: 'admissionDate', label: this.$t('dataadmissao'), class: 'text-center', formatter: getDate },
        { key: 'person.document', label: this.$t('documento'), class: 'text-center', formatter: fillIfEmpty },
        { key: 'person.name', label: this.$t('nome'), class: 'text-center', formatter: fillIfEmpty },
        { key: 'company.tradeName', label: this.$t('empresa'), class: 'text-center', formatter: fillIfEmpty },
        {
          key: 'unity',
          label: this.$t('estrutura'),
          class: 'text-center',
          formatter: (value) => {
            if (!value) return ' - '
            if (typeof value === 'string') return value
            return unityService.getSuperiorHierarchyByUnity(value, this.units)
          }
        },
        { key: 'position.name', label: this.$t('cargo'), class: 'text-center', formatter: fillIfEmpty },
        { key: 'personStatus', label: this.$t('status'), class: 'text-center' },
        { key: 'actions', label: this.$t('acoes'), class: 'text-center' }
      ]
    }
  },
  async created() {
    showLoader()
    try {
      const { data: userPersonbond } = await getByDocumentAndClient(this.userCpf, this.userClient)
      if (userPersonbond) {
        this.userBondId = userPersonbond._id
        this.isLeadership = userPersonbond.isLeadership
        this.$store.dispatch('collaboratorDossierTabs/setUserPersonId', userPersonbond.person)
      }
      await Promise.all([this.fetchUnits(), this.fecthAllUnitsHierarchy()])
    } catch (e) {
      // sem API — mantém dados mock
    } finally {
      hideLoader()
    }
  },
  methods: {
    normalizer(node) {
      return { id: node.referenceId, label: node.name, children: node.children }
    },

    async fetchUnits() {
      try {
        const { data } = await unityService.getTreeByHierarchy(this.userClient)
        this.unityOptions = data
      } catch (e) { console.log('fetchUnits error', e) }
    },

    async fecthAllUnitsHierarchy() {
      try {
        const { data } = await unityService.getByClient(this.userClient)
        this.units = data
      } catch (e) { console.log('fetchAllUnits error', e) }
    },

    async fetch() {
      showLoader()
      try {
        const query = [this.person, this.filter.unity, this.userBondId]
        const { data } = await getBondsSearch(this.userClient, this.limitService, this.page, ...query)
        if (data && data.docs && data.docs.length) {
          this.totalRows = data.totalDocs
          this.docs = data.docs.map(doc => {
            const personbond = _.get(doc, 'subordinate._id', doc)
            personbond.person = _.get(doc, 'subordinate.person', doc.person)
            personbond.position = _.get(doc, 'subordinate.position', doc.position)
            return personbond
          })
          this.lastSearch = query
        }
      } catch {
        // sem API — mantém dados mock
      } finally {
        hideLoader()
      }
    },

    paginate(params = {}) {
      this.page = params.page || this.page
      this.fetch()
    },

    onSelectedPerson(person) {
      this.person = person ? person._id : null
      if (person) {
        this.filter.unity = null
        this.fetch()
      }
    },

    async gotoRegistrationDataTabs(item) {
      this.personSelected = item
      showLoader()
      try {
        const { data: person } = await getPersonById(_.get(item, 'person._id'))
        const { data: admission } = await getBondsByAdmissionIdWithDeleted(item.admissionId)
        this.$store.dispatch('registrationDataTabs/setPerson', {
          ...person,
          dismissalDate: item.dismissalDate ? item.dismissalDate : null
        })
        this.$store.dispatch('registrationDataTabs/setAdmission', admission)
      } catch (error) {
        console.error('[ERROR TO FIND PERSON OR ADMISSION]', error)
      } finally {
        hideLoader()
      }
    },

    gotoCollaboratorDossierTabs(item) {
      this.personSelected = item
      const personId = _.get(item, 'person._id')
      const mockData = this.getMockDossierData(personId, item)
      this.$store.dispatch('collaboratorDossierTabs/setPerson', mockData.person)
      this.$store.dispatch('collaboratorDossierTabs/setAdmission', mockData.admission)
    },

    getMockDossierData(personId, item) {
      const MOCK_PERSONS = {
        'person-alanna': {
          person: {
            _id: 'person-alanna',
            document: '141.318.477-37',
            documentType: 'cpf',
            name: 'ALANNA STEFANI DOS SANTOS',
            pis: '120.34567.89-0',
            birthDate: '1995-03-20T00:00:00.000Z',
            phone: '+5511987651234',
            phoneCountry: 'BR',
            fatherName: 'Roberto Santos',
            motherName: 'Claudia Stefani dos Santos',
            email: 'alanna.santos@empresa.com.br',
            optin: true,
            photo: null,
            customFields: [{}, {}],
            dismissalDate: null,
            country: 'BRA',
            postalCode: '01310-100',
            street: 'Av. Paulista',
            number: '1578',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP'
          },
          admission: {
            _id: 'adm-1',
            admissionDate: '2024-09-03T00:00:00.000Z',
            company: 'comp-1',
            unity: 'unity-ref-1',
            position: 'pos-1',
            role: 'role-1',
            salary: 3800.00,
            workday: 'wd-1',
            bond: 'bond-1',
            reason: 'reason-1',
            isLeadership: false,
            customFields: [{}]
          }
        },
        'person-alexandre': {
          person: {
            _id: 'person-alexandre',
            document: '132.312.123-21',
            documentType: 'cpf',
            name: 'ALEXANDRE FATTORI JUNIOR',
            pis: '230.45678.90-1',
            birthDate: '1988-07-12T00:00:00.000Z',
            phone: '+5511987659876',
            phoneCountry: 'BR',
            fatherName: 'Alexandre Fattori',
            motherName: 'Sandra Regina Fattori',
            email: 'alexandre.fattori@empresa.com.br',
            optin: false,
            photo: null,
            customFields: [{}, {}],
            dismissalDate: null,
            country: 'BRA',
            postalCode: '04534-011',
            street: 'Rua Funchal',
            number: '418',
            neighborhood: 'Vila Olímpia',
            city: 'São Paulo',
            state: 'SP'
          },
          admission: {
            _id: 'adm-2',
            admissionDate: '2025-01-15T00:00:00.000Z',
            company: 'comp-1',
            unity: 'unity-ref-1',
            position: 'pos-2',
            role: 'role-2',
            salary: 5200.00,
            workday: 'wd-2',
            bond: 'bond-2',
            reason: 'reason-2',
            isLeadership: true,
            customFields: [{}]
          }
        }
      }
      if (MOCK_PERSONS[personId]) return MOCK_PERSONS[personId]
      return {
        person: {
          _id: personId || 'mock-person-id',
          document: _.get(item, 'person.document', '000.000.000-00'),
          documentType: 'cpf',
          name: _.get(item, 'person.name', 'Colaborador Exemplo'),
          pis: '000.00000.00-0',
          birthDate: '1990-01-01T00:00:00.000Z',
          phone: '+5511900000000',
          phoneCountry: 'BR',
          fatherName: '-',
          motherName: '-',
          email: 'colaborador@empresa.com.br',
          optin: false,
          photo: null,
          customFields: [{}, {}],
          dismissalDate: _.get(item, 'dismissalDate', null),
          country: 'BRA',
          postalCode: '00000-000',
          street: '-',
          number: '-',
          neighborhood: '-',
          city: '-',
          state: '-'
        },
        admission: {
          _id: _.get(item, 'admissionId', 'adm-gen'),
          admissionDate: _.get(item, 'admissionDate', new Date().toISOString()),
          company: 'comp-1',
          unity: 'unity-ref-1',
          position: 'pos-1',
          role: 'role-1',
          salary: 3500.00,
          workday: 'wd-1',
          bond: 'bond-1',
          reason: 'reason-1',
          isLeadership: false,
          customFields: [{}]
        }
      }
    },

    async exportSummary() {
      this.$refs.summaryReportsDownloader.showModal()
    },
    async exportComplete() {
      this.$refs.completeReportsDownloader.showModal()
    },

    getStatusFormatter(status) {
      return this.personBondStatus.find((option) => option.value === status) || {}
    },

    getDate(date) {
      if (!date) return '-'
      return moment.utc(date).format('DD/MM/YYYY').toString()
    }
  }
}
</script>

<style scoped>
.link-external {
  color: #00a9e0;
  cursor: pointer;
}
</style>
