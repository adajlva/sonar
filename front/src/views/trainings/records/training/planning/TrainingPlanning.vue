<template>
  <div class="quadro">
    <DMAlert ref="dmAlert" />

    <b-alert
      v-if="isScheduleType"
      show
      variant="warning"
      class="training-planning-max-schedules-alert mb-3"
    >
      <div class="d-flex align-items-start">
        <span class="training-planning-max-schedules-alert__badge">{{
          maxSchedulesFromCadastro
        }}</span>
        <div class="training-planning-max-schedules-alert__body">
          <div class="training-planning-max-schedules-alert__title">
            {{ $t("quantidademaximadeagendamentosinfo") }}
            <span class="training-planning-max-schedules-alert__emphasis">
              {{ maxSchedulesFromCadastro }}
              {{ $t("agendamentos").toLowerCase() }}
            </span>
          </div>
          <p class="mb-0 small text-muted">
            {{
              $t("vocepodecriaratéagendamentosparatreinamento", {
                count: maxSchedulesFromCadastro,
              })
            }}
          </p>
        </div>
      </div>
    </b-alert>

    <b-alert
      v-else-if="isDaysAfterServiceType"
      show
      variant="warning"
      class="training-planning-max-schedules-alert mb-3"
    >
      <div class="d-flex align-items-start">
        <span class="training-planning-max-schedules-alert__badge">{{
          pendingUnityRefsCount
        }}</span>
        <div class="training-planning-max-schedules-alert__body">
          <div class="training-planning-max-schedules-alert__title">
            {{ $t("diasaposplanejamentoalerttitulo") }}
          </div>
          <p class="mb-0 small text-muted">
            {{ $t("diasaposplanejamentoalerttexto") }}
          </p>
        </div>
      </div>
    </b-alert>

    <b-row>
      <b-col md="6" lg="6">
        <b-form-group>
          <template v-slot:label>
            <DMLabelRequired label="nometreinamento" />
          </template>
          <b-form-input
            ref="trainingName"
            v-model="training.name"
            disabled
            type="text"
          />
        </b-form-group>
      </b-col>
      <b-col
        v-if="isPlanningDmPeopleLayout"
        md="6"
        lg="6"
      >
        <b-form-group>
          <template v-slot:label>
            <DMLabelRequired label="estruturas" />
          </template>
          <multiselect
            id="planning-unities"
            :value="training.unities"
            :clear-on-select="false"
            :close-on-select="true"
            :multiple="true"
            :options="structureMultiselectOptions"
            :preserve-search="true"
            :disabled="!canEditPlanningUnities"
            label="name"
            track-by="referenceId"
            :placeholder="structureMultiselectPlaceholder"
            :select-label="$t('pressioneenterparaselecionar')"
            :deselect-label="$t('presioneenterpararemover')"
            :selected-label="$t('selecionado')"
            @input="nrOnPlanningUnitiesInput"
          >
            <template slot="beforeList">
              <b-form-checkbox
                v-model="nrAllPlanningStructuresSelected"
                class="ml-2 mt-2 mb-1"
                :disabled="!canEditPlanningUnities"
              >
                {{ $t("marcartodos") }}
              </b-form-checkbox>
            </template>
          </multiselect>
          <template v-if="isDaysAfterServiceType">
            <small
              class="form-text d-block mt-1"
              :class="
                pendingUnityRefsCount > 0 ? 'text-danger' : 'text-muted'
              "
            >{{ unidadesPendentesHelperText }}</small>
          </template>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6" lg="6">
        <b-form-group>
          <template v-slot:label>
            <DMLabel
              label="quaiscargosdevemparticipar"
              :show-two-points="false"
            />
            <multiselect
              id="planning-positions"
              v-model="training.positions"
              :clear-on-select="false"
              :close-on-select="true"
              :multiple="true"
              :options="training.positions"
              :preserve-search="true"
              disabled
              label="name"
              track-by="_id"
            />
          </template>
        </b-form-group>
      </b-col>
      <b-col md="6" lg="6">
        <b-form-group>
          <template v-slot:label>
            <DMLabel label="quaisfuncoesparticiparaodotreinamento" />
            <multiselect
              v-model="training.positionRoles"
              :clear-on-select="false"
              :close-on-select="true"
              :multiple="true"
              :options="training.positionRoles"
              :preselect-first="false"
              :preserve-search="true"
              disabled
              label="role"
              track-by="_id"
            />
          </template>
        </b-form-group>
      </b-col>
    </b-row>
    <div v-if="schedules">
      <template v-if="isPlanningDmPeopleLayout">
        <template v-if="nrFormScheduleKey !== null">
          <div
            v-for="{ planning, key } in nonRecurringPlanningSlice"
            :key="'nr-' + key"
            class="training-planning-nr-fields"
          >
            <b-row>
              <b-col
                v-if="!isDaysAfterServiceType"
                md="6"
                lg="6"
              >
                <b-form-group>
                  <template v-slot:label>
                    <DMLabelRequired label="dataprevistadeinicio" />
                  </template>
                  <b-form-input
                    ref="datainicio"
                    v-model="planning.startDate"
                    :disabled="!canBeChange(key)"
                    type="date"
                  />
                </b-form-group>
              </b-col>
              <b-col
                :md="isDaysAfterServiceType ? 12 : 6"
                :lg="isDaysAfterServiceType ? 12 : 6"
              >
                <b-form-group>
                  <template v-slot:label>
                    <DMLabel
                      v-if="isDaysAfterServiceType"
                      label="datatermino"
                    />
                    <DMLabelRequired
                      v-else
                      label="datadetermino"
                    />
                  </template>
                  <b-form-input
                    ref="datafim"
                    v-model="planning.endDate"
                    :disabled="!canBeChange(key)"
                    type="date"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6" lg="6">
                <b-form-group>
                  <template v-slot:label>
                    <DMLabelRequired
                      label="tempodeduracaodoagendamentoemminutos"
                    />
                  </template>
                  <b-form-input
                    ref="duracao"
                    v-model="planning.timeDuration"
                    :disabled="!canBeChange(key)"
                    :placeholder="$t('informeotempodeduracaoemmin')"
                    type="number"
                    @keydown="filterTimeInput"
                  />
                </b-form-group>
              </b-col>
              <b-col md="6" lg="6">
                <b-form-group>
                  <template v-slot:label>
                    <DMLabel label="indicarinstrutor" />
                  </template>
                  <b-form-input
                    ref="instrutor"
                    v-model="planning.instructor"
                    :disabled="!canBeChange(key)"
                    :placeholder="$t('digiteonomedoinstrutor')"
                    type="text"
                    @blur="validateWhiteSpace(key, 'instructor')"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6" lg="6">
                <b-form-group>
                  <template v-slot:label>
                    <DMLabelRequired label="checkderetencao" />
                  </template>
                  <b-form-select
                    v-model="planning.newTrainingEvaluation"
                    :disabled="!canBeChange(key)"
                  >
                    <b-form-select-option :value="null" disabled selected>
                      {{ $t("cliqueparaselecionarumaavaliacao") }}
                    </b-form-select-option>
                    <b-form-select-option
                      v-for="(option, evakey) in evaluations"
                      :key="evakey"
                      :value="option._id"
                    >
                      {{ option.name }}
                    </b-form-select-option>
                  </b-form-select>
                </b-form-group>
              </b-col>
              <b-col md="6" lg="6">
                <b-form-group>
                  <template v-slot:label>
                    <DMLabelRequired label="avaliacaodereacao" />
                  </template>
                  <b-form-select
                    v-model="planning.newTrainingForm"
                    :disabled="!canBeChange(key)"
                  >
                    <b-form-select-option :value="null" disabled selected>
                      {{ $t("cliqueparaselecionarumformulario") }}
                    </b-form-select-option>
                    <b-form-select-option
                      v-for="(option, formKey) in forms"
                      :key="formKey"
                      :value="option._id"
                    >
                      {{ option.name }}
                    </b-form-select-option>
                  </b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <template v-if="isNonRecurringSchedulesPlanning">
              <template
                v-if="isScheduleType && training.unities && training.unities.length > 1"
              >
                <div
                  v-for="unityOpt in training.unities"
                  :key="'plan-unityblock-' + planningUnityRefKey(unityOpt.referenceId)"
                  class="w-100"
                >
                  <b-row>
                    <b-col cols="12">
                      <b-form-group
                        :label-for="
                          'planning-person-autocomplete-' +
                            planningUnityRefKey(unityOpt.referenceId)
                        "
                      >
                        <template v-slot:label>
                          <span class="d-block font-weight-bold mb-1">
                            {{ $t('quaiscolaboradoresparticiparaodaunidadeprefix')
                            }}<span class="text-success">{{ unityOpt.name }}</span>{{
                              $t('quaiscolaboradoresparticiparaodaunidadesuffix')
                            }}<span class="text-danger"> *</span>
                          </span>
                        </template>
                        <autocomplete
                          :ref="'planAuto_' + planningUnityRefKey(unityOpt.referenceId)"
                          :get-result-value="planningAutocompleteGetResultValue"
                          :search="
                            (input) =>
                              filterPeoplePlanning(input, unityOpt.referenceId)
                          "
                          :disabled="
                            !isValidForPlanningPeopleSearch || !canBeChange(key)
                          "
                          :debounce-time="500"
                          :placeholder="
                            $t('cliqueparaselecionar') +
                              ' ' +
                              $t('umoumais') +
                              ' ' +
                              $t('colaboradoresmin')
                          "
                          @submit="
                            (p) =>
                              planningSubmitPerson(p, unityOpt.referenceId)
                          "
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
                                v-bind="inputProps"
                                v-on="inputListeners"
                              >
                              <ul
                                v-bind="resultListProps"
                                v-on="resultListListeners"
                              >
                                <li class="px-3 py-3">
                                  <b-form-checkbox
                                    @change="
                                      (checked) =>
                                        planningOnToggleSelectAll(
                                          checked,
                                          unityOpt.referenceId
                                        )
                                    "
                                  >
                                    {{ $t("marcartodos") }}
                                  </b-form-checkbox>
                                </li>
                                <template v-for="(result, ridx) in results">
                                  <li
                                    v-if="!result.hide && !result.disabled"
                                    :key="resultProps[ridx].id"
                                    v-bind="resultProps[ridx]"
                                  >
                                    {{ planningGetResultValue(result) }}
                                  </li>
                                  <p
                                    v-if="result.disabled"
                                    :key="'d-' + ridx"
                                    style="text-align: center"
                                  >
                                    {{ result.text }}
                                  </p>
                                </template>
                              </ul>
                            </div>
                          </template>
                        </autocomplete>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <DMSelectedPeopleView
                        :value="
                          personBondsForScheduleStructure(
                            planning,
                            unityOpt.referenceId
                          )
                        "
                        @input="
                          onPlanningBondsInputForUnity(
                            unityOpt.referenceId,
                            $event
                          )
                        "
                        :disabled-delete-button="!canBeChange(key)"
                        :can-remove-from-other-unity="false"
                        :unities="[unityOpt.referenceId]"
                      />
                    </b-col>
                  </b-row>
                </div>
              </template>
              <template v-else>
                <b-row>
                  <b-col cols="12">
                    <b-form-group label-for="planning-person-autocomplete">
                      <template v-slot:label>
                        <span
                          v-if="
                            training.unities &&
                              training.unities.length === 1 &&
                              training.unities[0].name
                          "
                          class="d-block font-weight-bold mb-1"
                        >
                          {{
                            $t('quaiscolaboradoresparticiparaodaunidadeprefix')
                          }}<span class="text-success">{{
                            training.unities[0].name
                          }}</span>{{ $t('quaiscolaboradoresparticiparaodaunidadesuffix')
                          }}<span class="text-danger"> *</span>
                        </span>
                        <DMLabelRequired
                          v-else
                          label="quaiscolaboradoresparticiparaodotreinamento"
                        />
                      </template>
                      <autocomplete
                        ref="planningPersonAutocomplete"
                        :get-result-value="planningAutocompleteGetResultValue"
                        :search="(input) => filterPeoplePlanning(input)"
                        :disabled="
                          !isValidForPlanningPeopleSearch || !canBeChange(key)
                        "
                        :debounce-time="500"
                        :placeholder="
                          $t('cliqueparaselecionar') +
                            ' ' +
                            $t('umoumais') +
                            ' ' +
                            $t('colaboradoresmin')
                        "
                        @submit="(p) => planningSubmitPerson(p)"
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
                              ref="planningPersonAutocompleteInput"
                              v-bind="inputProps"
                              v-on="inputListeners"
                            >
                            <ul
                              v-bind="resultListProps"
                              v-on="resultListListeners"
                            >
                              <li class="px-3 py-3">
                                <b-form-checkbox
                                  v-model="toggleSelectAllPlanning"
                                  @change="planningOnToggleSelectAll($event)"
                                >
                                  {{ $t("marcartodos") }}
                                </b-form-checkbox>
                              </li>
                              <template v-for="(result, idx) in results">
                                <li
                                  v-if="!result.hide && !result.disabled"
                                  :key="resultProps[idx].id"
                                  v-bind="resultProps[idx]"
                                >
                                  {{ planningGetResultValue(result) }}
                                </li>
                                <p
                                  v-if="result.disabled"
                                  :key="'d-' + idx"
                                  style="text-align: center"
                                >
                                  {{ result.text }}
                                </p>
                              </template>
                            </ul>
                          </div>
                        </template>
                      </autocomplete>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="12">
                    <DMSelectedPeopleView
                      v-model="planning.addedPersonBonds"
                      :disabled-delete-button="!canBeChange(key)"
                      :can-remove-from-other-unity="false"
                      :unities="
                        planningSelectedUnityRefs.length
                          ? planningSelectedUnityRefs
                          : allUnities.map((u) => u.referenceId)
                      "
                    />
                  </b-col>
                </b-row>
              </template>
            </template>
          </div>
        </template>
        <p
          v-else-if="schedules && schedules.length && nrFormScheduleKey === null"
          class="mb-3 text-secondary"
        >
          {{
            isDaysAfterServiceType
              ? $t("diasapospillsempendentes")
              : $t("todososagendamentosplanejados")
          }}
        </p>
      </template>
    </div>

    <b-button
      v-if="anyCanBeChange()"
      class="save mb-3 mt-3"
      variant="primary"
      :disabled="saveDisabled"
      @click="saveOrUpdateSchedules"
    >{{ $t("salvar") }}</b-button>

    <template v-if="isScheduleType && isPlanningDmPeopleLayout && schedules">
      <template v-if="structureCollapseSummaryGroups.length">
        <div
          v-for="group in structureCollapseSummaryGroups"
          :key="'sch-collapse-' + group.referenceId"
          class="training-planning-structure-accordion mb-2"
        >
          <div
            v-b-toggle="collapseElId(group.referenceId)"
            class="training-planning-structure-header"
          >
            <span class="training-planning-structure-header__title">{{
              structureCollapseTitle(group)
            }}</span>
            <span class="training-planning-structure-header__chevron"><b-icon icon="chevron-down" /></span>
          </div>
          <b-collapse
            :id="collapseElId(group.referenceId)"
            v-model="structureCollapseOpen[group.referenceId]"
          >
            <div class="training-planning-structure-panel training-planning-structure-panel--saved-only">
              <template v-for="idx in group.scheduleIndices">
                <div
                  v-if="nrShowSummaryCard(idx)"
                  :key="'sch-sum-' + group.referenceId + '-' + idx"
                  class="training-planning-summary-card mb-3"
                >
                  <div class="training-planning-summary-card__actions">
                    <b-button
                      v-b-tooltip.hover.bottom
                      :title="$t('editar')"
                      variant="outline-success"
                      class="training-planning-summary-card__icon-btn training-planning-summary-card__icon-btn--edit"
                      :disabled="!canBeChange(idx)"
                      @click="nrStartEditSchedule(idx)"
                    >
                      <b-icon icon="pencil" />
                    </b-button>
                    <b-button
                      v-b-tooltip.hover.bottom
                      :title="$t('excluir')"
                      variant="outline-danger"
                      class="training-planning-summary-card__icon-btn ml-1"
                      :disabled="!canBeChange(idx)"
                      @click="nrDeleteSchedule(idx, group.referenceId)"
                    >
                      <b-icon icon="trash" variant="danger" />
                    </b-button>
                  </div>
                  <div class="training-planning-summary-card__inner">
                    <h3 class="training-planning-summary-card__title">
                      {{ $t("agendamento") }} {{ scheduleOrdinalInGroup(group, idx) }}
                    </h3>
                    <div class="training-planning-summary-card__body">
                      <b-row>
                        <b-col md="6">
                          <strong>{{ $t("dataprevistadeiniciolabel") }}</strong>
                          {{ formatPlanningDateBr(schedules[idx].startDate) }}
                        </b-col>
                        <b-col md="6">
                          <strong>{{ $t("dataterminolabel") }}</strong>
                          {{ formatPlanningDateBr(schedules[idx].endDate) }}
                        </b-col>
                      </b-row>
                      <b-row class="mt-2">
                        <b-col md="6">
                          <strong>{{ $t("checkderetencaolabel") }}</strong>
                          {{ evaluationNameById(schedules[idx].newTrainingEvaluation) }}
                        </b-col>
                        <b-col md="6">
                          <strong>{{ $t("avaliacaodereacaolabel") }}</strong>
                          {{ formNameById(schedules[idx].newTrainingForm) }}
                        </b-col>
                      </b-row>
                      <b-row class="mt-2">
                        <b-col md="6">
                          <strong>{{ $t("tempodeduracaolabel") }}</strong>
                          {{ schedules[idx].timeDuration }} min
                        </b-col>
                        <b-col md="6">
                          <strong>{{ $t("instrutorlabel") }}</strong>
                          {{
                            schedules[idx].instructor &&
                              String(schedules[idx].instructor).trim()
                              ? schedules[idx].instructor.trim()
                              : $t("instrutornaoinformado")
                          }}
                        </b-col>
                      </b-row>
                      <template v-if="isNonRecurringSchedulesPlanning">
                        <p class="mb-1 mt-2">
                          <strong>{{ $t("pessoasparticipanteslabel") }}</strong>
                        </p>
                        <div>
                          <b-badge
                            v-for="(pb, pbi) in personBondsForScheduleStructure(schedules[idx], group.referenceId)"
                            :key="(pb._id || pbi) + '-sch-p'"
                            pill
                            variant="success"
                            class="mr-1 mb-1 training-planning-summary-person-badge"
                          >{{ personBondDisplayName(pb) }}</b-badge>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </b-collapse>
        </div>
      </template>
      <div
        v-else-if="nrRegisteredSchedulesCount < 1"
        class="training-planning-empty-state mb-3"
      >
        <p class="mb-1 font-weight-bold text-secondary">
          {{ $t("nenhumagendamentocadastradoainda") }}
        </p>
        <p class="mb-0 small text-muted">
          {{ $t("selecioneunidadepreenchadadosprimeiro") }}
        </p>
      </div>
    </template>

    <template v-if="isDaysAfterServiceType && isPlanningDmPeopleLayout && schedules">
      <div
        v-if="pendingUnityBadges.length"
        class="training-planning-pending-units mb-3"
      >
        <strong class="d-block text-secondary mb-2">{{
          $t("unidadespendentesplanejamentosecao")
        }}</strong>
        <div>
          <b-badge
            v-for="u in pendingUnityBadges"
            :key="u.referenceId"
            pill
            variant="secondary"
            class="mr-1 mb-1 training-planning-pending-badge"
          >{{ u.name }}</b-badge>
        </div>
      </div>
      <template v-if="nrRegisteredSchedulesCount > 0">
        <template v-for="(sch, idx) in schedules">
          <div
            v-if="nrShowSummaryCard(idx)"
            :key="'nr-sum-' + idx"
            class="training-planning-summary-card mb-3"
          >
            <div class="training-planning-summary-card__actions">
              <b-button
                v-b-tooltip.hover.bottom
                :title="$t('editar')"
                variant="outline-success"
                class="training-planning-summary-card__icon-btn training-planning-summary-card__icon-btn--edit"
                :disabled="!canBeChange(idx)"
                @click="nrStartEditSchedule(idx)"
              >
                <b-icon icon="pencil" />
              </b-button>
              <b-button
                v-b-tooltip.hover.bottom
                :title="$t('excluir')"
                variant="outline-danger"
                class="training-planning-summary-card__icon-btn ml-1"
                :disabled="!canBeChange(idx)"
                @click="nrDeleteSchedule(idx)"
              >
                <b-icon icon="trash" variant="danger" />
              </b-button>
            </div>
            <div class="training-planning-summary-card__inner">
              <h3 class="training-planning-summary-card__title">
                {{ $t("agendamento") }} {{ idx + 1 }}
              </h3>
              <div class="training-planning-summary-card__body">
                <p class="mb-2">
                  <strong>{{ $t("unidadeslabelresumo") }}</strong>
                  {{ sch.savedStructureLabels || nrUnityNamesFallback }}
                </p>
                <b-row v-if="!isDaysAfterServiceType">
                  <b-col md="6">
                    <strong>{{ $t("dataprevistadeiniciolabel") }}</strong>
                    {{ formatPlanningDateBr(sch.startDate) }}
                  </b-col>
                  <b-col md="6">
                    <strong>{{ $t("dataterminolabel") }}</strong>
                    {{ formatPlanningDateBr(sch.endDate) }}
                  </b-col>
                </b-row>
                <b-row v-else>
                  <b-col md="6">
                    <strong>{{ $t("dataterminolabel") }}</strong>
                    {{ formatPlanningDateBr(sch.endDate) }}
                  </b-col>
                </b-row>
                <b-row class="mt-2">
                  <b-col md="6">
                    <strong>{{ $t("checkderetencaolabel") }}</strong>
                    {{ evaluationNameById(sch.newTrainingEvaluation) }}
                  </b-col>
                  <b-col md="6">
                    <strong>{{ $t("avaliacaodereacaolabel") }}</strong>
                    {{ formNameById(sch.newTrainingForm) }}
                  </b-col>
                </b-row>
                <b-row class="mt-2">
                  <b-col md="6">
                    <strong>{{ $t("tempodeduracaolabel") }}</strong>
                    {{ sch.timeDuration }} min
                  </b-col>
                  <b-col md="6">
                    <strong>{{ $t("instrutorlabel") }}</strong>
                    {{
                      sch.instructor && String(sch.instructor).trim()
                        ? sch.instructor.trim()
                        : $t("instrutornaoinformado")
                    }}
                  </b-col>
                </b-row>
                <template v-if="!isDaysAfterServiceType">
                  <p class="mb-1 mt-2">
                    <strong>{{ $t("pessoasparticipanteslabel") }}</strong>
                  </p>
                  <div>
                    <b-badge
                      v-for="(pb, pbi) in sch.addedPersonBonds || []"
                      :key="(pb._id || pbi) + '-p'"
                      pill
                      variant="success"
                      class="mr-1 mb-1 training-planning-summary-person-badge"
                    >{{ personBondDisplayName(pb) }}</b-badge>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="training-planning-empty-state mb-3">
          <p class="mb-1 font-weight-bold text-secondary">
            {{ $t("nenhumagendamentocadastradoainda") }}
          </p>
          <p class="mb-0 small text-muted">
            {{ $t("selecioneunidadepreenchadadosprimeiro") }}
          </p>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import DMAlert from '@/components/DMAlert'
