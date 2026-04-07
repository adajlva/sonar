<template>
  <b-modal
    id="summary-report-modal"
    ref="summaryReportModal"
    size="xl"
    :title="$t('relatoriodedadosresumidos')"
    :ok-only="true"
    @ok="closeModal"
  >
    <DMAlert ref="dmAlert" />

    <b-row class="mb-2">
      <b-col md="12" sm="12">
        <b-button class="save px-5 py-2 my-1" variant="primary" :disabled="isBusy" @click="handleReport">
          {{ $t("gerarrelatorio") }}
        </b-button>
      </b-col>
    </b-row>

    <DMReportDownloadList
      :data="reports"
      :limit="reportLimit"
      :is-busy="isBusy"
      :total-rows="totalReports"
      @onChangePage="onChangePage"
    />
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { findBySource } from '@/services/report-service'
import DMAlert from '@/components/DMAlert'
import DMReportDownloadList from '@/components/DMReportDownloadList'
import {
  getBondsSearchWorksheetSummary,
  getActiveBondsSearchWorksheetSummary
} from '@/services/person-bond-service'
import { leadershipHierarchyService } from '@/services/leadership-hierarchy-service'

export default {
  name: 'SummaryReportsDownloader',
  components: { DMAlert, DMReportDownloadList },
  props: {
    path: { type: String, required: true },
    lastSearch: { type: Array, default: () => Array(4).fill(null), required: true },
    actives: { type: Boolean, default: false },
    isLeadership: { type: Boolean, default: false }
  },
  data() {
    return {
      isBusy: false,
      reports: [],
      totalReports: 0,
      reportLimit: 20,
      reportPage: 1
    }
  },
  computed: {
    ...mapGetters(['userClient']),
    ...mapState('user', ['userId'])
  },
  mounted() {
    this.$el.showModal = this.showModal
  },
  methods: {
    closeModal() { this.$refs.summaryReportModal.hide() },

    async showModal() {
      this.$refs.summaryReportModal.show()
      await this.loadReports()
    },

    async handleReport() {
      this.isBusy = true
      try {
        const service = this.getReportFunction()
        await service(this.userClient, this.$store.getters.locale, ...this.lastSearch)
        await this.loadReports()
      } catch (error) {
        this.$emit('alert', { type: 'danger', message: this.$t('erroaogerarrelatorio') })
      } finally {
        this.isBusy = false
      }
    },

    getReportFunction() {
      if (this.actives) {
        return this.isLeadership
          ? leadershipHierarchyService.getActiveBondsByLeadershipWorksheetSummary
          : getActiveBondsSearchWorksheetSummary
      }
      return getBondsSearchWorksheetSummary
    },

    async loadReports() {
      this.isBusy = true
      try {
        const { data } = await findBySource(this.path, null, this.userClient, this.reportLimit, this.reportPage)
        this.reports = data.docs
        this.totalReports = data.totalDocs
      } catch (error) {
        this.$emit('alert', { type: 'danger', message: this.$t('erroaogerarrelatorio') })
      } finally {
        this.isBusy = false
      }
    },

    async onChangePage(page) {
      this.reportPage = page
      await this.loadReports()
    }
  }
}
</script>
