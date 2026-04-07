<template>
  <span class="dm-label">{{ $t(label) }}</span>
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
