/* eslint-disable no-eval */
<template>
  <div>
    <DMAlert />
    <DMModal @ok="modalOk" />

    <b-row>
      <b-col md="5" sm="12">
        <div class="quadro">
          <div v-if="showChildGrid" class="font-weight-bold text-center">
            {{ $t("cadastrogradesequencial") }}<span v-if="grid._parent"> ({{ grid._parent.name }})</span>
          </div>
          <div v-else class="font-weight-bold text-center">
            {{ $t("cadastrogradeinicial") }}
          </div>
          <div class="mb-2 campo-obrigatorio">
            (<span class="obrigatorio">*</span>) {{ $t("camposobrigatorios") }}
          </div>
          <b-form @submit.prevent>
            <b-row>
              <b-col md="12" sm="12">
                <b-form-group label-for="grid-name">
                  <template v-slot:label>
                    <DMLabelRequired label="nome" />
                  </template>
                  <b-form-input
                    id="grid-name"
                    v-model="grid.name"
                    type="text"
                    :placeholder="$t('informenomegrade')"
                  />
                </b-form-group>
              </b-col>

              <b-col md="12" sm="12">
                <b-form-group label-for="user-clients">
                  <template v-slot:label>
                    <DMLabelRequired label="ecossistemas" />
                  </template>
                  <multiselect
                    v-model="grid.ecosystems"
                    :options="userEcosystems || []"
                    required
                    label="name"
                    track-by="_id"
                    :multiple="true"
                    :allow-empty="false"
                    :close-on-select="true"
                    :preserve-search="true"
                    :clear-on-select="false"
                    :preselect-first="false"
                    :placeholder="$t('cliqueparaselecionar') + ' ' + $t('umoumais') + ' ' + $t('ecossistemasmin')"
                  />
                </b-form-group>
              </b-col>

              <b-col md="12" sm="12">
                <b-form-group label-for="grid-details">
                  <template v-slot:label>
                    <DMLabel label="detalhes" />
                  </template>
                  <b-form-textarea
                    id="grid-details"
                    v-model="grid.details"
                    type="textarea"
                    :placeholder="$t('informedetalhesgrade')"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col xs="12">
                <span id="disabled-wrapper-grid" class="d-inline-block" tabindex="0">
                  <b-button
                    v-if="$can('manage', screens.grid_inWorkplaceModule)"
                    class="save"
                    variant="primary"
                    :disabled="!isValidGrid"
                    @click="saveOrUpdateGrid"
                  >{{ $t("salvar") }}</b-button>
                </span>
                <b-tooltip v-if="!isValidGrid" target="disabled-wrapper-grid">{{ $t("camposnaopreenchidos") }}</b-tooltip>
                <b-button class="save" variant="secondary" @click="clear">{{ $t("cancel") }}</b-button>
              </b-col>
            </b-row>
          </b-form>
        </div>
      </b-col>

      <b-col md="7" sm="12">
        <div v-if="grids && grids.length > 0" class="quadro grupo-scroll-unidade">
          <div role="tablist">
            <b-row>
              <b-col v-for="(_grid, i) in grids" :key="i" md="12" sm="12">
                <div
                  :id="_grid._id"
                  :class="getGridColor(i)"
                  :style="{ 'margin-left': getMargin(_grid) + 'px !important' }"
                  @click="showOrHideChildrenGrids(_grid._id)"
                >
                  <div class="title-group">
                    <b-icon icon="chevron-contract" variant="dark" class="mr-2 mt-1" />
                    {{ _grid.name }}
                  </div>
                  <div class="btn-grid">
                    <b-button
                      v-if="$can('manage', screens.grid_inWorkplaceModule)"
                      v-b-tooltip.hover.bottom
                      :title="$t('adicionarestruturasequencial')"
                      size="sm"
                      class="ml-3 mr-1"
                      variant="outline-primary"
                      @click="addChildGrid(_grid)"
                    >
                      <b-icon icon="plus" scale="1.5" variant="primary" />
                    </b-button>
                    <b-button size="sm" class="mr-1" variant="outline-primary" @click="updateGrid(_grid)">
                      <b-icon icon="pencil" variant="primary" />
                    </b-button>
                    <b-button
                      v-if="(!_grid.createdByAdmin && $can('manage', screens.grid_inWorkplaceModule)) || userProfile === 'admin_sistema' || isMaster"
                      size="sm"
                      class="mr-1"
                      variant="outline-danger"
                      @click="remove(_grid._id)"
                    >
                      <b-icon icon="trash" variant="danger" />
                    </b-button>
                  </div>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { knowledgeBaseGridService } from '@/services/knowledge-base-grid-service'
