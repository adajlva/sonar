<template>
  <div>
    <div v-if="status" class="quadro">
      {{ $t('situacaoatualcolaborador') }}:
      <b-button
        class="mr-1 btn-status"
        size="sm"
        :variant="getVariantByStatus(status)"
        disabled
      >
        {{
          personBondStatus.find((st) => st.value === status)
            ? personBondStatus.find((st) => st.value === status).text
            : '-'
        }}
      </b-button>
    </div>
    <DMPanel>
      <div>
        <DMAlert ref="dmAlert" />
        <!-- Photo -->
        <div v-if="person.photo" class="mt-3 ml-3 mb-3">
          <img :src="photo" class="photo" alt="" />
        </div>
        <div class="person-fields mt-3">
          <b-col md="6" sm="12">
            <div class="label-icon mb-2">
              {{ $t('foto') }} ({{ $t('opcional') }}):
            </div>
            <b-form-file
              id="person-photo"
              ref="newPhoto"
              v-model="newPhoto"
              :disabled="!isUserData"
              enctype="multipart/form-data"
              :placeholder="$t('escolhaarquivo')"
              :drop-placeholder="$t('arquivo') + '...'"
            />
          </b-col>
          <!-- End Photo -->

          <!-- Document -->
          <b-col md="6" sm="12">
            <b-form-group label-for="person-document">
              <template v-slot:label>
                {{ $t('documentoidentificacao') }}
                <span class="obrigatorio">*</span>:
              </template>
              <b-input-group>
                <b-input-group-append>
                  <b-form-select
                    v-model="person.documentType"
                    :disabled="person._id !== null"
                    @change="validateCPF"
                  >
                    <template>
                      <b-form-select-option value="cpf"
                        >CPF</b-form-select-option
                      >
                      <b-form-select-option value="other">{{
                        $t('outro')
                      }}</b-form-select-option>
                    </template>
                  </b-form-select>
                </b-input-group-append>
                <b-form-input
                  id="person-document"
                  ref="personDocument"
                  v-model="person.document"
                  v-mask="person.documentType === 'cpf' ? '###.###.###-##' : ''"
                  type="text"
                  autocomplete="nope"
                  :placeholder="$t('textodocumentoidentificacao')"
                  :disabled="person._id !== null || !isUserData"
                  @blur="onChangeDocument"
                  @input="toUpperCase"
                  @keypress="handleKeypress"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <!-- End document -->

          <!-- Name -->
          <b-col md="6" sm="12">
            <b-form-group label-for="pessoa-nome">
              <template v-slot:label>
                {{ $t('nome') }} <span class="obrigatorio">*</span>:
              </template>
              <b-form-input
                id="pessoa-nome"
                ref="personName"
                v-model="person.name"
                :disabled="!isUserData"
                autocomplete="nope"
                type="text"
                :placeholder="$t('informenome')"
                invalid-feedback="This field is required"
              />
            </b-form-group>
          </b-col>
          <!-- End Name -->

          <!-- PIS -->
          <b-col md="6" sm="12">
            <b-form-group label-for="user-pis">
              <template v-slot:label> PIS: </template>
              <b-form-input
                id="user-pis"
                ref="personPIS"
                v-model="person.pis"
                v-mask="'###.#####.##-#'"
                :disabled="!isUserData"
                type="text"
                autocomplete="nope"
                :placeholder="$t('informepis')"
              />
            </b-form-group>
          </b-col>
          <!-- End PIS -->

          <!-- Birth date -->
          <b-col md="6" sm="12">
            <b-form-group label-for="pessoa-cpf">
              <template v-slot:label>
                {{ $t('datanascimento') }} <span class="obrigatorio">*</span>:
              </template>
              <b-form-input
                id="pessoa-cpf"
                v-model="birthDate"
                v-limitInputDate
                :disabled="!isUserData"
                type="date"
                autocomplete="nope"
                :placeholder="$t('informedatanascimento')"
                invalid-feedback="This field is required"
                :max="currentDate"
                @blur="validatesBirthDate"
              />
            </b-form-group>
          </b-col>
          <!-- End birth -->

          <!-- Phone -->
          <b-col md="6" sm="12">
            <b-form-group label-for="pessoa-celular">
              <template v-slot:label>
                {{ $t('celular') }} <span class="obrigatorio">*</span>:
              </template>
              <vue-tel-input
                v-model="person.phone"
                :disabled="!isUserData"
                valid-characters-only
                mode="international"
                :input-options="{
                  placeholder: $t('informetelefonecelular'),
                  autocomplete: 'nope'
                }"
                :default-country="person.phoneCountry || 'BR'"
                @country-changed="countryChanged"
                @blur="onPhoneBlur"
              />
              <p v-if="duplicatePhoneError" class="helper-text-error">
                {{ $t('duplicated_phone') }}
                <a v-if="isAdmin" href="#" @click.prevent="viewDuplicates('phone')">
                  {{ $t('viewDuplicates') }}
                </a>
              </p>
            </b-form-group>
          </b-col>
          <!-- End phone -->

          <!-- Father name -->
          <b-col md="6" sm="12">
            <b-form-group label-for="pessoa-nomepai">
              <template v-slot:label>
                {{ $t('nomepai') }} ({{ $t('opcional') }}):
              </template>
              <b-form-input
                id="pessoa-nomepai"
                v-model="person.fatherName"
                :disabled="!isUserData"
                type="text"
                autocomplete="nope"
                :placeholder="$t('informenomepai')"
                invalid-feedback="This field is required"
              />
            </b-form-group>
          </b-col>
          <!-- End father name -->

          <!-- Mother name -->
          <b-col md="6" sm="12">
            <b-form-group label-for="pessoa-nomemae">
              <template v-slot:label>
                {{ $t('nomemae') }} ({{ $t('opcional') }}):
              </template>
              <b-form-input
                id="pessoa-nomemae"
                v-model="person.motherName"
                :disabled="!isUserData"
                type="text"
                autocomplete="nope"
                :placeholder="$t('informenomemae')"
                invalid-feedback="This field is required"
              />
            </b-form-group>
          </b-col>
          <!-- End mother name -->

          <!-- Email -->
          <b-col md="6" sm="12">
            <b-form-group label-for="pessoa-email">
              <template v-slot:label>
                {{ $t('email') }} ({{ $t('opcional') }}):
              </template>
              <b-form-input
                id="pessoa-email"
                v-model="person.email"
                :disabled="!isUserData"
                type="text"
                autocomplete="nope"
                :placeholder="$t('informeemail')"
                @blur="validateEmailUniqueness"
              />
              <p v-if="duplicateEmailError" class="helper-text-error">
                {{ $t('duplicated_email') }}
                <a v-if="isAdmin" href="#" @click.prevent="viewDuplicates('email')">
                  {{ $t('viewDuplicates') }}
                </a>
              </p>
            </b-form-group>
          </b-col>
          <!-- End Email -->

          <!-- Optin -->
          <b-col md="6" sm="12">
            <b-form-checkbox
              id="optin"
              v-model="person.optin"
              :disabled="!isUserData"
              name="optin"
              switch
            >
              {{ $t('concordareceberwhatsappdaempresa') }}
            </b-form-checkbox>
          </b-col>
          <!-- End Optin -->
        </div>

        <!-- Custom fields -->
        <vue-form-generator
          :schema="personalSchema"
          :model="model"
          :options="formOptions"
        />
        <!-- End custom fields -->

        <b-col v-if="!person.dismissalDate" xs="12">
          <div>
            <span id="disabled-wrapper" class="d-inline-block" tabindex="0">
              <b-button
                v-if="isUserData"
                class="save mb-3"
                variant="primary"
                :disabled="!isValidPerson || hasDuplicateContacts || validatingContacts"
                @click="saveOrUpdatePerson"
              >
                <span v-if="person._id">{{ $t('salvar') }}</span>
                <span v-else>{{ $t('avancar') }}</span>
              </b-button>
            </span>
            <b-tooltip v-if="!isValidPerson" target="disabled-wrapper">
              {{ $t('camposnaopreenchidos') }}
            </b-tooltip>
          </div>
        </b-col>
      </div>
      <DuplicatedContactsModal
        :visible="showDuplicatesModal"
        :duplicated-field="duplicatedField"
        :current-email="person.email"
        :current-phone="person.phone"
        :client="client"
        :exclude-person-id="person._id"
        @close="onCloseModal"
        @saved="onDuplicateSaved"
      />
    </DMPanel>
  </div>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import { parseCustomData, checkHasDuplicatedContacts } from '@/services/person-service'
