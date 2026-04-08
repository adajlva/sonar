<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link
        class="sidebar-logo-link"
        to="/"
        :key="collapse ? 'collapse' : 'expand'"
      >
        <img
          src="@/assets/dmpeople-fb.png"
          class="sidebar-logo"
          alt="DMPeople"
        />
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
  height: 65px;
  background: #2b2f3a;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;

  /* router-link → <a.sidebar-logo-link.router-link-active> */
  & .sidebar-logo-link {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    min-width: 0;
    min-height: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    text-decoration: none;
    color: inherit;
    box-sizing: border-box;
  }

  & .sidebar-logo-link.router-link-active,
  & .sidebar-logo-link.router-link-exact-active {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .sidebar-logo {
    display: block;
    width: auto;
    max-width: 100%;
    max-height: 40px;
    height: auto;
    object-fit: contain;
    flex-shrink: 0;
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
      max-height: 44px;
    }
  }
}
</style>
