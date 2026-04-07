<template>
  <div class="quadro">
    <div>
      <DMAlert ref="dmAlert" />

      <div class="mb-2 campo-obrigatorio ml-3">
        (<span class="obrigatorio">*</span>) {{ $t("camposobrigatorios") }}
      </div>
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
                :autofocus="true"
                :focus="true"
                :focused="true"
                :disabled="!isUserData"
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
                invalid-feedback="This field is required"
                :disabled="!isUserData"
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
                invalid-feedback="This field is required"
                :placeholder="$t('informelogradouro')"
                :disabled="!isUserData"
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
                invalid-feedback="This field is required"
                :placeholder="$t('informenumero')"
                :disabled="!isUserData"
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
                invalid-feedback="This field is required"
                :placeholder="$t('informebairro')"
                :disabled="!isUserData"
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
                invalid-feedback="This field is required"
                :placeholder="$t('informecidade')"
                :disabled="!isUserData"
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
                invalid-feedback="This field is required"
                :placeholder="$t('informeestado')"
                :disabled="!isUserData"
              />
            </b-form-group>
          </b-col>
        </div>
        <vue-form-generator
          :schema="socialSchema"
          :model="model"
          :options="formOptions"
          :disabled="!isUserData"
        />
        <div v-if="isUserData && !person.dismissalDate" class="person-fields">
          <b-col xs="12">
            <div>
              <span id="disabled-social-data-save" class="d-inline-block" tabindex="0">
                <b-button
                  class="save mb-3"
                  variant="primary"
                  :disabled="!isValidPerson"
                  @click="saveOrUpdatePerson"
                >{{ $t("salvar") }}</b-button>
              </span>
              <b-tooltip v-if="!isValidPerson" target="disabled-social-data-save">
                {{ $t("camposnaopreenchidos") }}
              </b-tooltip>
            </div>
          </b-col>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import DMAlert from '@/components/DMAlert'
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
import { mapState } from 'vuex'
import * as viacepService from '@/services/viacep-service'
import * as utilsService from '@/services/utils-service'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import { hideLoader, showLoader } from '@/utils/loading'
import { parseCustomData } from '@/services/person-service'

export default {
  name: 'SocialData',
  components: {
    'vue-form-generator': VueFormGenerator.component,
    Autocomplete,
    DMAlert
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      country: null,
      peoples: [],
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
      userPersonId: (state) => state.collaboratorDossierTabs.userPersonId,
      person: (state) => state.collaboratorDossierTabs.person
    }),

    isUserData() {
      return this.userPersonId === this.person._id
    },

    isValidPerson: function () {
      let isValid = true
      this.socialSchema.fields.forEach((field) => {
        if (field.required && !this.model[field.model]) {
          isValid = false
        }
      })
      return isValid
    }
  },
  watch: {
    fields: function () {
      if (this.fields.length > 0) this.fetchFields()
    },
    'person.country': function (newValue) {
      if (newValue) this.getDefaultCountry(newValue)
    }
  },
  created() {
    this.fetchFields()
    if (Array.isArray(this.person.customFields)) {
      this.model = this.person.customFields[1] || {}
    }
  },
  mounted() {
    this.getDefaultCountry(this.person.country)
  },
  methods: {
    async saveOrUpdatePerson() {
      try {
        showLoader()
        this.model = parseCustomData(this.model, this.socialSchema)
        this.$set(this.person.customFields, 1, this.model)
        this.person.fieldReference = 'social'
        this.$refs.dmAlert.alert({ message: this.$t('pessoa') + ' ' + this.$t('atualizada'), type: 'success' })
      } catch (error) {
        console.error('[ERROR TO SAVE PERSON]', error)
      } finally {
        hideLoader()
      }
    },

    fetchFields() {
      this.socialSchema.fields = this.fields
        .filter((f) => f.reference === 'social')
        .map(({ field }) => field)
    },

    async searchCountry(input) {
      try {
        const { data } = await utilsService.getCountries(input)
        return data
      } catch { return [] }
    },

    async onSelectCountry(value) {
      this.person.country = value.internationalName
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
          this.person.city = data.localidade
          this.person.state = data.uf
          this.person.neighborhood = data.bairro
          this.person.street = data.logradouro
        }
      } catch {
        console.log('error to find postalCode')
      }
    }
  }
}
</script>
