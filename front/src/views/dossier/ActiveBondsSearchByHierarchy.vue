<template>
  <div class="quadro">
    <DMAlert ref="dmAlert" visible-class="mx-2 mb-3" />

    <SummaryReportsDownloader
      ref="summaryReportsDownloader"
      :last-search="lastSearch"
      :is-leadership="isLeadership"
      :path="isLeadership ? 'collaborators_by_leadership_summary_data_worksheet_report' : 'active_collaborator_summary_data_worksheet_report'"
      actives
    />
    <CompleteReportsDownloader
      ref="completeReportsDownloader"
      :last-search="lastSearch"
      :is-leadership="isLeadership"
      :path="isLeadership ? 'collaborators_by_leadership_complete_data_worksheet_report' : 'active_collaborator_complete_data_worksheet_report'"
      actives
    />

    <div v-if="isLeadership || userBondId" class="mx-3 d-flex flex-row justify-content-start aligm-items-center">
      <DMExportExcel label="exportardadosresumidos" @getDataToExport="exportSummary" />
      <DMExportExcel label="exportardadoscompletos" @getDataToExport="exportComplete" />
    </div>

    <div v-if="isLeadership" class="quadro mt-1 mb-2 ml-3 mr-3">
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
            <treeselect
              id="unity"
              v-model="unity"
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
          </b-form-group>
        </b-col>

        <b-col xs="12">
          <span class="d-inline-block">
            <b-button class="save mb-3 mt-2" variant="primary" @click="fetch">{{ $t("filtrar") }}</b-button>
          </span>
        </b-col>
      </b-row>
    </div>

    <DMPaginatedTable
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
  getBondsSearch
} from '@/services/person-bond-service'
import { getPersonById } from '@/services/person-service'
import SummaryReportsDownloader from './export-modals/SummaryReportsDownloader.vue'
import CompleteReportsDownloader from './export-modals/CompleteReportsDownloader.vue'

const INITIAL_PAGE = 1

export default {
  name: 'ActiveBondsSearchByHierarchy',
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
      totalRows: 1,
      limitTable: 20,
      page: INITIAL_PAGE,
      unity: null,
      unityOptions: [],
      units: [],
      person: null,
      lastSearch: [null, null, null, null],
      docs: [],
      userBondId: null,
      isLeadership: false
    }
  },
  computed: {
    ...mapGetters(['userProfile', 'userClient', 'userCpf', 'isMaster']),
    ...mapState({ screens: (state) => state.screens.screens }),

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
        {
          key: 'unity',
          label: this.$t('estrutura'),
          class: 'text-center',
          formatter: (value) => value ? unityService.getSuperiorHierarchyByUnity(value, this.units) : ' - '
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
      }
      await Promise.all([this.fetchUnits(), this.fetch()])
    } catch (e) {
      console.error(e)
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
      } catch (e) { console.log(e) }
    },

    async fetch() {
      showLoader()
      try {
        const query = [this.person, this.unity, this.userBondId]
        const { data } = await getBondsSearch(this.userClient, this.limitTable, this.page, ...query)
        this.totalRows = data.totalDocs
        this.docs = data.docs.map(doc => {
          const personbond = _.get(doc, 'subordinate._id', doc)
          personbond.person = _.get(doc, 'subordinate.person', doc.person)
          personbond.position = _.get(doc, 'subordinate.position', doc.position)
          return personbond
        })
        this.lastSearch = query
      } catch (e) {
        console.log(e)
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
        this.unity = null
        this.fetch()
      }
    },

    async gotoCollaboratorDossierTabs(item) {
      try {
        showLoader()
        const { data: person } = await getPersonById(_.get(item, 'person._id'))
        const { data: admission } = await getBondsByAdmissionIdWithDeleted(item.admissionId)
        this.$store.dispatch('collaboratorDossierTabs/setPerson', {
          ...person,
          dismissalDate: item.dismissalDate ? item.dismissalDate : null
        })
        this.$store.dispatch('collaboratorDossierTabs/setAdmission', admission)
      } catch (error) {
        console.error('[ERROR TO FIND PERSON OR ADMISSION]', error)
      } finally {
        hideLoader()
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
