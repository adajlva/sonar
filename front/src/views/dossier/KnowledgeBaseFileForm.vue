<template>
  <div>
    <DMAlert />
    <DMModal @ok="modalOk" />

    <b-modal ref="modalFiles" size="xl" :title="$t('baixar')" :hide-footer="true">
      <div class="d-flex flex-row justify-content-center align-content-center flex-wrap" style="width: 100%">
        <b-card v-for="(file, index) in filesDoc" :key="index" class="mx-2 px-2 mb-2">
          <span>{{ file.originalName }}</span>
          <b-button size="sm" variant="outline-primary" class="ml-2" @click="download(file.file, file.name)">
            <b-icon icon="cloud-download-fill" variant="primary" />
          </b-button>
        </b-card>
      </div>
    </b-modal>

    <b-modal ref="modalClients" size="xl" :title="$t('clientes')" :hide-footer="true">
      <b-card v-for="client in clients" :key="client.code" style="width: 100%" no-body class="mb-2">
        <b-card-header header-tag="header" role="tab">
          <b-button v-b-toggle:[`file-accordion-${client.code}`] block variant="primary" class="d-flex flex-row justify-content-between align-items-center">
            <span />
            <span>{{ client.name }}</span>
            <b-icon class="when-open" icon="chevron-contract" scale="1" variant="light" />
            <b-icon class="when-closed" icon="chevron-expand" scale="1" variant="light" />
          </b-button>
        </b-card-header>
        <b-collapse :id="'file-accordion-' + client.code" :visible="true">
          <b-card-body class="mx-3">
            <b-row>
              <b-col md="6" sm="12">
                <b-form-group :label-for="'file-unidades-' + client.code">
                  <template v-slot:label> {{ $t("estruturas") }}: </template>
                  <div class="d-flex justify-content-start align-items-center flex-wrap">
                    <b-button v-for="(unity, index) in client.units" :key="index" variant="primary" class="mx-2 mt-2">
                      {{ unity.name }}
                    </b-button>
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="6" sm="12">
                <b-form-group :label-for="'file-positions-' + client.code">
                  <template v-slot:label> {{ $t("cargos") }}: </template>
                  <div class="d-flex justify-content-start align-items-center flex-wrap">
                    <b-button v-for="(position, index) in client.positions" :key="index" variant="primary" class="mx-2 mt-2">
                      {{ position.name }}
                    </b-button>
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-modal>

    <b-row>
      <b-col md="12" sm="12">
        <div class="quadro">
          <div class="mb-2 campo-obrigatorio">
            (<span class="obrigatorio">*</span>) {{ $t("camposobrigatorios") }}
          </div>
          <b-form @submit.prevent>
            <b-row>
              <b-col md="6" sm="12">
                <b-form-group label-for="file-name">
                  <template v-slot:label><DMLabelRequired label="nome" /></template>
                  <b-form-input id="file-name" v-model="file.name" type="text" required :placeholder="$t('informenomeconteudo')" />
                </b-form-group>
              </b-col>

              <b-col md="6" sm="12">
                <b-form-group label-for="file-grid">
                  <template v-slot:label><DMLabelRequired label="vinculadograde" /></template>
                  <Treeselect
                    id="file-grid"
                    v-model="file.grid"
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
                <b-form-group label-for="file-filter-mode">
                  <template v-slot:label><DMLabelRequired label="comodisponibilizar" /></template>
                  <b-form-radio-group id="file-filter-mode" v-model="filterMode" :options="filterModes" required stacked @change="onSelectFilterMode" />
                </b-form-group>
              </b-col>

              <b-col v-if="byEcosystems" md="6" sm="12">
                <b-form-group label-for="file-ecosystems">
                  <template v-slot:label><DMLabelRequired label="ecossistemas" /></template>
                  <multiselect
                    id="file-ecosystems"
                    v-model="ecosystems"
                    :options="userEcosystems || []"
                    required
                    label="name"
                    track-by="_id"
                    :multiple="true"
                    :allow-empty="false"
                    :close-on-select="true"
                    :clear-on-select="false"
                    :preselect-first="false"
                    :preserve-search="true"
                    :placeholder="$t('cliqueparaselecionar') + ' ' + $t('umoumais') + ' ' + $t('ecossistemasmin')"
                  />
                </b-form-group>
              </b-col>

              <b-col md="6" sm="12">
                <b-form-group label-for="file-description">
                  <template v-slot:label><DMLabelRequired label="descricao" /></template>
                  <b-form-textarea id="file-description" v-model="file.description" type="textarea" required :placeholder="$t('informedescricaoconteudo')" />
                </b-form-group>
              </b-col>

              <b-col md="6" sm="12">
                <b-form-group label-for="file-keywords">
                  <template v-slot:label><DMLabel label="palavraschaveconteudo" /></template>
                  <b-input-group>
                    <b-form-input id="file-keywords" v-model="keyword" type="text" :placeholder="$t('informepalavrachave')" @keyup.enter="addKeyword" />
                    <b-input-group-append>
                      <b-button variant="primary" @click="addKeyword">
                        <b-icon icon="plus" variant="ligth" />
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
                <div v-if="file.keywords && file.keywords.length > 0" class="font-weight-bold">{{ $t("palavrasadicionadas") }}</div>
                <div class="palavras-chave">
                  <div v-for="(fileKeyword, index) in file.keywords" :key="index">
                    <div class="mr-3">
                      {{ fileKeyword }}
                      <b-icon v-b-tooltip.hover.bottom :title="$t('excluirpalavra')" class="clicable" icon="x-circle" variant="dark" @click="removeKeyword(index)" />
                    </div>
                  </div>
                </div>
              </b-col>

              <b-col md="6" sm="12">
                <b-form-group label-for="file-files">
                  <template v-slot:label> {{ $t("conteudos") }}: </template>
                  <b-form-file id="file-files" v-model="files" :multiple="true" enctype="multipart/form-data" :placeholder="$t('escolhaconteudos')" :drop-placeholder="$t('conteudo') + '...'" />
                </b-form-group>
              </b-col>

              <b-col md="6" sm="12">
                <b-form-group :label="$t('desejaadicionar')" label-for="file-resources">
                  <multiselect
                    id="file-resources"
                    v-model="externalResources"
                    :options="externalResourceOptions.map((res) => res.value)"
                    :custom-label="(opt) => externalResourceOptions.find((res) => res.value === opt).text"
                    :multiple="true"
                    :close-on-select="true"
                    :clear-on-select="false"
                    :preserve-search="true"
                    :preselect-first="false"
                    :placeholder="$t('selecioneparaadicionar')"
                    @remove="onRemoveExternalResource"
                  />
                </b-form-group>
              </b-col>

              <b-col v-if="showForm" md="6" sm="12">
                <b-form-group label-for="file-link-form">
                  <template v-slot:label><DMLabelRequired label="linkform" /></template>
                  <b-form-input id="file-link-form" v-model="file.formLink" type="text" required :state="isURL(file.formLink)" :placeholder="$t('informelinkform')" />
                </b-form-group>
              </b-col>
              <b-col v-if="showForm" md="6" sm="12">
                <b-form-group label-for="file-name-form">
                  <template v-slot:label><DMLabel label="nomeform" /></template>
                  <b-form-input id="file-name-form" type="text" :placeholder="$t('informenomeform')" @input="(vl) => stringNotEmpty(vl, 'formName')" />
                </b-form-group>
              </b-col>

              <b-col v-if="showDashboard" md="6" sm="12">
                <b-form-group label-for="file-link-dashboard">
                  <template v-slot:label><DMLabelRequired label="linkdash" /></template>
                  <b-form-input id="file-link-dashboard" v-model="file.websiteLink" type="text" required :state="isURL(file.websiteLink)" :placeholder="$t('informelinkdash')" />
                </b-form-group>
              </b-col>
              <b-col v-if="showDashboard" md="6" sm="12">
                <b-form-group label-for="file-name-dashboard">
                  <template v-slot:label><DMLabel label="nomedash" /></template>
                  <b-form-input id="file-name-dashboard" type="text" :placeholder="$t('informenomedash')" @input="(vl) => stringNotEmpty(vl, 'websiteName')" />
                </b-form-group>
              </b-col>

              <b-col v-if="showVideo" md="6" sm="12">
                <b-form-group label-for="file-link-video">
                  <template v-slot:label><DMLabelRequired label="videorelacionado" /></template>
                  <b-form-input id="file-link-video" v-model="file.videoLink" type="text" required :state="isURL(file.videoLink)" :placeholder="$t('informelinkvideo')" />
                </b-form-group>
              </b-col>
              <b-col v-if="showVideo" md="6" sm="12">
                <b-form-group label-for="file-name-video">
                  <template v-slot:label><DMLabel label="nomevideo" /></template>
                  <b-form-input id="file-name-video" type="text" :placeholder="$t('informenomevideo')" @input="(vl) => stringNotEmpty(vl, 'videoName')" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col xs="12">
                <span id="disabled-wrapper-file" class="d-inline-block" tabindex="0">
                  <b-button
                    v-if="$can('manage', screens.registerFiles_inWorkplaceModule)"
                    class="save"
                    variant="primary"
                    :disabled="$v.submitValidation.$invalid"
                    @click="submit"
                  >{{ $t("salvar") }}</b-button>
                </span>
                <b-tooltip v-if="$v.submitValidation.$invalid" target="disabled-wrapper-file">{{ $t("camposnaopreenchidos") }}</b-tooltip>
              </b-col>
            </b-row>
          </b-form>
        </div>
      </b-col>
    </b-row>

    <div class="quadro mt-1 mb-2 ml-3 mr-3">
      <div class="search-with-export">
        <b-input-group class="mb-2">
          <b-input-group-append>
            <b-button disabled variant="secondary"><b-icon icon="search" variant="ligth" /></b-button>
          </b-input-group-append>
          <b-form-input id="search-text" v-model="keywordSearch" :placeholder="$t('placeholderbuscaconteudo')" type="text" @input="debounceSearch" @keyup.enter="filterByKeyword" />
          <b-input-group-append class="btn-clear-search">
            <b-button variant="secondary" @click="clearSearch">{{ $t("limparpesquisa") }}</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
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
      :show-delete-buttom="$can('manage', screens.registerFiles_inWorkplaceModule)"
      @get="paginate"
      @remove="confirmRemove"
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
import { mapGetters, mapState } from 'vuex'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { hideLoader, showLoader } from '@/utils/loading'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import DMAlert from '@/components/DMAlert'
import DMLabelRequired from '@/components/DMLabelRequired'
import DMLabel from '@/components/DMLabel'
import DMModal from '@/components/DMModal'
import DMPaginatedTable from '@/components/DMPaginatedTable'
import { knowledgeBaseGridService } from '@/services/knowledge-base-grid-service'
import { knowledgeBaseFileService } from '@/services/knowledge-base-file-service'
import { upload } from '@/services/storage-service'
import * as _ from 'lodash'

