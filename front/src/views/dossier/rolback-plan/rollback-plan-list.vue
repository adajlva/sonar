<template>
  <div class="quadro">
    <b-input-group>
      <b-input-group-append>
        <b-button variant="secondary" disabled>
          <b-icon icon="search" variant="ligth" />
        </b-button>
      </b-input-group-append>
      <b-form-input
        v-model="search"
        type="text"
        :placeholder="$t('placeholderbuscaplanoreversao')"
        @input="debounceSearch"
        @keyup.enter="searchResignationRequest"
      />
      <b-input-group-append class="btn-clear-search">
        <b-button variant="secondary" @click="clearSearch">
          {{ $t("limparpesquisa") }}
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <div v-if="resignationRequestProcesses.length" class="board">
      <div
        v-for="item in resignationRequestProcesses"
        :key="item._id"
        class="item d-flex justify-content-between align-items-center border rounded"
      >
        <span class="name font-weight-bold">{{ item.rollbackPlan.name }}</span>
        <b-button variant="outline-primary" @click="showRollbackPlan(item)">
          <b-icon icon="eye" variant="primary" />
        </b-button>
      </div>
    </div>
    <div v-else class="text-center mt-4">
      {{ search.length ? $t('nenhumresultadoencontrado') : $t("naoexisteumprativovinculadoaoseuusuario") }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { hideLoader, showLoader } from '@/utils/loading'
import { resignationRequestProcessService } from '@/services/v2/resignation-request-process-service'

export default {
  name: 'RollbackPlanList',
  data() {
    return {
      search: '',
      searchInputTimer: null,
      resignationRequestProcesses: []
    }
  },
  computed: {
    ...mapGetters(['userClient'])
  },
  created() {
    this.searchResignationRequest()
  },
  methods: {
    ...mapActions('rollbackPlan', ['load', 'setColaborator', 'clear', 'resetSelectedCollaborator']),

    clearSearch() {
      this.search = ''
      this.searchResignationRequest()
    },

    async searchResignationRequest() {
      showLoader()
      try {
        const { data } = await resignationRequestProcessService.getMyResignationRequest({
          client: this.userClient,
          search: this.search
        })
        this.resignationRequestProcesses = data
      } catch (e) {
        console.log(e)
      } finally {
        hideLoader()
      }
    },

    debounceSearch() {
      clearTimeout(this.inputSearchTimer)
      this.inputSearchTimer = setTimeout(() => this.searchResignationRequest(), 1000)
    },

    showRollbackPlan(data) {
      this.clear()
      this.resetSelectedCollaborator()
      this.$emit('select', data)
    }
  }
}
</script>

<style scoped>
.board { width: 100%; margin-top: 20px; }
.item { padding: 0.625rem 0.5rem; gap: 1rem; }
.item + .item { margin-top: 1rem; }
.item .name { flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
