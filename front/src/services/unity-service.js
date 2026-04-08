/** Mesmo formato esperado por normalizerUnity; `children` sempre array (evita quebra no reduce do formulário). */
const unityNode = (referenceId, name, children = []) => ({
  referenceId,
  name,
  monitoringEndDate: null,
  children
})

/** Mock — Estrutura (Treeselect multiselect) para cadastro de treinamento */
const mockUnityTree = () =>
  unityNode('client-demo', 'Cliente Demo — Holding Brasil', [
    unityNode('reg-sul', 'Região Sul', [
      unityNode('u1', 'Matriz — Porto Alegre / RS'),
      unityNode('u1b', 'Filial — Caxias do Sul / RS'),
      unityNode('u1c', 'CD — Gravataí / RS'),
      unityNode('u1d', 'Filial — Florianópolis / SC')
    ]),
    unityNode('reg-sudeste', 'Região Sudeste', [
      unityNode('u2', 'Escritório corporativo — São Paulo / SP'),
      unityNode('u2b', 'Filial — Campinas / SP'),
      unityNode('u2c', 'Hub logístico — Guarulhos / SP'),
      unityNode('u2d', 'Filial — Rio de Janeiro / RJ'),
      unityNode('u2e', 'Filial — Belo Horizonte / MG')
    ]),
    unityNode('reg-nordeste', 'Região Nordeste', [
      unityNode('u3', 'Filial — Salvador / BA'),
      unityNode('u3b', 'Filial — Recife / PE'),
      unityNode('u3c', 'Filial — Fortaleza / CE')
    ]),
    unityNode('reg-centro-oeste', 'Região Centro-Oeste', [
      unityNode('u4', 'Filial — Brasília / DF'),
      unityNode('u4b', 'Filial — Goiânia / GO')
    ]),
    unityNode('reg-norte', 'Região Norte', [
      unityNode('u5', 'Filial — Manaus / AM')
    ])
  ])

export const unityService = {
  getTreeByHierarchy() {
    /* Raiz em array: Treeselect + allUnities.reduce esperam lista de nós raiz */
    return Promise.resolve({
      data: [mockUnityTree()]
    })
  },
  getTreeByClient() {
    return Promise.resolve({
      data: [mockUnityTree()]
    })
  }
}
