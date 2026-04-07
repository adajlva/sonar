<template>
  <div class="quadro mb-2 ml-2 mr-2">
    <DMAlert visible-class="mx-3" />

    <div class="flex-row-scrollable-list">
      <div class="pesquisa-recruitment-form mt-2 mb-2">
        <b-col md="12" sm="12">
          <b-input-group>
            <b-input-group-append>
              <b-button variant="secondary" disabled>
                <b-icon icon="search" variant="light" />
              </b-button>
            </b-input-group-append>
            <b-form-input
              id="pesquisa-palavras"
              v-model="keyword"
              type="text"
              :placeholder="$t('placeholderbuscanomeformulario')"
              @input="debounceSearch"
              @keyup.enter="filterByKeyword"
            />
            <b-input-group-append>
              <b-button variant="secondary" @click="clearSearch">{{ $t("limparpesquisa") }}</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </div>
    </div>

    <div class="flex-row-scrollable-list">
      <b-col md="12" sm="12" class="p-0">
        <div v-if="customForms.length > 0" role="tablist" class="quadro recruitment-form-scroll">
          <div
            v-infinite-scroll="fetchForms"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="1"
            infinite-scroll-throttle-delay="200"
          >
            <b-col v-for="(form, i) in customForms" :key="i" class="p-0">
              <div class="scrollable-list branco">
                <div class="title-scrollable-list font-weight-bold">
                  {{ form.name }}
                </div>
                <div class="btn-actions-scrollable-list">
                  <b-button
                    v-b-modal.modal-share-recruitment-form
                    v-b-tooltip.hover.bottom
                    :title="$t('responderformulario')"
                    size="sm"
                    class="mr-1"
                    variant="outline-primary"
                    @click="reply(form)"
                  >
                    <b-icon icon="file-text" variant="primary" scale="1" />
                  </b-button>
                </div>
              </div>
            </b-col>
          </div>
        </div>
      </b-col>
    </div>
  </div>
</template>

<script>
import { hideLoader, showLoader } from '@/utils/loading'
import { mapActions, mapGetters } from 'vuex'
import DMAlert from '@/components/DMAlert'
import { customFormService } from '@/services/custom-form-service'
import { clientService } from '@/services/client-service'

export default {
  name: 'RequestsList',
  components: { DMAlert },
  data() {
    return {
      customForms: [],
      client: '',
      clients: [],
      busy: true,
      currentSearch: '',
      totalPages: null,
      page: 1,
      keyword: '',
      limit: 20,
      timer: null,
      toClient: null,
      showClientSelect: false
    }
  },
  computed: mapGetters(['userProfile', 'userClient', 'userCpf']),
  mounted() {
    this.fetchForms()
    this.fetchClients()
  },
  methods: {
    ...mapActions('workplaceRequestsTabs', ['goToList', 'goToView']),

    async filterByKeyword() {
      this.customForms = []
      this.page = 1
      this.totalPages = null
      return this.fetchForms()
    },

    debounceSearch() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => { this.filterByKeyword() }, 1000)
    },

    clearSearch() {
      this.keyword = null
      return this.filterByKeyword()
    },

    async fetchForms() {
      this.busy = true
      const finishPaginate = this.totalPages && this.page > this.totalPages
      if (finishPaginate) { return }
      showLoader()
      try {
        const { data } = await customFormService.getWorkplaceFormsByKeyword(
          this.userClient, this.userCpf, this.limit, this.page, this.keyword
        )
        const head = this.customForms.slice(0, this.limit * (this.page - 1))
        const tail = this.customForms.slice(this.limit * this.page)
        this.customForms = [...head, ...data.docs, ...tail]
        this.totalPages = data.totalPages
      } catch (e) {
        if (e.response && e.response.status === 409) {
          this.$emit('alert', { message: this.$t('usuarionaocolaborador'), type: 'danger', timer: 10 })
        }
      } finally {
        this.page++
        this.busy = false
        hideLoader()
      }
    },

    async fetchClients() {
      const { data } = await clientService.get()
      this.clients = data
    },

    async reply(form) {
      showLoader()
      await this.goToView(form)
      hideLoader()
    }
  }
}
</script>

<style scoped>
.recruitment-form-scroll {
  height: calc(100vh - 90px);
  overflow-y: scroll;
  overflow-x: hidden;
  margin-left: 0;
  margin-right: 0;
}
.pesquisa-recruitment-form { width: 100%; }
@media screen and (max-width: 470px) {
  .recruitment-form-scroll { height: 100vh; margin-left: 0; margin-right: 0; overflow-y: scroll; overflow-x: hidden; }
  .pesquisa-recruitment-form { width: 100%; }
}
</style>
