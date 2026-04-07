<template>
  <div id="app" class="poppins">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.poppins {
  font-family: 'Poppins', sans-serif;
}

.quadro {
  padding: 15px;
}

.obrigatorio {
  color: red;
}

.save {
  min-width: 100px;
}

.person-fields {
  display: flex;
  flex-wrap: wrap;
}

.label-icon {
  font-weight: 600;
  font-size: 0.875rem;
  color: #343434;
}

.btn-status {
  pointer-events: none;
}

.campo-obrigatorio {
  font-size: 0.8rem;
  color: #666;
}

.duplicate-alert {
  border-radius: 6px;
}

.text-info2 {
  color: #17a2b8 !important;
}
</style>
