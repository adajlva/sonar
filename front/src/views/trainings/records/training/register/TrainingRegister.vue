<template>
  <div class="quadro">
    <DMAlert ref="dmAlert" />
    <div class="quadro mt-1 mb-2 ml-3 mr-3">
      <b-card no-body>
        <b-tabs v-model="tabIndex" card fixed="top">
          <b-tab
            :title="$t('cadastro')"
            :title-link-class="linkClass(0)"
            @click="setCurrentTrainingsRegisterTabIndex(0)"
          >
            <DMPanel>
              <b-row style="align-items: end">
                <b-col>
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabelRequired label="nometreinamento" />
                    </template>
                    <b-form-input
                      ref="trainingName"
                      v-model="training.name"
                      type="text"
                      :placeholder="$t('nomedotreinamento')"
                      maxlength="500"
                      :disabled="!canBeChange"
                      @input="validateLength"
                      @blur="validateWhiteSpace('name')"
                    />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabelRequiredAndHelp
                        label="grade"
                        :text="
                          $t(
                            'vocedeveselecionaronivelnoqualotreinamentoseraalocado'
                          )
                        "
                      />
                    </template>
                    <Treeselect
                      v-model="training.newTrainingGrid"
                      :disabled="!canBeChange"
                      :options="grids"
                      :no-results-text="$t('nenhumresultadoencontrado')"
                      :no-options-text="$t('nenhumaopcaodisponivel')"
                      :no-children-text="$t('semsubopcoes')"
                      :flat="true"
                      :multiple="false"
                      :placeholder="
                        $t('cliqueparaselecionar') +
                          ' ' +
                          $t('umaoumais') +
                          ' ' +
                          $t('gradesmin')
                      "
                      :clearable="true"
                      :searchable="true"
                      :sort-value-by="'LEVEL'"
                      :normalizer="normalizer"
                    />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabelRequiredAndHelp
                        label="indicadorassociado"
                        :text="
                          $t(
                            'quaiskpismetricassaoimpactadospelarealizacaodestetreinamento'
                          )
                        "
                        :required="false"
                      />
                    </template>
                    <b-form-input
                      v-model="training.indicator"
                      type="text"
                      :placeholder="$t('descreveroindicador')"
                      :disabled="!canBeChange"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row style="align-items: end">
                <b-col>
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabelRequiredAndHelp
                        label="valordotreinamento"
                        :text="
                          $t(
                            'valormonetariorecursofinanceiroqueseraaplicadonestetreinamento'
                          )
                        "
                        :required="false"
                      />
                    </template>
                    <b-form-input
                      v-model="training.value"
                      v-money="money"
                      :disabled="!canBeChange"
                      type="text"
                      placeholder="0,00"
                    />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabelRequired label="anoreferencia" />
                    </template>
                    <b-form-select
                      v-model="training.referenceYear"
                      :disabled="!canBeChange"
                    >
                      <b-form-select-option :value="null" disabled selected>
                        {{ $t("selecioneoanoreferencia") }}
                      </b-form-select-option>
                      <b-form-select-option
                        v-for="(option, key) in yearOptions"
                        :key="key"
                        :value="option.value"
                      >
                        {{ option.text }}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row style="align-items: normal">
                <b-col md="4" sm="12">
                  <b-form-checkbox
                    v-model="training.isRequired"
                    switch
                    :disabled="!canBeChange"
                    class="ml-2 mb-1"
                  >
                    {{ $t("otreinamentoeobrigatorio") }}<br>
                  </b-form-checkbox>
                </b-col>
                <b-col md="8" sm="12" style="padding-left: 55px !important">
                  <b-form-checkbox
                    v-model="training.isRecurringPlanning"
                    switch
                    :disabled="isDaysAfterTheStart || !canBeChange"
                    class="ml-2 mb-1"
                    @input="recurringPlanningChanged"
                  >
                    {{ $t("planejamentorecorrente") }}<br>
                    <span style="font-weight: 100; font-size: small">{{
                      $t(
                        "marqueessaopcaoparatreinamentosqueacontecemdeformacontinua"
                      )
                    }}</span>
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row style="align-items: end; z-index: 1000">
                <b-col>
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabelRequired label="estrutura" />
                    </template>
                    <Treeselect
                      v-model="selectedUnities"
                      :disabled="!canBeChange"
                      :options="unitsHierarchy"
                      :no-results-text="$t('nenhumresultadoencontrado')"
                      :no-options-text="$t('nenhumaopcaodisponivel')"
                      :no-children-text="$t('semsubopcoes')"
                      :collapse-tags="true"
                      :placeholder="
                        $t('cliqueparaselecionar') +
                          ' ' +
                          $t('umaoumais') +
                          ' ' +
                          $t('estruturasmin')
                      "
                      :normalizer="normalizerUnity"
                      :clearable="true"
                      :searchable="true"
                      :flat="true"
                      :multiple="true"
                      :sort-value-by="'LEVEL'"
                      :auto-deselect-descendants="true"
                      :auto-select-descendants="true"
                      @input="filterSelectedPersonbonds()"
                    />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabelRequired label="tipoagendamento" />
                    </template>
                    <!-- select nativo: BFormSelect pode normalizar value das opções e quebrar v-if dos campos seguintes -->
                    <select
                      v-model="schedulingTypeModel"
                      class="custom-select"
                      :disabled="!canBeChange"
                      @change="setRecurringPlanning"
                    >
                      <option value="" disabled>
                        {{ $t("selecioneumtipodeagendamento") }}
                      </option>
                      <option
                        v-for="st in scheduleTypes"
                        :key="st.id"
                        :value="st.value"
                      >
                        {{ st.text }}
                      </option>
                    </select>
                  </b-form-group>
                </b-col>
                <b-col :key="'scheduling-detail-' + String(schedulingTypeModel)">
                  <b-form-group v-if="isSchedules">
                    <template v-slot:label>
                      <DMLabelRequired label="quantidadedeagendamentos" />
                    </template>
                    <select
                      v-model="qtdSchedulesModel"
                      class="custom-select"
                      :disabled="!canBeChange"
                    >
                      <option value="" disabled>
                        {{ $t("selecioneaquantidadedeagendamentos") }}
                      </option>
                      <option
                        v-for="(appointment, key) in appointments"
                        :key="key"
                        :value="appointment"
                      >
                        {{ appointment }}
                      </option>
                    </select>
                  </b-form-group>
                  <b-form-group v-if="isDaysAfterTheStart">
                    <template v-slot:label>
                      <DMLabelRequired
                        label="diasaposiniciodaprestacaodeservicos"
                      />
                    </template>
                    <b-form-input
                      v-model="training.qtdDaysAfterTheStartService"
                      :disabled="!canBeChange"
                      type="number"
                      :placeholder="$t('insiraaquantidadededias')"
                      min="0"
                      step="1"
                      @blur="numberValidate"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row style="align-items: end">
                <b-col md="6" sm="12" lg="6">
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabelRequired label="tipodevinculo" />
                    </template>
                    <multiselect
                      id="bondsMultiSelect"
                      ref="bondsMultiSelect"
                      v-model="selectedBonds"
                      :clear-on-select="false"
                      :close-on-select="true"
                      :multiple="true"
                      :options="bonds"
                      :placeholder="$t('selecioneumoumaistiposdevinculo')"
                      :preselect-first="false"
                      :preserve-search="true"
                      label="name"
                      track-by="_id"
                      :disabled="!canBeChange"
                      :select-label="$t('pressioneenterparaselecionar')"
                      :deselect-label="$t('presioneenterpararemover')"
                      :selected-label="$t('selecionado')"
                      @input="filterSelectedPersonbonds()"
                      @remove="(item) => itemRemoved(item, 'bond')"
                      @open="openMultiselect"
                    >
                      <template slot="beforeList">
                        <b-form-checkbox
                          v-model="allTypesOfBondsSelected"
                          class="ml-2 mt-2 mb-1"
                          @change="selectAllTypesOfBonds"
                        >{{ $t("marcartodos") }}
                        </b-form-checkbox>
                      </template>
                    </multiselect>
                  </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                  <b-form-group label-for="job-type">
                    <template v-slot:label>
                      <DMLabelRequired label="tiposcargos" />
                    </template>
                    <template>
                      <multiselect
                        id="positionTypeMultiSelect"
                        ref="positionTypeMultiSelect"
                        v-model="selectedPositionTypes"
                        :clear-on-select="false"
                        :close-on-select="true"
                        :multiple="true"
                        :disabled="!canBeChange"
                        :options="positionTypes"
                        :placeholder="
                          $t('selecione') +
                            ' ' +
                            $t('umoumais') +
                            ' ' +
                            $t('tiposcargosmin')
                        "
                        :preserve-search="true"
                        label="type"
                        track-by="_id"
                        :select-label="$t('pressioneenterparaselecionar')"
                        :deselect-label="$t('presioneenterpararemover')"
                        :selected-label="$t('selecionado')"
                        @input="filterSelectedPersonbonds()"
                        @remove="positionTypesRemoved"
                        @open="openMultiselect"
                      >
                        <template slot="beforeList">
                          <b-form-checkbox
                            id="check-all-positions-type"
                            v-model="allPositionTypesSelected"
                            class="ml-2 mt-2 mb-1"
                            @change="selectAllPositionTypes"
                          >{{ $t("marcartodos") }}
                          </b-form-checkbox>
                        </template>
                      </multiselect>
                    </template>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row style="align-items: end">
                <!-- cargo -->
                <b-col>
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabelRequired label="quaiscargosdevemparticipar" />
                    </template>
                    <multiselect
                      id="positionMultiSelect"
                      ref="positionMultiSelect"
                      v-model="selectedPositions"
                      :clear-on-select="false"
                      :close-on-select="true"
                      :multiple="true"
                      :options="positions"
                      :disabled="
                        selectedPositionTypes.length === 0 ||
                          positions.length === 0 ||
                          !canBeChange
                      "
                      :placeholder="
                        $t('selecione') +
                          ' ' +
                          $t('umoumais') +
                          ' ' +
                          $t('cargosmin')
                      "
                      :preselect-first="false"
                      :preserve-search="true"
                      label="name"
                      track-by="_id"
                      :select-label="$t('pressioneenterparaselecionar')"
                      :deselect-label="$t('presioneenterpararemover')"
                      :selected-label="$t('selecionado')"
                      @input="filterSelectedPersonbonds()"
                      @remove="(item) => itemRemoved(item, 'position')"
                      @open="openMultiselect"
                    >
                      <template slot="beforeList">
                        <b-form-checkbox
                          v-model="allPositionsSelected"
                          class="ml-2 mt-2 mb-1"
                          @change="selectAllPositions"
                        >{{ $t("marcartodos") }}
                        </b-form-checkbox>
                      </template>
                    </multiselect>
                  </b-form-group>
                </b-col>

                <!-- função -->
                <b-col>
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabel label="quaisfuncoesparticiparaodotreinamento" />
                    </template>

                    <multiselect
                      id="positionRolesMultiSelect"
                      ref="positionRolesMultiSelect"
                      v-model="selectedPositionRoles"
                      :clear-on-select="false"
                      :close-on-select="true"
                      :multiple="true"
                      :options="selectableRoles"
                      :disabled="
                        selectedPositions.length === 0 ||
                          selectableRoles.length === 0 ||
                          !canBeChange
                      "
                      :placeholder="
                        $t('selecione') +
                          ' ' +
                          $t('umoumais') +
                          ' ' +
                          $t('funcoesmin')
                      "
                      :preselect-first="false"
                      :preserve-search="true"
                      label="role"
                      track-by="_id"
                      :select-label="$t('pressioneenterparaselecionar')"
                      :deselect-label="$t('presioneenterpararemover')"
                      :selected-label="$t('selecionado')"
                      @input="filterSelectedPersonbonds()"
                      @remove="(item) => itemRemoved(item, 'role')"
                      @open="openMultiselect"
                    >
                      <template slot="beforeList">
                        <b-form-checkbox
                          v-model="allPositionRolesSelected"
                          class="ml-2 mt-2 mb-1"
                          :disabled="!canBeChange"
                          @change="selectAllPositionRoles"
                        >{{ $t("marcartodos") }}
                        </b-form-checkbox>
                      </template>
                    </multiselect>
                  </b-form-group>
                </b-col>

                <!-- colaboradores: só agendamento não recorrente (DMPeople) -->
                <b-col>
                  <b-form-group
                    v-if="!training.isRecurringPlanning"
                    label-for="file-grid"
                  >
                    <template v-slot:label>
                      <DMLabelRequired
                        label="quaiscolaboradoresparticiparaodotreinamento"
                      />
                    </template>

                    <autocomplete
                      ref="personAutocomplete"
                      :search="filterPeople"
                      :disabled="!isValidForSearchPeople || !canBeChange"
                      :debounce-time="500"
                      :placeholder="
                        $t('cliqueparaselecionar') +
                          ' ' +
                          $t('umoumais') +
                          ' ' +
                          $t('colaboradoresmin')
                      "
                      @submit="submit"
                    >
                      <template
                        #default="{
                          rootProps,
                          inputProps,
                          inputListeners,
                          resultListProps,
                          resultListListeners,
                          results,
                          resultProps,
                        }"
                      >
                        <div v-bind="rootProps">
                          <input
                            ref="input"
                            v-bind="inputProps"
                            v-on="inputListeners"
                          >

                          <ul
                            ref="resultList"
                            v-bind="resultListProps"
                            v-on="resultListListeners"
                          >
                            <li class="px-3 py-3">
                              <b-form-checkbox
                                v-model="toggleSelectAll"
                                @change="onToggleSelectAll"
                              >
                                {{ $t("marcartodos") }}
                              </b-form-checkbox>
                            </li>

                            <template v-for="(result, index) in results">
                              <slot
                                v-if="!result.hide && !result.disabled"
                                name="result"
                                :result="result"
                                :props="resultProps[index]"
                              >
                                <li
                                  :key="resultProps[index].id"
                                  v-bind="resultProps[index]"
                                >
                                  {{ getResultValue(result) }}
                                </li>
                              </slot>
                              <slot
                                v-if="result.disabled"
                                name="result"
                                :result="result"
                                :props="resultProps[index]"
                              >
                                <p :key="1" style="text-align: center">
                                  {{ result.text }}
                                </p>
                              </slot>
                            </template>
                          </ul>
                        </div>
                      </template>
                    </autocomplete>
                  </b-form-group>

                  <b-form-group
                    v-if="
                      training.isRecurringPlanning &&
                        training.type === 'schedules'
                    "
                    label-for="admitted-from"
                  >
                    <template v-slot:label>
                      <DMLabelRequired label="admitidosapartirde" />
                    </template>
                    <b-form-input
                      id="admitted-from"
                      v-model="training.admittedFrom"
                      v-limitInputDate
                      required
                      max="2099-12-31"
                      type="date"
                      :disabled="!canBeChange"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <DMSelectedPeopleView
                    v-model="selectedPersonbonds"
                    :disabled-delete-button="!canBeChange"
                    :can-remove-from-other-unity="false"
                    :unities="allUnities.map((u) => u.referenceId)"
                  />
                </b-col>
              </b-row>
              <b-row class="mt-3">
                <b-col>
                  <b-input-group-append>
                    <strong>{{
                      $t("contabilizarnomodulodeperformance")
                    }}</strong>
                    <b-form-checkbox
                      v-model="training.accountInPerformanceModule"
                      switch
                      :disabled="!canBeChange"
                      class="ml-2 mb-1"
                    />
                  </b-input-group-append>
                </b-col>
                <b-col v-if="isAdmin && training.accountInPerformanceModule">
                  <b-form-group label-for="account-for-performance-module">
                    <template v-slot:label>
                      <DMLabelRequired
                        label="indicadorcorrespondentenomodulodeperformance"
                      />
                    </template>
                    <Treeselect
                      v-model="training.correspondingIdInPerformanceModule"
                      name="estrutura"
                      :placeholder="$t('selecioneoindicador')"
                      :options="indicators"
                      :normalizer="indicatorNormalizer"
                      :sort-value-by="'LEVEL'"
                      :multiple="false"
                      :clearable="true"
                      :disabled="!canBeChange"
                      :no-results-text="$t('nenhumresultadoencontrado')"
                      :no-options-text="$t('nenhumaopcaodisponivel')"
                      :no-children-text="$t('semsubopcoes')"
                      :searchable="true"
                      :auto-select-descendants="false"
                      :auto-deselect-descendants="false"
                      @input="(v) => (value = v || null)"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row class="mt-3">
                <b-col md="6" sm="12" lg="6">
                  <b-form-group>
                    <template v-slot:label>
                      <DMLabelRequired label="objetivodotreinamento" />
                    </template>
                    <b-form-textarea
                      v-model="training.objective"
                      type="textarea"
                      :disabled="!canBeChange"
                      :placeholder="$t('descrevaoobjetivodotreinamento')"
                      :rows="6"
                      @blur="validateWhiteSpace('objective')"
                    />
                  </b-form-group>
                </b-col>
                <b-col md="6" sm="12" lg="6">
                  <DMFiles
                    v-if="isAdmin"
                    ref="certificate-file"
                    v-model="training.certificateTemplate"
                    :multiple="false"
                    :disabled="!canBeChange"
                    :files="files"
                    :can-show-file="true"
                    :label="
                      $t('templatecertificado') +
                        ' (' +
                        $t('somenteimagempng') +
                        ')'
                    "
                    accept=".png"
                    style="z-index: 0"
                    hide-after-input
                    :hide-placeholder="'templatecertificado'"
                    @remove="removeFile"
                    @input="submitFile(false)"
                  />

                  <b-form-group>
                    <template v-slot:label>
                      <DMLabel label="palavraschaverelacionadasaotreinamento" />
                    </template>
                    <b-input-group>
                      <b-form-input
                        v-model="keyword"
                        :disabled="!canBeChange"
                        :placeholder="$t('informepalavrachave')"
                        type="text"
                        maxlength="30"
                        style="z-index: 0"
                      />
                      <b-input-group-append style="z-index: 0">
                        <b-button
                          style="z-index: 0"
                          variant="primary"
                          :disabled="!canBeChange"
                          @click="addKeyWord"
                        ><b-icon
                          icon="plus-lg"
                          style="z-index: 0"
                        /></b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                  <div
                    v-if="training.keywords && training.keywords.length > 0"
                    class="font-weight-bold"
                  >
                    {{ $t("palavrasadicionadas") }}
                  </div>
                  <div class="palavras-chave">
                    <div v-for="(w, index) in training.keywords" :key="index">
                      <div class="mr-3">
                        {{ w }}
                        <b-icon
                          v-b-tooltip.hover.bottom
                          :title="$t('excluirpalavra')"
                          class="clicable"
                          icon="x-circle"
                          :disabled="!canBeChange"
                          variant="dark"
                          @click="removeKeyWord(index)"
                        />
                      </div>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <b-button
                v-if="!canBeChange"
                class="save mb-3 mt-3"
                variant="primary"
                @click="
                  setCurrentTrainingRecordsTabIndex(0);
                  goToTrainingList();
                "
              >{{ $t("voltar") }}</b-button>

              <b-button
                v-else
                class="save mb-3 mt-3"
                :disabled="$v.$invalid || !canBeChange"
                variant="primary"
                @click="saveOrUpdateTraining"
              >{{ $t("salvar") }}</b-button>
            </DMPanel>
          </b-tab>
          <b-tab
            :title="$t('planejamento')"
            :title-link-class="linkClass(1)"
            :disabled="!newTrainingRegister._id"
            @click="setCurrentTrainingsRegisterTabIndex(1)"
          >
            <TrainingPlaning v-if="newTrainingRegister._id" />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import DMAlert from '@/components/DMAlert'
