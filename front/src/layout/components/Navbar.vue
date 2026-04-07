<template>
  <div class="navbar">
    <b-modal
      id="modalTermsOfUse"
      ref="modalTermsOfUse"
      :title="$t('termosdeuso')"
      size="lg"
      :ok-only="true"
      :ok-title="$t('avancar')"
      :ok-disabled="!termsOfUse"
      :no-close-on-esc="true"
      :no-close-on-backdrop="true"
      :hide-header-close="true"
      @ok="modalOk"
      @hide="modalOk"
      @cancel="modalOk"
    >
      <b-row align-h="center" class="justify-content-center">
        <b-col col md="12">
          <object
            :data="termodeusoFile"
            type="application/pdf"
            width="135%"
            height="450px"
          />
        </b-col>
        <b-col md="12">
          <b-form-checkbox
            id="checkbox-1"
            v-model="termsOfUse"
            name="checkbox-1"
            :value="true"
            :unchecked-value="false"
          >
            {{ $t('aceitotermosdeuso') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
    </b-modal>

    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb
      v-if="device !== 'mobile'"
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <div class="empresa mb-3">
      <div class="font-weight-bold mt-2">{{ $t('empresa') }}:</div>
      <b-col md="12" class="select-company">
        <b-form-group>
          <b-form-select
            id="user-perfil"
            v-model="client"
            class="custom-select-company"
            @change="changeClient"
          >
            <template>
              <b-form-select-option
                v-for="(c, i) in clients"
                :key="i"
                :value="c.code"
                :preselect-first="false"
                class="client-option"
              >
                {{ c.name }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
    </div>

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <img
          src="@/assets/brasil.png"
          class="right-menu-item lang"
          @click="changeLocale('pt-BR')"
        />
        <img
          src="@/assets/espanha.png"
          class="right-menu-item lang"
          @click="changeLocale('es')"
        />
        <img
          src="@/assets/usa.jpg"
          class="right-menu-item lang"
          @click="changeLocale('en')"
        />

        <!-- <search id="header-search" class="right-menu-item mr-3" />
        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>

      <el-dropdown
        v-if="user"
        v-b-tooltip.hover.bottom
        :title="name"
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img src="@/assets/avatar2.png" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <template v-if="device === 'mobile'">
            <el-dropdown-item>
              <span style="display: block">{{ $t('linguagem') }}</span>
              <div @click="changeLocale('pt-BR')">
                <span
                  style="display: block; margin-left: 10px; font-weight: 600"
                  >{{ $t('portugues') }}</span
                >
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div @click="changeLocale('es')">
                <span
                  style="display: block; margin-left: 10px; font-weight: 600"
                  >{{ $t('espanhol') }}</span
                >
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div @click="changeLocale('en')">
                <span
                  style="display: block; margin-left: 10px; font-weight: 600"
                  >{{ $t('ingles') }}</span
                >
              </div>
            </el-dropdown-item>
          </template>

          <router-link to="/">
            <el-dropdown-item divided>{{
              $t('titletreinamentos')
            }}</el-dropdown-item>
          </router-link>

          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">{{ $t('sair') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import i18n from '@/plugins/i18n'
import { getInfo } from '@/api/user'
import { clientService } from '@/services/client-service'
import { userClientConfigurationService } from '@/services/user-client-configuration-service'
import { centralDemarcoUserService } from '@/services/central-demarco-user-service'
import { hideLoader, showLoader } from '@/utils/loading'
import router from '@/router'

export default {
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      languages: [
        { flag: 'pt-BR', language: 'pt-BR', title: 'Português' },
        { flag: 'us', language: 'en', title: 'English' },
        { flag: 'es', language: 'es', title: 'Español' }
      ],
      user: null,
      clients: [],
      client: null,
      termsOfUse: false,
      termodeusoFile: require('@/assets/pdf/termodeuso.pdf')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'userClient',
      'userValidClients',
      'userUnit',
      'userId',
      'name'
    ]),
    ...mapState({
      approval: (state) => state.approval.approval,
      userTermsOfUse: (state) => state.user.userTermsOfUse
    })
  },
  watch: {
    '$store.getters.updateClient': function () {
      if (this.$store.getters.updateClient) {
        this.fetchClientes()
        this.$store.commit('user/SET_UPDATECLIENT', false)
      }
    }
  },
  created() {
    this.getLocale()
    this.fetchClientes()
    getInfo()
      .then(({ data }) => {
        this.user = data
      })
      .catch(() => {
        this.user = { name: 'Usuário' }
      })

    this.client = this.userClient
    this.getApprovalsByClient()
  },
  mounted() {
    this.verifyTermsOfUse()
  },
  methods: {
    ...mapActions('approval', ['loadApproval', 'clearApproval']),
    ...mapActions('user', ['setUserClient']),
    getLocale() {
      let lastLocale =
        localStorage.getItem('lastLocale') ||
        navigator.userLanguage ||
        (navigator.languages &&
          navigator.languages.length &&
          navigator.languages[0]) ||
        navigator.language ||
        navigator.browserLanguage ||
        navigator.systemLanguage ||
        'pt-BR'
      if (lastLocale !== 'en' && lastLocale !== 'es') {
        lastLocale = 'pt-BR'
      }
      this.$store.state.user.locale = lastLocale
      i18n.locale = lastLocale
    },

    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
    },
    changeLocale(locale) {
      i18n.locale = locale
      this.$store.state.user.locale = locale
      localStorage.setItem('lastLocale', locale)
    },
    async fetchClientes() {
      try {
        const { data } = await clientService.getByUserToken()
        this.clients = data || []
      } catch {
        this.clients = []
      }
    },
    async changeClient() {
      this.setUserClient(this.client)
      await this.changeUserHierarchy()
      await this.getApprovalsByClient()
      await this.$store.dispatch('user/updateEcosystems')
      await this.$store.dispatch('user/updateIsCycleManager')
      if (this.$route.path !== '/home/index') {
        router.push('/dossier')
      }
    },

    async getApprovalsByClient() {
      await this.loadApproval()
    },

    async verifyTermsOfUse() {
      if (!this.userTermsOfUse) this.$refs.modalTermsOfUse.show()
    },

    async modalOk() {
      if (!this.termsOfUse) {
        router.push('/')
      } else {
        try {
          showLoader()
          const { data: user } =
            await centralDemarcoUserService.getByReferenceId(this.userId)
          user.termsOfUse = this.termsOfUse
          await centralDemarcoUserService.save(user)
          this.$store.dispatch('user/updateTermsOfUse', true)
        } catch (error) {
          console.error(error)
        } finally {
          hideLoader()
        }
      }
    },

    async changeUserHierarchy() {
      try {
        const { data } = await userClientConfigurationService.getByUserAndClient(
          this.userId,
          this.userClient
        )
        this.$store.state.user.userHierarchy = data ? data.units : []
        this.$store.state.user.userUnit = data ? data.units : []
      } catch {
        this.$store.state.user.userHierarchy = []
        this.$store.state.user.userUnit = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  font-family: Poppins;

  .hamburger-container {
    line-height: 25px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 30px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 1px;
      height: 100%;
      font-size: 15px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    img.lang {
      width: 40px;
      height: 25px;
      margin-bottom: 4px;
      cursor: pointer;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 0;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }

    .el-dropdown-menu__item {
      .band {
        width: 35px;
        height: 20px;
      }
    }
  }
}

.empresa {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 40%;
}

.select-company {
  height: 30px;
}

.custom-select-company {
  background-color: #53933a;
  color: #fff;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.custom-select-company .client-option {
  background: #62af3a;
}

.custom-select-company .client-option:link,
.custom-select-company .client-option:visited,
.custom-select-company .client-option:hover,
.custom-select-company .client-option:active,
.custom-select-company .client-option:focus {
  background: #53933a !important;
}

@media screen and (max-width: 470px) {
  .empresa {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .navbar {
    height: 80px;
  }
}
</style>
