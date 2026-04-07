<template>
  <div class="quadro">
    <b-card no-body>
      <b-tabs
        :value="currentKnowledgeBaseTabIndex"
        card
        lazy
        fixed="top"
        @input="setCurrentKnowledgeBaseTabIndex"
      >
        <b-tab
          v-if="$can('read', screens.files_inWorkplaceModule)"
          :title="$t('conteudos')"
          :title-link-class="linkClass(0)"
          @click="setCurrentKnowledgeBaseTabIndex(0)"
        >
          <template v-slot:title>
            {{ $t("conteudos") }}
          </template>
          <knowledge-base-list />
        </b-tab>
        <b-tab
          v-if="$can('read', screens.grid_inWorkplaceModule)"
          :title="$t('grade')"
          :title-link-class="linkClass(1)"
          @click="setCurrentKnowledgeBaseTabIndex(1)"
        >
          <template v-slot:title>
            {{ $t("grade") }}
          </template>
          <knowledge-base-grid />
        </b-tab>
        <b-tab
          v-if="$can('read', screens.registerFiles_inWorkplaceModule)"
          :title="$t('cadastro')"
          :title-link-class="linkClass(2)"
          @click="setCurrentKnowledgeBaseTabIndex(2)"
        >
          <template v-slot:title>
            {{ $t("cadastro") }}
          </template>
          <knowledge-base-file-form />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import KnowledgeBaseList from './KnowledgeBaseList'
import KnowledgeBaseGrid from './KnowledgeBaseGrid'
import KnowledgeBaseFileForm from './KnowledgeBaseFileForm'

export default {
  name: 'KnowledgeBaseTabs',
  components: {
    KnowledgeBaseList,
    KnowledgeBaseGrid,
    KnowledgeBaseFileForm
  },
  computed: {
    ...mapState({
      currentKnowledgeBaseTabIndex: (state) =>
        state.currentKnowledgeBaseTabIndex.currentKnowledgeBaseTabIndex,
      screens: (state) => state.screens.screens
    })
  },
  methods: {
    ...mapActions('currentKnowledgeBaseTabIndex', [
      'setCurrentKnowledgeBaseTabIndex',
      'clearCurrentKnowledgeBaseTabIndex'
    ]),
    linkClass(idx) {
      if (this.currentKnowledgeBaseTabIndex === idx) {
        return ['bg-primary', 'text-light']
      } else {
        return ['bg-light', 'text-info2']
      }
    }
  }
}
</script>
