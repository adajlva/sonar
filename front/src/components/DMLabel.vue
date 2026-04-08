<template>
  <span class="dm-form-label">{{ $t(label) }}</span>
</template>

<script>
export default {
  name: 'DMLabel',
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>
