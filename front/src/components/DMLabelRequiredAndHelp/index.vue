<template>
  <div class="dm-form-label dm-label-required-row">
    {{ $t(label) }}<span v-if="showTwoPoints && dotsBefore">: </span
    ><span v-if="required" class="obrigatorio">* </span
    ><span v-if="showTwoPoints && dotsAfter">: </span
    ><b-icon
      :id="text"
      v-b-tooltip.hover.top
      :title="text ? '' : $t('textonomecampo')"
      icon="question-circle-fill"
      variant="dark"
    />
    <b-tooltip :target="text" triggers="hover" custom-class="custom-tooltip">
      {{ text }}
    </b-tooltip>
  </div>
</template>

<script>
export default {
  name: 'DMLabelORequiredAndHelp',
  props: {
    label: { type: String, default: '' },
    text: { type: String, default: '' },
    required: { type: Boolean, default: true },
    showTwoPoints: { type: Boolean, default: true },
    dotsAfter: { type: Boolean, default: false },
    dotsBefore: { type: Boolean, default: false }
  },
  computed: {
    definedDotsOrientation() {
      return !this.dotsAfter && !this.dotsBefore
    },
    showDotsBefore() {
      return (
        this.showTwoPoints && this.definedDotsOrientation && this.dotsBefore
      )
    },
    showDotsAfter() {
      return (
        this.showTwoPoints && (!this.definedDotsOrientation || this.dotsAfter)
      )
    }
  }
}
</script>

<style>
.custom-tooltip .tooltip-inner {
  white-space: nowrap;
  width: fit-content !important;
  max-width: 1000px !important;
}
</style>

<style lang="scss" scoped>
.dm-label-required-row {
  margin: 8px 0 8px 0;
}
</style>
