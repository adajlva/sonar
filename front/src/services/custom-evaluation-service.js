const mockEvals = [
  {
    _id: 'eval-mock-1',
    name: 'Avaliação de reação — treinamento',
    client: 'demo-client',
    module: '507f1f77bcf86cd799439011',
    description: 'Percepção imediata após a sessão (mock).',
    hasScore: true,
    maximumScore: 10,
    minimumScore: 0,
    formTemplate: {
      groups: [],
      fields: [],
      queries: [],
      createdByAdmin: false
    },
    answered: 3
  },
  {
    _id: 'eval-mock-2',
    name: 'Avaliação de aprendizado — mock',
    client: 'demo-client',
    module: '507f1f77bcf86cd799439011',
    description: 'Verificação de conhecimento pós-treinamento (mock).',
    hasScore: true,
    maximumScore: 100,
    minimumScore: 0,
    formTemplate: {
      groups: [],
      fields: [],
      queries: [],
      createdByAdmin: false
    },
    answered: 0
  }
]

export const customEvaluationService = {
  getByModuleAndClient(module, pageNumber, limit = 20, keyword) {
    const kw = keyword && String(keyword).trim()
    const docs = kw
      ? mockEvals.filter((e) =>
          e.name.toLowerCase().includes(kw.toLowerCase())
        )
      : mockEvals
    return Promise.resolve({
      data: {
        docs,
        totalPages: 1,
        totaldocs: docs.length
      }
    })
  },
  getByModuleAndClientWithoutPagination() {
    return Promise.resolve({ data: [...mockEvals] })
  },
  getById(id) {
    const found = mockEvals.find((e) => e._id === id) || mockEvals[0]
    return Promise.resolve({ data: { ...found, _id: id } })
  },
  save(evaluation) {
    const base = mockEvals[0]
    return Promise.resolve({
      data: { ...base, ...evaluation, _id: evaluation._id || base._id }
    })
  },
  delete() {
    return Promise.resolve({ data: {} })
  }
}
