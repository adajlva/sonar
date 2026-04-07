<template>
  <div class="quadro">
    <div class="mb-2 campo-obrigatorio">
      (<span class="obrigatorio">*</span>) {{ $t('camposobrigatorios') }}
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DMPanel'
}
</script>
