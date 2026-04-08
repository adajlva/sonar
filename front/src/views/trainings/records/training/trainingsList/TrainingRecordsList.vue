<template>
  <div>
    <DMModal ref="trainingRemoveModal" @ok="remove" />
    <DMAlert ref="dmAlert" />

    <b-modal
      ref="duplicate-modal"
      :title="$t('atencao')"
      :cancel-title="$t('cancel')"
      size="md"
      :ok-disabled="!trainingToDuplicate.name"
      @ok="duplicate"
    >
      <b-form-group style="text-align: left">
        <template v-slot:label>
          <DMLabelRequiredAndHelp
            label="nomeparanovotreinamento"
            :text="$t('paraserdupliacadootreinamentodeveterumnovonome')"
          />
        </template>
        <b-form-input
          v-model="trainingToDuplicate.name"
          type="text"
          :placeholder="$t('digitenomeparanovotreinamento')"
          @blur="validateWhiteSpace()"
        />
      </b-form-group>
    </b-modal>

    <b-modal
      ref="copy-modal"
      :title="$t('atencao')"
      :cancel-title="$t('cancel')"
      size="md"
      @ok="duplicate"
    >
      <p>{{ $t("certezacopiartreinamento") }}</p>
    </b-modal>
    <div class="flex-row-scrollable-list trainings-list-toolbar">
      <b-button
        v-if="$can('manage', screens.records)"
        class="save mt-2 mb-2 mr-2 trainings-list-toolbar__new-btn"
        variant="primary"
        @click="goToCreate"
      >{{ $t("novotreinamento") }}</b-button>

      <div
        class="mt-2 mb-2 trainings-list-toolbar__search"
      >
        <b-col
          md="12"
          sm="12"
          lg="12"
          :style="{
            'padding-right': '0 !important',
            'padding-left': $can('manage', screens.records)
              ? '15px !important'
              : '0 !important',
          }"
        >
          <div class="search-with-export">
            <b-input-group class="mb-2">
              <b-input-group-append>
                <b-button
                  variant="secondary"
                  disabled
                ><b-icon
                  icon="search"
                  variant="ligth"
                /></b-button>
              </b-input-group-append>
              <b-form-input
                id="processo-palavras"
                v-model="keyword"
                type="text"
                :placeholder="$t('placeholderbuscanomeoudescricaotreinamento')"
                @input="debounceSearch(1000)"
                @keyup.enter="filterByKeyword"
              />
              <b-input-group-append>
                <b-button
                  variant="secondary"
                  class="btn-clear-search"
                  @click="clearSearch()"
                >{{ $t("limparpesquisa") }}</b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </b-col>
      </div>
    </div>
    <div
      class="flex-row-scrollable-list"
      style="margin-top: 16px; justify-content: center"
    >
      <div class="filter-content">
        <div class="filter-item">
          <b-form-group label-for="status">
            <template v-slot:label> {{ $t("status") }}: </template>
            <b-form-select
              id="status"
              v-model="filter.status"
              @change="debounceSearch"
            >
              <template>
                <b-form-select-option
                  :value="null"
                >{{ $t("selecione") }}
                </b-form-select-option>
                <b-form-select-option
                  v-for="(status, key) in statusOptions"
                  :key="key"
                  :value="status.value"
                  :preselect-first="false"
                >
                  {{ status.text }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="filter-item">
          <b-form-group label-for="required">
            <template v-slot:label> {{ $t("obrigatorio") }}: </template>
            <b-form-select
              id="required"
              v-model="filter.isRequired"
              @change="debounceSearch"
            >
              <template>
                <b-form-select-option :value="null">
                  {{ $t("selecione") }}</b-form-select-option>
                <b-form-select-option
                  v-for="(require, key) in requiredOptions"
                  :key="key"
                  :value="require.value"
                  :preselect-first="false"
                >
                  {{ require.text }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="filter-item">
          <b-form-group label-for="year">
            <template v-slot:label> {{ $t("anoreferencia") }}: </template>
            <b-form-select
              id="year"
              v-model="filter.referenceYear"
              @change="debounceSearch"
            >
              <template>
                <b-form-select-option :value="null">
                  {{ $t("selecione") }}</b-form-select-option>
                <b-form-select-option
                  v-for="(year, key) in yearOptions"
                  :key="key"
                  :value="year.value"
                  :preselect-first="false"
                >
                  {{ year.text }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>
      </div>
    </div>
    <div class="flex-row-scrollable-list">
      <b-col
        md="12"
        sm="12"
        lg="12"
        class="p-0"
        style="padding-right: 0 !important"
      >
        <div
          v-if="trainings.length > 0"
          role="tablist"
          class="quadro recruitment-form-scroll"
        >
          <div
            v-infinite-scroll="fetchTrainings"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="1"
            infinite-scroll-throttle-delay="200"
          >
            <b-col v-for="(training, i) in trainings" :key="i" class="p-0">
              <div class="scrollable-list branco">
                <div
                  class="title-scrollable-list font-weight-bold"
                  style="
                    overflow: hidden;
                    word-break: break-word;
                    padding: 0 8px;
                  "
                >
                  {{ training.name }}
                </div>
                <div
                  v-if="!showClientSelect || showClientSelect !== training._id"
                  class="badges"
                >
                  <h5>
                    <b-badge
                      :style="setStatusBtn(training.status)"
                      class="badge-custom"
                    >
                      {{ getStatusName(training.status) }}
                    </b-badge>
                  </h5>
                  <h6>
                    <b-badge
                      class="badge-custom"
                      style="background-color: #c5e9ca; color: black"
                    >
                      {{ $t("anoreferencia") }}: {{ training.referenceYear }}
                    </b-badge>
                  </h6>
                  <h6>
                    <b-badge
                      variant="success"
                      class="badge-custom"
                      style="background-color: #c5e9ca; color: black"
                    >
                      {{ $t("obrigatorio") }}:
                      {{ training.isRequired ? $t("sim") : $t("nao") }}
                    </b-badge>
                  </h6>
                </div>

                <div
                  class="btn-actions-scrollable-list"
                  style="width: fit-content"
                >
                  <span
                    v-b-tooltip.hover.bottom
                    :title="
                      !canManage(training, 'duplicate')
                        ? $t('vocenaotempermissaopararealizaressaoperacao')
                        : $t('duplicar')
                    "
                  >
                    <b-button
                      :disabled="!canManage(training, 'duplicate')"
                      size="sm"
                      class="mr-1"
                      variant="outline-primary"
                      @click="confirmDuplicate(training._id)"
                    >
                      <b-icon icon="files" variant="primary" scale="1" />
                    </b-button>
                  </span>
                  <span
                    v-b-tooltip.hover.bottom
                    :title="
                      !canManage(training, 'copy')
                        ? $t('vocenaotempermissaopararealizaressaoperacao')
                        : $t('copiar')
                    "
                  >
                    <b-button
                      :disabled="!canManage(training, 'copy')"
                      size="sm"
                      class="mr-1"
                      variant="outline-primary"
                      @click="changeShowClientSelect(training._id)"
                    >
                      <svg-icon
                        icon-class="file-export"
                        style="width: 17.5px; height: 17.5px"
                      />
                    </b-button>
                  </span>

                  <b-form-select
                    v-if="showClientSelect === training._id"
                    id="client"
                    v-model="toClient"
                    style="min-width: 250px; margin: 0 5px"
                    @change="confirmCopy(training._id, toClient)"
                  >
                    <template>
                      <b-form-select-option
                        :value="null"
                        disabled
                      >-- {{ $t("selecione") }} {{ $t("o") }}
                        {{ $t("clientemin") }} --</b-form-select-option>
                      <b-form-select-option
                        v-for="(_client, key) in clientsSelectable"
                        :key="key"
                        :value="_client.code"
                        :preselect-first="false"
                      >
                        {{ _client.name }}
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                  <b-button
                    v-if="canManage(training, 'visualize')"
                    v-b-tooltip.hover.bottom
                    :title="$t('visualizar')"
                    size="sm"
                    class="mr-1"
                    variant="outline-primary"
                    @click="view(training)"
                  >
                    <b-icon icon="eye" variant="primary" scale="1" />
                  </b-button>
                  <b-button
                    v-else
                    v-b-tooltip.hover.bottom
                    :title="$t('editar')"
                    size="sm"
                    class="mr-1"
                    variant="outline-primary"
                    @click="update(training._id)"
                  >
                    <b-icon icon="pencil" variant="primary" scale="1" />
                  </b-button>
                  <span
                    v-b-tooltip.hover.bottom
                    :title="
                      !canManage(training, 'delete')
                        ? $t('vocenaotempermissaopararealizaressaoperacao')
                        : $t('deletar')
                    "
                  >
                    <b-button
                      :disabled="!canManage(training, 'delete')"
                      size="sm"
                      class="mr-1"
                      variant="outline-danger"
                      @click="confirmRemove(training._id)"
                    >
                      <b-icon icon="trash" variant="danger" />
                    </b-button>
                  </span>
                </div>
              </div>
            </b-col>
          </div>
        </div>
        <div v-else style="text-align: center; padding-top: 50px">
          <p>{{ $t("semregistros") }}</p>
        </div>
      </b-col>
    </div>
  </div>
</template>

<script>
import { hideLoader, showLoader } from '@/utils/loading'

import { mapActions, mapGetters, mapState } from 'vuex'
import { newTrainingService } from '@/services/new-training-service'
import DMModal from '@/components/DMModal'
import DMAlert from '@/components/DMAlert'
import DMLabelRequiredAndHelp from '@/components/DMLabelRequiredAndHelp'
import { clientService } from '@/services/client-service'
import moment from 'moment'

export default {
  name: 'TrainingRecordsList',
  components: { DMModal, DMAlert, DMLabelRequiredAndHelp },
  data() {
    return {
      filter: { status: null, isRequired: null, referenceYear: null },
      keyword: null,
      trainings: [],
      limit: 20,
      page: 1,
      totalPages: null,
      busy: true,
      timer: null,
      err: null,
      trainingToDuplicate: {
        _id: null,
        name: null,
        toClient: null
      },
      showClientSelect: null,
      toClient: null,
      clients: []
    }
  },

  computed: {
    ...mapState({
      screens: (state) => state.screens.screens
    }),
    ...mapGetters([
      'userProfile',
      'userClient',
      'isMaster',
      'userValidClients'
    ]),
    clientsSelectable() {
      return this.clients.filter((client) => client.code !== this.userClient && !client.deleted)
    },
    statusOptions() {
      return [
        { text: this.$t('rascunho'), value: 'draft' },
        { text: this.$t('planejamentopendente'), value: 'pending' },
        { text: this.$t('agendado'), value: 'scheduled' },
        { text: this.$t('emandamento'), value: 'in_progress' },
        { text: this.$t('concluido'), value: 'completed' }
      ]
    },
    requiredOptions() {
      return [
        { text: this.$t('sim'), value: true },
        { text: this.$t('nao'), value: false }
      ]
    },
    yearOptions() {
      const years = []
      const currentYearMoreFive = moment().add(5, 'years').year()

      for (let year = 2023; year <= currentYearMoreFive; year++) {
        years.unshift({
          value: year,
          text: year.toString()
        })
      }

      return years
    },

    errorMessage() {
      switch (this.err) {
        case 'cannot_change_created_by_admin':
          return this.$t('vocenaotempermissaopararealizaressaoperacao')
        case 'already_has_new_training':
          return this.$t(
            'naopossivelduplicarpoisonomejaeusadoemoutrotreinamento'
          )
        case 'without_bonds':
          return this.$t(
            'naoepossivelcopiarpoisnaoexistemessesvinculosnoclientedestino'
          )
        case 'without_positions':
          return this.$t(
            'naoepossivelcopiarpoisnaoexistemessecargosnoclientedestino'
          )
        case 'without_grid':
          return this.$t(
            'naoepossivelcopiarpoisnaoexisteagradenoclientedestino'
          )
        case 'in_draft_training_is_not_manipulable':
          return this.$t(
            'otreinamentocomstatusrascunhonaopodesermanipulado'
          )
        case 'has_form_answer':
          return this.$t(
            'naoepossiveldeletarpoiscontemrespostasaosformulariosdestetreinamento'
          )
        case 'has_evaluation_answer':
          return this.$t(
            'naoepossiveldeletarotreinamentopoiscontemrespostasasavaliacoesdomesmo'
          )
        case 'has_form_and_evaluation_answers':
          return this.$t(
            'naoepossiveldeletarotreinamentopoisexisterespostasdeavaliacoeseformulariorespondidos'
          )
        default:
          return this.$t('erroaoexcluirregistro')
      }
    }
  },
  mounted() {
    this.fetchTrainings()
    this.fetchClients()
    this.clear()
  },
  methods: {
    ...mapActions('currentTraingRegisterTab', [
      'goToCreate',
      'goToUpdate',
      'goToView'
    ]),
    ...mapActions('newTrainingRegister', ['clear']),

    canManage(training, type) {
      if (type === 'delete') {
        return (
          (!training.createdByAdmin &&
            this.$can('manage', this.screens.records)) ||
          this.userProfile === 'admin_sistema' ||
          this.isMaster
        )
      } else if (type === 'visualize') {
        return (
          (this.userProfile === 'usuario' && training.createdByAdmin) ||
          this.isStartedTraining(training) ||
          !this.$can('manage', this.screens.records)
        )
      } else if (type === 'duplicate') {
        return (
          this.$can('manage', this.screens.records) &&
          training.status !== 'draft'
        )
      } else if (type === 'copy') {
        return (
          (this.userProfile === 'admin_sistema' || this.isMaster) &&
          training.status !== 'draft'
        )
      }
    },

    debounceSearch(ms = 0) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.filterByKeyword()
      }, ms)
    },
    async filterByKeyword(searchItem) {
      clearTimeout(this.timer)

      if (searchItem && typeof searchItem === 'string') {
        const { keyword } = searchItem
        this.keyword = keyword
      }
      this.trainings = []
      this.page = 1
      this.totalPages = null
      return this.fetchTrainings()
    },

    async fetchTrainings() {
      this.busy = true

      const finishPaginate = this.totalPages && this.page > this.totalPages
      if (finishPaginate) {
        return
      }

      showLoader()
      try {
        const { data } = await newTrainingService.getByKeywordAndFilter(
          this.userClient,
          this.keyword,
          this.filter,
          this.limit,
          this.page
        )
        const head = this.trainings.slice(0, this.limit * (this.page - 1))
        const tail = this.trainings.slice(this.limit * this.page)
        this.trainings = [...head, ...data.docs, ...tail]
        this.totalPages = data.totalPages
      } catch (e) {
        console.log(e)
      } finally {
        this.page++
        this.busy = false
        hideLoader()
      }
    },

    async fetchClients() {
      const { data } =
        this.userProfile === 'admin_sistema'
          ? await clientService.get()
          : await clientService.getByUserClients(this.userValidClients)
      this.clients = data
    },

    async update(trainingId) {
      await this.goToUpdate(trainingId)
    },

    async view(training) {
      await this.goToView(training)
    },

    confirmDuplicate(id) {
      this.clearDuplicate()
      this.trainingToDuplicate._id = id
      this.$refs['duplicate-modal'].show()
    },

    async duplicate() {
      showLoader()
      try {
        await newTrainingService.duplicate(
          this.trainingToDuplicate._id,
          this.trainingToDuplicate.name,
          this.trainingToDuplicate.toClient
        )
        await this.filterByKeyword()
        this.$refs.dmAlert.alert({
          type: 'success',
          message: this.trainingToDuplicate.name
            ? this.$t('treinamentoduplicadosucesso')
            : this.$t('treinamentocopiadosucesso')
        })
      } catch (error) {
        this.err = (error.response && error.response.data && error.response.data.message) || 'error'

        if (this.err === 'in_draft_training_is_not_manipulable') {
          this.$refs.dmAlert.alert({
            message: this.$t('otreinamentocomstatusrascunhonaopodesermanipulado'),
            type: 'danger',
            keepAlert: true
          })
        } else {
          this.$refs.dmAlert.alert({
            message: this.trainingToDuplicate.name
              ? this.errorMessage
              : this.$t(
                'naoepossivelcopiarpoisonomejaeusadoemumtreinamentonoclientedestino'
              ),
            type: 'danger',
            keepAlert: true
          })
        }
      } finally {
        this.clearDuplicate()
        hideLoader()
      }
    },

    clearDuplicate() {
      this.showClientSelect = null
      this.toClient = null
      this.trainingToDuplicate = {
        _id: null,
        name: null,
        toClient: null
      }
    },

    confirmCopy(id, toClient) {
      this.clearDuplicate()
      this.trainingToDuplicate._id = id
      this.trainingToDuplicate.toClient = toClient
      this.$refs['copy-modal'].show()
    },

    confirmRemove(id) {
      const options = {
        id,
        title: this.$t('atencao'),
        content: this.$t('certezaexcluirtreinamento')
      }
      this.$refs.trainingRemoveModal.show(options)
    },

    async remove({ id }) {
      showLoader()
      try {
        await newTrainingService.delete(id)
        await this.filterByKeyword()

        const messageSuccess =
          this.$t('treinamento') + ' ' + this.$t('excluido')
        this.$refs.dmAlert.alert({ type: 'success', message: messageSuccess })
      } catch (error) {
        this.err = (error.response && error.response.data && error.response.data.message) || 'error'
        this.$refs.dmAlert.alert({ message: this.errorMessage, type: 'danger' })
      } finally {
        hideLoader()
      }
    },

    clearSearch() {
      this.keyword = null
      this.filter = { status: null, isRequired: null, referenceYear: null }
      this.filterByKeyword()
    },
    getStatusName(value) {
      const status = this.statusOptions.find(
        (status) => status.value === value
      )
      return status ? status.text : ''
    },
    setStatusBtn(value) {
      switch (value) {
        case 'completed':
          return 'background-color: #28A745'

        case 'in_progress':
          return 'background-color: #ffc107; color: black'

        case 'scheduled':
          return 'background-color: #0075ff; color: white'

        case 'pending':
          return 'background-color: red; color: white'

        case 'draft':
          return 'background-color: #666666; color: white'
      }
    },

    changeShowClientSelect(id) {
      return this.showClientSelect === null
        ? (this.showClientSelect = id)
        : (this.showClientSelect = null)
    },

    isStartedTraining(newTraining) {
      if (newTraining.type === 'days_after_the_start_service') {
        return newTraining.schedules[0].newTrainingForm
      }

      return Boolean(
        newTraining.schedules.find((schedule) =>
          moment(new Date()).isAfter(moment(schedule.startDate))
        )
      )
    },

    validateWhiteSpace() {
      var regex = /\S/

      if (!regex.test(this.trainingToDuplicate.name)) {
        this.trainingToDuplicate.name = null
      } else if (this.trainingToDuplicate.name) {
        this.trainingToDuplicate.name = this.trainingToDuplicate.name.trim()
      }
    }
  }
}
</script>
<style scoped>
.filter-item {
  width: 33% !important;
}

.filter-content {
  width: 100%;
  display: flex;
  gap: 20px;
}

.recruitment-form-scroll {
  height: calc(100vh - 90px);
  overflow-y: scroll;
  overflow-x: hidden;
  margin-left: 0;
  margin-right: -10px;
}

.pesquisa-recruitment-form {
  width: calc(100%);
}

.badge-custom {
  font-weight: normal;
  margin-right: 10px;
  margin-top: auto;
  margin-bottom: auto;
  padding: 5px;
}

.badges {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 10px;
}

.btn-actions-scrollable-list :disabled {
  background-color: #dddfe6;
}

/* Flex row + filho width:100% encolhia o botão e cortava o texto */
.trainings-list-toolbar {
  align-items: flex-start;
  flex-wrap: nowrap;
}

.trainings-list-toolbar__new-btn {
  flex-shrink: 0;
  white-space: nowrap;
}

.trainings-list-toolbar__search {
  flex: 1;
  min-width: 0;
}

@media screen and (max-width: 470px) {
  .recruitment-form-scroll {
    height: 100vh;
    margin-left: 0;
    margin-right: 0;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .pesquisa-recruitment-form {
    width: 100%;
  }
}
</style>
