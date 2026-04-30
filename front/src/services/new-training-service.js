/**
 * Mock — Integração e Treinamento > Cadastros (23113)
 * Garante `schedules` coerente com tipo / quantidade (comportamento esperado pelo planejamento).
 */
const mockTraining = (overrides = {}) => ({
  _id: 'nt-mock-1',
  name: 'NR-35 Trabalho em Altura',
  referenceYear: 2025,
  objective: 'Capacitar colaboradores em normas de segurança',
  indicator: null,
  value: null,
  keywords: ['NR-35', 'altura'],
  type: 'schedules',
  status: 'completed',
  accountInPerformanceModule: false,
  isRecurringPlanning: false,
  isRequired: true,
  qtdDaysAfterTheStartService: null,
  qtdNewTrainingSchedules: 3,
  certificateTemplate: null,
  newTrainingGrid: null,
  unities: [],
  bonds: [],
  positionTypes: [],
  positions: [],
  personBonds: [],
  positionRoles: [],
  correspondingIdInPerformanceModule: null,
  createdByAdmin: false,
  admittedFrom: null,
  schedules: [],
  /** IDs (referenceId) elegíveis no planejamento; não encolhe ao subconjunto salvo */
  unitiesCadastro: [],
  /** Unidades já planejadas (acúmulo a cada save no fluxo agendamentos não recorrente) */
  plannedUnityRefs: [],
  client: 'demo-client',
  ...overrides
})

function emptySchedule(trainingId, suffix) {
  return {
    _id: `${trainingId}-sch-${suffix}`,
    startDate: null,
    endDate: null,
    timeDuration: null,
    newTrainingForm: null,
    newTrainingEvaluation: null,
    instructor: null,
    addedPersonBonds: [],
    removedPersonBonds: []
  }
}

/** Alinha ao fluxo DMPeople: agendamentos = N blocos por estrutura no cadastro; dias após = 1 bloco simplificado */
export function ensureSchedules(training) {
  const t = JSON.parse(JSON.stringify(training))
  if (!Array.isArray(t.schedules)) t.schedules = []

  if (t.type === 'schedules') {
    const m = Math.max(1, Number(t.qtdNewTrainingSchedules) || 1)
    const refCount =
      Array.isArray(t.unitiesCadastro) && t.unitiesCadastro.length
        ? t.unitiesCadastro.length
        : Array.isArray(t.unities) && t.unities.length
          ? t.unities.length
          : 0
    const perStructureTotal =
      refCount > 0 ? refCount * m : m
    const count = Math.max(
      1,
      perStructureTotal,
      t.schedules.length || 0
    )
    let n = t.schedules.length
    while (n < count) {
      t.schedules.push(emptySchedule(t._id, n + 1))
      n++
    }
    t.schedules.forEach((sch, i) => {
      if (!sch._id) sch._id = `${t._id}-sch-${i + 1}`
      if (!Array.isArray(sch.addedPersonBonds)) sch.addedPersonBonds = []
      if (!Array.isArray(sch.removedPersonBonds)) sch.removedPersonBonds = []
    })
  } else if (t.type === 'days_after_the_start_service') {
    const uCad = Array.isArray(t.unitiesCadastro) && t.unitiesCadastro.length
      ? t.unitiesCadastro.length
      : Array.isArray(t.unities)
        ? t.unities.length
        : 0
    const target = Math.max(1, uCad || 1, t.schedules.length)
    let n = t.schedules.length
    while (n < target) {
      n += 1
      t.schedules.push(emptySchedule(t._id, `d${n}`))
    }
    t.schedules.forEach((sch, i) => {
      if (!sch._id) sch._id = `${t._id}-sch-d${i + 1}`
      if (!Array.isArray(sch.addedPersonBonds)) sch.addedPersonBonds = []
      if (!Array.isArray(sch.removedPersonBonds)) sch.removedPersonBonds = []
    })
  }

  const u = Array.isArray(t.unities) ? t.unities : []
  if (!Array.isArray(t.unitiesCadastro) || !t.unitiesCadastro.length) {
    t.unitiesCadastro = [...u]
  }
  if (!Array.isArray(t.plannedUnityRefs)) {
    t.plannedUnityRefs = []
  }

  return t
}

