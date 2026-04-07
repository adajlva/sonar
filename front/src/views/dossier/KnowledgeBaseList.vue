<template>
  <div class="quadro">
    <DMAlert visible-class="mx-2 mb-3" />

    <b-modal
      ref="modalFiles"
      size="lg"
      :title="$t('baixar')"
      :hide-footer="true"
    >
      <div class="d-flex flex-row justify-content-center align-content-center flex-wrap" style="width: 100%">
        <b-card
          v-for="(file, index) in files"
          :key="index"
          class="mx-2 px-2 mb-2 d-flex flex-row flex-justify-around flex-wrap"
        >
          <span>{{ file.originalName }}</span>
          <b-button
            v-b-tooltip.hover.bottom
            size="sm"
            variant="outline-primary"
            class="ml-2"
            :title="$t('baixar') + ' ' + $t('conteudomin')"
            @click="download(file.file, file.name)"
          >
            <b-icon icon="cloud-download-fill" variant="primary" />
          </b-button>
        </b-card>
      </div>
    </b-modal>

    <div class="quadro mt-1 mb-2 ml-3 mr-3">
      <div class="search-with-export">
        <b-button
          v-if="$can('manage', screens.registerFiles_inWorkplaceModule)"
          id="goto-file-register"
          class="btn save btn-primary mr-3 mb-2"
          style="min-width: 21%"
          variant="primary"
          @click="gotoForm"
        >{{ $t("novo") + " " + $t("conteudomin") }}
        </b-button>

        <b-input-group class="mb-2">
          <b-input-group-append>
            <b-button disabled variant="secondary">
              <b-icon icon="search" variant="ligth" />
            </b-button>
          </b-input-group-append>
          <b-form-input
            id="search-text"
            v-model="keyword"
            :placeholder="$t('placeholderbuscaconteudo')"
            type="text"
            @input="debounceSearch"
            @keyup.enter="filterByKeyword"
          />
          <b-input-group-append class="btn-clear-search">
            <b-button variant="secondary" @click="clearSearch">
              {{ $t("limparpesquisa") }}
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label-for="file-ecosystems">
            <template v-slot:label>
              <DMLabel label="ecossistemas" />
            </template>
            <multiselect
              id="file-ecosystems"
              v-model="ecosystems"
              :options="userEcosystems || []"
              label="name"
              track-by="_id"
              :multiple="true"
              :allow-empty="true"
              :close-on-select="true"
              :clear-on-select="false"
              :preselect-first="false"
              :preserve-search="true"
              :placeholder="$t('cliqueparaselecionar') + ' ' + $t('um') + ' ' + $t('ecossistemasmin')"
            />
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="file-grid">
            <template v-slot:label>
              <DMLabel label="vinculadograde" />
            </template>
            <Treeselect
              id="file-grid"
              v-model="grid"
              required
              :multiple="false"
              :options="grids"
              :placeholder="$t('cliqueparaselecionar') + ' ' + $t('a') + ' ' + $t('grademin')"
              :normalizer="normalizerGrid"
              :clearable="true"
              :searchable="true"
              :sort-value-by="'LEVEL'"
            />
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="data-inicio">
            <template v-slot:label> {{ $t("datainicio") }}: </template>
            <b-form-input id="data-inicio" v-model="startDate" type="date" max="2099-12-31" />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label-for="data-termino">
            <template v-slot:label> {{ $t("datatermino") }}: </template>
            <b-form-input id="data-termino" v-model="endDate" type="date" max="2099-12-31" />
          </b-form-group>
        </b-col>

        <b-col xs="12">
          <span class="d-inline-block">
            <b-button class="save mb-3 mt-2" variant="primary" @click="fetchFiles">{{ $t("filtrar") }}</b-button>
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
      <template v-slot:action="{ row }">
        <b-button
          v-if="row.item.files && row.item.files.length > 0"
          v-b-tooltip.hover.bottom
          size="sm"
          class="mr-1 mb-1"
          variant="outline-primary"
          :title="$t('ver') + ' ' + $t('conteudosmin')"
          @click="filesView(row.item.files)"
        >
          <b-icon icon="images" variant="primary" />
        </b-button>
      </template>

      <template v-slot:cell(links)="{ value }">
        <span v-for="({ name, link, type }, index) in value" :key="index">
          <b-link :href="link" target="_blank" class="link-external">{{ name || $t("linkdo" + type) }}</b-link><span v-if="index < value.length - 1">, </span>
        </span>
      </template>
    </DMPaginatedTable>
  </div>
