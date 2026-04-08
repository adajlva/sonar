const baseForm = (overrides = {}) => ({
  client: 'demo-client',
  module: '507f1f77bcf86cd799439011',
  answerPath: 'new-training-form-answer',
  description: 'Dados mockados — avaliação de reação (treinamento)',
  integratesWithGEG: false,
  formTemplate: {
    groups: [{ id: 'g1', title: 'Avaliação de reação' }],
    fields: [],
    queries: [],
    createdByAdmin: false
  },
  answered: 0,
  ...overrides
})

/** Formulários usados no planejamento como “Avaliação de reação” (newTrainingForm) */
const mockReactionForms = [
  baseForm({
    _id: 'form-reacao-1',
    name: 'Avaliação de reação — satisfação imediata (NPS)'
  }),
  baseForm({
    _id: 'form-reacao-2',
    name: 'Avaliação de reação — relevância e aplicabilidade'
  }),
  baseForm({
    _id: 'form-reacao-3',
    name: 'Avaliação de reação — instrutor e material didático'
  }),
  baseForm({
    _id: 'form-reacao-4',
    name: 'Avaliação de reação — ambiente e logística'
  }),
  baseForm({
    _id: 'form-reacao-5',
    name: 'Avaliação de reação — Kirkpatrick nível 1 (reação)'
  })
]

const mockForm = mockReactionForms[0]

export const customFormService = {
  getById(id) {
    const found =
      mockReactionForms.find((f) => f._id === id) ||
      { ...mockForm, _id: id || mockForm._id }
    return Promise.resolve({ data: found })
  },
  getByClientModule(client, module, limit, page) {
    return Promise.resolve({
      data: {
        docs: [...mockReactionForms],
        totalPages: 1,
        totalDocs: mockReactionForms.length
      }
    })
  },
  save(form) {
    return Promise.resolve({ data: { ...mockForm, ...form, _id: form._id || mockForm._id } })
  }
}
