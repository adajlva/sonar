<template>
  <div class="quadro shared-frame-form">
    <DMAlert />

    <div v-if="schema && (!step || step === 'identify-collaborator')">
      <div v-if="step === 'identify-collaborator'" class="dm-form-anwswer-success">
        <div class="font-weight-bold mb-3 section">
          {{ $t("identificacaodocolaborador") }}
        </div>
      </div>
    </div>

    <div v-if="schema && step === 'form-view' && !showSuccessMessage">
      <div class="quadro p-3">
        <h5>{{ schema.name }}</h5>
        <p>{{ schema.description }}</p>
        <b-button variant="primary" @click="showSuccessMessage = true">
          {{ $t("salvar") }}
        </b-button>
      </div>
    </div>

    <div v-if="showSuccessMessage" class="dm-form-anwswer-success">
      <div class="obrigado mt-4 mb-4 ml-2">
        <i class="el-icon-circle-check" />
        {{ $t("obrigadoparticipacao") }}
      </div>
      <div class="resposta-enviada mb-4 ml-2">
        {{ $t("respostaenviada") }}
      </div>
      <div class="ml-2" @click="goToList()">
        <a href="#">{{ $t("voltar") }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import * as storageService from '@/services/storage-service'
import { FormAnswerService } from '@/services/form-answer-service'
import { hideLoader, showLoader } from '@/utils/loading'
import DMAlert from '@/components/DMAlert'
import { customFormPlanningService } from '@/services/custom-form-planning-service'

export default {
  name: 'RequestAnswerView',
  components: { DMAlert },
  data() {
    return {
      client: null,
      collaborator: null,
      schema: null,
      formAnswerService: null,
      step: null,
      errorMessage: null,
      path: null,
      showSuccessMessage: false,
      userDocument: null
    }
  },
  computed: {
    ...mapGetters(['userCpf', 'userClient']),
    ...mapState('workplaceRequests', ['requestForm'])
  },
  async created() {
    showLoader()
    this.userDocument = this.userCpf
    this.client = this.requestForm && this.requestForm.client === 'global' ? this.userClient : (this.requestForm && this.requestForm.client)
    try {
      if (!this.requestForm) {
        this.handleFormNotFound()
        return
      }
      this.schema = this.requestForm
      this.path = this.requestForm.answerPath
      this.formAnswerService = new FormAnswerService(this.path)
      if (this.requestForm.hasPlanning) {
        await this.handlePlanningForm()
      }
      if (!this.requestForm.hasPlanning && this.requestForm.answerType === 'collaborators') {
        await this.handleCollaboratorForm()
      }
      if (this.requestForm.answerType === 'ownanswer') {
        await this.handleOwnAnswerForm()
      }
    } catch (error) {
      console.error(error)
    } finally {
      hideLoader()
    }
  },
  destroyed() {
    this.goToList()
  },
  methods: {
    ...mapActions('workplaceRequestsTabs', ['goToList']),

    selectCollaborator(collaborator) {
      this.collaborator = collaborator
      this.step = 'form-view'
    },

    saveFile(file) {
      const formData = new FormData()
      formData.append('file', file)
      return storageService.upload(formData)
    },

    async saveAnswer({ duration }) {
      showLoader()
      try {
        const formAnswers = {
          client: this.client,
          customForm: this.schema._id,
          answers: {}
        }
        if (duration) { formAnswers.duration = duration }
        if (this.userDocument) { formAnswers.userDocument = this.userDocument }
        if (this.collaborator) { formAnswers.person = this.collaborator.person._id }
        await this.formAnswerService.save(formAnswers)
        this.showSuccessMessage = true
      } catch (error) {
        const messageErrorKey = error.response ? error.response.data.message : 'erroaoexcluirregistro'
        this.$emit('alert', { type: 'danger', message: this.$t(messageErrorKey) })
      } finally {
        hideLoader()
      }
    },

    async handleFormNotFound() {
      this.$emit('alert', { message: this.$t('formularionaoencontrado'), type: 'danger', timer: 1000 })
    },

    async handlePlanningForm() {
      if (!this.userDocument) { this.handleUserNotIdentified(); return }
      try {
        const { data: planning } = await customFormPlanningService.validPlansByCustomForm(this.client, this.schema._id, this.userDocument)
        if (!planning) { this.handleNoActivePlans(); return }
      } catch (e) {
        console.error(e)
        if (e.response && e.response.status === 409) {
          this.$emit('alert', { message: this.$t(e.response.data.message), type: 'danger', timer: 1000 })
        }
        return
      }
      if (this.requestForm.answerType === 'collaborators') { this.step = 'identify-collaborator' }
    },

    async handleCollaboratorForm() {
      if (!this.userDocument) { this.handleUserNotIdentified(); return }
      this.step = 'identify-collaborator'
    },

    async handleOwnAnswerForm() {
      try {
        const { data } = await this.formAnswerService.hasAnswerByCustomForm(this.client, this.requestForm._id, this.userDocument)
        if (data && !this.requestForm.multAnswersPerUser) { this.handleMultipleAnswers() }
        else { this.step = 'form-view' }
      } catch (e) {
        if (e.response && e.response.status === 409) {
          this.$emit('alert', { message: this.$t(e.response.data.message), type: 'danger', timer: 10 })
        }
      }
    },

    async handleUserNotIdentified() {
      this.$emit('alert', { message: this.$t('usuarionaoidentificado'), type: 'danger', timer: 1000 })
    },
    async handleNoActivePlans() {
      this.$emit('alert', { message: this.$t('semplanejamentosativos'), type: 'danger', timer: 1000 })
    },
    async handleMultipleAnswers() {
      this.$emit('alert', { message: this.$t('formrespondidomaisdeumavezmesmapessoa'), type: 'danger', timer: 10 })
    }
  }
}
</script>
