<template>
  <div class="quadro">
    <div>
      <DMAlert ref="dmAlert" />
      <div class="mb-2 campo-obrigatorio ml-3">
        (<span class="obrigatorio">*</span>) {{ $t("camposobrigatorios") }}
      </div>

      <div class="person-fields">
        <b-col md="6" sm="12">
          <b-form-group label-for="admission-date">
            <template v-slot:label>
              {{ $t("dataadmissao") }} <span class="obrigatorio">*</span>:
            </template>
            <b-form-input
              id="admission-date"
              ref="admissionDate"
              v-model="admissionDate"
              type="date"
              max="2099-12-31"
              :placeholder="$t('informedataadmissao')"
              invalid-feedback="This field is required"
              :disabled="admission._id !== null"
              @blur="validateAdmissionDate"
            />
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="admission-company">
            <template v-slot:label>
              {{ $t("empresa") }}:
            </template>
            <b-form-select
              id="admission-company"
              v-model="company"
              :disabled="admission._id !== null"
            >
              <template>
                <b-form-select-option
                  v-if="companies.length === 0"
                  :value="null"
                  :preselect-first="true"
                >
                  {{ $t("cadastre") }} {{ $t("uma") }} {{ $t("empresamin") }}
                </b-form-select-option>
                <b-form-select-option v-else value="" disabled>-- {{ $t("selecione") }} {{ $t("a") }} {{ $t("empresamin") }} --</b-form-select-option>
                <b-form-select-option
                  v-for="(comp, key) in companies"
                  :key="key"
                  :value="comp._id"
                >
                  {{ comp.tradeName }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="admission-unity">
            <template v-slot:label>
              {{ $t("estrutura") }} <span class="obrigatorio">*</span>:
            </template>
            <Treeselect
              v-model="admission.unity"
              :multiple="false"
              :options="unitsHierarchy"
              :placeholder="$t('cliqueparaselecionar') + ' ' + $t('a') + ' ' + $t('estruturamin')"
              :normalizer="normalizer"
              :clearable="true"
              :searchable="true"
              :sort-value-by="'LEVEL'"
              :disabled="admission._id !== null"
            />
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="admission-position">
            <template v-slot:label>
              {{ $t("cargo") }} <span class="obrigatorio">*</span>:
            </template>
            <b-form-select
              id="admission-position"
              v-model="admission.position"
              :disabled="admission._id !== null"
              @change="filterRoles(true)"
            >
              <template>
                <b-form-select-option v-if="positions.length === 0" :value="null" :preselect-first="true">
                  {{ $t("cadastre") }} {{ $t("um") }} {{ $t("cargomin") }}
                </b-form-select-option>
                <b-form-select-option v-else :value="null" disabled>-- {{ $t("selecione") }} {{ $t("o") }} {{ $t("cargomin") }} --</b-form-select-option>
                <b-form-select-option v-for="(p, key) in positions" :key="key" :value="p._id">
                  {{ p.name }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="admission-role">
            <template v-slot:label> {{ $t("funcao") }}: </template>
            <b-form-select
              id="admission-role"
              v-model="role"
              :disabled="admission._id !== null"
            >
              <template>
                <b-form-select-option v-if="filteredRoles.length === 0" value="" :preselect-first="true">
                  {{ $t("cadastre") }} {{ $t("uma") }} {{ $t("funcaomin") || $t("funcao") }}
                </b-form-select-option>
                <b-form-select-option v-else value="" disabled>-- {{ $t("selecione") }} {{ $t("a") }} {{ $t("funcaomin") || $t("funcao") }} --</b-form-select-option>
                <b-form-select-option v-for="(r, key) in filteredRoles" :key="key" :value="r._id">
                  {{ r.role }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="admission-salay">
            <template v-slot:label>
              {{ $t("salario") }} <span class="obrigatorio">*</span>:
            </template>
            <b-form-input
              id="admission-salay"
              v-model="admission.salary"
              type="number"
              step="0.01"
              required
              :placeholder="$t('informesalario')"
              :disabled="admission._id !== null"
            />
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="admission-workday">
            <template v-slot:label>
              {{ $t("jornadadetrabalho") }} <span class="obrigatorio">*</span>:
            </template>
            <b-form-select
              id="admission-workday"
              v-model="workday"
              :disabled="admission._id !== null"
            >
              <template>
                <b-form-select-option v-if="workdays.length === 0" :value="null" :preselect-first="true">
                  {{ $t("cadastre") }} {{ $t("uma") }} {{ $t("jornadamin") }} {{ $t("em") }} {{ $t("referencias") }} / {{ $t("jornadas") }}
                </b-form-select-option>
                <b-form-select-option v-else value="" disabled>
                  -- {{ $t("selecione") }} {{ $t("a") }} {{ $t("jornadamin") }} --
                </b-form-select-option>
                <b-form-select-option v-for="(w, key) in workdays" :key="key" :value="w._id">
                  {{ w.name }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="admission-bond">
            <template v-slot:label>
              {{ $t("vinculo") }} <span class="obrigatorio">*</span>:
            </template>
            <b-form-select
              id="admission-bond"
              v-model="bond"
              :disabled="admission._id !== null"
            >
              <template>
                <b-form-select-option v-if="bonds.length === 0" :value="null" :preselect-first="true">
                  {{ $t("cadastre") }} {{ $t("um") }} {{ $t("vinculomin") }} {{ $t("em") }} {{ $t("referencias") }} / {{ $t("vinculos") }}
                </b-form-select-option>
                <b-form-select-option v-else value="" disabled>-- {{ $t("selecione") }} {{ $t("o") }} {{ $t("vinculomin") }} --</b-form-select-option>
                <b-form-select-option v-for="(b, key) in bonds" :key="key" :value="b._id">
                  {{ b.name }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group label-for="admission-reason">
            <template v-slot:label>
              {{ $t("motivoadmissao") }} <span class="obrigatorio">*</span>:
            </template>
            <b-form-select
              id="admission-reason"
              v-model="admission.reason"
              :disabled="admission._id !== null"
            >
              <template>
                <b-form-select-option v-if="hiringGroups.length === 0" :value="null" :preselect-first="true">
                  {{ $t("cadastreummotivo") }}
                </b-form-select-option>
                <b-form-select-option v-else :value="null" disabled>-- {{ $t("selecione") }} {{ $t("a") }} {{ $t("motivomin") }} --</b-form-select-option>
                <b-form-select-option v-for="(group, key) in hiringGroups" :key="key" :value="group._id">
                  {{ group.name }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>

        <b-col md="6" sm="12">
          <b-form-group>
            <b-form-checkbox
              id="isLeadership"
              v-model="admission.isLeadership"
              name="isLeadership"
              :disabled="admission._id !== null"
            >
              {{ $t("lideranca") }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>
      </div>

      <!-- Custom fields -->
      <vue-form-generator
        :schema="functionalSchema"
        :model="model"
        :options="formOptions"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import { hideLoader, showLoader } from '@/utils/loading'
import DMAlert from '@/components/DMAlert'
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { unityService } from '@/services/unity-service'
import { companyService } from '@/services/company-service'
import { getBondsByClient } from '@/services/bond-service'
import { getWorkdaysByClient } from '@/services/workday-service'
import { positionRoleService } from '@/services/position-role-service'
import { getHiringGroupsByClient } from '@/services/hiring-group-service'
import { getSimplePositionsByClient } from '@/services/position-service'

export default {
  name: 'FunctionalData',
  components: {
    'vue-form-generator': VueFormGenerator.component,
    Treeselect,
    DMAlert
  },

  props: {
    fields: { type: Array, default: () => [] }
  },

  data() {
    return {
      hiringGroups: [],
      positions: [],
      unitsHierarchy: [],
      workdays: [],
      bonds: [],
      companies: [],
      roles: [],
      filteredRoles: [],
      admissionRole: null,
      model: {},
      functionalSchema: { fields: [] },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateAsync: true
      },
      normalizer(node) {
        return {
          id: node.referenceId,
          label: node.name,
          children: node.children || []
        }
      }
    }
  },

  computed: {
    ...mapState({
      person: state => state.collaboratorDossierTabs.person,
      userPersonId: state => state.collaboratorDossierTabs.userPersonId,
      admission: (state) => state.collaboratorDossierTabs.admission,
      screens: (state) => state.screens.screens
    }),
    ...mapGetters(['userClient']),

    admissionDate: {
      get() {
        if (this.admission && this.admission.admissionDate) {
          return moment.utc(this.admission.admissionDate).format('YYYY-MM-DD').toString()
        }
        return ''
      },
      set(value) {
        if (this.admission) this.admission.admissionDate = value
      }
    },

    company: {
      get() {
        const company = this.admission && this.admission.company ? this.admission.company : ''
        return typeof company === 'string' ? company : company._id
      },
      set(value) {
        if (this.admission) this.admission.company = value
      }
    },

    role: {
      get() {
        const role = this.admission && this.admission.role ? this.admission.role : ''
        return typeof role === 'string' ? role : role._id
      },
      set(value) {
        if (this.admission) this.admission.role = value
      }
    },

    workday: {
      get() {
        const workday = this.admission && this.admission.workday ? this.admission.workday : ''
        return typeof workday === 'string' ? workday : workday._id
      },
      set(value) {
        if (this.admission) this.admission.workday = value
      }
    },

    bond: {
      get() {
        const bond = this.admission && this.admission.bond ? this.admission.bond : ''
        return typeof bond === 'string' ? bond : bond._id
      },
      set(value) {
        if (this.admission) this.admission.bond = value
      }
    }
  },

  watch: {
    fields: function () {
      if (this.fields.length > 0) this.fetchFields()
    }
  },

  async created() {
    showLoader()
    await Promise.all([
      this.fetchBonds(),
      this.fetchWorkdays(),
      this.fetchUnitsHierarchy(),
      this.fetchPositions(),
      this.fetchCompanies(),
      this.fetchPositionRoles(),
      this.fetchHiringGroups()
    ])
    hideLoader()
    this.fetchFields()
    this.filterRoles(false)

    if (Array.isArray(this.admission && this.admission.customFields)) {
      this.model = this.admission.customFields[0] || {}
    }
  },

  methods: {
    async fetchUnitsHierarchy() {
      try {
        const { data } = await unityService.getTreeByHierarchy(this.userClient)
        this.unitsHierarchy = data
      } catch {
        this.unitsHierarchy = [
          { referenceId: 'unity-ref-1', name: 'AMBEV BRASIL', children: [
            { referenceId: 'unity-ref-2', name: 'AMBEV BRASIL - SP', children: [] },
            { referenceId: 'unity-ref-3', name: 'AMBEV BRASIL - RJ', children: [] }
          ] }
        ]
      }
    },
    async fetchPositions() {
      try {
        const { data } = await getSimplePositionsByClient(this.userClient, 'name')
        this.positions = data
      } catch {
        this.positions = [
          { _id: 'pos-1', name: 'Analista RH', roles: [{ _id: 'role-1', role: 'Analista RH Jr' }, { _id: 'role-1b', role: 'Analista RH Pl' }] },
          { _id: 'pos-2', name: 'Ajudante Distribuição', roles: [{ _id: 'role-2', role: 'Ajudante Distribuição I' }] },
          { _id: 'pos-3', name: 'Coordenador RH', roles: [{ _id: 'role-3', role: 'Coordenador RH Sr' }] },
          { _id: 'pos-4', name: 'Supervisor Operações', roles: [{ _id: 'role-4', role: 'Supervisor Operações Sr' }] }
        ]
      }
    },
    async fetchCompanies() {
      try {
        const { data } = await companyService.getByClient(this.userClient)
        this.companies = data
      } catch {
        this.companies = [
          { _id: 'comp-1', tradeName: 'ALLIS LOGÍSTICA' },
          { _id: 'comp-2', tradeName: 'DM PEOPLE SERVIÇOS' }
        ]
      }
    },
    async fetchPositionRoles() {
      try {
        const { data } = await positionRoleService.getByClient(this.userClient)
        this.roles = data
      } catch {
        this.roles = [
          { _id: 'role-1', role: 'Analista RH Jr', positionId: 'pos-1' },
          { _id: 'role-1b', role: 'Analista RH Pl', positionId: 'pos-1' },
          { _id: 'role-2', role: 'Ajudante Distribuição I', positionId: 'pos-2' },
          { _id: 'role-3', role: 'Coordenador RH Sr', positionId: 'pos-3' },
          { _id: 'role-4', role: 'Supervisor Operações Sr', positionId: 'pos-4' }
        ]
      }
    },
    async fetchHiringGroups() {
      try {
        const { data } = await getHiringGroupsByClient(this.userClient)
        this.hiringGroups = data
      } catch {
        this.hiringGroups = [
          { _id: 'reason-1', name: 'Necessidade Operacional' },
          { _id: 'reason-2', name: 'Expansão da Equipe' },
          { _id: 'reason-3', name: 'Substituição de Colaborador' }
        ]
      }
    },
    filterRoles(clearCurrentRole) {
      if (clearCurrentRole) {
        this.admissionRole = null
        this.role = ''
      }
      const position = this.positions.find(p => p._id === (this.admission && this.admission.position))
      this.filteredRoles = position && position.roles && position.roles.length > 0 ? position.roles : []
    },
    fetchFields() {
      this.functionalSchema.fields = this.fields
        .filter((f) => f.reference === 'functional')
        .map(({ field }) => field)
    },
    async fetchBonds() {
      try {
        const { data } = await getBondsByClient(this.userClient)
        this.bonds = data
      } catch {
        this.bonds = [
          { _id: 'bond-1', name: 'CLT' },
          { _id: 'bond-2', name: 'PJ' },
          { _id: 'bond-3', name: 'Temporário' }
        ]
      }
    },
    async fetchWorkdays() {
      try {
        const { data } = await getWorkdaysByClient(this.userClient)
        this.workdays = data
      } catch {
        this.workdays = [
          { _id: 'wd-1', name: '44h Semanais' },
          { _id: 'wd-2', name: '40h Semanais' },
          { _id: 'wd-3', name: '36h Semanais' }
        ]
      }
    },
    validateAdmissionDate() {
      const currentDate = new Date().getTime()
      const admissionDate = new Date(this.admissionDate)
      if (admissionDate.getTime() - currentDate > 0) {
        this.admissionDate = null
        this.$refs.dmAlert.alert({ message: this.$t('dataadmissaoinvalida'), type: 'danger' })
      } else if (admissionDate.getFullYear() < 1900) {
        this.admissionDate = null
        this.$refs.dmAlert.alert({ message: this.$t('dataanoinvalido'), type: 'danger' })
      }
    }
  }
}
</script>