import DMLabel from '@/components/DMLabel'
import DMLabelRequired from '@/components/DMLabelRequired'
import { hideLoader, showLoader } from '@/utils/loading'
import { mapState, mapGetters, mapActions } from 'vuex'
import * as _ from 'lodash'
import { newTrainingEligibleService } from '@/services/new-training-eligible-service'
import { customFormService } from '@/services/custom-form-service'
import { customEvaluationService } from '@/services/custom-evaluation-service'
import { unityService } from '@/services/unity-service'
import { getPositionsByClient } from '@/services/position-service'
import { positionRoleService } from '@/services/position-role-service'
import { unitsMonitoredFilter } from '@/utils/unities-monitored-filter.js'
import DMSelectedPeopleView from '@/components/dmpeople/DMSelectedPeopleView'
import { getByFilterAndName } from '@/services/person-bond-service'
import { ensureSchedules } from '@/services/new-training-service'
import { required, minLength, requiredIf } from 'vuelidate/lib/validators'
import moment from 'moment'

export default {
  name: 'TrainingPlanning',
  components: {
    DMAlert,
    DMLabel,
    DMLabelRequired,
    DMSelectedPeopleView
  },

  data() {
    return {
      training: {
        name: '',
        unities: [],
        positionRoles: [],
        positions: []
      },
      eligibles: [],
      schedules: null,
      evaluations: [],
      forms: [],
      unitsHierarchy: [],
      err: null,
      toggleSelectAllPlanning: false,
      lastKeywordPlanning: '',
      nrEditingScheduleKey: null,
      nrSummarySavedIndices: [],
      structureCollapseOpen: {}
    }
  },
  validations() {
    const trainingRule = {
      unities: {
        required,
        minLength: minLength(1)
      }
    }
    if (this.isPlanningDmPeopleLayout) {
      return { training: trainingRule }
    }
    return {
      training: trainingRule,
      schedules: {
        $each: {
          startDate: {
            required: requiredIf(() => this.isScheduleType)
          },
          endDate: {
            required: requiredIf(() => this.isScheduleType)
          },
          timeDuration: {
            required
          },
          newTrainingForm: {
            required
          },
          newTrainingEvaluation: {
            required
          },
          addedPersonBonds: {
            required: requiredIf(
              () =>
                this.isScheduleType &&
                !this.newTrainingRegister.isRecurringPlanning
            ),
            minLength: minLength(1)
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      newTrainingRegister: (state) => state.newTrainingRegister.newTraining
    }),
    ...mapGetters(['userProfile', 'userClient', 'isMaster']),
    unitsHierarchyValid: function () {
      const refs = (this.training.unities || []).map((x) =>
        x && typeof x === 'object' ? x.referenceId : x
      )
      return unitsMonitoredFilter(refs, this.unitsHierarchy)
    },

    /** Estruturas permitidas = o que foi salvo no cadastro (pool fixo) */
    planningUnityOptions() {
      const allowed =
        this.newTrainingRegister.unitiesCadastro ||
        this.newTrainingRegister.unities ||
        []
      const flat = this.flattenUnityRoots(this.unitsHierarchy)
      return flat.filter((unity) => {
        if (!allowed.includes(unity.referenceId)) return false
        const ch = unity.children
        if (Array.isArray(ch) && ch.length > 0) return false
        return true
      })
    },

    planningSelectedUnityRefs() {
      return (this.training.unities || []).map((u) => u.referenceId)
    },

    canEditPlanningUnities() {
      if (!this.anyCanBeChange()) return false
      if (this.isPlanningDmPeopleLayout) {
        return this.nrFormScheduleKey !== null
      }
      return true
    },

    /** Tipo "dias após início da prestação de serviços" */
    isDaysAfterServiceType() {
      return (
        this.newTrainingRegister.type === 'days_after_the_start_service'
      )
    },

    /**
     * Layout DMPeople (um slot, resumos, pool de unidades): agendamentos ou dias após início.
     */
    isPlanningDmPeopleLayout() {
      return this.isScheduleType || this.isDaysAfterServiceType
    },

    isNonRecurringSchedulesPlanning() {
      return this.isScheduleType && !this.newTrainingRegister.isRecurringPlanning
    },

    /**
     * Resumos já salvos agrupados por estrutura (colapses após salvar — tipo agendamentos).
     */
    structureCollapseSummaryGroups() {
      if (!this.isScheduleType || !this.schedules) return []
      const groups = []
      for (const referenceId of this.cadastroUnityRefs) {
        const scheduleIndices = []
        this.schedules.forEach((s, i) => {
          if (!this.nrShowSummaryCard(i)) return
          const refs = Array.isArray(s.savedPlanningUnityRefs)
            ? s.savedPlanningUnityRefs
            : []
          if (refs.includes(referenceId)) {
            scheduleIndices.push(i)
          }
        })
        if (!scheduleIndices.length) continue
        const u = this.planningUnityOptions.find(
          (o) => o.referenceId === referenceId
        )
        groups.push({
          referenceId,
          structureName: u ? u.name : String(referenceId),
          scheduleIndices
        })
      }
      return groups
    },

    cadastroUnityRefs() {
      const c = this.newTrainingRegister.unitiesCadastro
      if (c && c.length) return c
      return this.newTrainingRegister.unities || []
    },

    plannedUnityRefsFromRegister() {
      return this.newTrainingRegister.plannedUnityRefs || []
    },

    /**
     * Unidades que já saem da lista “pendentes” na UI: persistidas no cadastro
     * (após Salvar) ou usadas num agendamento cujo rascunho já tem todos os
     * obrigatórios preenchidos (ainda sem salvar — não altera o backend).
     */
    nrEffectivelyPlannedUnityRefSet() {
      const set = new Set(this.plannedUnityRefsFromRegister)
      const k = this.nrFormScheduleKeyBase
      if (
        k != null &&
        this.schedules &&
        this.schedules[k] &&
        this.schedulePlanningRowComplete(this.schedules[k])
      ) {
        const selected = this.training.unities || []
        selected.forEach((u) => {
          if (u && u.referenceId != null) set.add(u.referenceId)
        })
      }
      return set
    },

    pendingUnityRefsCount() {
      const planned = this.nrEffectivelyPlannedUnityRefSet
      return this.cadastroUnityRefs.filter((ref) => !planned.has(ref)).length
    },

    unidadesPendentesHelperText() {
      return this.$t('unidadespendentesplanejamentohelper', {
        pendentes: this.pendingUnityRefsCount,
        total: this.cadastroUnityRefs.length
      })
    },

    pendingPlanningUnityOptions() {
      if (this.isScheduleType) {
        return this.planningUnityOptions.filter((o) => {
          if (!o || o.referenceId == null) return false
          const id = String(o.referenceId)
          const used = this.nrSavedScheduleCountByUnityRef[id] || 0
          return used < this.maxSchedulesFromCadastro
        })
      }
      const planned = this.nrEffectivelyPlannedUnityRefSet
      return this.planningUnityOptions.filter((o) => {
        if (!o || o.referenceId == null) return false
        return !planned.has(o.referenceId)
      })
    },

    /**
     * Por estrutura: quantos agendamentos já salvos (resumo) referenciam cada referenceId.
     * Usado para esconder estruturas no select quando atingem a quantidade máxima do cadastro.
     */
    nrSavedScheduleCountByUnityRef() {
      const counts = {}
      if (!this.isScheduleType || !this.schedules || !this.nrSummarySavedIndices) {
        return counts
      }
      for (const i of this.nrSummarySavedIndices) {
        const s = this.schedules[i]
        if (!s) continue
        const refs = Array.isArray(s.savedPlanningUnityRefs)
          ? s.savedPlanningUnityRefs
          : []
        for (const raw of refs) {
          const ref =
            raw != null && typeof raw === 'object' && raw.referenceId != null
              ? raw.referenceId
              : raw
          const key = ref != null ? String(ref) : ''
          if (!key) continue
          counts[key] = (counts[key] || 0) + 1
        }
      }
      return counts
    },

    structureMultiselectOptions() {
      const selectedRefs = new Set(
        (this.training.unities || [])
          .map((u) => u && u.referenceId != null && String(u.referenceId))
          .filter(Boolean)
      )
      const canSelectStructureOption = (o) => {
        if (!o || o.referenceId == null) return false
        if (!this.isScheduleType) return true
        const id = String(o.referenceId)
        if (selectedRefs.has(id)) return true
        const used = this.nrSavedScheduleCountByUnityRef[id] || 0
        return used < this.maxSchedulesFromCadastro
      }

      if (!this.isPlanningDmPeopleLayout) {
        if (!this.isScheduleType) return this.planningUnityOptions
        return this.planningUnityOptions.filter(canSelectStructureOption)
      }
      const pendingOpts = this.pendingPlanningUnityOptions.filter(
        canSelectStructureOption
      )
      const byRef = new Map(
        pendingOpts.map((o) => [String(o.referenceId), o])
      )
      for (const u of this.training.unities || []) {
        if (!u || u.referenceId == null) continue
        const id = String(u.referenceId)
        if (!byRef.has(id)) {
          const full = this.planningUnityOptions.find(
            (o) => String(o.referenceId) === id
          )
          if (full) byRef.set(id, full)
        }
      }
      const merged = [...byRef.values()]
      return merged.length
        ? merged
        : this.planningUnityOptions.filter(canSelectStructureOption)
    },

    structureMultiselectPlaceholder() {
      if (this.isPlanningDmPeopleLayout) {
        return this.$t('selecioneaunidade')
      }
      return (
        this.$t('selecione') +
        ' ' +
        this.$t('umaoumais') +
        ' ' +
        this.$t('estruturasmin')
      )
    },

    /**
     * Igual ao cadastro: “Marcar todos” na lista do multiselect (slot beforeList).
     */
    nrAllPlanningStructuresSelected: {
      get() {
        const opts = this.structureMultiselectOptions || []
        if (!opts.length) return false
        const selected = new Set(
          (this.training.unities || []).map((u) => u.referenceId)
        )
        return opts.every((o) => selected.has(o.referenceId))
      },
      set(checked) {
        this.nrOnToggleAllStructures(checked)
      }
    },

    pendingUnityBadges() {
      const planned = this.nrEffectivelyPlannedUnityRefSet
      return this.planningUnityOptions.filter(
        (o) => !planned.has(o.referenceId)
      )
    },

    maxSchedulesFromCadastro() {
      if (this.isDaysAfterServiceType) {
        const c =
          (this.cadastroUnityRefs && this.cadastroUnityRefs.length) || 0
        return Math.max(
          1,
          c,
          (this.schedules && this.schedules.length) || 1
        )
      }
      const n = Number(this.newTrainingRegister.qtdNewTrainingSchedules)
      if (n > 0) return n
      return Math.max(1, (this.schedules && this.schedules.length) || 1)
    },

    /**
     * Índice do slot ativo sem regra extra de “dias após” (evita ciclo com unidades pendentes).
     */
    nrFormScheduleKeyBase() {
      if (!this.isPlanningDmPeopleLayout || !this.schedules) return null
      if (this.nrEditingScheduleKey !== null) return this.nrEditingScheduleKey

      const slotOpen = (i) =>
        this.canBeChange(i) && !this.nrSummarySavedIndices.includes(i)

      const completeUnsaved = this.schedules.findIndex(
        (s, i) => slotOpen(i) && this.schedulePlanningRowComplete(s)
      )
      if (completeUnsaved >= 0) return completeUnsaved

      const firstIncomplete = this.schedules.findIndex(
        (s, i) => slotOpen(i) && !this.schedulePlanningRowComplete(s)
      )
      if (firstIncomplete >= 0) return firstIncomplete

      return null
    },

    /**
     * Índice do agendamento em edição (layout DMPeople).
     * Em dias após: slot vazio só enquanto houver unidades pendentes.
     */
    nrFormScheduleKey() {
      if (!this.isPlanningDmPeopleLayout || !this.schedules) return null
      if (this.nrEditingScheduleKey !== null) return this.nrEditingScheduleKey

      const slotOpen = (i) =>
        this.canBeChange(i) &&
        !this.nrSummarySavedIndices.includes(i) &&
        this.daysAfterSlotIsEligible(i)

      const completeUnsaved = this.schedules.findIndex(
        (s, i) => slotOpen(i) && this.schedulePlanningRowComplete(s)
      )
      if (completeUnsaved >= 0) return completeUnsaved

      const firstIncomplete = this.schedules.findIndex(
        (s, i) => slotOpen(i) && !this.schedulePlanningRowComplete(s)
      )
      if (firstIncomplete >= 0) return firstIncomplete

      return null
    },

    nonRecurringPlanningSlice() {
      const i = this.nrFormScheduleKey
      if (i === null || !this.schedules || !this.schedules[i]) return []
      return [{ planning: this.schedules[i], key: i }]
    },

    nrRegisteredSchedulesCount() {
      return (this.nrSummarySavedIndices && this.nrSummarySavedIndices.length) || 0
    },

    nrUnityNamesFallback() {
      return (this.training.unities || [])
        .map((u) => u.name)
        .filter(Boolean)
        .join(', ')
    },

    saveDisabled() {
      if (!this.schedules || !this.anyCanBeChange()) return true
      if (this.isPlanningDmPeopleLayout) {
        const k = this.nrFormScheduleKey
        if (k === null || !this.schedules[k]) return true
        const rowOk = this.schedulePlanningRowComplete(this.schedules[k])
        const tInv = this.$v.training && this.$v.training.$invalid
        return !rowOk || Boolean(tInv)
      }
      return this.$v.$invalid
    },

    bondIdsForPlanningSearch() {
      const b = this.newTrainingRegister.bonds || []
      return b
        .map((x) => (x && typeof x === 'object' ? x._id : x))
        .filter(Boolean)
    },

    positionIdsForPlanningSearch() {
      return (this.training.positions || [])
        .map((p) => (p && p._id) || p)
        .filter(Boolean)
    },

    roleIdsForPlanningSearch() {
      return (this.training.positionRoles || [])
        .map((r) => (r && r._id) || r)
        .filter(Boolean)
    },

    isValidForPlanningPeopleSearch() {
      if (!this.isNonRecurringSchedulesPlanning) return false
      return (
        this.bondIdsForPlanningSearch.length > 0 &&
        this.positionIdsForPlanningSearch.length > 0 &&
        this.planningSelectedUnityRefs.length > 0
      )
    },
    errorMessage() {
      if (this.err === 'cannot_change_new_training_schedule_after_is_started') {
        return this.$t('naoepossivelatualizarumagendamentojainiciado')
      }

      if (this.err === 'start_date_must_be_less_than_end_date') {
        return this.$t('datainicialmaiorouigualquefinal')
      }

      if (
        this.err ===
        'start_date_must_be_greater_than_previous_schedule_start_date'
      ) {
        return this.$t('dataagendamentosuperioraposterior')
      }

      return this.$t('erroaosalvarregistro')
    },
    isScheduleType() {
      return this.newTrainingRegister.type === 'schedules'
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
    }
  },

  async mounted() {
    try {
      showLoader()
      await Promise.all([
        this.fetchEligibles(),
        this.fetchForms(),
        this.fetchEvaluations(),
        this.fetchUnitsHierarchy()
      ])

      if (this.newTrainingRegister._id) {
        await this.loadItem(this.newTrainingRegister)
      }
    } finally {
      hideLoader()
    }
  },

  methods: {
    ...mapActions('newTrainingRegister', ['load', 'removePlannedUnityRefs']),

    showAlert(payload) {
      if (this.$refs.dmAlert) {
        this.$refs.dmAlert.alert(payload)
      }
      this.$emit('alert', payload)
    },

    collapseElId(ref) {
      return `plan-str-${String(ref).replace(/[^a-zA-Z0-9_-]/g, '_')}`
    },

    structureCollapseTitle(group) {
      const reg = this.structureRegisteredCount(group)
      const max = this.maxSchedulesFromCadastro
      return `${group.structureName} – ${reg}/${max} ${this.$t('agendamentos').toLowerCase()} cadastrados`
    },

    structureRegisteredCount(group) {
      return group.scheduleIndices.length
    },

    scheduleOrdinalInGroup(group, idx) {
      const i = group.scheduleIndices.indexOf(idx)
      return i >= 0 ? i + 1 : idx + 1
    },

    /** Abre colapses de resumo por estrutura na primeira carga (evita fechado sem modelo). */
    initSavedStructureCollapseOpen() {
      const refs = this.cadastroUnityRefs || []
      refs.forEach((r) => {
        if (this.structureCollapseOpen[r] === undefined) {
          this.$set(this.structureCollapseOpen, r, true)
        }
      })
    },

    /** Rascunho com qualquer dado preenchido (dias após: slot vazio exige unidades pendentes). */
    scheduleRowHasUsableDraft(s) {
      if (!s) return false
      return Boolean(
        s.startDate ||
        s.endDate ||
        (s.timeDuration != null &&
          String(s.timeDuration).trim() !== '' &&
          !Number.isNaN(Number(s.timeDuration))) ||
        s.newTrainingForm ||
        s.newTrainingEvaluation ||
        (s.instructor && String(s.instructor).trim()) ||
        (s.addedPersonBonds && s.addedPersonBonds.length)
      )
    },

    /**
     * Dias após: slot novo só enquanto houver unidades pendentes; demais tipos sempre elegíveis.
     */
    daysAfterSlotIsEligible(index) {
      if (!this.isDaysAfterServiceType) return true
      const s = this.schedules && this.schedules[index]
      if (!s) return false
      if (this.scheduleRowHasUsableDraft(s)) return true
      return this.pendingUnityRefsCount > 0
    },

    nrOnToggleAllStructures(checked) {
      if (!this.canEditPlanningUnities) return
      const opts = this.structureMultiselectOptions || []
      if (checked) {
        this.training.unities = opts.map((o) => ({ ...o }))
      } else {
        this.training.unities = []
      }
    },

    /**
     * Controla o multiselect sem v-model para, no tipo agendamentos, comparar com o valor
     * anterior e impedir incluir estrutura que já atingiu o máximo de agendamentos salvos.
     */
    nrOnPlanningUnitiesInput(value) {
      const list = Array.isArray(value) ? value : []
      if (!this.isScheduleType) {
        this.training.unities = list
        return
      }
      const max = this.maxSchedulesFromCadastro
      const counts = this.nrSavedScheduleCountByUnityRef
      const prev = this.training.unities || []
      const prevSet = new Set(
        prev.map((u) => (u && u.referenceId != null ? String(u.referenceId) : '')).filter(Boolean)
      )
      const next = list.filter((u) => {
        if (!u || u.referenceId == null) return false
        const id = String(u.referenceId)
        const used = counts[id] || 0
        if (used < max) return true
        return prevSet.has(id)
      })
      this.training.unities = next
    },

    serializeSchedulesForApi() {
      return _.cloneDeep(this.schedules).map((schedule) => {
        schedule.addedPersonBonds = schedule.addedPersonBonds.map(
          (personbond) => personbond._id
        )

        schedule.removedPersonBonds = schedule.removedPersonBonds.map(
          (personbond) => String(personbond)
        )
        schedule.timeDuration = Number(schedule.timeDuration)
        if (!schedule.startDate) schedule.startDate = null
        if (!schedule.endDate) schedule.endDate = null

        return schedule
      })
    },

    async saveOrUpdateSchedules() {
      try {
        showLoader()
        const nrSavedKey = this.isPlanningDmPeopleLayout
          ? this.nrFormScheduleKey
          : null
        const nrShouldRegisterCard =
          nrSavedKey != null &&
          this.schedules &&
          this.schedules[nrSavedKey] &&
          this.schedulePlanningRowComplete(this.schedules[nrSavedKey])

        if (this.isPlanningDmPeopleLayout) {
          const unityLabelStr = (this.training.unities || [])
            .map((u) => u.name)
            .filter(Boolean)
            .join(', ')
          if (nrShouldRegisterCard) {
            const refs = (this.training.unities || [])
              .map((u) => u.referenceId)
              .filter(Boolean)
            this.$set(
              this.schedules[nrSavedKey],
              'savedPlanningUnityRefs',
              refs
            )
            this.$set(
              this.schedules[nrSavedKey],
              'savedStructureLabels',
              unityLabelStr
            )
          }
        }
        const schedules = this.serializeSchedulesForApi()

        const lastSch = schedules[schedules.length - 1]
        const message =
          lastSch && lastSch.newTrainingForm
            ? this.$t('planejamento') + ' ' + this.$t('atualizado')
            : this.$t('planejamento') + ' ' + this.$t('cadastrado')

        await this.$store.dispatch('newTrainingRegister/saveSchedules', {
          _id: this.newTrainingRegister._id,
          schedules,
          unities: (this.training.unities || []).map((u) => u.referenceId)
        })

        if (this.isPlanningDmPeopleLayout && this.isScheduleType && this.schedules) {
          const padded = ensureSchedules(
            _.cloneDeep({
              ...this.newTrainingRegister,
              schedules: this.schedules
            })
          )
          const next = padded.schedules || []
          for (let i = this.schedules.length; i < next.length; i++) {
            const sch = _.cloneDeep(next[i])
            sch.removedPersonBonds = sch.removedPersonBonds || []
            sch.addedPersonBonds = sch.addedPersonBonds || []
            sch.startDate = sch.startDate ? sch.startDate.split('T')[0] : null
            sch.endDate = sch.endDate ? sch.endDate.split('T')[0] : null
            this.schedules.push(sch)
          }
        }

        this.showAlert( { message, type: 'success' })
        this.nrEditingScheduleKey = null
        if (this.newTrainingRegister._id) {
          if (!this.isPlanningDmPeopleLayout) {
            await this.loadItem(this.newTrainingRegister)
          }
        }
        if (
          nrShouldRegisterCard &&
          !this.nrSummarySavedIndices.includes(nrSavedKey)
        ) {
          this.nrMergeSavedSummaryIndex(nrSavedKey)
        }
        if (this.isPlanningDmPeopleLayout && nrShouldRegisterCard) {
          this.training.unities = []
        }
      } catch (error) {
        this.err =
          error.response &&
          error.response.data &&
          error.response.data.message

        this.showAlert( { message: this.errorMessage, type: 'danger' })
      } finally {
        hideLoader()
      }
    },
    async fetchEligibles() {
      const { data } = await newTrainingEligibleService.getByTraining(
        this.newTrainingRegister._id, true
      )
      this.eligibles = data
    },

    async fetchForms() {
      const { data } = await customFormService.getByClientModule(
        this.userClient,
        this.$store.state.modules.modules['integracaotreinamento'],
        { select: 'name _id' }
      )
      if (Array.isArray(data)) {
        this.forms = data
      } else if (data && Array.isArray(data.docs)) {
        this.forms = data.docs
      } else {
        this.forms = []
      }
    },

    async fetchEvaluations() {
      const { data } =
        await customEvaluationService.getByModuleAndClientWithoutPagination(
          this.userClient,
          this.$store.state.modules.modules['integracaotreinamento']
        )
      this.evaluations = data || []
    },

    async fetchUnitsHierarchy() {
      const { data } = await unityService.getTreeByHierarchy(this.userClient)
      this.unitsHierarchy = Array.isArray(data) ? data : data ? [data] : []
    },

    flattenUnityRoots(roots) {
      const arr = Array.isArray(roots) ? roots : roots ? [roots] : []
      const out = []
      const walk = (n) => {
        if (!n) return
        out.push(n)
        ;(n.children || []).forEach(walk)
      }
      arr.forEach(walk)
      return out
    },

    refIds(list) {
      if (!Array.isArray(list)) return []
      return list
        .map((x) => (x && typeof x === 'object' ? x._id : x))
        .filter(Boolean)
    },

    async resolvePositionsAndRolesFromCadastro() {
      const posIds = this.refIds(this.newTrainingRegister.positions)
      const roleIds = this.refIds(this.newTrainingRegister.positionRoles)

      const [{ data: allPositions = [] }, { data: allRoles = [] }] =
        await Promise.all([
          getPositionsByClient(this.userClient),
          positionRoleService.getByClient(this.userClient)
        ])

      this.training.positions = posIds
        .map((id) => allPositions.find((p) => p._id === id))
        .filter(Boolean)

      this.training.positionRoles = roleIds
        .map((id) => allRoles.find((r) => r._id === id))
        .filter(Boolean)
    },

    async loadItem(newTraining) {
      await this.load({
        id: newTraining._id,
        options: { populate: 'positions positionRoles' }
      })

      const paddedRegister = ensureSchedules(
        _.cloneDeep({
          ...this.newTrainingRegister,
          schedules: this.newTrainingRegister.schedules || []
        })
      )
      const schedules = paddedRegister.schedules || []
      this.training.name = this.newTrainingRegister.name

      await this.resolvePositionsAndRolesFromCadastro()

      const flatUnities = this.flattenUnityRoots(this.unitsHierarchy)
      if (this.isPlanningDmPeopleLayout) {
        this.training.unities = []
      } else {
        const activeRefs = this.newTrainingRegister.unities || []
        this.training.unities = flatUnities.filter((unity) =>
          activeRefs.includes(unity.referenceId)
        )
      }

      await this.fetchEligibles()

      this.schedules = schedules.map((schedule) => {
        schedule.removedPersonBonds = schedule.removedPersonBonds || []

        const persistedBondIds = (schedule.addedPersonBonds || [])
          .map((x) => (x && typeof x === 'object' ? x._id : x))
          .filter(Boolean)

        const fromEligibles = this.eligibles
          .filter((eligible) => {
            const links = eligible.schedules || []
            return links.some(
              (elgibleSchedule) =>
                elgibleSchedule.newTrainingSchedule === schedule._id
            )
          })
          .map((eligible) => {
            return {
              _id: eligible.personBond,
              person: eligible.person,
              unity: eligible.unity,
              newTrainingEligible: eligible
            }
          })

        const resolvedIds = new Set(
          fromEligibles.map((x) => x && x._id).filter(Boolean)
        )
        const stubs = persistedBondIds
          .filter((id) => !resolvedIds.has(id))
          .map((id) => ({ _id: id }))

        schedule.addedPersonBonds = [...fromEligibles, ...stubs]

        schedule.startDate = schedule.startDate
          ? schedule.startDate.split('T')[0]
          : null

        schedule.endDate = schedule.endDate
          ? schedule.endDate.split('T')[0]
          : null

        return schedule
      })

      if (this.isPlanningDmPeopleLayout) {
        // Só após dados vindos do backend: cartões = agendamentos já persistidos, não rascunho no formulário
        this.hydrateNrSummarySavedIndicesFromSchedules()
        this.nrEditingScheduleKey = null
        if (this.isScheduleType) {
          this.initSavedStructureCollapseOpen()
        }
      }
    },

    nrMergeSavedSummaryIndex(index) {
      if (index == null || index < 0) return
      if (this.nrSummarySavedIndices.includes(index)) return
      this.nrSummarySavedIndices = [...this.nrSummarySavedIndices, index].sort(
        (a, b) => a - b
      )
    },

    /**
     * Card de resumo só para agendamento efetivamente persistido pelo botão Salvar do planejamento.
     * `savedStructureLabels` é gravado imediatamente antes do dispatch (não existe em rascunho só no formulário).
     */
    nrScheduleHasPersistedPlanningSummary(s) {
      if (!s || !this.schedulePlanningRowComplete(s)) return false
      const lbl = s.savedStructureLabels
      return lbl != null && String(lbl).trim() !== ''
    },

    /**
     * Reconstrói índices dos cards após loadItem. Não usar “linha completa” como proxy de salvo.
     */
    hydrateNrSummarySavedIndicesFromSchedules() {
      if (!this.isPlanningDmPeopleLayout || !this.schedules) {
        this.nrSummarySavedIndices = []
        return
      }
      this.nrSummarySavedIndices = this.schedules
        .map((s, i) =>
          this.nrScheduleHasPersistedPlanningSummary(s) ? i : null
        )
        .filter((i) => i != null)
    },

    nrShowSummaryCard(index) {
      if (!this.schedules || !this.schedules[index]) return false
      return (
        this.nrSummarySavedIndices.includes(index) &&
        this.nrEditingScheduleKey !== index
      )
    },

    nrStartEditSchedule(index) {
      if (!this.canBeChange(index)) return
      this.nrEditingScheduleKey = index
    },

    nrDeleteSchedule(index, structureReferenceId = null) {
      if (!this.canBeChange(index) || !this.schedules || !this.schedules[index]) {
        return
      }
      const msg = this.$t('certezaexcluiragendamento')
      const go = async () => {
        const sch = this.schedules[index]
        const norm = (x) => (x == null ? '' : String(x))
        const rawRefs = Array.isArray(sch.savedPlanningUnityRefs)
          ? sch.savedPlanningUnityRefs
          : []
        const refs = rawRefs.map((r) =>
          r != null && typeof r === 'object' && r.referenceId != null
            ? r.referenceId
            : r
        )

        const removeOneStructure =
          this.isScheduleType &&
          structureReferenceId != null &&
          refs.length > 1 &&
          refs.some((r) => norm(r) === norm(structureReferenceId))

        if (removeOneStructure) {
          const target = norm(structureReferenceId)
          const nextRefs = refs.filter((r) => norm(r) !== target)
          const labelParts = nextRefs.map((rid) => {
            const u = this.planningUnityOptions.find(
              (o) => norm(o.referenceId) === norm(rid)
            )
            return u ? u.name : String(rid)
          })
          this.$set(sch, 'savedPlanningUnityRefs', nextRefs)
          this.$set(
            sch,
            'savedStructureLabels',
            labelParts.filter(Boolean).join(', ')
          )
          try {
            showLoader()
            const schedules = this.serializeSchedulesForApi()
            await this.$store.dispatch('newTrainingRegister/saveSchedules', {
              _id: this.newTrainingRegister._id,
              schedules,
              unities: (this.training.unities || []).map((u) => u.referenceId)
            })
            await this.removePlannedUnityRefs({
              _id: this.newTrainingRegister._id,
              refs: [structureReferenceId]
            })
            this.showAlert({
              message: this.$t('planejamento') + ' ' + this.$t('atualizado'),
              type: 'success'
            })
          } catch (error) {
            this.err =
              error.response &&
              error.response.data &&
              error.response.data.message
            this.showAlert({
              message: this.errorMessage,
              type: 'danger'
            })
          } finally {
            hideLoader()
          }
          this.fetchEligibles()
          return
        }

        const id = sch._id
        const removed = sch.removedPersonBonds || []
        const refsToRelease = Array.isArray(sch.savedPlanningUnityRefs)
          ? [...sch.savedPlanningUnityRefs]
          : []
        Object.assign(sch, {
          _id: id,
          startDate: null,
          endDate: null,
          timeDuration: null,
          newTrainingForm: null,
          newTrainingEvaluation: null,
          instructor: null,
          addedPersonBonds: [],
          removedPersonBonds: removed,
          savedStructureLabels: null,
          savedPlanningUnityRefs: null
        })
        this.nrSummarySavedIndices = this.nrSummarySavedIndices.filter(
          (i) => i !== index
        )
        this.nrEditingScheduleKey = null
        if (refsToRelease.length > 0 && this.newTrainingRegister._id) {
          try {
            await this.removePlannedUnityRefs({
              _id: this.newTrainingRegister._id,
              refs: refsToRelease
            })
          } catch (_e) {
            /* mock sempre resolve */
          }
        }
        this.fetchEligibles()
      }
      if (this.$bvModal && this.$bvModal.msgBoxConfirm) {
        this.$bvModal
          .msgBoxConfirm(msg, {
            title: this.$t('atencao'),
            okVariant: 'danger',
            okTitle: this.$t('sim'),
            cancelTitle: this.$t('cancelar'),
            centered: true
          })
          .then((v) => {
            if (v) go()
          })
      } else if (window.confirm(msg)) {
        go()
      }
    },

    formatPlanningDateBr(iso) {
      if (!iso) return '—'
      const m = moment(iso)
      return m.isValid() ? m.format('DD/MM/YYYY') : String(iso)
    },

    evaluationNameById(id) {
      if (!id) return '—'
      const f = this.evaluations.find((e) => e._id === id)
      return f ? f.name : id
    },

    formNameById(id) {
      if (!id) return '—'
      const f = this.forms.find((e) => e._id === id)
      return f ? f.name : id
    },

    personBondDisplayName(pb) {
      if (!pb) return '—'
      if (pb.person) {
        const p = pb.person
        return p.name || [p.firstName, p.lastName].filter(Boolean).join(' ')
      }
      const bondId = pb._id
      if (!bondId) return '—'
      const el = (this.eligibles || []).find(
        (e) =>
          e &&
          (e.personBond === bondId ||
            String(e.personBond) === String(bondId))
      )
      if (el && el.person) {
        const p = el.person
        return p.name || [p.firstName, p.lastName].filter(Boolean).join(' ')
      }
      return String(bondId)
    },

    planningGetResultValue(result) {
      if (!result.person) return ''
      return result.person.document
        ? `${result.person.name} - ${result.person.document}`
        : result.person.name
    },

    /**
     * Obrigatório para @trevoreyre/autocomplete-vue: o padrão é `result => result`,
     * o que coloca o objeto inteiro no input e exibe "[object Object]".
     */
    planningAutocompleteGetResultValue(result) {
      if (!result || result.disabled) return ''
      return this.planningGetResultValue(result)
    },

    planningUnityRefKey(ref) {
      return String(ref == null ? '' : ref).replace(/[^a-zA-Z0-9_-]/g, '_')
    },

    /** Colaboradores do vínculo cuja unidade coincide com a estrutura (resumo / blocos por empresa). */
    personBondsForScheduleStructure(schedule, structureReferenceId) {
      if (!schedule || structureReferenceId == null) return []
      const target = String(structureReferenceId)
      const bonds = schedule.addedPersonBonds || []
      return bonds.filter((pb) => {
        const r = this.planningBondUnityRef(pb)
        return r != null && String(r) === target
      })
    },

    onPlanningBondsInputForUnity(unityRef, newBonds) {
      const key = this.nrFormScheduleKey
      if (key == null || !this.schedules || !this.schedules[key]) return
      const planning = this.schedules[key]
      const target = String(unityRef)
      const rest = (planning.addedPersonBonds || []).filter((pb) => {
        const r = this.planningBondUnityRef(pb)
        return r == null || String(r) !== target
      })
      this.$set(planning, 'addedPersonBonds', [...rest, ...(newBonds || [])])
    },

    async filterPeoplePlanning(input, singleUnityRef = null) {
      const key = this.nrFormScheduleKey
      if (key === null || !this.schedules || !this.schedules[key]) return []

      const planning = this.schedules[key]
      const bonds = this.bondIdsForPlanningSearch
      const positions = this.positionIdsForPlanningSearch
      const roles = this.roleIdsForPlanningSearch
      const unities =
        singleUnityRef != null
          ? [singleUnityRef]
          : this.planningSelectedUnityRefs

      if (!bonds.length || !positions.length || !unities.length) {
        return []
      }

      let term = input != null ? String(input).trim() : ''
      this.lastKeywordPlanning = term

      const excluded = (planning.addedPersonBonds || []).map((p) => p._id)

      const { data } = await getByFilterAndName(
        this.userClient,
        20,
        1,
        term,
        { bonds, positions, roles, unities },
        'person._id person.name person.document admissionDate dismissalDate bond position unity role',
        excluded
      )

      if (data.docs && data.docs.length) {
        this.toggleSelectAllPlanning = false
        return data.docs
      }

      this.toggleSelectAllPlanning = true
      return [
        { disabled: true, text: this.$t('nenhumcolaboradorencontrado') }
      ]
    },

    planningSubmitPerson(person, autocompleteUnityRef) {
      const key = this.nrFormScheduleKey
      if (key === null || !person || !this.schedules) return

      const planning = this.schedules[key]
      if (!planning.addedPersonBonds) {
        this.$set(planning, 'addedPersonBonds', [])
      }
      if (!planning.addedPersonBonds.find((b) => b._id === person._id)) {
        planning.addedPersonBonds.push(person)
      }

      this.$nextTick(() => {
        if (autocompleteUnityRef != null) {
          const refName = 'planAuto_' + this.planningUnityRefKey(autocompleteUnityRef)
          const r = this.$refs[refName]
          const comp = Array.isArray(r) ? r[0] : r
          if (comp && typeof comp.handleInput === 'function') {
            comp.handleInput({ target: { value: '' } })
          }
        } else {
          const ref = this.$refs.planningPersonAutocomplete
          if (ref && typeof ref.handleInput === 'function') {
            ref.handleInput({ target: { value: '' } })
          }
        }
      })
    },

    async planningOnToggleSelectAll(toggleOrEvent, singleUnityRef = null) {
      const checked =
        typeof toggleOrEvent === 'boolean'
          ? toggleOrEvent
          : !!(
            toggleOrEvent &&
            toggleOrEvent.target &&
            toggleOrEvent.target.checked
          )
      if (checked) {
        await this.planningSelectAllPeople(singleUnityRef)
      } else {
        this.planningUnselectAllPeople(singleUnityRef)
      }
      const suffix =
        singleUnityRef != null ? this.planningUnityRefKey(singleUnityRef) : null
      this.$nextTick(() => {
        if (suffix != null) {
          const r = this.$refs['planAuto_' + suffix]
          const comp = Array.isArray(r) ? r[0] : r
          if (comp && typeof comp.handleInput === 'function') {
            comp.handleInput({
              target: { value: this.lastKeywordPlanning || '' }
            })
          }
        } else {
          const ref = this.$refs.planningPersonAutocomplete
          if (ref && typeof ref.handleInput === 'function') {
            ref.handleInput({
              target: { value: this.lastKeywordPlanning || '' }
            })
          }
        }
      })
    },

    planningBondUnityRef(pb) {
      if (!pb || pb.unity == null) return null
      const u = pb.unity
      if (typeof u === 'object' && u.referenceId != null) return u.referenceId
      return u
    },

    planningUnselectAllPeople(singleUnityRef = null) {
      const key = this.nrFormScheduleKey
      if (key === null || !this.schedules) return
      const planning = this.schedules[key]
      if (singleUnityRef != null) {
        const target = String(singleUnityRef)
        planning.addedPersonBonds = (planning.addedPersonBonds || []).filter(
          (pb) => String(this.planningBondUnityRef(pb)) !== target
        )
        return
      }
      const allowed = new Set(this.planningSelectedUnityRefs)
      planning.addedPersonBonds = (planning.addedPersonBonds || []).filter(
        (pb) => {
          const ref = this.planningBondUnityRef(pb)
          return ref != null && allowed.has(ref)
        }
      )
    },

    async planningSelectAllPeople(singleUnityRef = null) {
      const key = this.nrFormScheduleKey
      if (key === null || !this.schedules || !this.schedules[key]) return

      const planning = this.schedules[key]
      const bonds = this.bondIdsForPlanningSearch
      const positions = this.positionIdsForPlanningSearch
      const roles = this.roleIdsForPlanningSearch
      const unities =
        singleUnityRef != null
          ? [singleUnityRef]
          : this.planningSelectedUnityRefs

      if (!bonds.length || !positions.length || !unities.length) return

      showLoader()
      try {
        const excluded = (planning.addedPersonBonds || []).map((p) => p._id)
        const { data } = await getByFilterAndName(
          this.userClient,
          null,
          null,
          '',
          { bonds, positions, roles, unities },
          'person._id person.name person.document admissionDate dismissalDate bond position unity role',
          excluded
        )
        const docs = data.docs != null ? data.docs : data
        const clearRef =
          singleUnityRef != null ? singleUnityRef : undefined
        for (const doc of docs) {
          this.planningSubmitPerson(doc, clearRef)
        }
      } catch (e) {
        this.showAlert({
          message: this.$t('errocarregarelegiveis'),
          type: 'danger'
        })
      } finally {
        hideLoader()
      }
    },

    filterTimeInput(e) {
      const key = e.key

      if (
        key === '.' ||
        key === 'e' ||
        key === ',' ||
        key === '+' ||
        key === '-'
      ) {
        return e.preventDefault()
      }
    },
    validateWhiteSpace(index, field) {
      var regex = /\S/

      if (!regex.test(this.schedules[index][field])) {
        this.schedules[index][field] = null
      } else if (this.schedules[index][field]) {
        this.schedules[index][field] = this.schedules[index][field].trim()
      }
    },

    canBeChange(index) {
      if (!this.schedules || !this.schedules[index]) return false
      const storeSch =
        this.newTrainingRegister.schedules &&
        this.newTrainingRegister.schedules[index]
      if (!storeSch && !this.isPlanningDmPeopleLayout) return false

      if (!this.$can('manage', this.$store.state.screens.screens.records)) {
        return false
      }

      return true
    },

    anyCanBeChange() {
      return Boolean(
        this.schedules && this.schedules.find((s, i) => this.canBeChange(i))
      )
    },

    schedulePlanningRowComplete(s) {
      if (!s) return false
      const td = s.timeDuration
      if (
        td == null ||
        (typeof td === 'string' && !String(td).trim()) ||
        Number.isNaN(Number(td))
      ) {
        return false
      }
      if (!s.newTrainingForm || !s.newTrainingEvaluation) {
        return false
      }
      if (!this.isDaysAfterServiceType) {
        if (!s.startDate || !s.endDate) return false
      }
      // dias após: sem data prevista de início; data de término opcional
      if (
        this.isScheduleType &&
        !this.newTrainingRegister.isRecurringPlanning
      ) {
        if (!(s.addedPersonBonds && s.addedPersonBonds.length)) return false
        return true
      }
      return true
    }
  }
}
</script>

<style>
.planning {
  border: 1px solid #53933a !important;
  border-radius: 5px !important;
  box-shadow: 2px 2px 2px #c0c4cc !important;
  padding: 16px !important;
}

.title {
  size: 16px !important;
  color: #53933a !important;
  font-weight: bold !important;
}

.custom-title {
  font-family: "Poppins";
  size: 16px !important;
  color: #53933a !important;
  font-weight: bold !important;
}

.remove-header-border {
  border-bottom: none;
}

.training-planning-max-schedules-alert {
  border: 1px solid #f0ad4e !important;
  background-color: #fcf8e3 !important;
  color: #343434 !important;
}

.training-planning-max-schedules-alert__badge {
  flex-shrink: 0;
  min-width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: #f0ad4e;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-right: 1rem;
  font-size: 1rem;
}

.training-planning-max-schedules-alert__emphasis {
  color: #d9530f;
  font-weight: 700;
}

.training-planning-empty-state {
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  padding: 2rem 1.5rem;
  text-align: center;
  background: #fafafa;
}

.training-planning-pending-units {
  background: #fcf8e3;
  border: 1px solid #f0ad4e;
  border-radius: 6px;
  padding: 1rem 1.25rem;
}

.training-planning-pending-badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}

.training-planning-summary-card {
  position: relative;
  border: 1px solid #53933a;
  border-radius: 8px;
  background: #fff;
  padding: 1.25rem 1rem 1rem;
}

.training-planning-summary-card__actions {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  display: flex;
  align-items: flex-start;
  z-index: 1;
}

.training-planning-summary-card__inner {
  padding-right: 5.5rem;
}

.training-planning-summary-card__title {
  position: relative;
  display: inline-block;
  color: #53933a;
  font-size: 1.05rem;
  font-weight: 700;
  margin: -0.5rem 0 1rem;
  padding: 0 0.25rem 0 0;
  background: #fff;
}

.training-planning-summary-card__body {
  font-size: 0.9375rem;
  color: #343434;
}

.training-planning-summary-card__icon-btn {
  padding: 0.35rem 0.45rem;
}

.training-planning-summary-card__icon-btn--edit {
  border-color: #53933a !important;
  color: #53933a !important;
}

.training-planning-summary-card__icon-btn--edit:hover:not(:disabled) {
  background-color: #53933a !important;
  color: #fff !important;
}

.training-planning-summary-person-badge {
  font-weight: 500;
}

.training-planning-structure-accordion {
  border-radius: 8px;
  /* não usar overflow:hidden — recorta a lista do autocomplete de colaboradores */
  overflow: visible;
  position: relative;
  z-index: 1;
}

.training-planning-structure-accordion .collapse {
  overflow: visible !important;
}

.training-planning-structure-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
}

.training-planning-structure-header:hover {
  border-color: #c0c4cc;
}

.training-planning-structure-header__title {
  font-weight: 700;
  color: #212529;
  font-size: 0.95rem;
  padding-right: 0.75rem;
}

.training-planning-structure-header__chevron {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid #53933a;
  color: #53933a;
}

.training-planning-structure-panel {
  border: 1px solid #dcdcdc;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 1rem 1rem 1.25rem;
  margin-top: -1px;
  overflow: visible;
  position: relative;
  z-index: 1;
}

.training-planning-structure-panel .training-planning-nr-fields {
  overflow: visible;
  position: relative;
  z-index: 2;
}

/* Lista suspensa do autocomplete acima dos cartões e do próximo colapse */
.training-planning-structure-panel .autocomplete [role='listbox'],
.training-planning-structure-panel .autocomplete ul {
  z-index: 2000 !important;
}

</style>
