<template>
  <div class="quadro">
    <DMAlert ref="dmAlert" />

    <b-form>
      <div class="person-fields">
        <b-col md="6" sm="12">
          <b-form-group label-for="pessoa-pais">
            <template v-slot:label> {{ $t("pais") }}: </template>
            <autocomplete
              ref="autocompleteInput"
              auto-select
              autocomplete="nope"
              :search="searchCountry"
              :get-result-value="getCountryResult"
              :debounce-time="500"
              :disabled="!canUpdate"
              @submit="onSelectCountry"
            />
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="pessoa-codigopostal">
            <template v-slot:label> {{ $t("codigopostal") }}: </template>
            <b-form-input
              id="pessoa-codigopostal"
              ref="postalCode"
              v-model="person.postalCode"
              type="text"
              autocomplete="nope"
              :placeholder="$t('informecodigopostal')"
              :disabled="!canUpdate"
              @change="onChangePostalCode"
            />
          </b-form-group>
        </b-col>
      </div>

      <div class="person-fields">
        <b-col md="6" sm="12">
          <b-form-group label-for="pessoa-logradouro">
            <template v-slot:label> {{ $t("logradouro") }}: </template>
            <b-form-input
              id="pessoa-logradouro"
              v-model="person.street"
              type="text"
              autocomplete="nope"
              :placeholder="$t('informelogradouro')"
              :disabled="!canUpdate"
            />
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="pessoa-numero">
            <template v-slot:label> {{ $t("numero") }}: </template>
            <b-form-input
              id="pessoa-numero"
              v-model="person.number"
              type="text"
              autocomplete="nope"
              :placeholder="$t('informenumero')"
              :disabled="!canUpdate"
            />
          </b-form-group>
        </b-col>
      </div>

      <div class="person-fields">
        <b-col md="6" sm="12">
          <b-form-group label-for="pessoa-bairro">
            <template v-slot:label> {{ $t("bairro") }}: </template>
            <b-form-input
              id="pessoa-bairro"
              v-model="person.neighborhood"
              type="text"
              autocomplete="nope"
              :placeholder="$t('informebairro')"
              :disabled="!canUpdate"
            />
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="pessoa-cidade">
            <template v-slot:label> {{ $t("cidade") }}: </template>
            <b-form-input
              id="pessoa-cidade"
              v-model="person.city"
              type="text"
              autocomplete="nope"
              :placeholder="$t('informecidade')"
              :disabled="!canUpdate"
            />
          </b-form-group>
        </b-col>
      </div>

      <div class="person-fields">
        <b-col md="6" sm="12">
          <b-form-group label-for="pessoa-estado">
            <template v-slot:label> {{ $t("estado") }}: </template>
            <b-form-input
              id="pessoa-estado"
              v-model="person.state"
              type="text"
              autocomplete="nope"
              :placeholder="$t('informeestado')"
              :disabled="!canUpdate"
            />
          </b-form-group>
        </b-col>
      </div>

      <vue-form-generator :schema="socialSchema" :model="model" :options="formOptions" />

      <div v-if="canUpdate" class="person-fields mt-4">
        <b-col xs="12">
          <b-button
            variant="primary"
            class="save"
            :disabled="!isValidPerson"
            @click="saveOrUpdatePerson"
          >
            {{ $t("salvar") }}
          </b-button>
        </b-col>
      </div>
    </b-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { hideLoader, showLoader } from '@/utils/loading'
import { fieldService } from '@/services/field-service'
import * as utilsService from '@/services/utils-service'
import * as viacepService from '@/services/viacep-service'
import { parseCustomData } from '@/services/person-service'
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
import DMAlert from '@/components/DMAlert'
import Autocomplete from '@trevoreyre/autocomplete-vue'

export default {
  name: 'RegistrationSocialData',
  components: {
    DMAlert,
    Autocomplete,
    'vue-form-generator': VueFormGenerator.component
  },

  data() {
    return {
      fields: [],
      country: null,
      model: {},
      socialSchema: { fields: [] },
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
      screens: (state) => state.screens.screens
    }),

    canUpdate() {
      return this.$can('manage', this.screens.consultCollaborators) &&
        (!this.personBond || !this.personBond.dismissalDate)
    },

    isValidPerson() {
      let isValid = true
      this.socialSchema.fields.forEach((field) => {
        if (field.required && !this.model[field.model]) isValid = false
      })
      return isValid
    }
  },

  watch: {
    'person.country': function (newValue) {
      if (newValue) this.getDefaultCountry(newValue)
    }
  },

  async mounted() {
    showLoader()
    try {
      await this.fetchFields()
      this.getDefaultCountry(this.person && this.person.country)
      if (this.person && Array.isArray(this.person.customFields)) {
        this.model = this.person.customFields[1] || {}
      }
    } finally {
      hideLoader()
    }
  },

  methods: {
    ...mapActions('registrationDataTabs', ['gotoHome']),

    async saveOrUpdatePerson() {
      try {
        showLoader()
        this.model = parseCustomData(this.model, this.socialSchema)
        if (this.person) this.$set(this.person.customFields, 1, this.model)
        this.person.fieldReference = 'social'
        this.$refs.dmAlert.alert({ message: this.$t('pessoa') + ' ' + this.$t('atualizada'), type: 'success' })
      } catch (error) {
        console.error('[ERROR TO SAVE PERSON]', error)
        this.$refs.dmAlert.alert({ message: this.$t('erroaosalvarregistro'), type: 'danger', timer: 10 })
      } finally {
        hideLoader()
      }
    },

    async fetchFields() {
      try {
        const { data } = await fieldService.getByClient(this.$store.getters.userClient)
        this.fields = data.map((customField) => {
          customField.field.disabled = !this.canUpdate
          customField.field.readonly = !this.canUpdate
          return customField
        })
        this.socialSchema.fields = this.fields
          .filter((f) => f.reference === 'social')
          .map(({ field }) => field)
      } catch { this.socialSchema.fields = [] }
    },

    async searchCountry(input) {
      try {
        const { data } = await utilsService.getCountries(input)
        return data
      } catch { return [] }
    },

    async onSelectCountry(value) {
      if (this.person) this.person.country = value.internationalName
    },

    async getDefaultCountry(country) {
      if (this.$refs['autocompleteInput']) {
        this.$refs['autocompleteInput'].value = await utilsService.getCountryLabel(country)
      }
    },

    getCountryResult(country) {
      return utilsService.getCountryByLocale(country)
    },

    async onChangePostalCode(value) {
      try {
        const cep = value.replace(/[^\d]+/g, '')
        if (cep.length === 8) {
          const { data } = await viacepService.findByCEP(cep)
          if (this.person) {
            this.person.city = data.localidade
            this.person.state = data.uf
            this.person.neighborhood = data.bairro
            this.person.street = data.logradouro
          }
        }
      } catch {
        console.log('error to find postalCode')
      }
    }
  }
}
</script>