let mockList = [
  mockTraining({
    _id: 'nt-1',
    name: 'NR-35 Trabalho em Altura',
    status: 'completed',
    bonds: ['b1'],
    positions: ['p3'],
    positionRoles: ['r2'],
    unities: ['u4'],
    unitiesCadastro: ['u4']
  }),
  mockTraining({
    _id: 'nt-2',
    name: 'Integração Corporativa',
    status: 'in_progress',
    type: 'days_after_the_start_service',
    qtdDaysAfterTheStartService: 30,
    qtdNewTrainingSchedules: null,
    isRecurringPlanning: true,
    unities: ['u4', 'u4b'],
    unitiesCadastro: ['u4', 'u4b']
  }),
  mockTraining({ _id: 'nt-3', name: 'Segurança da Informação', status: 'scheduled', isRequired: false }),
  mockTraining({ _id: 'nt-4', name: 'LGPD — Fundamentos', status: 'draft' })
]

function filterList(client, word, filter) {
  let list = [...mockList]
  if (word) {
    const w = String(word).toLowerCase()
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(w) ||
        (t.objective && t.objective.toLowerCase().includes(w))
    )
  }
  if (filter && filter.status) {
    list = list.filter((t) => t.status === filter.status)
  }
  if (filter && filter.isRequired != null && filter.isRequired !== '') {
    list = list.filter((t) => t.isRequired === filter.isRequired)
  }
  if (filter && filter.referenceYear) {
    list = list.filter((t) => t.referenceYear === filter.referenceYear)
  }
  return list
}

export const newTrainingService = {
  getByKeywordAndFilter(client, word, filter, limit, page) {
    const all = filterList(client, word, filter || {})
    const lim = limit || 20
    const p = Math.max(1, page || 1)
    const start = (p - 1) * lim
    const docs = all.slice(start, start + lim)
    const totalPages = Math.max(1, Math.ceil(all.length / lim))
    return Promise.resolve({ data: { docs, totalPages } })
  },

  getById(id, _options, _includesDeleted) {
    const idx = mockList.findIndex((t) => t._id === id)
    const raw =
      idx >= 0 ? mockList[idx] : mockTraining({ _id: id, name: 'Treinamento (mock)' })
    const data = ensureSchedules(JSON.parse(JSON.stringify(raw)))
    if (idx >= 0) mockList[idx] = data
    return Promise.resolve({ data: JSON.parse(JSON.stringify(data)) })
  },

  save(payload) {
    const id = payload._id || `nt-${Date.now()}`
    const merged = mockTraining({ ...payload, _id: id })
    const u = merged.unities || []
    merged.unitiesCadastro = [...u]
    const saved = ensureSchedules(merged)
    const i = mockList.findIndex((t) => t._id === saved._id)
    if (i >= 0) mockList[i] = saved
    else mockList.push(saved)
    return Promise.resolve({ data: JSON.parse(JSON.stringify(saved)) })
  },

  updateSchedules(id, body) {
    const schedules = body.schedules ? JSON.parse(JSON.stringify(body.schedules)) : []
    const t = mockList.find((x) => x._id === id)
    if (t) {
      t.schedules = schedules
      if (Array.isArray(body.unities) && body.unities.length) {
        t.plannedUnityRefs = [
          ...new Set([...(t.plannedUnityRefs || []), ...body.unities])
        ]
      }
      if (t.unitiesCadastro && t.unitiesCadastro.length) {
        t.unities = [...t.unitiesCadastro]
      } else if (body.unities != null) {
        t.unities = [...body.unities]
      }
    }
    return Promise.resolve({
      data: { _id: id, schedules, unities: body.unities }
    })
  },

  removePlannedUnityRefs(id, refsToRemove) {
    const t = mockList.find((x) => x._id === id)
    if (t && Array.isArray(refsToRemove) && refsToRemove.length) {
      const remove = new Set(refsToRemove)
      t.plannedUnityRefs = (t.plannedUnityRefs || []).filter((r) => !remove.has(r))
    }
    return Promise.resolve()
  },

  duplicate(id, name, toClient) {
    const src = mockList.find((t) => t._id === id)
    const copy = ensureSchedules(
      mockTraining({
        ...src,
        _id: `nt-copy-${Date.now()}`,
        name: name || (src && src.name ? `${src.name} (cópia)` : 'Cópia'),
        toClient: toClient || undefined
      })
    )
    mockList.push(copy)
    return Promise.resolve({ data: copy })
  },

  delete(id) {
    mockList = mockList.filter((t) => t._id !== id)
    return Promise.resolve({ data: {} })
  }
}
