<template>
  <div class="quadro">
    <DMAlert ref="dmAlert" />
    <div v-if="admission && admission.workday">
      <b-col md="6" sm="12">
        <b-form-group label-for="admission-workday">
          <template v-slot:label>
            {{ $t('jornadadetrabalho') }} <span class="obrigatorio">*</span>:
          </template>
          <b-form-select
            id="admission-workday"
            v-model="admission.workday"
            :disabled="!canUpdate"
          >
            <template>
              <b-form-select-option v-if="workdays.length === 0" :value="null" :preselect-first="true">
                {{ $t('cadastre') }} {{ $t('uma') }} {{ $t('jornadamin') }}
                {{ $t('em') }} {{ $t('referencias') }} / {{ $t('jornadas') }}
              </b-form-select-option>
              <b-form-select-option v-else value="" disabled>
                -- {{ $t('selecione') }} {{ $t('a') }} {{ $t('jornadamin') }} --
              </b-form-select-option>
              <b-form-select-option
                v-for="(w, key) in workdays"
                :key="key"
                :value="w._id"
              >
                {{ w.name }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
    </div>

    <!-- Custom fields -->
    <vue-form-generator
      :schema="functionalSchema"
      :model="model"
      :options="formOptions"
    />

    <div v-if="canUpdate" class="person-fields mt-3">
      <b-col xs="12">
        <b-button
          class="save mb-3"
          variant="primary"
          :disabled="!isValidFunctionalData"
          @click="saveAdmission"
        >
          {{ $t('salvar') }}
        </b-button>
      </b-col>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { hideLoader, showLoader } from '@/utils/loading'
import DMAlert from '@/components/DMAlert'
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
import { getWorkdaysByClient } from '@/services/workday-service'
import { fieldService } from '@/services/field-service'

export default {
  name: 'RegistrationFunctionalData',
  components: {
    DMAlert,
    'vue-form-generator': VueFormGenerator.component
  },

  data() {
    return {
      workdays: [],
      model: {},
      functionalSchema: { fields: [] },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateAsync: true
      }
    }
  },

  computed: {
    ...mapState({
      person: (state) => state.registrationDataTabs.person,
      personBond: (state) => state.registrationDataTabs.personBond,
      admission: (state) => state.registrationDataTabs.admission,
      screens: (state) => state.screens.screens
    }),
    ...mapGetters(['userClient']),

    canUpdate() {
      return this.$can('manage', this.screens.consultCollaborators) &&
        (!this.personBond || !this.personBond.dismissalDate)
    },

    isValidFunctionalData() {
      let isValid = true
      this.functionalSchema.fields.forEach((field) => {
        if (field.required && !this.model[field.model]) isValid = false
      })
      return isValid
    }
  },

  async created() {
    showLoader()
    try {
      await this.fetchWorkdays()
      await this.fetchFields()
      if (this.admission && Array.isArray(this.admission.customFields)) {
        this.model = this.admission.customFields[0] || {}
      }
    } finally {
      hideLoader()
    }
  },

  methods: {
    async fetchWorkdays() {
      try {
        const { data } = await getWorkdaysByClient(this.userClient)
        this.workdays = data
      } catch { this.workdays = [] }
    },

    async fetchFields() {
      try {
        const { data } = await fieldService.getByClient(this.userClient)
        this.functionalSchema.fields = data
          .filter((f) => f.reference === 'functional')
          .map(({ field }) => {
            field.disabled = !this.canUpdate
            field.readonly = !this.canUpdate
            return field
          })
      } catch { this.functionalSchema.fields = [] }
    },

    async saveAdmission() {
      try {
        showLoader()
        this.$refs.dmAlert.alert({ message: this.$t('admissao') + ' ' + this.$t('atualizada'), type: 'success' })
      } catch (error) {
        this.$refs.dmAlert.alert({ message: this.$t('erroaosalvarregistro'), type: 'danger', timer: 10 })
        console.error('[ERROR SAVING ADMISSION]', error)
      } finally {
        hideLoader()
      }
    }
  }
}
</script>
