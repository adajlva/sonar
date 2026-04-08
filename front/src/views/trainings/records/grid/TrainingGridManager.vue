<template>
  <div class="quadro">
    <DMAlert ref="dmAlert" />
    <DMModal ref="gridRemoveModal" @ok="remove" />

    <div style="text-align: center; font-weight: bold; margin-bottom: 30px">
      {{ $t("gradetreinamentos") }}
    </div>
    <b-row>
      <b-col md="6" sm="12">
        <div v-if="showChildTraining" class="font-weight-bold text-center">
          {{ $t("cadastrogradesequencial") }}
        </div>
        <div v-else class="font-weight-bold text-center">
          {{ $t("cadastrogradeinicial") }}
        </div>
        <div class="mb-2 campo-obrigatorio">
          (<span class="obrigatorio">*</span>) {{ $t("camposobrigatorios") }}
        </div>

        <b-form-group label-for="trainingGrid-name">
          <template v-slot:label>
            <DMLabelRequired label="nome" />
          </template>
          <b-form-input
            id="trainingGrid-name"
            v-model="newTrainingGrid.name"
            type="text"
            :placeholder="$t('informenomegrade')"
            @blur="newTrainingGrid.name !== null ? validateGridName() : ''"
          />
        </b-form-group>

        <b-form-group label-for="trainingGrid-details">
          <template v-slot:label>
            <DMLabel label="detalhes" />
          </template>
          <b-form-textarea
            id="trainingGrid-details"
            v-model="newTrainingGrid.details"
            type="textarea"
            :placeholder="$t('informedetalhesgrade')"
          />
        </b-form-group>

        <b-form-group>
          <b-form-checkbox
            id="allow-trainings-at-this-level"
            v-model="newTrainingGrid.allowTrainingsAtThisLevel"
            switch
            class="ml-2 mt-2 mb-1"
          >
            {{ $t("permitircadastrodetreinamentonestenivel") }}
            <span style="font-weight: 100; font-size: small">{{
              $t("permitirtreinamentosatralados")
            }}</span>
          </b-form-checkbox>
        </b-form-group>

        <b-row>
          <b-col xs="12">
            <span
              id="disabled-wrapper-newTrainingGrid"
              class="d-inline-block"
              tabindex="0"
            >
              <b-button
                v-if="
                  ((!newTrainingGrid._id || !newTrainingGrid.createdByAdmin) &&
                    $can('manage', screens.records)) ||
                    userProfile === 'admin_sistema' ||
                    isMaster
                "
                class="save"
                variant="primary"
                :disabled="!isValidTraining"
                @click="saveOrUpdateUnity"
              >{{ $t("salvar") }}</b-button>
            </span>
            <b-tooltip
              v-if="!isValidTraining"
              target="disabled-wrapper-newTrainingGrid"
            >{{ $t("camposnaopreenchidos") }}</b-tooltip>
            <b-button
              v-if="newTrainingGrid._id"
              class="save mb-3 mt-3"
              variant="secondary"
              @click="clear()"
            >
              {{ $t("cancelar") }}
            </b-button>
          </b-col>
        </b-row>
      </b-col>

      <b-col md="6" sm="12">
        <div
          v-if="trainingGrids && trainingGrids.length > 0"
          class="grupo-scroll-unidade"
        >
          <div role="tablist">
            <b-row>
              <b-col
                v-for="(trainingGrid, i) in trainingGrids"
                :key="i"
                md="12"
                sm="12"
              >
                <div
                  :id="trainingGrid._id"
                  :class="getTrainingColor(i)"
                  :style="{
                    'margin-left': getMargin(trainingGrid) + 'px !important',
                  }"
                  @click="showOrHideChildrenTrainingGrids(trainingGrid._id)"
                >
                  <div class="title-group">
                    <b-icon
                      icon="chevron-contract"
                      variant="dark"
                      class="mr-2 mt-1"
                    />
                    {{ trainingGrid.name }}
                  </div>
                  <div class="btn-grid">
                    <b-button
                      v-if="$can('manage', screens.records)"
                      v-b-tooltip.hover.bottom
                      :title="$t('adicionargradesequencial')"
                      size="sm"
                      class="ml-3 mr-1"
                      variant="outline-primary"
                      @click="addChildTrainig(trainingGrid)"
                    >
                      <b-icon icon="plus" scale="1.5" variant="primary" />
                    </b-button>
                    <b-button
                      size="sm"
                      class="mr-1"
                      variant="outline-primary"
                      @click="updateTraining(trainingGrid)"
                    >
                      <b-icon icon="pencil" variant="primary" />
                    </b-button>
                    <b-button
                      v-if="
                        (!trainingGrid.createdByAdmin &&
                          $can('manage', screens.records)) ||
                          userProfile === 'admin_sistema' ||
                          isMaster
                      "
                      size="sm"
                      class="mr-1"
                      variant="outline-danger"
                      @click="confirmRemove(trainingGrid._id)"
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
import { newTrainingGridService } from '@/services/new-training-grid-service'
import { hideLoader, showLoader } from '@/utils/loading'
import { mapGetters, mapState } from 'vuex'
import * as _ from 'lodash'
import DMAlert from '@/components/DMAlert'
import DMLabelRequired from '@/components/DMLabelRequired'
import DMLabel from '@/components/DMLabel'
import DMModal from '@/components/DMModal'

