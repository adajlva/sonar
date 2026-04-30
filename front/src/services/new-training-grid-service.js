const mockGrid = {
  _id: 'grid-1',
  name: 'Grade padrão — Operações',
  client: 'demo-client',
  tree: []
}

const gridNode = (_id, name, allowTrainingsAtThisLevel, children = []) => ({
  _id,
  name,
  allowTrainingsAtThisLevel,
  children
})

/**
 * Mock — árvores de Grade (Treeselect).
 * Só nós com allowTrainingsAtThisLevel: true são elegíveis para alocação.
 */
const mockGridTreeRoots = [
  gridNode('grid-ops', 'Grade — Operações & Supply', false, [
    gridNode('grid-ops-dir', 'Diretoria operações', false, [
      gridNode('grid-ops-sup', 'Supervisão de planta', false, [
        gridNode('grid-ops-unidade', 'Alocação treinamento — unidade produtiva', true, [])
      ])
    ])
  ])
]

export const newTrainingGridService = {
  getByClient(client, limit, page) {
    return Promise.resolve({
      data: {
        docs: [mockGrid],
        totalPages: 1,
        totalDocs: 1
      }
    })
  },
  getTreeByClient(client) {
    return Promise.resolve({
      data: mockGridTreeRoots
    })
  },
  save(body) {
    return Promise.resolve({ data: { ...mockGrid, ...body, _id: body._id || 'grid-new' } })
  },
  delete() {
    return Promise.resolve({ data: {} })
  }
}
