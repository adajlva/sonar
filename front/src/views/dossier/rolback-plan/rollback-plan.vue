<template>
  <div class="quadro">
    <b-button variant="outline-primary" @click="$emit('clear')">
      <b-icon icon="arrow-left" variant="primary" />
      Voltar
    </b-button>
    <div v-if="collaboratorSelected && collaboratorSelected.person" class="board">
      <div class="header">
        <b-row>
          <b-col md="3" sm="12" style="font-size: 16px; text-align: start; font-weight: bold; overflow: hidden; text-overflow: ellipsis;">
            <span>{{ resignationRequestProcess.rollbackPlan.name }}</span>
          </b-col>
          <b-col md="9" sm="12" class="header-dynamic-content" style="text-align: end">
            {{ $t("dataadmissao") }}: <span style="font-weight: bold">{{ getDate(collaboratorSelected.admissionDate) }}</span>
          </b-col>
        </b-row>
      </div>

      <div class="list">
        <b-tabs card lazy>
          <b-tab :title="$t('followdoplanodereversao')">
            <FollowRegister />
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { getDate } from '@/services/utils-service'
import FollowRegister from './tabs/follow-register'

export default {
  name: 'RollbackPlan',
  components: { FollowRegister },
  props: {
    resignationRequestProcess: {
      type: Object,
      required: true
    }
  },
  data() {
    return { tabIndex: 0 }
  },
  computed: {
    ...mapGetters(['userClient']),
    ...mapState('rollbackPlan', ['collaboratorSelected', 'rollbackPlan'])
  },
  async created() {
    this.clear()
    this.resetSelectedCollaborator()
    if (this.resignationRequestProcess && this.resignationRequestProcess.rollbackPlan) {
      this.load(this.resignationRequestProcess.rollbackPlan)
    }
    if (
      this.resignationRequestProcess &&
      this.resignationRequestProcess.resignationCandidate &&
      this.resignationRequestProcess.resignationCandidate.personBond
    ) {
      this.setColaborator(this.resignationRequestProcess.resignationCandidate.personBond)
    }
  },
  methods: {
    ...mapActions('rollbackPlan', ['load', 'setColaborator', 'clear', 'resetSelectedCollaborator']),
    getDate(date) { return getDate(date) }
  }
}
</script>

<style scoped>
.board { width: 100%; margin-top: 20px; background: #53933a; border-radius: 8px; }
.list { width: 100%; background: #ffffff; }
.header { padding: 20px; color: white; text-align: end; }
.header .header-dynamic-content { font-size: 10pt; }
</style>
