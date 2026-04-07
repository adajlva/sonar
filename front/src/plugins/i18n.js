import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ptBR from './pt-br'

Vue.use(VueI18n)

const messages = {
  'pt-BR': ptBR
}

export default new VueI18n({
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages
})
