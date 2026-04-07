<template>
  <b-modal
    ref="modal"
    :title="training ? training.name : ''"
    size="xl"
    hide-footer
    @hidden="onHidden"
  >
    <div v-if="training" class="quadro poppins px-2">
      <div class="my-quadro">
        <div
          v-for="schedule in training.schedules"
          :key="schedule._id"
          class="schedule-row"
          :style="getStyleCard(schedule.status)"
        >
          <!-- Agendamento + Ícone cadeado -->
          <div class="schedule-cell schedule-cell--name">
            <span class="date-title nowrap">
              {{ $t('agendamento') }} {{ String(schedule.index).padStart(2, '0') }}
            </span>
            <svg class="padlock-icon ml-2" viewBox="0 0 16 18">
              <use
                :href="statusIsOpen(schedule.status) ? '#icon-open-padlock' : '#icon-closed-padlock'"
                :class="getStatusIconClass(schedule.status)"
              />
            </svg>
          </div>

          <!-- Mensagem -->
          <div class="schedule-cell schedule-cell--message">
            <b-badge
              class="badge-custom message-schedule-status"
              :class="getStatusMessageClass(schedule.status)"
            >
              {{ getScheduleMessage(schedule.status) }}
            </b-badge>
          </div>

          <!-- Badge de status -->
          <div class="schedule-cell schedule-cell--status">
            <b-badge
              :class="getStatusBtnClass(schedule.status)"
              class="badge-custom button-schedule-status"
            >
              {{ getStatusName(schedule.status) }}
            </b-badge>
          </div>

          <!-- Data de realização -->
          <div class="schedule-cell schedule-cell--date">
            <div class="date-title nowrap">{{ $t('dataderealizacao') }}</div>
            <div class="date-message nowrap">{{ schedule.realizedAt || $t('na') }}</div>
          </div>

          <!-- Data de início -->
          <div class="schedule-cell schedule-cell--date">
            <div class="date-title nowrap">{{ $t('datainicio') }}</div>
            <div class="date-message nowrap">{{ schedule.startDate || $t('na') }}</div>
          </div>

          <!-- Data de término -->
          <div class="schedule-cell schedule-cell--date">
            <div class="date-title nowrap">{{ $t('datatermino') }}</div>
            <div class="date-message nowrap">{{ schedule.endDate || $t('na') }}</div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-3">
        <b-button variant="primary" @click="close">{{ $t('voltar') }}</b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'AgendamentosModal',

  data() {
    return {
      training: null
    }
  },

  methods: {
    show(training) {
      this.training = training
      this.$refs.modal.show()
    },

    close() {
      this.$refs.modal.hide()
    },

    onHidden() {
      this.training = null
    },

    statusIsOpen(status) {
      return ['done', 'done_manually', 'pending', 'delayed'].includes(status)
    },

    getStatusName(status) {
      const map = {
        done: this.$t('presente'),
        done_manually: this.$t('remanejado'),
        pending: this.$t('emandamento'),
        delayed: this.$t('atrasado'),
        scheduled: this.$t('agendado'),
        missed: this.$t('faltou'),
        na: this.$t('na')
      }
      return map[status] || status
    },

    getScheduleMessage(status) {
      const map = {
        done: this.$t('colaboradorconcluiuagendamento'),
        done_manually: this.$t('colaboradordispensadopenaliza'),
        pending: this.$t('agendamentodisponivelparainicioimediato'),
        delayed: this.$t('agendamentodisponivelporemforadoprazo'),
        scheduled: this.$t('agendamentoindisponivelaguardeadatadeinicio'),
        missed: this.$t('adatadeterminodesteagendamentojapassou'),
        na: this.$t('esteagendamentonaoestamaisdisponivel')
      }
      return map[status] || ''
    },

    getStyleCard(status) {
      return this.statusIsOpen(status) ? '' : 'background-color: #F8F9FA; cursor: default;'
    },

    getStatusIconClass(status) {
      const map = {
        done: 'done-schedule-status-icon',
        done_manually: 'done-manually-schedule-status-icon',
        pending: 'pending-schedule-status-icon',
        delayed: 'delayed-schedule-status-icon',
        scheduled: 'scheduled-schedule-status-icon',
        missed: 'missed-schedule-status-icon',
        na: 'na-schedule-status-icon'
      }
      return map[status] || ''
    },

    getStatusMessageClass(status) {
      const map = {
        done: 'done-schedule-status-message',
        done_manually: 'done-manually-schedule-status-message',
        pending: 'pending-schedule-status-message',
        delayed: 'delayed-schedule-status-message',
        scheduled: 'scheduled-schedule-status-message',
        missed: 'missed-schedule-status-message',
        na: 'na-schedule-status-message'
      }
      return map[status] || ''
    },

    getStatusBtnClass(status) {
      const map = {
        done: 'done-schedule-status',
        done_manually: 'done-manually-schedule-status',
        pending: 'pending-schedule-status',
        delayed: 'delayed-schedule-status',
        scheduled: 'scheduled-schedule-status',
        missed: 'missed-schedule-status',
        na: 'na-schedule-status'
      }
      return map[status] || ''
    }
  }
}
</script>