const INITIAL_PAGE = 1
const RETICENCE = '...'
const ITENS_MIN = 5

export default {
  name: 'KnowledgeBaseFileForm',
  components: { Treeselect, DMAlert, DMLabelRequired, DMLabel, DMModal, DMPaginatedTable },
  data() {
    return {
      totalRows: 1,
      limitTable: 20,
      limitService: 20,
      page: INITIAL_PAGE,
      keywordSearch: null,
      docs: [],
      filesDoc: [],
      grids: [],
      keyword: null,
      filterMode: 'by_ecosystems',
      ecosystems: [],
      clients: [],
      files: null,
      externalResources: [],
      file: {
        name: null, description: null, grid: null, keywords: null,
        ecosystems: [], clients: [], units: [], positions: [], files: null,
        formName: null, formLink: null, websiteName: null, websiteLink: null, videoName: null, videoLink: null
      }
    }
  },
  validations() {
    const requiredIfByEcosystems = requiredIf(() => this.byEcosystems)
    const isURL = (link) => {
      if (!link) return true
      const pattern = new RegExp('^(https?:\\/\\/)?' + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + '((\\d{1,3}\\.){3}\\d{1,3}))' + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + '(\\?[;&a-z\\d%_.~+=-]*)?' + '(\\#[-a-z\\d_]*)?$', 'i')
      return pattern.test(link)
    }
    return {
      filterMode: { required },
      ecosystems: { requiredIfByEcosystems },
      files: { required: requiredIf(() => _.isEmpty(this.externalResources)) },
      externalResources: { required: requiredIf(() => _.isEmpty(this.files)) },
      file: {
        name: { required },
        description: { required },
        grid: { required },
        formLink: { requiredIfIncludeFormLink: requiredIf(() => this.showForm), isURL },
        websiteLink: { requiredIfIncludeWebsiteLink: requiredIf(() => this.showDashboard), isURL },
        videoLink: { requiredIfIncludeVideoLink: requiredIf(() => this.showVideo), isURL }
      },
      submitValidation: ['file', 'filterMode', 'ecosystems', 'files', 'externalResources']
    }
  },
  computed: {
    ...mapState({ screens: (state) => state.screens.screens }),
    ...mapGetters(['userProfile', 'userClient', 'userEcosystems']),
    filterModes() {
      return [
        { value: 'by_ecosystems', text: this.$t('ecossistemas') },
        { value: 'by_clients', text: this.$t('clientes') }
      ]
    },
    byEcosystems() { return this.filterMode === 'by_ecosystems' },
    byClients() { return this.filterMode === 'by_clients' },
    externalResourceOptions() {
      return [
        { text: this.$t('formularioexterno'), value: 'formexterno' },
        { text: this.$t('dashboardousite'), value: 'dashboard' },
        { text: this.$t('video'), value: 'video' }
      ]
    },
    showForm() { return this.externalResources.some((res) => res === 'formexterno') },
    showDashboard() { return this.externalResources.some((res) => res === 'dashboard') },
    showVideo() { return this.externalResources.some((res) => res === 'video') },
    fields() {
      return [
        { key: 'name', label: this.$t('conteudo'), class: 'text-center' },
        { key: 'ecosystems', label: this.$t('ecossistemas'), class: 'text-center', formatter: (val) => val ? val.map(e => e.name).join(', ') : ' - ' },
        { key: 'grid', label: this.$t('grade'), class: 'text-center', formatter: (grid) => grid ? grid.hierarchy || grid.name : ' - ' },
        { key: 'links', label: this.$t('links'), class: 'text-center' },
        { key: 'actions', label: this.$t('acoes'), class: 'text-center' }
      ]
    }
  },
  async created() {
    showLoader()
    await Promise.all([this.fetchGrids(), this.$store.dispatch('user/updateEcosystems'), this.clearSearch()])
    hideLoader()
  },
  methods: {
    isURL(link) {
      if (!link) return
      const pattern = new RegExp('^(https?:\\/\\/)?' + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + '((\\d{1,3}\\.){3}\\d{1,3}))' + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + '(\\?[;&a-z\\d%_.~+=-]*)?' + '(\\#[-a-z\\d_]*)?$', 'i')
      return !!pattern.test(link)
    },
    stringNotEmpty(value, attr) {
      this.file[attr] = _.isString(value) && _.trim(value).length > 0 ? _.trim(value) : null
    },
    onRemoveExternalResource(resource) {
      if (resource === 'formexterno') { this.file.formName = null; this.file.formLink = null }
      else if (resource === 'dashboard') { this.file.websiteName = null; this.file.websiteLink = null }
      else if (resource === 'video') { this.file.videoName = null; this.file.videoLink = null }
    },
    onSelectFilterMode() {
      this.ecosystems = []
      this.clients = []
    },
    normalizerGrid(grid) { return { id: grid._id, label: grid.name, children: grid.children } },
    addKeyword() {
      const keyword = _.trim(this.keyword)
      if (keyword) {
        if (!_.isArray(this.file.keywords)) { this.file.keywords = [] }
        this.file.keywords.push(keyword)
        this.file.keywords = _.uniq(this.file.keywords)
      }
      this.keyword = null
    },
    removeKeyword(index) { this.file.keywords.splice(index, 1) },
    async fetchGrids() {
      try {
        const { data } = await knowledgeBaseGridService.getTreeByClient(this.userClient)
        this.grids = data
      } catch (e) { console.log(e) }
    },
    async submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      showLoader()
      try {
        const file = _.cloneDeep(this.file)
        if (this.byEcosystems) {
          file.units = null; file.positions = null
          file.ecosystems = this.ecosystems.map((e) => e._id)
        } else {
          file.ecosystems = null
        }
        if (!_.isEmpty(this.files)) {
          const filePromises = this.files.map(async (f) => {
            const formData = new FormData()
            formData.append('file', f)
            const { data } = await upload(formData)
            return data._id
          })
          file.files = await Promise.all(filePromises)
        }
        // eslint-disable-next-line
        ;['form', 'website', 'video'].forEach((key) => {
          const attr = key + 'Link'
          let link = this.file[attr]
          if (!_.isNil(link) && !/^(http|https):\/\//.test(link)) { link = 'https://' + link }
          file[attr] = link
        })
        await knowledgeBaseFileService.save(file)
        await this.fetchFiles()
        this.clear()
        this.$emit('alert', { type: 'success', message: this.$t('conteudo') + ' ' + this.$t('cadastrado') })
      } catch (error) {
        const errorKey = _.get(error, 'response.data.error')
        let message = errorKey ? this.$t(errorKey) : this.$t('erro')
        this.$emit('alert', { message, type: 'danger' })
      } finally {
        hideLoader()
      }
    },
    clear() {
      this.file = {
        name: null, description: null, grid: null, keywords: null,
        ecosystems: [], clients: [], units: [], positions: [], files: null,
        formName: null, formLink: null, websiteName: null, websiteLink: null, videoName: null, videoLink: null
      }
    },
    async fetchFiles() {
      const mountLinks = (doc) => {
        doc.links = ['form', 'website', 'video']
          .map((type) => ({ type, name: doc[type + 'Name'], link: doc[type + 'Link'] }))
          .filter((link) => !_.isNil(link.link))
      }
      showLoader()
      try {
        const { data } = await knowledgeBaseFileService.getByKeyword(this.userClient, this.limitService, this.page, this.keywordSearch)
        data.docs.forEach(mountLinks)
        this.totalRows = data.totalDocs
        this.docs = data.docs
      } finally {
        hideLoader()
      }
    },
    paginate(params = {}) { this.page = params.page || this.page; this.fetchFiles() },
    filterByKeyword() { this.page = INITIAL_PAGE; this.fetchFiles() },
    clearSearch() { this.keywordSearch = null; this.filterByKeyword() },
    debounceSearch() { clearTimeout(this.timer); this.timer = setTimeout(this.filterByKeyword, 1000) },
    confirmRemove(id) { this.$emit('showModal', { id, title: this.$t('atencao'), content: this.$t('certezaexcluirconteudo') }) },
    async modalOk({ id }) { await this.removeDoc({ id }) },
    async removeDoc({ id }) {
      showLoader()
      try {
        await knowledgeBaseFileService.delete(id)
        if (this.page > 1 && this.docs.length < ITENS_MIN) { this.page = this.page - 1 }
        await this.fetchFiles()
        this.$emit('alert', { type: 'success', message: this.$t('conteudo') + ' ' + this.$t('excluido') })
      } catch (error) {
        this.$emit('alert', { type: 'danger', message: this.$t('erroaoexcluirregistro') })
      } finally {
        hideLoader()
      }
    },
    hasReticence(value) {
      if (value.length < RETICENCE.length) return false
      return value.slice(RETICENCE.length * -1) === RETICENCE
    },
    filesView(files) { this.filesDoc = files; this.$refs['modalFiles'].show() },
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
.collapsed > .when-open, .not-collapsed > .when-closed { display: none; }
.link-external { color: #00a9e0; cursor: pointer; }
</style>
