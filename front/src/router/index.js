import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

const NotImplemented = () => import('@/views/NotImplemented')

export const constantRoutes = [
  {
    path: '/',
    redirect: '/dossier',
    hidden: true
  },
  {
    path: '/client',
    component: Layout,
    redirect: '/client/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'Empresa',
        meta: { title: 'empresa', icon: 'company', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'empresa', icon: 'company' }
  },
  {
    path: '/configuration',
    component: Layout,
    redirect: '/configuration/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'Configuracao',
        meta: { title: 'configuracao', icon: 'user-cog', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'configuracao', icon: 'user-cog' }
  },
  {
    path: '/dossier',
    component: Layout,
    redirect: '/dossier/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/dossier/WorkplaceTabs'),
        name: 'Peoples',
        meta: { title: 'dossievirtual', icon: 'peoples', noCache: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'dossievirtual', icon: 'peoples' }
  },
  {
    path: '/recruitment',
    component: Layout,
    redirect: '/recruitment/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'Recrutamento',
        meta: { title: 'recrutamentoselecao', icon: 'skill', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'recrutamentoselecao', icon: 'skill' }
  },
  {
    path: '/actionPlan',
    component: Layout,
    redirect: '/actionPlan/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'PlanodeAcao',
        meta: { title: 'planodeacao', icon: 'Action-Plan', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'planodeacao', icon: 'Action-Plan' }
  },
  {
    path: '/management',
    component: Layout,
    redirect: '/management/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'Movimentacao',
        meta: { title: 'movimentacaoregistro', icon: 'id-card', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'movimentacaoregistro', icon: 'id-card' }
  },
  {
    path: '/workday',
    component: Layout,
    redirect: '/workday/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'JornadaTrabalho',
        meta: { title: 'jornadatrabalho', icon: 'calendar-check', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'jornadatrabalho', icon: 'calendar-check' }
  },
  {
    path: '/remuneration',
    component: Layout,
    redirect: '/remuneration/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'Remuneracao',
        meta: { title: 'remuneracaobeneficios', icon: 'dollar', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'remuneracaobeneficios', icon: 'dollar' }
  },
  {
    path: '/trainings',
    component: Layout,
    redirect: '/trainings/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'Treinamentos',
        meta: { title: 'integracaotreinamento', icon: 'education', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'integracaotreinamento', icon: 'education' }
  },
  {
    path: '/researches',
    component: Layout,
    redirect: '/researches/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'Pesquisas',
        meta: { title: 'acompanhamentoretencao', icon: 'form', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'acompanhamentoretencao', icon: 'form' }
  },
  {
    path: '/career',
    component: Layout,
    redirect: '/career/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'Career',
        meta: { title: 'desenvolvimentoecarreira', icon: 'signal', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'desenvolvimentoecarreira', icon: 'signal' }
  },
  {
    path: '/reports',
    component: Layout,
    redirect: '/reports/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'Reports',
        meta: { title: 'analiseserelatorios', icon: 'analysis', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'analiseserelatorios', icon: 'analysis' }
  },
  {
    path: '/health',
    component: Layout,
    redirect: '/health/index',
    children: [
      {
        path: 'index',
        component: NotImplemented,
        name: 'Health',
        meta: { title: 'avaliacoeseinspecoes', icon: 'health', affix: true, requiresAuth: false }
      }
    ],
    meta: { resource: 'saudeeseguranca', icon: 'health' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
})

export default router
