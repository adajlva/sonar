/** Mesmo formato esperado por normalizerUnity; `children` sempre array (evita quebra no reduce do formulário). */
const unityNode = (referenceId, name, children = []) => ({
  referenceId,
  name,
  monitoringEndDate: null,
  children
})

/** Mock — Estrutura (Treeselect multiselect): somente Região Centro-Oeste */
const mockUnityTree = () =>
  unityNode('client-demo', 'Cliente Demo — Holding Brasil', [
    unityNode('reg-centro-oeste', 'Região Centro-Oeste', [
      unityNode('u4', 'Filial — Brasília / DF'),
      unityNode('u4b', 'Filial — Goiânia / GO')
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
