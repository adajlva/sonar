<template>
  <div class="poppins" style="margin-top: 40px">
    <DMAlert visible-class="mx-3 mb-4" />

    <div
      v-if="selectedFollow && selectedFollow.actions && selectedFollow.actions.length"
      style="width: 100%; text-align: center; margin: 20px 0 0 0; font-weight: bold;"
    >
      <DMLabelRequired two-points-before label="selecioneumfollow" class="mb-4" />

      <b-form-radio-group v-model="followIndex" class="mb-3">
        <b-form-radio
          v-for="(storageFollow, storageFollowIndex) in storageRollbackPlan.follows"
          :key="storageFollow._id"
          class="mx-5"
          :value="storageFollowIndex"
          :disabled="!canDoThisFollow(storageFollow)"
        >
          <span style="font-weight: 400 !important; max-width: 220px; text-align: center; font-weight: bold;">
            {{ ordinalSymbol(storageFollowIndex + 1) + $t("follow") }}
          </span>
        </b-form-radio>
      </b-form-radio-group>
    </div>

    <div v-if="selectedFollow && selectedFollow.actions && selectedFollow.actions.length">
      <div v-for="(action, n) in selectedFollow.actions" :key="n" class="accordion" role="tablist">
        <b-card no-body class="mb-1 border-0 shadow-none">
          <b-card-header header-tag="header" class="p-1 border-0" role="tab" style="background: white !important">
            <div v-if="action.status" style="overflow: scroll" class="d-flex flex-row justify-content-between">
              <div block class="accordion-button d-flex flex-row justify-content-between p-2 w-100 mr-2">
                <span />
                <span>{{ $t("acao") }} {{ n + 1 }}</span>
                <b-button v-b-toggle:[`accordion-${n}`] class="collapseButton d-flex flex-column justify-content-center align-items-center mx-2">
                  <b-icon class="when-open" style="color: #53933a; width: 12px; height: 12px" icon="chevron-up" />
                  <b-icon class="when-closed" style="color: #53933a; width: 12px; height: 12px" icon="chevron-down" />
                </b-button>
              </div>
              <span :style="`background:` + getStatusColor(action.status)" :class="'status-card status-card-' + action.status.toLowerCase()">
                {{ $t(getStatusTranslate(action.status)) }}
              </span>
            </div>
            <div v-else block class="accordion-button d-flex flex-row justify-content-between p-2 w-100">
              <span />
              <span>{{ $t("acao") }} {{ n + 1 }}</span>
              <b-button v-b-toggle:[`accordion-${n}`] class="collapseButton d-flex flex-column justify-content-center align-items-center mx-2">
                <b-icon class="when-open" style="color: #53933a; width: 12px; height: 12px" icon="chevron-up" />
                <b-icon class="when-closed" style="color: #53933a; width: 12px; height: 12px" icon="chevron-down" />
              </b-button>
            </div>
          </b-card-header>
          <b-collapse :id="'accordion-' + n" :visible="true" accordion="my-accordion" role="tabpanel" style="padding: 30px 0">
            <div style="border: 0">
              <div class="w-100 d-flex flex-column justify-content-start align-items-start px-3">
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("competencia") }}:</span> {{ action.competence }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("motivodaacao") }}:</span> {{ $t(i18nActionReason[action.reason]) }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("tipodaacao") }}:</span> {{ $t(i18nActionType[action.type]) }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("porquefazeressaacao") }}:</span> {{ action.justification }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("desenvolverpontencializarcompetencia") }}:</span> {{ action.whatToDo }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("comorealizaracao") }}:</span> {{ action.howToDo }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("quempodeajudar") }}:</span> {{ action.whoCanHelpToDo }}</p>
                <p class="field-value">
                  <span class="field-name" style="font-weight: bold">{{ $t("datadaacao") }}:</span>
                  {{ getActionStart(action, n) }} {{ $t("ate") }} {{ getActionEnd(action, n) }}
                </p>
              </div>
            </div>
          </b-collapse>
        </b-card>
      </div>
    </div>

    <div v-else>
      <div v-for="(action, n) in actions" :key="n" class="accordion" role="tablist">
        <b-card no-body class="mb-1 border-0 shadow-none">
          <b-card-header header-tag="header" class="p-1 border-0" role="tab" style="background: white !important">
            <b-row v-if="action.status" style="overflow: scroll">
              <b-col md="12" sm="12">
                <div block class="accordion-button d-flex flex-row justify-content-between p-2">
                  <span />
                  <span>{{ $t("acao") }} {{ n + 1 }}</span>
                  <b-button v-b-toggle:[`accordion-${n}`] class="collapseButton d-flex flex-column justify-content-center align-items-center mx-2">
                    <b-icon class="when-open" style="color: #53933a; width: 12px; height: 12px" icon="chevron-up" />
                    <b-icon class="when-closed" style="color: #53933a; width: 12px; height: 12px" icon="chevron-down" />
                  </b-button>
                </div>
              </b-col>
            </b-row>
            <div v-else block class="accordion-button d-flex flex-row justify-content-between p-2 w-100">
              <span />
              <span>{{ $t("acao") }} {{ n + 1 }}</span>
              <b-button v-b-toggle:[`accordion-${n}`] class="collapseButton d-flex flex-column justify-content-center align-items-center mx-2">
                <b-icon class="when-open" style="color: #53933a; width: 12px; height: 12px" icon="chevron-up" />
                <b-icon class="when-closed" style="color: #53933a; width: 12px; height: 12px" icon="chevron-down" />
              </b-button>
            </div>
          </b-card-header>
          <b-collapse :id="'accordion-' + n" :visible="true" accordion="my-accordion" role="tabpanel" style="padding: 30px 0">
            <div style="border: 0">
              <div class="w-100 d-flex flex-column justify-content-start align-items-start px-3">
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("competencia") }}:</span> {{ action.competence }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("motivodaacao") }}:</span> {{ $t(i18nActionReason[action.reason]) }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("tipodaacao") }}:</span> {{ $t(i18nActionType[action.type]) }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("porquefazeressaacao") }}:</span> {{ action.justification }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("desenvolverpontencializarcompetencia") }}:</span> {{ action.whatToDo }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("comorealizaracao") }}:</span> {{ action.howToDo }}</p>
                <p class="field-value"><span class="field-name" style="font-weight: bold">{{ $t("quempodeajudar") }}:</span> {{ action.whoCanHelpToDo }}</p>
                <p class="field-value">
                  <span class="field-name" style="font-weight: bold">{{ $t("datadaacao") }}:</span>
                  {{ getActionStart(action, n) }} {{ $t("ate") }} {{ getActionEnd(action, n) }}
                </p>
              </div>
            </div>
          </b-collapse>
        </b-card>
      </div>
    </div>

    <div v-if="selectedFollow && selectedFollow.comment" style="margin-top: 30px">
      <fieldset class="fieldset-border">
        <legend>{{ $t("comentariosdofollow") }}</legend>
        <b-container fluid class="px-3 pt-2">
          <b-form-group>
            <template v-slot:label>
              <div class="fieldset-label">
                {{ getExecutedByUserName(selectedFollow.executedByUser) }} - {{ getDate(selectedFollow.followDate) }}
              </div>
            </template>
            <b-form-textarea id="textarea" v-model="selectedFollow.comment" disabled :rows="6" :maxrows="10" />
          </b-form-group>
        </b-container>
      </fieldset>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getDate } from '@/services/utils-service'