import DMPanel from '@/components/DMPanel'
import DMLabel from '@/components/DMLabel'
import DMLabelRequiredAndHelp from '@/components/DMLabelRequiredAndHelp'
import DMSelectedPeopleView from '@/components/dmpeople/DMSelectedPeopleView'
import DMLabelRequired from '@/components/DMLabelRequired'
import TrainingPlaning from '@/views/trainings/records/training/planning/TrainingPlanning'

import { hideLoader, showLoader } from '@/utils/loading'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { mapActions, mapState, mapGetters } from 'vuex'
import { newTrainingGridService } from '@/services/new-training-grid-service'
import { getBondsByClient } from '@/services/bond-service'
import { positionTypeService } from '@/services/position-type-service'
import { getPositionsByClient } from '@/services/position-service'
import { positionRoleService } from '@/services/position-role-service'
import { unityService } from '@/services/unity-service'
import moment from 'moment'
import { getByFilterAndName } from '@/services/person-bond-service'
import DMFiles from '@/components/DMFiles'
import { required, requiredIf } from 'vuelidate/lib/validators'
import * as _ from 'lodash'
import { newTrainingTypes } from '@/views/trainings/utils/new-training-utils'

export default {
  name: 'TrainingRegister',
  components: {
    DMAlert,
    DMPanel,
    DMLabel,
    DMSelectedPeopleView,
    DMLabelRequired,
    DMLabelRequiredAndHelp,
    TrainingPlaning,
    DMFiles,
    Treeselect
  },
  props: {
    structures: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      toggleSelectAll: false,

      money: {
        decimal: ',',
        thousands: '.',
        precision: 2,
        masked: false /* doesn't work with directive */
      },
      training: {
        _id: '',
        name: '',
        referenceYear: null,
        objective: null,
        indicator: null,
        value: null,
        keywords: [],
        type: null,
        accountInPerformanceModule: false,
        isRecurringPlanning: false,
        isRequired: false,
        qtdDaysAfterTheStartService: null,
        createdByAdmin: false,
        qtdNewTrainingSchedules: null,
        certificateTemplate: {},
        newTrainingGrid: null,
        unities: null,
        bonds: null,
        positionTypes: null,
        positions: null,
        personBonds: [],
        positionRoles: null,
        correspondingIdInPerformanceModule: null,
        admittedFrom: null
      },
      unitsHierarchy: [],
      selectedUnities: [],
      originSelectedUnities: [],
      unitsByClient: [],

      bonds: [],
      selectedBonds: [],
      allTypesOfBondsSelected: false,

      positionTypes: [],
      selectedPositionTypes: [],
      allPositionTypesSelected: false,

      positions: [],
      selectedPositions: [],
      allPositionsSelected: false,

      positionRoles: [],
      selectedPositionRoles: [],
      allPositionRolesSelected: false,

      selectedPersonbonds: [],

      grids: [],
      indicators: [],

      files: [],
      acceptTypes: ['image/png'],

      tabIndex: 0,
      keyword: null,
      indicatorNormalizer(node) {
        return {
          id: node.id,
          label: node.nome,
          children: node.indicadores
        }
      },
      err: null
    }
  },
  validations() {
    return {
      training: {
        name: {
          required
        },
        newTrainingGrid: {
          required
        },
        type: {
          required
        },
        objective: {
          required
        },
        referenceYear: {
          required
        },
        admittedFrom: {
          required: requiredIf(
            () =>
              this.training.isRecurringPlanning &&
              this.training.type === 'schedules'
          )
        },
        correspondingIdInPerformanceModule: {
          required: requiredIf(() => this.training.accountInPerformanceModule)
        },
        qtdDaysAfterTheStartService: {
          required: requiredIf(
            () => this.training.type === 'days_after_the_start_service'
          )
        },
        qtdNewTrainingSchedules: {
          required: requiredIf(() => this.training.type === 'schedules')
        }
      },
      selectedUnities: {
        required
      },
      selectedBonds: {
        required
      },
      selectedPositionTypes: {
        required
      },
      selectedPositions: {
        required
      },
      selectedPersonbonds: {
        required: requiredIf(() => !this.training.isRecurringPlanning)
      }
    }
  },

  computed: {
    ...mapState({
      newTrainingRegister: (state) => state.newTrainingRegister.newTraining,
      position: (state) => state.position.position
    }),
    ...mapGetters(['userProfile', 'userClient', 'isMaster']),
    isAdmin() {
      return this.userProfile === 'admin_sistema'
    },

    errorMessage() {
      if (this.err === 'cannot_change_new_training_after_start_date') {
        return this.$t('naoepossivelatualizarpoisotreinamentojainiciou')
      }
      if (this.err === 'already_has_new_training') {
        return this.$t(
          'naoepossivelsalvarpoisjaexisteumtreinamentocomestenome'
        )
      }
      return this.$t('erroaosalvarregistro')
    },

    canBeChange() {
      if (
        this.$can('manage', this.$store.state.screens.screens.records) &&
        (this.isAdmin || !this.newTrainingRegister.createdByAdmin) &&
        !this.isStartedTraining(this.newTrainingRegister)
      ) {
        return true
      }
      return false
    },

    scheduleTypes() {
      return [
        {
          id: 1,
          text: this.$t('agendamentos'),
          value: newTrainingTypes.schedules
        },
        {
          id: 2,
          text: this.$t('diasaposiniciodaprestacaodeservicos'),
          value: newTrainingTypes.daysAfterTheStartService
        }
      ]
    },
    schedulingTypeModel: {
      get() {
        const t = this.training.type
        if (t === null || t === undefined || t === '') return ''
        return String(t)
      },
      set(v) {
        const next = v === '' || v == null ? null : String(v)
        this.$set(this.training, 'type', next)
      }
    },
    qtdSchedulesModel: {
      get() {
        const q = this.training.qtdNewTrainingSchedules
        if (q === null || q === undefined || q === '') return ''
        return q
      },
      set(v) {
        const next = v === '' || v == null ? null : Number(v)
        this.$set(this.training, 'qtdNewTrainingSchedules', next)
      }
    },
    allGrids() {
      const reduceGridsHierarchy = (grids, gridsHierarchy) => {
        grids.push(gridsHierarchy)
        const children = gridsHierarchy.children.reduce(
          reduceGridsHierarchy,
          []
        )
        grids.push(...children)
        return grids
      }

      return this.gridsHierarchy.reduce(reduceGridsHierarchy, [])
    },

    appointments() {
      const appointments = []
      for (let i = 1; i < 25; i++) {
        appointments.push(i)
      }
      return appointments
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

    isDaysAfterTheStart() {
      return this.training.type === newTrainingTypes.daysAfterTheStartService
    },

    isSchedules() {
      return this.training.type === newTrainingTypes.schedules
    },

    selectableRoles() {
      let roles = this.positionRoles
      if (this.selectedPositions.length > 0) {
        const positionRolesIds = this.selectedPositions
          .map((position) => position.roles)
          .flat()
          .map((role) => role._id)
        roles = roles.filter((role) => positionRolesIds.includes(role._id))
      }
      return roles
    },

    allUnities() {
      const roots = Array.isArray(this.unitsHierarchy)
        ? this.unitsHierarchy
        : this.unitsHierarchy
          ? [this.unitsHierarchy]
          : []
      const reduceUnitiesHierarchy = (unities, unityHierarchy) => {
        if (!unityHierarchy) return unities
        unities.push(unityHierarchy)
        const ch = unityHierarchy.children || []
        const nested = ch.reduce(reduceUnitiesHierarchy, [])
        unities.push(...nested)
        return unities
      }

      return roots.reduce(reduceUnitiesHierarchy, [])
    },

    allUnitiesByClient() {
      const roots = Array.isArray(this.unitsByClient)
        ? this.unitsByClient
        : this.unitsByClient
          ? [this.unitsByClient]
          : []
      const reduceUnitiesHierarchy = (unities, unityHierarchy) => {
        if (!unityHierarchy) return unities
        unities.push(unityHierarchy)
        const ch = unityHierarchy.children || []
        const nested = ch.reduce(reduceUnitiesHierarchy, [])
        unities.push(...nested)
        return unities
      }

      return roots.reduce(reduceUnitiesHierarchy, [])
    },

    isValidForSearchPeople() {
      return (
        this.selectedPositions &&
        this.selectedPositions.length &&
        this.selectedBonds &&
        this.selectedBonds.length &&
        this.selectedUnities &&
        this.selectedUnities.length
      )
    },

    isEdit() {
      return !!this.newTrainingRegister._id
    },

    colabsFromOtherUnities() {
      return this.selectedPersonbonds.filter(
        (personbond) =>
          !this.allUnities.map((u) => u.referenceId).includes(personbond.unity)
      )
    }
  },

  watch: {
    selectedBonds() {
      this.allTypesOfBondsSelected =
        this.selectedBonds.length === this.bonds.length
    },
    selectedPositionTypes(newTypes, oldTypes) {
      this.allPositionTypesSelected =
        this.selectedPositionTypes.length === this.positionTypes.length

      if (newTypes.length > oldTypes.length) {
        this.positions = []
      }
      this.fetchPositions()
    },
    selectedPositions() {
      this.allPositionsSelected =
        this.selectedPositions.length === this.positions.length
    },
    selectedPositionRoles() {
      this.allPositionRolesSelected =
        this.selectedPositionRoles.length === this.selectableRoles.length
    },
    selectableRoles(selectableRoles) {
      if (!this.selectedPositions.length) this.selectedPositionRoles = []
      const rolesIds = selectableRoles.map((role) => role._id)
      this.selectedPositionRoles = this.selectedPositionRoles.filter((role) =>
        rolesIds.includes(role._id)
      )
    }
  },

  async mounted() {
    try {
      showLoader()

      await Promise.all([
        this.fetchNewTrainingGrids(),
        this.fetchBonds(),
        this.fetchPositionsType(),
        this.fetchPositions(),
        this.fetchPositionRoles(),
        this.fetchUnitsHierarchy(),
        this.fetchUnitsByClient(),
        this.fetchIndicatorsFromPerformanceModule()
      ])
      if (this.newTrainingRegister._id) {
        await this.load(this.newTrainingRegister)
      }
    } finally {
      hideLoader()
    }
  },
  destroyed() {
    this.clear()
    this.goToTrainingList()
  },
  methods: {
    ...mapActions('trainingsTabs', ['setTabs']),
    ...mapActions('newTrainingRegister', ['clear']),
    ...mapActions('currentTraingRegisterTab', ['goToTrainingList']),

    ...mapActions('currentTrainingsRegisterTabIndex', [
      'setCurrentTrainingsRegisterTabIndex'
    ]),

    ...mapActions('currentTrainingRecordsTabIndex', [
      'setCurrentTrainingRecordsTabIndex'
    ]),

    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['bg-primary', 'text-light']
      } else {
        return ['bg-light', 'text-info2']
      }
    },

    showAlert(payload) {
      if (this.$refs.dmAlert) {
        this.$refs.dmAlert.alert(payload)
      }
      this.$emit('alert', payload)
    },

    async load(newTraining) {
      this.training = {
        _id: newTraining._id,
        name: newTraining.name,
        referenceYear: newTraining.referenceYear,
        objective: newTraining.objective,
        indicator: newTraining.indicator,
        value: newTraining.value,
        keywords: newTraining.keywords,
        type:
          newTraining.type == null || newTraining.type === ''
            ? null
            : String(newTraining.type),
        accountInPerformanceModule: newTraining.accountInPerformanceModule,
        isRecurringPlanning: newTraining.isRecurringPlanning,
        isRequired: newTraining.isRequired,
        qtdDaysAfterTheStartService: newTraining.qtdDaysAfterTheStartService,
        qtdNewTrainingSchedules: newTraining.qtdNewTrainingSchedules,
        certificateTemplate: newTraining.certificateTemplate,
        newTrainingGrid: newTraining.newTrainingGrid,
        correspondingIdInPerformanceModule:
          newTraining.correspondingIdInPerformanceModule,
        admittedFrom: newTraining.admittedFrom
          ? moment.utc(newTraining.admittedFrom).format('YYYY-MM-DD')
          : null
      }

      if (newTraining.certificateTemplate) {
        this.files = [newTraining.certificateTemplate]
      }

      const bonds = newTraining.bonds.map((t) => t._id || t)
      this.selectedBonds = this.bonds.filter((t) => bonds.includes(t._id))

      const types = newTraining.positionTypes.map((t) => t._id || t)
      this.selectedPositionTypes = this.positionTypes.filter((t) =>
        types.includes(t._id)
      )

      await this.fetchPositions()

      const positions = newTraining.positions.map((p) => p._id || p)
      this.selectedPositions = this.positions.filter((p) =>
        positions.includes(p._id)
      )

      const positionRoles = newTraining.positionRoles.map((p) => p._id || p)
      this.selectedPositionRoles = this.positionRoles.filter((p) =>
        positionRoles.includes(p._id)
      )

      this.selectedPersonbonds = newTraining.personBonds.filter(
        (p) => typeof p === 'object'
      )

      this.originSelectedUnities = newTraining.unities.filter(
        (u) => !this.allUnities.map((unity) => unity.referenceId).includes(u)
      )
      this.selectedUnities = newTraining.unities.filter((u) =>
        this.allUnities.map((unity) => unity.referenceId).includes(u)
      )
    },

    async saveOrUpdateTraining() {
      this.makeArraysForTraining()

      this.training.createdByAdmin = this.isAdmin

      const files =
        this.training.certificateTemplate &&
        !this.training.certificateTemplate.id
          ? this.training.certificateTemplate
          : null

      this.training.certificateTemplate = null

      if (this.isEdit && this.files && this.files[0] && this.files[0].id) {
        this.training.certificateTemplate = this.files[0]._id
      }

      this.training.qtdDaysAfterTheStartService = Number(
        this.training.qtdDaysAfterTheStartService
      )

      const newTraining = Object.assign({}, this.training)

      try {
        showLoader()

        const message = newTraining._id
          ? this.$t('treinamento') + ' ' + this.$t('atualizado')
          : this.$t('treinamento') + ' ' + this.$t('cadastrado')

        if (!newTraining._id) {
          delete newTraining._id
        }

        const { data: newTrainingSaved } = await this.$store.dispatch(
          'newTrainingRegister/save',
          newTraining
        )

        const pathFile = `new-training/${newTrainingSaved._id}/upload`
        if (!_.isEmpty(JSON.parse(JSON.stringify(files)))) {
          await this.$refs['certificate-file'].save({
            path: pathFile,
            files: [files]
          })
        }

        this.selectedPersonbonds = []
        this.selectedUnities = []

        await this.$store.dispatch('newTrainingRegister/load', {
          id: newTrainingSaved._id,
          options: { populate: 'personBonds certificateTemplate' },
          includesDeletedPersonBonds: true
        })

        await this.load(this.newTrainingRegister)

        this.showAlert( { message, type: 'success' })
      } catch (error) {
        this.err = error.response.data.message

        this.showAlert( { message: this.errorMessage, type: 'danger' })
        console.log({ error })
      } finally {
        hideLoader()
      }
    },

    makeArraysForTraining() {
      this.training.bonds = []
      this.training.positionTypes = []
      this.training.positions = []
      this.training.positionRoles = []
      this.training.personBonds = []
      this.training.unities = []

      this.selectedBonds.forEach((bond) => {
        this.training.bonds.push(bond._id)
      })
      this.selectedPositionTypes.forEach((pt) => {
        this.training.positionTypes.push(pt._id)
      })
      this.selectedPositions.forEach((p) => {
        this.training.positions.push(p._id)
      })
      this.selectedPositionRoles.forEach((pr) => {
        this.training.positionRoles.push(pr._id)
      })

      this.selectedPersonbonds.forEach((pb) => {
        this.training.personBonds.push(pb._id)
      })
      this.training.unities = this.allSelectedUnities()
    },

    allSelectedUnities() {
      return [
        ...new Set([
          ...this.allUnities
            .filter((h) => this.selectedUnities.includes(h.referenceId))
            .map((unity) => unity.referenceId),
          ...this.originSelectedUnities
        ])
      ]
    },

    async fetchBonds() {
      const { data } = await getBondsByClient(this.userClient)
      this.bonds = data
    },

    async fetchIndicatorsFromPerformanceModule() {
      /* Mock — árvore para Treeselect (indicatorNormalizer: id, nome, indicadores) */
      this.indicators = [
        {
          id: 'cat-sst',
          nome: 'Segurança e saúde no trabalho',
          indicadores: [
            { id: 'ind-sst-1', nome: 'Horas de treinamento SST / ano' },
            { id: 'ind-sst-2', nome: 'Aderência a treinamentos obrigatórios (%)' }
          ]
        },
        {
          id: 'cat-dev',
          nome: 'Desenvolvimento e performance',
          indicadores: [
            { id: 'ind-dev-1', nome: 'Certificações obtidas no período' },
            { id: 'ind-dev-2', nome: 'Nota média em avaliações de competência' }
          ]
        },
        {
          id: 'cat-eng',
          nome: 'Engajamento',
          indicadores: [
            { id: 'ind-eng-1', nome: 'Taxa de conclusão de trilhas EAD' }
          ]
        }
      ]
    },
    async fetchPositionsType() {
      const { data } = await positionTypeService.getByClient(this.userClient)
      this.positionTypes = data
    },

    async fetchPositions() {
      showLoader()
      const { data } = await getPositionsByClient(this.userClient)
      this.filterPositions(data)
      hideLoader()
    },

    async fetchPositionRoles() {
      const { data } = await positionRoleService.getByClient(this.userClient)
      this.positionRoles = data
    },

    async fetchUnitsHierarchy() {
      const { data } = await unityService.getTreeByHierarchy(this.userClient)
      this.unitsHierarchy = data
    },

    async fetchUnitsByClient() {
      const { data } = await unityService.getTreeByClient(this.userClient)
      this.unitsByClient = data
    },

    async filterPeople(input) {
      const bonds = []
      const positions = []
      const roles = []

      this.selectedBonds.forEach((bond) => {
        bonds.push(bond._id)
      })

      this.selectedPositions.forEach((pt) => {
        positions.push(pt._id)
      })

      this.selectedPositionRoles.forEach((p) => {
        roles.push(p._id)
      })
      const unities =
        this.selectedUnities && this.selectedUnities.length
          ? this.allUnities.filter((h) =>
            this.selectedUnities.includes(h.referenceId)
          )
          : this.allUnitiesByClient

      if (input) {
        input = input.trim()
      } else input = ''

      if (
        bonds &&
        bonds.length &&
        positions &&
        positions.length &&
        unities.map((unity) => unity.referenceId) &&
        unities.map((unity) => unity.referenceId).length
      ) {
        const { data } = await getByFilterAndName(
          this.userClient,
          20,
          1,
          input,
          {
            bonds,
            positions,
            roles,
            unities: unities.map((unity) => unity.referenceId)
          },
          'person._id person.name person.document admissionDate dismissalDate bond position unity role',
          this.selectedPersonbonds.map((participant) => participant._id)
        )

        if (data.docs.length) {
          this.toggleSelectAll = false
          return data.docs
        }

        this.toggleSelectAll = true
        return [
          { disabled: true, text: this.$t('nenhumcolaboradorencontrado') }
        ]
      }
      return []
    },

    filterPositions(positions = []) {
      const types = this.selectedPositionTypes.map((type) => type._id)

      if (positions.length === 0) {
        positions = this.positions
      }

      /* Sem tipo selecionado: mostrar todos os cargos (mock/API); com tipos: filtrar */
      if (!types.length) {
        this.positions = [...positions]
      } else {
        this.positions = positions.filter((position) =>
          types.includes(position.type ? position.type._id : '')
        )
      }

      this.selectedPositions = this.selectedPositions.filter((position) =>
        this.positions.map((p) => p._id).includes(position._id)
      )

      this.filterSelectedPersonbonds()
    },

    filterSelectedPersonbonds() {
      if (!this.selectedPersonbonds.length) return

      if (!this.canBeChange) return true

      const bonds = []
      const positions = []
      const roles = []

      this.selectedBonds.forEach((bond) => {
        bonds.push(bond._id)
      })
      if (!bonds.length) this.clearSelectedPersonbonds()

      this.selectedPositions.forEach((pt) => {
        positions.push(pt._id)
      })
      if (!positions.length) this.clearSelectedPersonbonds()
      const unities = this.allUnities
        .filter((h) => this.selectedUnities.includes(h.referenceId))
        .map((unity) => unity.referenceId)
      if (!unities.length && !this.originSelectedUnities.length) {
        this.clearSelectedPersonbonds()
      }

      this.selectedPositionRoles.forEach((p) => {
        roles.push(p._id)
      })

      this.selectedPersonbonds = this.selectedPersonbonds.filter(
        (personbond) => {
          const hasBond = bonds.includes(personbond.bond)
          if (!hasBond) return false
          const hasPosition = positions.includes(personbond.position)
          if (!hasPosition) return false
          const hasUnity =
            unities.includes(personbond.unity) ||
            !this.allUnities
              .map((u) => u.referenceId)
              .includes(personbond.unity)
          if (!hasUnity) return false

          if (roles.length) {
            const hasRole = roles.includes(personbond.role)
            if (!hasRole) return false
          }

          return true
        }
      )
    },

    normalizer(node) {
      return {
        id: node._id,
        label: node.name,
        children: node.children || []
      }
    },

    normalizerUnity(unity) {
      return {
        id: unity.referenceId,
        label: unity.monitoringEndDate
          ? unity.name + ` (${this.$t('unidadeinativa')})`
          : unity.name,
        children: unity.children || []
      }
    },

    async fetchNewTrainingGrids() {
      const { data } = await newTrainingGridService.getTreeByClient(
        this.userClient
      )

      const setDisabled = (grid) => {
        grid.isDisabled = !grid.allowTrainingsAtThisLevel

        if (grid.children && grid.children.length) {
          grid.children.map((child) => setDisabled(child))
        }

        return grid
      }

      const roots = Array.isArray(data) ? data : data ? [data] : []
      this.grids = roots.map((grid) => setDisabled(grid))
    },
    addKeyWord() {
      if (this.keyword) {
        this.training.keywords.push(this.keyword)
      }
      this.keyword = null
    },
    removeKeyWord(index) {
      this.training.keywords.splice(index, 1)
    },

    selectAllTypesOfBonds() {
      if (this.allTypesOfBondsSelected) {
        this.selectedBonds = []
        this.bonds.forEach((bond) => {
          this.selectedBonds.push(bond)
        })
      } else {
        this.selectedBonds.splice(0, this.selectedBonds.length)
        this.deselectAllTypesOfBonds()
      }
    },
    deselectAllTypesOfBonds() {
      if (this.selectedBonds && this.selectedBonds.length > 0) {
        this.selectedBonds.splice(0, this.selectedBonds.length)
        this.allTypesOfBondsSelected = false
      }
    },

    selectAllPositionTypes() {
      if (this.allPositionTypesSelected) {
        this.selectedPositionTypes = []
        this.positionTypes.forEach((position) => {
          this.selectedPositionTypes.push(position)
        })
      } else {
        this.selectedPositionTypes.splice(0, this.selectedPositionTypes.length)
        this.deselectAllPositionTypes()
      }
    },
    deselectAllPositionTypes() {
      if (this.selectedPositionTypes.length > 0) {
        this.selectedPositionTypes.splice(0, this.selectedPositionTypes.length)
        this.allPositionTypesSelected = false
      }
    },

    selectAllPositions() {
      if (this.allPositionsSelected) {
        this.selectedPositions = []
        this.positions.forEach((position) => {
          this.selectedPositions.push(position)
        })
      } else {
        this.selectedPositions.splice(0, this.selectedPositions.length)
        this.deselectAllPositions()
      }
    },
    deselectAllPositions() {
      if (this.selectedPositions.length > 0) {
        this.selectedPositions.splice(0, this.selectedPositions.length)
        this.allPositionsSelected = false
      }
    },

    selectAllPositionRoles() {
      if (this.allPositionRolesSelected) {
        this.selectedPositionRoles = []
        this.selectableRoles.forEach((position) => {
          this.selectedPositionRoles.push(position)
        })
      } else {
        this.selectedPositionRoles.splice(0, this.selectedPositionRoles.length)
        this.deselectAllPositionRoles()
      }
    },
    deselectAllPositionRoles() {
      if (this.selectedPositionRoles.length > 0) {
        this.selectedPositionRoles.splice(0, this.selectedPositionRoles.length)
        this.allPositionRolesSelected = false
      }
    },
    validateLength() {
      if (this.training.name && this.training.name.length >= 500) {
        this.showAlert( {
          message: this.$t('ocamponaopodetermaisque500caracteres'),
          type: 'danger'
        })
      }
    },
    validateWhiteSpace(field) {
      var regex = /\S/

      if (!regex.test(this.training[field])) {
        this.training[field] = null
      } else if (this.training[field]) {
        this.training[field] = this.training[field].trim()
      }
    },
    setRecurringPlanning() {
      if (this.isDaysAfterTheStart) {
        this.training.isRecurringPlanning = true
      }
    },
    recurringPlanningChanged() {
      if (this.training.isRecurringPlanning) this.clearSelectedPersonbonds()
    },
    clearSelectedPersonbonds() {
      this.selectedPersonbonds = []
    },
    submit(person) {
      this.onSelectPerson(person)
    },

    unselectAll() {
      this.selectedPersonbonds = this.selectedPersonbonds.filter(
        (personBond) => !this.selectedUnities.includes(personBond.unity)
      )
    },

    async selectAll() {
      showLoader()
      try {
        const bonds = []
        const positions = []
        const roles = []

        this.selectedBonds.forEach((bond) => {
          bonds.push(bond._id)
        })

        this.selectedPositions.forEach((pt) => {
          positions.push(pt._id)
        })

        this.selectedPositionRoles.forEach((p) => {
          roles.push(p._id)
        })
        const unities =
          this.selectedUnities && this.selectedUnities.length
            ? this.allUnities.filter((h) =>
              this.selectedUnities.includes(h.referenceId)
            )
            : this.allUnitiesByClient

        if (
          bonds &&
          bonds.length &&
          positions &&
          positions.length &&
          unities.map((unity) => unity.referenceId) &&
          unities.map((unity) => unity.referenceId).length
        ) {
          const { data } = await getByFilterAndName(
            this.userClient,
            null,
            null,
            '',
            {
              bonds,
              positions,
              roles,
              unities: unities.map((unity) => unity.referenceId)
            },
            'person._id person.name person.document admissionDate dismissalDate bond position unity role',
            this.selectedPersonbonds.map((participant) => participant._id)
          )

          const docs = data.docs != null ? data.docs : data
          for (const doc of docs) {
            this.submit(doc)
          }
        }
      } catch (e) {
        this.showAlert( {
          message: this.$t('errocarregarelegiveis'),
          type: 'danger'
        })
      } finally {
        hideLoader()
      }
    },

    async onToggleSelectAll(toggle) {
      if (toggle) {
        await this.selectAll()
      } else {
        this.unselectAll()
      }

      this.$refs.personAutocomplete.handleInput({
        target: { value: this.lastKeyword }
      })
    },

    onSelectPerson(bondSelected) {
      if (bondSelected) {
        if (
          !this.selectedPersonbonds.find(
            (bond) => bond._id === bondSelected._id
          )
        ) {
          this.selectedPersonbonds.push(bondSelected)
        }

        this.$refs.personAutocomplete.handleInput({
          target: { value: '' }
        })
      }
    },
    getResultValue(result) {
      return result.person.name + ' - ' + result.person.document
    },

    removeFile(index) {
      this.files.splice(index, 1)
      this.$refs['certificate-file'].clear()
    },

    validateTypeFile() {
      if (this.file && this.file.type !== 'image/png') {
        this.file = null
        this.textAlerta = this.$t('imageminvalida')
        this.dismissCountDownDanger = this.dismissSecs
      }
    },

    submitFile(byclear) {
      if (byclear) return

      if (
        !this.training.certificateTemplate ||
        !this.includesOnlyAcceptTypes()
      ) {
        this.showAlert( {
          message: this.$t('imageminvalida'),
          type: 'danger'
        })
        this.training.certificateTemplate = []
        this.$refs['certificate-file'].clear()

        setTimeout(() => {
          window.scrollTo(0, 0)
        }, 100)
      } else {
        this.files.push({
          _id: this.files.length + 1,
          originalName: this.training.certificateTemplate.name,
          type: this.training.certificateTemplate.type,
          file: URL.createObjectURL(this.training.certificateTemplate)
        })
      }
    },

    includesOnlyAcceptTypes() {
      const file = this.training.certificateTemplate
      if (file && file.type !== 'image/png') {
        return false
      }

      return true
    },

    isStartedTraining(newTraining) {
      if (!newTraining || !newTraining.schedules) return false

      if (newTraining.type === newTrainingTypes.daysAfterTheStartService) {
        return newTraining.schedules[0].newTrainingForm
      }

      return Boolean(
        newTraining.schedules.find((schedule) =>
          moment(new Date()).isAfter(moment(schedule.startDate))
        )
      )
    },
    positionTypesRemoved(item) {
      const { _id: itemId } = item

      const positionsByType = this.positions.filter((position) => {
        return position.type ? position.type._id === itemId : false
      })

      for (const positionByType of positionsByType) {
        const colabWithItemId = this.colabsFromOtherUnities.find(
          (colab) => colab.position === positionByType._id
        )

        if (colabWithItemId) {
          this.showAlert( {
            message: this.$t('vinculadoaumcolaboradordeoutraunidade'),
            type: 'danger'
          })

          this.selectedPositionTypes.push(item)
          return this.filterSelectedPersonbonds()
        }
      }

      this.filterPositions()
      this.filterSelectedPersonbonds()
    },
    itemRemoved(item, attr) {
      const { _id: itemId } = item

      const colabWithItemId = this.colabsFromOtherUnities.find(
        (colab) => colab[attr] === itemId
      )

      if (colabWithItemId) {
        this.showAlert( {
          message: this.$t('vinculadoaumcolaboradordeoutraunidade'),
          type: 'danger'
        })

        switch (attr) {
          case 'bond':
            this.selectedBonds.push(item)
            break
          case 'position':
            this.selectedPositions.push(item)
            break
          case 'role':
            this.selectedPositionRoles.push(item)
            break
        }

        this.filterSelectedPersonbonds()
      }
    },
    openMultiselect(id) {
      const multiselectRefs = [
        'positionRolesMultiSelect',
        'positionMultiSelect',
        'bondsMultiSelect',
        'positionTypeMultiSelect'
      ].filter((multi) => multi !== id)

      for (const multiselectRef of multiselectRefs) {
        this.$refs[multiselectRef].deactivate()
      }
    },

    numberValidate() {
      if (!Number.isInteger(this.training.qtdDaysAfterTheStartService)) {
        this.training.qtdDaysAfterTheStartService = Math.round(
          this.training.qtdDaysAfterTheStartService
        )
      }

      if (this.training.qtdDaysAfterTheStartService < 0) {
        this.training.qtdDaysAfterTheStartService = 0
      }
    }
  }
}
</script>

<style lang="css">
.close-tag {
  color: inherit;
  font-size: 125%;
  line-height: 1;
  float: none;
  margin-left: 0.25rem;
}
</style>
