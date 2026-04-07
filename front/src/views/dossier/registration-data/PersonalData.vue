<template>
  <div class="quadro">
    <b-alert v-if="hasDuplicates" show variant="danger" class="duplicate-alert mb-3">
      {{ $t('duplicateContactAlert') }}
    </b-alert>

    <DMAlert ref="dmAlert" />

    <!-- Photo -->
    <div v-if="person && person.photo" class="mb-3">
      <img :src="photoUrl" class="photo" alt="" />
    </div>

    <div class="person-fields">
      <b-col md="6" sm="12">
        <div class="label-icon mb-2">{{ $t('foto') }}:</div>
        <b-form-file
          id="person-photo"
          ref="newPhoto"
          v-model="newPhoto"
          :disabled="!canUpdate"
          enctype="multipart/form-data"
          :placeholder="$t('escolhaarquivo')"
          :drop-placeholder="$t('arquivo') + '...'"
        />
      </b-col>

      <!-- Document -->
      <b-col md="6" sm="12">
        <b-form-group label-for="person-document">
          <template v-slot:label>
            {{ $t('documentoidentificacao') }}: <span class="obrigatorio">*</span>
          </template>
          <b-input-group>
            <b-input-group-append>
              <b-form-select
                v-model="person.documentType"
                :disabled="!canUpdate"
                @change="validateDocument"
              >
                <template>
                  <b-form-select-option value="cpf">CPF</b-form-select-option>
                  <b-form-select-option value="other">{{ $t('outro') }}</b-form-select-option>
                </template>
              </b-form-select>
            </b-input-group-append>
            <b-form-input
              id="person-document"
              ref="personDocument"
              v-model="person.document"
              v-mask="person.documentType === 'cpf' ? '###.###.###-##' : ''"
              type="text"
              maxlength="20"
              autocomplete="nope"
              :placeholder="$t('textodocumentoidentificacao')"
              :disabled="!canUpdate"
              @blur="onChangeDocument"
              @keypress="handleKeypress"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- Name -->
      <b-col md="6" sm="12">
        <b-form-group label-for="pessoa-nome">
          <template v-slot:label>
            {{ $t('nome') }}: <span class="obrigatorio">*</span>
          </template>
          <b-form-input
            id="pessoa-nome"
            ref="personName"
            v-model="person.name"
            :disabled="!canUpdate"
            autocomplete="nope"
            type="text"
            :placeholder="$t('informenome')"
          />
        </b-form-group>
      </b-col>

      <!-- PIS -->
      <b-col md="6" sm="12">
        <b-form-group label-for="user-pis">
          <template v-slot:label> PIS: </template>
          <b-form-input
            id="user-pis"
            v-model="person.pis"
            v-mask="'###.#####.##-#'"
            :disabled="!canUpdate"
            type="text"
            autocomplete="nope"
            :placeholder="$t('informepis')"
          />
        </b-form-group>
      </b-col>

      <!-- Birth date -->
      <b-col md="6" sm="12">
        <b-form-group label-for="pessoa-nascimento">
          <template v-slot:label>
            {{ $t('datanascimento') }} <span class="obrigatorio">*</span>:
          </template>
          <b-form-input
            id="pessoa-nascimento"
            v-model="birthDate"
            :disabled="!canUpdate"
            type="date"
            autocomplete="nope"
            :placeholder="$t('informedatanascimento')"
            :max="currentDate"
            @blur="validatesBirthDate"
          />
        </b-form-group>
      </b-col>

      <!-- Phone -->
      <b-col md="6" sm="12">
        <b-form-group label-for="pessoa-celular">
          <template v-slot:label>
            {{ $t('celular') }} <span class="obrigatorio">*</span>:
          </template>
          <vue-tel-input
            v-model="person.phone"
            :disabled="!canUpdate"
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
          </p>
        </b-form-group>
      </b-col>

      <!-- Father name -->
      <b-col md="6" sm="12">
        <b-form-group label-for="pessoa-nomepai">
          <template v-slot:label>
            {{ $t('nomepai') }} ({{ $t('opcional') }}):
          </template>
          <b-form-input
            id="pessoa-nomepai"
            v-model="person.fatherName"
            :disabled="!canUpdate"
            type="text"
            autocomplete="nope"
            :placeholder="$t('informenomepai')"
          />
        </b-form-group>
      </b-col>

      <!-- Mother name -->
      <b-col md="6" sm="12">
        <b-form-group label-for="pessoa-nomemae">
          <template v-slot:label>
            {{ $t('nomemae') }} ({{ $t('opcional') }}):
          </template>
          <b-form-input
            id="pessoa-nomemae"
            v-model="person.motherName"
            :disabled="!canUpdate"
            type="text"
            autocomplete="nope"
            :placeholder="$t('informenomemae')"
          />
        </b-form-group>
      </b-col>

      <!-- Email -->
      <b-col md="6" sm="12">
        <b-form-group label-for="pessoa-email">
          <template v-slot:label>
            {{ $t('email') }} ({{ $t('opcional') }}):
          </template>
          <b-form-input
            id="pessoa-email"
            v-model="person.email"
            :disabled="!canUpdate"
            type="text"
            autocomplete="nope"
            :placeholder="$t('informeemail')"
            @blur="validateEmailUniqueness"
          />
          <p v-if="duplicateEmailError" class="helper-text-error">
            {{ $t('duplicated_email') }}
          </p>
        </b-form-group>
      </b-col>

      <!-- Optin -->
      <b-col md="6" sm="12">
        <b-form-checkbox
          id="optin"
          v-model="person.optin"
          :disabled="!canUpdate"
          name="optin"
          switch
        >
          {{ $t('concordareceberwhatsappdaempresa') }}
        </b-form-checkbox>
      </b-col>
    </div>

    <!-- Custom fields -->
    <vue-form-generator :schema="personalSchema" :model="model" :options="formOptions" />

    <div v-if="canUpdate" class="person-fields mt-3">
      <b-col xs="12">
        <b-button
          class="save mb-3"
          variant="primary"
          :disabled="!isValidPerson || hasDuplicateContacts"
          @click="saveOrUpdatePerson"
        >
          <span v-if="person._id">{{ $t('salvar') }}</span>
          <span v-else>{{ $t('avancar') }}</span>
        </b-button>
      </b-col>
    </div>
  </div>
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
import { mapState, mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import { parseCustomData, checkHasDuplicatedContacts } from '@/services/person-service'
import { normalizeEmail, normalizePhone } from '@/utils/contact-normalizer'
import { hideLoader, showLoader } from '@/utils/loading'
import DMAlert from '@/components/DMAlert'
import { validCPF } from '@/utils/validate'
import * as storageService from '@/services/storage-service'

export default {
  name: 'RegistrationPersonalData',
  components: {
    'vue-form-generator': VueFormGenerator.component,
    DMAlert
  },

  data() {
    return {
      duplicateEmailError: false,
      duplicatePhoneError: false,
      personalSchema: { fields: [] },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateAsync: true
      },
      model: {},
      photoUrl: null,
      currentDate: moment.utc(new Date()).format('YYYY-MM-DD')
    }
  },

  computed: {
    ...mapState({
      person: (state) => state.registrationDataTabs.person,
      personBond: (state) => state.registrationDataTabs.personBond,
      screens: (state) => state.screens.screens,
      client: (state) => state.user.userClient
    }),
    ...mapGetters('contactDuplicates', ['hasDuplicates']),

    canUpdate() {
      return this.$can('manage', this.screens.consultCollaborators) &&
        (!this.personBond || !this.personBond.dismissalDate)
    },

    hasDuplicateContacts() {
      return this.duplicateEmailError || this.duplicatePhoneError
    },

    birthDate: {
      get() {
        if (this.person && this.person.birthDate) {
          return moment.utc(this.person.birthDate).format('YYYY-MM-DD').toString()
        }
        return ''
      },
      set(value) {
        if (this.person) this.person.birthDate = value
      }
    },

    newPhoto: {
      get() { return [] },
      set(value) { if (this.person) this.person.photo = value }
    },

    isValidPerson() {
      if (!this.person) return false
      if (!this.person.name || !this.person.document || !this.birthDate || !this.person.phone) return false
      let isValid = true
      this.personalSchema.fields.forEach((field) => {
        if (field.required && !this.model[field.model]) isValid = false
      })
      return isValid
    }
  },

  async created() {
    if (this.person) {
      if (Array.isArray(this.person.customFields)) {
        this.model = this.person.customFields[0] || {}
      }
      if (this.person.photo && typeof this.person.photo === 'string') {
        try {
          const { data } = await storageService.findById(this.person.photo)
          this.photoUrl = data.file
        } catch { this.photoUrl = null }
      }
    }
  },

  methods: {
    ...mapMutations('contactDuplicates', ['ADD_DUPLICATED_FIELD', 'REMOVE_DUPLICATED_FIELD', 'CLEAR_DUPLICATES']),

    countryChanged(country) {
      if (this.person) this.person.phoneCountry = country.iso2
    },

    onPhoneBlur() {
      this.validatePhoneUniqueness()
    },

    async validateEmailUniqueness() {
      this.duplicateEmailError = false
      this.REMOVE_DUPLICATED_FIELD('email')
      if (!this.person || !this.person.email || !this.client) return
      try {
        const normalized = normalizeEmail(this.person.email)
        const result = await checkHasDuplicatedContacts(normalized, null, this.client, this.person._id)
        if (result.hasDuplicate && result.duplicatedField === 'email') {
          this.duplicateEmailError = true
          this.ADD_DUPLICATED_FIELD('email')
        }
      } catch (error) {
        console.error('[ERROR VALIDATING EMAIL]', error)
      }
    },

    async validatePhoneUniqueness() {
      this.duplicatePhoneError = false
      this.REMOVE_DUPLICATED_FIELD('phone')
      if (!this.person || !this.person.phone || !this.client) return
      try {
        const normalized = normalizePhone(this.person.phone)
        const result = await checkHasDuplicatedContacts(null, normalized, this.client, this.person._id)
        if (result.hasDuplicate && result.duplicatedField === 'phone') {
          this.duplicatePhoneError = true
          this.ADD_DUPLICATED_FIELD('phone')
        }
      } catch (error) {
        console.error('[ERROR VALIDATING PHONE]', error)
      }
    },

    handleKeypress(event) {
      const regex = /^[a-zA-Z0-9\s]$/
      if (!regex.test(event.key)) event.preventDefault()
    },

    validatesBirthDate() {
      if (!this.birthDate) return
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

    validateDocument() {},

    onChangeDocument() {
      this.validateCPF()
    },

    validateCPF() {
      if (
        this.person.documentType === 'cpf' &&
        this.person.document &&
        !validCPF(this.person.document.replace(/[^\d]+/g, ''))
      ) {
        this.person.document = null
        this.$refs.dmAlert.alert({ message: this.$t('informeCPFvalido'), type: 'danger' })
      }
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
}
</style>
