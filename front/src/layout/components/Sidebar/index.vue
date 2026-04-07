<template>
  <div style="font-family: Poppins" :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          @clicked="itemClicked"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'

export default {
  name: 'SidebarIndex',
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta && meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return true
    },
    variables() {
      return {
        menuBg: '#212121',
        menuText: '#757575',
        menuActiveText: '#fff'
      }
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    itemClicked() {}
  }
}
</script>
<style></style>
