<template>
  <div class="app-container">
    <el-result
      icon="info"
      :title="$t(routeTitle)"
      sub-title="Este módulo ainda não está disponível nesta instalação."
    >
      <template slot="extra">
        <el-button type="primary" @click="$router.push('/dossier/index')">
          Ir para Dossiê
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
export default {
  name: 'NotImplemented',
  computed: {
    routeTitle() {
      return (this.$route.meta && this.$route.meta.title) || ''
    }
  }
}
</script>