import DMAlert from '@/components/DMAlert'
import DMLabelRequired from '@/components/DMLabelRequired'
import * as _ from 'lodash'

export default {
  name: 'ResignationRequestProcessRollbackView',
  components: { DMAlert, DMLabelRequired },
  data() {
    return {
      err: null,
      followIndex: 0,
      i18nActionReason: {
        develop_skills: 'desenvolvercompetencia',
        enhance_skills: 'potencializarcompetencia'
      },
      i18nActionType: {
        on_the_job: 'onthejob',
        interaction_and_networking: 'interacaonetworking',
        training_and_study: 'treinamentoestudo',
        other: 'outros'
      },
      statusValues: [
        { i18n: 'acaonoprazo', value: 'ON_TIME', color: '#0075FF' },
        { i18n: 'acaoconcluida', value: 'DONE', color: '#28A745' },
        { i18n: 'acaocancelada', value: 'CANCELED', color: '#FF4136' },
        { i18n: 'acaoatrasada', value: 'DELAYED', color: '#FFC107' }
      ]
    }
  },
  computed: {
    ...mapState('rollbackPlan', ['storageRollbackPlan']),
    actions() { return this.storageRollbackPlan ? this.storageRollbackPlan.actions : [] },
    selectedFollow() {
      if (!this.storageRollbackPlan || !this.storageRollbackPlan.follows) return { actions: [] }
      return this.storageRollbackPlan.follows[this.followIndex] || { actions: [] }
    },
    previousFollow() {
      if (this.followIndex > 0) {
        return this.storageRollbackPlan.follows[this.followIndex - 1]
      }
      return null
    }
  },
  methods: {
    getDate,
    canDoThisFollow(selectedFollow) { return selectedFollow.actions.length > 0 },
    getActionStart(action, actionIndex) {
      let actionStart = _.get(action, 'period.start')
      if (this.previousFollow) {
        const prevAction = this.previousFollow.actions[actionIndex]
        const rescheduleStart = _.get(prevAction, 'reschedule.period.start')
        if (rescheduleStart) { actionStart = rescheduleStart }
      }
      if (actionStart) return getDate(actionStart)
    },
    getActionEnd(action, actionIndex) {
      let actionEnd = _.get(action, 'period.end')
      if (this.previousFollow) {
        const prevAction = this.previousFollow.actions[actionIndex]
        const rescheduleEnd = _.get(prevAction, 'reschedule.period.end')
        if (rescheduleEnd) { actionEnd = rescheduleEnd }
      }
      if (actionEnd) return getDate(actionEnd)
    },
    getStatusColor(value) {
      const found = this.statusValues.find((s) => s.value === value)
      return found ? found.color : 'grey'
    },
    getStatusTranslate(value) {
      const found = this.statusValues.find((s) => s.value === value)
      return found ? found.i18n : null
    },
    ordinalSymbol(number) {
      switch (this.$store.getters.locale) {
        case 'pt-BR':
        case 'es':
          return ` ${number}º `
        case 'en': {
          const lastDigit = number % 10
          return lastDigit === 1 ? ` ${number}st ` : lastDigit === 2 ? ` ${number}nd ` : lastDigit === 3 ? ` ${number}rd ` : ` ${number}th `
        }
        default:
          return ` ${number}º `
      }
    },
    getExecutedByUserName(executedByUser) { return executedByUser ? executedByUser.name : '' }
  }
}
</script>

<style>
.collapsed > .when-open, .not-collapsed > .when-closed { display: none; }
</style>

<style scoped>
.accordion-button {
  display: block; background: #e9e9e9; border: #c0c4cc; border-radius: 5px;
  font-family: Poppins; font-weight: 700; font-size: 16px; line-height: 150%; text-align: center; color: #252525;
}
.fieldset-border legend { color: #77a167; text-align: left !important; width: auto; padding: 0 5px; font-family: Poppins; font-weight: 600; font-size: 24px; line-height: 120%; }
.field-value { text-align: left; font-size: 16px; line-height: 25px !important; }
.status-card { display: inline-block; min-width: 125px; padding: 6px 12px; border-radius: 5px; color: white; text-align: center; font-family: Poppins; font-weight: 400; font-size: 16px; }
.status-card-delayed { color: black; }
.fieldset-label { font-family: Poppins; font-weight: 600; font-size: 16px; text-align: left; }
.collapseButton { width: 25px; border-radius: 100%; background-color: white; border-color: #53933a; padding: 0; }
</style>