<style scoped>
/* ── Badges de mensagem ── */
.message-schedule-status {
  padding: 4px 8px;
  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  white-space: normal;
}

/* ── Botão de status ── */
.button-schedule-status {
  padding: 4px 8px;
  font-size: 14px;
  white-space: nowrap;
}

/* ── Status: Presente (done) ── */
.done-schedule-status          { background: #28a745; color: white; }
.done-schedule-status-icon     { color: #28a745; }
.done-schedule-status-message  { background: #c5e9ca; color: black; }

/* ── Status: Remanejado (done_manually) ── */
.done-manually-schedule-status         { background: #d2d2d2; color: black; }
.done-manually-schedule-status-icon    { color: #aaa; }
.done-manually-schedule-status-message { background: #ebebeb; color: black; }

/* ── Status: Em andamento (pending) ── */
.pending-schedule-status         { background: #ffc107; color: black; }
.pending-schedule-status-icon    { color: #ffc107; }
.pending-schedule-status-message { background: #ffecb3; color: black; }

/* ── Status: Atrasado (delayed) ── */
.delayed-schedule-status         { background: red; color: white; }
.delayed-schedule-status-icon    { color: red; }
.delayed-schedule-status-message { background: #ffd9d7; color: black; }

/* ── Status: Agendado (scheduled) ── */
.scheduled-schedule-status         { background: #0075ff; color: white; }
.scheduled-schedule-status-icon    { color: #0075ff; }
.scheduled-schedule-status-message { background: #bfdcff; color: black; }

/* ── Status: Faltou / N/A ── */
.missed-schedule-status         { background: #666666; color: white; }
.missed-schedule-status-icon    { color: #666666; }
.missed-schedule-status-message { background: #d2d2d2; color: black; }
.na-schedule-status             { background: #666666; color: white; }
.na-schedule-status-icon        { color: #666666; }
.na-schedule-status-message     { background: #d2d2d2; color: black; }

/* ── Linha de agendamento ── */
.my-quadro {
  padding: 5px 0;
  margin: 12px 0;
  border-radius: 5px;
}

.schedule-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  border: solid 1px #dcdcdc;
  border-radius: 5px;
  padding: 8px 12px;
  margin-bottom: 6px;
  min-height: 60px;
  gap: 8px;
}

.schedule-cell {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.schedule-cell--name {
  flex: 0 0 180px;
  justify-content: flex-start;
}

.schedule-cell--message {
  flex: 1 1 auto;
  justify-content: flex-start;
}

.schedule-cell--status {
  flex: 0 0 110px;
  justify-content: center;
}

.schedule-cell--date {
  flex: 0 0 120px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* ── Texto de data ── */
.date-title {
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
}

.date-message {
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  color: #53933a;
}

/* ── Ícone cadeado ── */
.padlock-icon {
  width: 16px;
  height: 18px;
  fill: currentColor;
  overflow: visible;
}

.badge-custom {
  font-weight: normal;
  margin-top: auto;
  margin-bottom: auto;
  white-space: nowrap;
}

.nowrap {
  white-space: nowrap;
}
</style>