import { normalizeEmail, normalizePhone } from '@/utils/contact-normalizer'
import DuplicatedContactsModal from '@/components/DuplicatedContactsModal'
import { hideLoader, showLoader } from '@/utils/loading'
import DMAlert from '@/components/DMAlert'
import DMPanel from '@/components/DMPanel'
import * as _ from 'lodash'
import { validCPF } from '@/utils/validate'
import { getStatusByPersonBond } from '@/services/person-bond-service'
import * as storageService from '@/services/storage-service'

export default {
  name: 'PersonalData',
  components: {
    'vue-form-generator': VueFormGenerator.component,
    DMPanel,
    DMAlert,
    DuplicatedContactsModal
  },

  props: {
    fields: { type: Array, default: () => [] }
  },

  data() {
    return {
      status: null,
      duplicateEmailError: false,
      duplicatePhoneError: false,
      showDuplicatesModal: false,
      duplicatedField: null,
      validatingContacts: false,
      personalSchema: {
        fields: []
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateAsync: true
      },
      model: {},
      currentDate: moment.utc(new Date()).format('YYYY-MM-DD')
    }
  },

  computed: {
    ...mapState({
      client: (state) => state.user.userClient,
      person: (state) => _.cloneDeep(state.collaboratorDossierTabs.person),
      userPersonId: (state) => state.collaboratorDossierTabs.userPersonId,
      screens: (state) => state.screens.screens,
      userProfile: (state) => state.user.userProfile
    }),

    isAdmin() {
      return this.userProfile === 'admin_sistema'
    },

    hasDuplicateContacts() {
      return this.duplicateEmailError || this.duplicatePhoneError
    },

    isUserData() {
      return this.userPersonId === this.person._id
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

    birthDate: {
      get() {
        if (this.person.birthDate) {
          return moment.utc(this.person.birthDate).format('YYYY-MM-DD').toString()
        }
        return ''
      },
      set(value) {
        this.person.birthDate = value
      }
    },

    newPhoto: {
      get() {
        return []
      },
      set(value) {
        this.person.photo = value
      }
    },

    isValidPerson: function () {
      if (!this.person.name || !this.person.document || !this.birthDate || !this.person.phone) {
        return false
      }
      let isValid = true
      this.personalSchema.fields.forEach((field) => {
        if (field.required && !this.model[field.model]) {
          isValid = false
        }
      })
      return isValid
    }
  },

  asyncComputed: {
    async photo() {
      if (!this.person.photo) return null
      if (this.person.photo instanceof File) return URL.createObjectURL(this.person.photo)
      if (typeof this.person.photo === 'string') {
        try {
          const { data } = await storageService.findById(this.person.photo)
          return data.file
        } catch {
          return null
        }
      }
      return this.person.photo.file
    }
  },

  watch: {
    hasDuplicateContacts(newVal) {
      if (newVal) {
        this.$refs.dmAlert.alert({ message: this.$t('duplicateContactAlert'), type: 'warning', keepAlert: true })
      } else {
        this.$refs.dmAlert.dismiss()
      }
    },
    fields: function () {
      if (this.fields.length > 0) this.fetchFields()
    }
  },

  async created() {
    this.CLEAR_DUPLICATES()
    this.fetchFields()
    if (Array.isArray(this.person.customFields)) {
      this.model = this.person.customFields[0] || {}
    }
    try {
      this.status = (await getStatusByPersonBond(this.person._id)).data
    } catch {
      this.status = null
    }
  },

  beforeDestroy() {
    this.CLEAR_DUPLICATES()
  },

  methods: {
    ...mapMutations('contactDuplicates', ['ADD_DUPLICATED_FIELD', 'REMOVE_DUPLICATED_FIELD', 'CLEAR_DUPLICATES']),

    countryChanged(country) {
      this.person.phoneCountry = country.iso2
    },

    onPhoneBlur() {
      this.validatePhoneUniqueness()
    },

    async validateEmailUniqueness() {
      this.duplicateEmailError = false
      this.REMOVE_DUPLICATED_FIELD('email')
      if (!this.person.email || !this.client) return
      this.validatingContacts = true
      try {
        const normalized = normalizeEmail(this.person.email)
        const result = await checkHasDuplicatedContacts(normalized, null, this.client, this.person._id)
        if (result.hasDuplicate && result.duplicatedField === 'email') {
          this.duplicateEmailError = true
          this.ADD_DUPLICATED_FIELD('email')
        }
      } catch (error) {
        console.error('[ERROR VALIDATING EMAIL UNIQUENESS]', error)
      } finally {
        this.validatingContacts = false
      }
    },

    async validatePhoneUniqueness() {
      this.duplicatePhoneError = false
      this.REMOVE_DUPLICATED_FIELD('phone')
      if (!this.person.phone || !this.client) return
      this.validatingContacts = true
      try {
        const normalized = normalizePhone(this.person.phone)
        const result = await checkHasDuplicatedContacts(null, normalized, this.client, this.person._id)
        if (result.hasDuplicate && result.duplicatedField === 'phone') {
          this.duplicatePhoneError = true
          this.ADD_DUPLICATED_FIELD('phone')
        }
      } catch (error) {
        console.error('[ERROR VALIDATING PHONE UNIQUENESS]', error)
      } finally {
        this.validatingContacts = false
      }
    },

    viewDuplicates(field) {
      this.duplicatedField = field
      this.showDuplicatesModal = true
    },

    onDuplicateSaved() {
      if (this.duplicatedField === 'email') this.validateEmailUniqueness()
      else if (this.duplicatedField === 'phone') this.validatePhoneUniqueness()
    },

    onCloseModal() {
      this.showDuplicatesModal = false
    },

    toUpperCase() {
      if (this.person.documentType === 'other' && this.person.document) {
        const sanitizedValue = this.person.document.replace(/[^A-Z0-9]/gi, '').toUpperCase()
        this.person.document = sanitizedValue
      }
    },

    handleKeypress(event) {
      const regex = /^[a-zA-Z0-9\s]$/
      if (!regex.test(event.key)) event.preventDefault()
    },

    validatesBirthDate() {
      const currentDate = new Date().getTime()
      const birthDate = new Date(this.birthDate)
      if (birthDate.getTime() - currentDate > 0) {
        this.birthDate = null
        this.$refs.dmAlert.alert({ message: this.$t('datanascimentomaioratual'), type: 'danger' })
      } else if (birthDate.getFullYear() < 1900) {
        this.birthDate = null
        this.$refs.dmAlert.alert({ message: this.$t('dataanoinvalido'), type: 'danger' })
      }
    },

    async saveOrUpdatePerson() {
      try {
        showLoader()
        this.model = parseCustomData(this.model, this.personalSchema)
        this.$set(this.person.customFields, 0, this.model)
        this.person.fieldReference = 'personal'
        this.$refs.dmAlert.alert({ message: this.$t('pessoa') + ' ' + this.$t('atualizada'), type: 'success' })
      } catch (error) {
        this.$refs.dmAlert.alert({ message: this.$t('erroaosalvarregistro'), type: 'danger', timer: 10 })
        console.error('[ERROR TO SAVE PERSON]', error)
      } finally {
        hideLoader()
      }
    },

    fetchFields() {
      this.personalSchema.fields = this.fields
        .filter((f) => f.reference === 'personal')
        .map(({ field }) => field)
    },

    async onChangeDocument() {
      if (this.person.document && !this.person._id) {
        this.validateCPF()
      }
    },

    validateCPF() {
      if (
        this.person.documentType === 'cpf' &&
        this.person.document &&
        !validCPF(this.person.document.replace(/[^\d]+/g, ''))
      ) {
        this.person.document = null
        return this.$refs.dmAlert.alert({ message: this.$t('informeCPFvalido'), type: 'danger' })
      }
    },

    getVariantByStatus(status) {
      return this.personBondStatus.find((option) => option.value === status)
        ? this.personBondStatus.find((option) => option.value === status).variant
        : null
    }
  }
}
</script>

<style scoped>
.photo {
  width: 120px;
  height: 150px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.helper-text-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.helper-text-error a {
  color: #007bff;
  text-decoration: underline;
  margin-left: 0.5rem;
}

.helper-text-error a:hover {
  color: #0056b3;
}
</style>