import { hideLoader, showLoader } from '@/utils/loading'
import { mapGetters, mapState } from 'vuex'
import DMAlert from '@/components/DMAlert'
import DMModal from '@/components/DMModal'
import DMLabelRequired from '@/components/DMLabelRequired'
import DMLabel from '@/components/DMLabel'

export default {
  name: 'KnowledgeBaseGrid',
  components: { DMAlert, DMModal, DMLabelRequired, DMLabel },
  data() {
    return {
      grid: { ecosystems: null },
      grids: [],
      ecosystems: [],
      showChildGrid: false
    }
  },
  computed: {
    ...mapState({
      currentKnowledgeBaseTabIndex: (state) => state.currentKnowledgeBaseTabIndex.currentKnowledgeBaseTabIndex,
      screens: (state) => state.screens.screens
    }),
    ...mapGetters(['userProfile', 'userClient', 'userEcosystems', 'isMaster']),
    isValidGrid() {
      return this.grid.name && this.grid.ecosystems && this.grid.ecosystems.length > 0
    }
  },
  watch: {
    currentKnowledgeBaseTabIndex: function() {
      if (this.currentKnowledgeBaseTabIndex === 1) { this.fetchGrids() }
    }
  },
  async created() {
    showLoader()
    await Promise.all([this.fetchGrids(), this.$store.dispatch('user/updateEcosystems')])
    hideLoader()
  },
  methods: {
    getGridColor(i) {
      return i % 2 === 0 ? 'unit-groups branco' : 'unit-groups cinza'
    },
    getMargin(grid) {
      const level = grid.path.split('#')
      return (level.length - 1) * 20
    },
    updateGrid(item) {
      this.grid = Object.assign({}, item)
      this.grid.ecosystem = item.ecosystem ? item.ecosystem._id : null
      const path = item.path.split('#')
      if (path.length > 1) { this.showChildGrid = true }
      document.getElementById('grid-name').focus()
    },
    async fetchGrids() {
      try {
        showLoader()
        const { data } = await knowledgeBaseGridService.getByClient(this.userClient)
        this.grids = data
        this.grids.forEach((grid) => {
          if (document.getElementById(grid._id)) {
            document.getElementById(grid._id).style.display = 'flex'
          }
        })
      } finally {
        hideLoader()
      }
    },
    async remove(_id) {
      this.$emit('showModal', {
        id: _id,
        title: this.$t('atencao'),
        content: this.$t('certezaexcluirgrade')
      })
    },
    async clear() {
      this.grid = { ecosystem: null }
      this.showChildGrid = false
    },
    async modalOk(event) {
      try {
        showLoader()
        await knowledgeBaseGridService.delete(event.id)
        this.$emit('alert', { message: this.$t('grade') + ' ' + this.$t('excluida'), type: 'success' })
        await this.fetchGrids()
      } catch (error) {
        this.$emit('alert', { message: this.$t('erroaoexcluirregistro'), type: 'danger' })
      } finally {
        hideLoader()
      }
    },
    async saveOrUpdateGrid() {
      try {
        showLoader()
        this.grid.client = this.userClient
        let message = this.$t('grade') + ' ' + this.$t('cadastrada')
        if (this.grid._id) { message = this.$t('grade') + ' ' + this.$t('atualizada') }
        await knowledgeBaseGridService.save(this.grid)
        this.$emit('alert', { message: message, type: 'success' })
        await this.fetchGrids()
        this.clear()
      } finally {
        hideLoader()
        window.scrollTo(0, 0)
      }
    },
    addChildGrid(grid) {
      this.clear()
      this.grid.parent = grid._id
      this.grid._parent = grid
      this.showChildGrid = true
      document.getElementById('grid-name').focus()
    },
    showOrHideChildrenGrids(id) {
      const children = this.grids.filter((grid) => grid.path.includes(id) && grid._id !== id)
      if (children.length > 0) {
        const isVisible = document.getElementById(children[0]._id) &&
          document.getElementById(children[0]._id).style.display === 'flex'
        children.forEach((child) => {
          if (document.getElementById(child._id)) {
            document.getElementById(child._id).style.display = isVisible ? 'none' : 'flex'
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.grupo-scroll-unidade { height: 100%; overflow-y: scroll; overflow-x: hidden; }
</style>
