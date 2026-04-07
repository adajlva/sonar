<template>
  <div>
    <b-table
      ref="generalTables"
      :fields="fields"
      :items="data"
      :current-page="page"
      :per-page="0"
      :no-local-sorting="true"
      :responsive="true"
      small
      striped
      show-empty
      stacked="sm"
      class="dm-paginated-table"
    >
      <template v-for="(_, name) in $scopedSlots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template v-slot:cell(actions)="row">
        <slot name="action" :row="row" />
      </template>
    </b-table>

    <b-col class="my-1" md="12" sm="6">
      <b-pagination
        v-model="currentPage"
        :per-page="limit"
        :total-rows="totalRows"
        align="center"
        class="my-0"
        size="sm"
        @input="onPageChange"
      />
    </b-col>
  </div>
</template>

<script>
export default {
  name: 'DMPaginatedTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Array,
      default: () => []
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    totalRows: {
      type: Number,
      default: 0
    },
    showUpdateButtom: {
      type: Boolean,
      default: true
    },
    showDeleteButtom: {
      type: Boolean,
      default: true
    },
    verifyAdminUser: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPage: this.page
    }
  },
  methods: {
    onPageChange(page) {
      this.$emit('get', { page })
    }
  }
}
</script>
