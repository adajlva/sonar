<template>
  <div class="mr-3">
    <b-button
      class="save btn-export-excel"
      variant="primary"
      :disabled="disabled"
      @click="$emit('getDataToExport')"
    >
      <span class="btn-export-excel__inner">
        {{ $t(label) }}
        <svg-icon icon-class="excel2" class="btn-export-excel__icon" />
      </span>
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'DMExportExcel',
  props: {
    label: {
      type: String,
      default: () => 'exportardadosparaexcel'
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style scoped>
.btn-export-excel__inner {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  gap: 6px;
}

.btn-export-excel__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
