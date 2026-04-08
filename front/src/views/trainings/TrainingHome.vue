<template>
  <div class="container">
    <div class="quadro container-quadro">
      <div class="container-img">
        <img v-if="srcImage" :src="srcImage" class="welcome-logo">
      </div>

      <div class="container-cards">
        <div v-for="card in cards" :key="card.i18n">
          <div v-if="$can('read', card.resource)" class="card-container">
            <div
              :class="
                $can('read', card.resource) && userTermsOfUse
                  ? 'card-item card-active'
                  : 'card-item card-disable disable'
              "
            >
              <router-link :to="$can('read', card.resource) ? card.path : ''">
                <svg aria-hidden="true" class="svg-icon">
                  <use :href="'#icon-' + card.icon" />
                </svg>

                <div class="container-text">{{ $t(card.i18n) }}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TrainingHome',
  data() {
    return {
      welcome_pt: require('@/assets/dmpeople_integracaoetrainamentos.png'),
      welcome_eng: require('@/assets/dmpeople_integrationandtraining.png'),
      welcome_esp: require('@/assets/dmpeople_integracionyformacion.png'),
      srcImage: null
    }
  },
  computed: {
    cards() {
      const s = this.$store.state.screens.screens
      return [
        {
          name: 'Cadastros',
          icon: 'form',
          i18n: 'cadastros',
          path: '/training-tabs/records',
          resource: s.records
        },
        {
          name: 'Acompanhamento',
          icon: 'graph-up',
          i18n: 'acompanhamento',
          path: '/training-tabs/follow-up',
          resource: s.followup
        },
        {
          name: 'Academy',
          icon: 'academy',
          i18n: 'academy',
          path: '/training-tabs/academy',
          resource: s.training
        },
        {
          name: 'Execução',
          icon: 'person-badge',
          i18n: 'execucao',
          path: '/training-tabs/execution',
          resource: s.execution
        }
      ]
    },
    ...mapState({
      currentCareerTabIndex: (state) =>
        state.currentCareerTabIndex.currentCareerTabIndex,
      userTermsOfUse: (state) => state.user.userTermsOfUse
    })
  },
  watch: {
    '$store.getters.locale': function () {
      if (this.$store.getters.locale === 'en') {
        this.srcImage = this.welcome_eng
      } else if (this.$store.getters.locale === 'es') {
        this.srcImage = this.welcome_esp
      } else {
        this.srcImage = this.welcome_pt
      }
    }
  },
  created() {
    if (this.$store.getters.locale === 'en') {
      this.srcImage = this.welcome_eng
    } else if (this.$store.getters.locale === 'es') {
      this.srcImage = this.welcome_esp
    } else {
      this.srcImage = this.welcome_pt
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}
.container-img {
  display: contents;
}
.welcome-logo {
  width: 93.1%;
}
.container-quadro {
  align-items: center;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.container-cards {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  justify-content: space-between;
  align-items: stretch;
  gap: 20px;
}
.card-active {
  color: rgb(117, 117, 117);
  background-color: #fff;
  box-shadow: 2px 2px 2px #c0c4cc;
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.card-disable {
  color: rgb(117, 117, 117);
  background-color: #c0c4cc;
  box-shadow: 2px 2px 2px #c0c4cc;
  border: 1px solid rgba(0, 0, 0, 0.125);
  pointer-events: none;
  cursor: not-allowed;
}
.card-item:hover {
  background-color: #5f5f5f;
  color: #fff;
}
.card-container {
  margin-bottom: 3%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height: 100%;
  min-width: 230px;
}
.card-item {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 98%;
  border-radius: 0.5rem;
  text-align: center;
  height: 156px;
  width: 226px;
  padding: 15%;
}
.svg-icon {
  margin-bottom: 8px;
  margin-right: 0;
  width: 2em;
  height: 2em;
  fill: currentColor;
  overflow: hidden;
}
.card-item:hover .svg-icon {
  vertical-align: -0.15em !important;
  fill: #53933a !important;
  color: #53933a !important;
  overflow: hidden !important;
}
.container-text {
  width: 134px;
}
</style>
