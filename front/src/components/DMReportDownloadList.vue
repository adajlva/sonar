<template>
  <div>
    <b-spinner v-if="isBusy" label="Carregando..." />
    <b-table
      v-else
      :items="data"
      :fields="fields"
      small
      striped
      show-empty
    >
      <template v-slot:cell(url)="row">
        <b-link :href="row.item.url" target="_blank">
          {{ $t('baixar') }}
        </b-link>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :per-page="limit"
      :total-rows="totalRows"
      align="center"
      size="sm"
      class="my-2"
      @input="$emit('onChangePage', $event)"
    />
  </div>
</template>

<script>
export default {
  name: 'DMReportDownloadList',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 20
    },
    isBusy: {
      type: Boolean,
      default: false
    },
    totalRows: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentPage: 1,
      fields: [
        { key: 'createdAt', label: 'Data', formatter: (v) => v ? new Date(v).toLocaleString('pt-BR') : '-' },
        { key: 'status', label: 'Status' },
        { key: 'url', label: 'Download' }
      ]
    }
  }
}
</script>
