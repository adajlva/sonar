/**
 * Mock — Cargos (multiselect "quais cargos devem participar").
 * Cada cargo tem type._id alinhado a position-type-service e roles filtráveis.
 */
const r = (id, label) => ({ _id: id, role: label, name: label })

const R = {
  r1: r('r1', 'Liderança'),
  r2: r('r2', 'Colaborador'),
  r3: r('r3', 'Especialista'),
  r4: r('r4', 'Apoio'),
  r5: r('r5', 'Supervisão'),
  r6: r('r6', 'Coordenação'),
  r7: r('r7', 'Mentor / buddy'),
  r8: r('r8', 'Fiscal / auditoria interna'),
  r9: r('r9', 'Substituto eventual'),
  r10: r('r10', 'Estagiário em cargo-chave')
}

export function getPositionsByClient(_client) {
  return Promise.resolve({
    data: [
      // Operacional (pt1)
      { _id: 'p1', name: 'Ajudante de distribuição', type: { _id: 'pt1' }, roles: [R.r1, R.r2, R.r4] },
      { _id: 'p2', name: 'Operador de empilhadeira', type: { _id: 'pt1' }, roles: [R.r2, R.r3, R.r5] },
      { _id: 'p11', name: 'Auxiliar de produção', type: { _id: 'pt1' }, roles: [R.r2, R.r4] },
      { _id: 'p12', name: 'Montador industrial', type: { _id: 'pt1' }, roles: [R.r2, R.r3] },
      { _id: 'p13', name: 'Operador de máquinas', type: { _id: 'pt1' }, roles: [R.r2, R.r5, R.r6] },
      // Administrativo (pt2)
      { _id: 'p3', name: 'Analista de RH', type: { _id: 'pt2' }, roles: [R.r2, R.r3] },
      { _id: 'p4', name: 'Coordenador administrativo', type: { _id: 'pt2' }, roles: [R.r1, R.r2, R.r6] },
      { _id: 'p14', name: 'Assistente administrativo', type: { _id: 'pt2' }, roles: [R.r2, R.r4] },
      { _id: 'p15', name: 'Recepcionista bilíngue', type: { _id: 'pt2' }, roles: [R.r2] },
      // Comercial (pt3)
      { _id: 'p5', name: 'Representante comercial', type: { _id: 'pt3' }, roles: [R.r2, R.r3] },
      { _id: 'p6', name: 'Gerente de contas', type: { _id: 'pt3' }, roles: [R.r1, R.r2] },
      { _id: 'p16', name: 'Inside sales', type: { _id: 'pt3' }, roles: [R.r2, R.r3] },
      { _id: 'p17', name: 'Key account specialist', type: { _id: 'pt3' }, roles: [R.r3, R.r6] },
      // Tecnologia (pt4)
      { _id: 'p7', name: 'Desenvolvedor de software', type: { _id: 'pt4' }, roles: [R.r2, R.r3] },
      { _id: 'p8', name: 'Analista de sistemas', type: { _id: 'pt4' }, roles: [R.r2, R.r3, R.r4] },
      { _id: 'p18', name: 'Product owner', type: { _id: 'pt4' }, roles: [R.r1, R.r3, R.r6] },
      { _id: 'p19', name: 'Suporte técnico N2', type: { _id: 'pt4' }, roles: [R.r2, R.r3] },
      // Logística (pt5)
      { _id: 'p9', name: 'Motorista carreteiro', type: { _id: 'pt5' }, roles: [R.r2, R.r4] },
      { _id: 'p10', name: 'Conferente de carga', type: { _id: 'pt5' }, roles: [R.r2, R.r4] },
      { _id: 'p20', name: 'Planejador de rotas', type: { _id: 'pt5' }, roles: [R.r2, R.r3, R.r6] },
      // Saúde ocupacional (pt6)
      { _id: 'p21', name: 'Técnico em segurança do trabalho', type: { _id: 'pt6' }, roles: [R.r2, R.r3, R.r8] },
      { _id: 'p22', name: 'Enfermeiro do trabalho', type: { _id: 'pt6' }, roles: [R.r2, R.r3] },
      { _id: 'p23', name: 'Médico do trabalho', type: { _id: 'pt6' }, roles: [R.r1, R.r3] },
      // Financeiro (pt7)
      { _id: 'p24', name: 'Analista financeiro', type: { _id: 'pt7' }, roles: [R.r2, R.r3] },
      { _id: 'p25', name: 'Assistente fiscal', type: { _id: 'pt7' }, roles: [R.r2, R.r4] },
      { _id: 'p26', name: 'Controller júnior', type: { _id: 'pt7' }, roles: [R.r3, R.r6] },
      // Jurídico (pt8)
      { _id: 'p27', name: 'Advogado corporativo', type: { _id: 'pt8' }, roles: [R.r1, R.r3] },
      { _id: 'p28', name: 'Assessor jurídico', type: { _id: 'pt8' }, roles: [R.r2, R.r3] },
      // RH (pt9)
      { _id: 'p29', name: 'Business partner de RH', type: { _id: 'pt9' }, roles: [R.r2, R.r3, R.r6] },
      { _id: 'p30', name: 'Analista de recrutamento', type: { _id: 'pt9' }, roles: [R.r2, R.r3] },
      { _id: 'p31', name: 'Generalista de RH', type: { _id: 'pt9' }, roles: [R.r2, R.r3] },
      // Facilities (pt10)
      { _id: 'p32', name: 'Técnico de manutenção', type: { _id: 'pt10' }, roles: [R.r2, R.r3] },
      { _id: 'p33', name: 'Encarregado de facilities', type: { _id: 'pt10' }, roles: [R.r1, R.r5, R.r6] }
    ]
  })
}