</template>

<script>
import * as _ from 'lodash'
import { mapState, mapGetters, mapActions } from 'vuex'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { hideLoader, showLoader } from '@/utils/loading'
import { knowledgeBaseGridService } from '@/services/knowledge-base-grid-service'
import { knowledgeBaseFileService } from '@/services/knowledge-base-file-service'
import DMAlert from '@/components/DMAlert'
import DMLabel from '@/components/DMLabel'
import DMPaginatedTable from '@/components/DMPaginatedTable'
import { getDate } from '@/services/utils-service'

const INITIAL_PAGE = 1

export default {
  name: 'KnowledgeBaseList',
  components: { Treeselect, DMAlert, DMLabel, DMPaginatedTable },
  data() {
    return {
      totalRows: 1,
      limitTable: 20,
      limitService: 20,
      page: INITIAL_PAGE,
      keyword: null,
      ecosystems: null,
      grid: null,
      grids: [],
      startDate: null,
      endDate: null,
      docs: [],
      files: []
    }
  },
  computed: {
    ...mapGetters(['userProfile', 'userClient', 'userEcosystems']),
    ...mapState({ screens: (state) => state.screens.screens }),

    fields() {
      return [
        { key: 'name', label: this.$t('conteudo'), class: 'text-center' },
        {
          key: 'grid',
          label: this.$t('grade'),
          class: 'text-center',
          formatter: (grid) => (grid ? grid.hierarchy || grid.name : ' - ')
        },
        { key: 'createdAt', label: this.$t('datacadastro'), class: 'text-center', formatter: getDate },
        { key: 'author', label: this.$t('cadastradopor'), class: 'text-center', formatter: (author) => (author ? author.name : '') },
        { key: 'links', label: this.$t('links'), class: 'text-center' },
        { key: 'actions', label: this.$t('acoes'), class: 'text-center' }
      ]
    }
  },
  async created() {
    await Promise.all([this.fetchGrids(), this.$store.dispatch('user/updateEcosystems'), this.clearSearch()])
  },
  methods: {
    async fetchGrids() {
      try {
        const { data } = await knowledgeBaseGridService.getTreeByEcosystems(this.userClient)
        this.grids = data
      } catch (e) { console.log(e) }
    },
    normalizerGrid(grid) {
      return { id: grid._id, label: grid.name, children: grid.children }
    },
    ...mapActions('currentKnowledgeBaseTabIndex', ['setCurrentKnowledgeBaseTabIndex', 'clearCurrentKnowledgeBaseTabIndex']),
    gotoForm() {
      this.setCurrentKnowledgeBaseTabIndex(2)
    },
    async fetchFiles() {
      const mountLinks = (doc) => {
        doc.links = ['form', 'website', 'video']
          .map((type) => ({ type, name: doc[type + 'Name'], link: doc[type + 'Link'] }))
          .filter((link) => !_.isNil(link.link))
      }
      showLoader()
      try {
        const { data } = await knowledgeBaseFileService.getFiles(
          this.userClient, this.limitService, this.page, this.keyword,
          this.ecosystems && this.ecosystems.map((e) => e._id), this.grid, this.startDate, this.endDate
        )
        data.docs.forEach(mountLinks)
        this.totalRows = data.totalDocs
        this.docs = data.docs
      } finally {
        hideLoader()
      }
    },
    paginate(params = {}) {
      this.page = params.page || this.page
      this.fetchFiles()
    },
    filterByKeyword() {
      this.page = INITIAL_PAGE
      this.fetchFiles()
    },
    clearSearch() {
      this.keyword = null
      this.filterByKeyword()
    },
    debounceSearch() {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.filterByKeyword, 1000)
    },
    filesView(files) {
      this.files = files
      this.$refs['modalFiles'].show()
    },
    download(url, filename) {
      fetch(url).then(function(t) {
        return t.blob().then((b) => {
          const a = document.createElement('a')
          a.href = URL.createObjectURL(b)
          a.setAttribute('download', filename)
          a.click()
        })
      })
    }
  }
}
</script>

<style scoped>
.link-external { color: #00a9e0; cursor: pointer; }
</style>