export default {
  name: 'TrainingGridManager',
  components: {
    DMAlert,
    DMLabel,
    DMLabelRequired,
    DMModal
  },
  data() {
    return {
      newTrainingGrid: {
        name: null,
        details: null,
        allowTrainingsAtThisLevel: false
      },
      trainingGrids: [],
      showChildTraining: false,
      err: '',
      newTrainingGridBeforeChange: null
    }
  },
  computed: {
    ...mapState({
      currentTrainingRecordsTabIndex: (state) =>
        state.currentTrainingRecordsTabIndex.currentTrainingRecordsTabIndex,
      screens: (state) => state.screens.screens
    }),
    ...mapGetters(['userProfile', 'userClient', 'isMaster']),
    isValidTraining: function () {
      return (
        this.newTrainingGrid.name &&
        typeof this.newTrainingGrid.allowTrainingsAtThisLevel === 'boolean' &&
        this.newTrainingGrid.name.trim() !== ''
      )
    },
    errorMessage() {
      if (this.err === 'already_has_childs') {
        return this.$t('jaexistetreinamentosnestenivel')
      } else if (this.err === 'has_create_by_adm_childs') {
        return this.$t('gradessequenciascriadasporadm')
      } else if (this.err === 'has_training_at_this_level') {
        return this.$t('erroaotentaratualizarpoisexistetreinamentos')
      } else if (this.err === 'has_training_at_the_childrens_level') {
        return this.$t('erroaotentaratualizarpoisexistetreinamentosnosfilhos')
      }
      return this.$t('erroaoexcluirregistro')
    }
  },
  watch: {
    currentTrainingRecordsTabIndex: function () {
      if (this.currentTrainingRecordsTabIndex === 1) {
        this.clear()
        this.fetchNewTrainingGrids()
      }
    },
    'trainingGrids': function() {
      if (this.trainingGrids.length > 5) { frames.octadesk.chat.hide() } else frames.octadesk.chat.show()
    }
  },
  mounted() {
    if (this.currentTrainingRecordsTabIndex === 1) {
      this.fetchNewTrainingGrids()
    }
  },
  destroyed() {
    frames.octadesk.chat.show()
  },

  methods: {
    getTrainingColor: function (i) {
      if (i % 2 === 0) {
        return 'unit-groups branco'
      } else {
        return 'unit-groups cinza'
      }
    },

    getMargin(trainingGrid) {
      const level = trainingGrid.path.split('#')
      return (level.length - 1) * 20
    },

    async updateTraining(item) {
      this.newTrainingGridBeforeChange = Object.assign({}, item)
      this.newTrainingGrid = Object.assign({}, item)

      const path = item.path.split('#')
      if (path.length > 1) {
        this.showChildTraining = true
      }
      document.getElementById('trainingGrid-name').focus()
    },

    async alredyExistThisTrainingGridName() {
      await this.fetchNewTrainingGrids()
      const isUpdate = Boolean(this.newTrainingGridBeforeChange)
      const cloneGrids = _.cloneDeep(this.trainingGrids)
      if (isUpdate) cloneGrids.splice(cloneGrids.findIndex((g) => g.name === this.newTrainingGridBeforeChange.name), 1)
      const hasDuplicatedGrid = Boolean(cloneGrids.find((g) => g.name === this.newTrainingGrid.name.trim()))
      if (hasDuplicatedGrid) {
        this.$refs.dmAlert.alert( {
          message: this.$t('onomeinformadojaeutilizadoemoutragrade'),
          type: 'danger'
        })
        return true
      } else {
        return false
      }
    },

    validateGridName() {
      if (this.newTrainingGrid.name.trim() === '') {
        this.$refs.dmAlert.alert( {
          message: this.$t('onomeinformadoparaagradenaoevalido'),
          type: 'danger'
        })
        this.newTrainingGrid.name = ''
      }
    },

    async fetchNewTrainingGrids() {
      try {
        showLoader()
        const { data } = await newTrainingGridService.getByClient(
          this.userClient
        )
        this.trainingGrids = data
        this.trainingGrids.forEach((trainingGrid) => {
          if (document.getElementById(trainingGrid._id)) {
            document.getElementById(trainingGrid._id).style.display = 'flex'
          }
        })
      } finally {
        hideLoader()
      }
    },

    async clear() {
      this.newTrainingGrid = {
        name: null,
        details: null,
        allowTrainingsAtThisLevel: false
      }
      this.showChildTraining = false
      this.newTrainingGridBeforeChange = null
    },

    async saveOrUpdateUnity() {
      try {
        showLoader()
        this.newTrainingGrid.createdByAdmin =
          this.userProfile === 'admin_sistema'
        this.newTrainingGrid.client = this.userClient

        this.newTrainingGrid.name = this.newTrainingGrid.name.trim()

        if (await this.alredyExistThisTrainingGridName()) return

        let message =
          this.$t('gradetreinamentos') + ' ' + this.$t('cadastrada')
        if (this.newTrainingGrid._id) {
          message = this.$t('gradetreinamentos') + ' ' + this.$t('atualizada')
        }

        await newTrainingGridService.save(this.newTrainingGrid)
        this.$refs.dmAlert.alert( { message: message, type: 'success' })

        await this.fetchNewTrainingGrids()
        this.clear()
      } catch (e) {
        if (e.response.data.statusCode === 409) {
          this.err = e.response.data.message
          this.$refs.dmAlert.alert( { message: this.errorMessage, type: 'danger' })
        } else {
          const messageDanger = this.$t('erroaoexcluirregistro')
          this.$refs.dmAlert.alert( { type: 'danger', message: messageDanger })
        }
      } finally {
        hideLoader()
        window.scrollTo(0, 0)
      }
    },

    addChildTrainig(trainingGrid) {
      this.clear()
      this.newTrainingGrid.parent = trainingGrid._id
      this.showChildTraining = true
      document.getElementById('trainingGrid-name').focus()
    },

    showOrHideChildrenTrainingGrids(id) {
      const children = this.trainingGrids.filter(
        (trainingGrid) =>
          trainingGrid.path.includes(id) && trainingGrid._id !== id
      )
      if (children.length > 0) {
        const isVisible =
          document.getElementById(children[0]._id) &&
          document.getElementById(children[0]._id).style.display === 'flex'
        children.forEach((child) => {
          if (document.getElementById(child._id)) {
            document.getElementById(child._id).style.display = isVisible
              ? 'none'
              : 'flex'
          }
        })
      }
    },

    confirmRemove(id) {
      const options = {
        id,
        title: this.$t('atencao'),
        content: this.$t('certezaexcluirgrade')
      }
      this.$refs.gridRemoveModal.show(options)
    },

    async remove({ id }) {
      showLoader()
      try {
        await newTrainingGridService.delete(id)
        await this.fetchNewTrainingGrids()
        const messageSuccess = this.$t('grade') + ' ' + this.$t('excluida')
        this.$refs.dmAlert.alert( { type: 'success', message: messageSuccess })
      } catch (error) {
        this.err = error.response.data.message
        this.$refs.dmAlert.alert( { message: this.errorMessage, type: 'danger' })
      } finally {
        hideLoader()
      }
    }
  }
}
</script>

<style>
.grupo-scroll-unidade {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
