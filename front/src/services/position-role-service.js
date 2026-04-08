/** Mock — Funções / papéis (multiselect "quais funções participarão") */
export const positionRoleService = {
  getByClient(_client) {
    return Promise.resolve({
      data: [
        { _id: 'r1', role: 'Liderança', name: 'Liderança' },
        { _id: 'r2', role: 'Colaborador', name: 'Colaborador' },
        { _id: 'r3', role: 'Especialista', name: 'Especialista' },
        { _id: 'r4', role: 'Apoio', name: 'Apoio' },
        { _id: 'r5', role: 'Supervisão', name: 'Supervisão' },
        { _id: 'r6', role: 'Coordenação', name: 'Coordenação' },
        { _id: 'r7', role: 'Mentor / buddy', name: 'Mentor / buddy' },
        { _id: 'r8', role: 'Fiscal / auditoria interna', name: 'Fiscal / auditoria interna' },
        { _id: 'r9', role: 'Substituto eventual', name: 'Substituto eventual' },
        { _id: 'r10', role: 'Estagiário em cargo-chave', name: 'Estagiário em cargo-chave' }
      ]
    })
  }
}
