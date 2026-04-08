const mockDocs = [
  {
    _id: 'pb1',
    person: { _id: 'per1', name: 'Alanna Stefani dos Santos', document: '14131847737' },
    personBond: { _id: 'bond1' },
    admissionDate: '2024-01-10',
    dismissalDate: null,
    bond: 'b1',
    position: 'p3',
    unity: 'u1',
    role: 'r2'
  },
  {
    _id: 'pb2',
    person: { _id: 'per2', name: 'Alexandre Fattori Junior', document: '132312123321' },
    personBond: { _id: 'bond2' },
    admissionDate: '2025-01-15',
    dismissalDate: null,
    bond: 'b1',
    position: 'p1',
    unity: 'u1',
    role: 'r2'
  },
  {
    _id: 'pb3',
    person: { _id: 'per3', name: 'Bruno Carvalho Mendes', document: '52987654001' },
    personBond: { _id: 'bond3' },
    admissionDate: '2023-06-01',
    dismissalDate: null,
    bond: 'b2',
    position: 'p5',
    unity: 'u2',
    role: 'r3'
  },
  {
    _id: 'pb4',
    person: { _id: 'per4', name: 'Carla Nunes Ferreira', document: '98765432100' },
    personBond: { _id: 'bond4' },
    admissionDate: '2024-03-20',
    dismissalDate: null,
    bond: 'b1',
    position: 'p7',
    unity: 'u2b',
    role: 'r2'
  },
  {
    _id: 'pb5',
    person: { _id: 'per5', name: 'Diego Ramos Silva', document: '45678912345' },
    personBond: { _id: 'bond5' },
    admissionDate: '2022-11-11',
    dismissalDate: null,
    bond: 'b1',
    position: 'p9',
    unity: 'u1c',
    role: 'r4'
  },
  {
    _id: 'pb6',
    person: { _id: 'per6', name: 'Eduarda Martins Costa', document: '32165498700' },
    personBond: { _id: 'bond6' },
    admissionDate: '2024-08-01',
    dismissalDate: null,
    bond: 'b3',
    position: 'p10',
    unity: 'u1',
    role: 'r2'
  },
  {
    _id: 'pb7',
    person: { _id: 'per7', name: 'Felipe Oliveira Souza', document: '11122233344' },
    personBond: { _id: 'bond7' },
    admissionDate: '2023-02-14',
    dismissalDate: null,
    bond: 'b4',
    position: 'p8',
    unity: 'u2',
    role: 'r3'
  },
  {
    _id: 'pb8',
    person: { _id: 'per8', name: 'Gabriela Rocha Lima', document: '55566677788' },
    personBond: { _id: 'bond8' },
    admissionDate: '2025-03-10',
    dismissalDate: null,
    bond: 'b1',
    position: 'p14',
    unity: 'u3',
    role: 'r2'
  },
  {
    _id: 'pb9',
    person: { _id: 'per9', name: 'Henrique Dias Pereira', document: '99988877766' },
    personBond: { _id: 'bond9' },
    admissionDate: '2022-05-22',
    dismissalDate: null,
    bond: 'b2',
    position: 'p21',
    unity: 'u4',
    role: 'r3'
  },
  {
    _id: 'pb10',
    person: { _id: 'per10', name: 'Isabela Freitas Cardoso', document: '44433322211' },
    personBond: { _id: 'bond10' },
    admissionDate: '2024-11-30',
    dismissalDate: null,
    bond: 'b1',
    position: 'p24',
    unity: 'u2d',
    role: 'r2'
  },
  {
    _id: 'pb11',
    person: { _id: 'per11', name: 'João Victor Almeida', document: '12312312399' },
    personBond: { _id: 'bond11' },
    admissionDate: '2023-09-09',
    dismissalDate: null,
    bond: 'b5',
    position: 'p30',
    unity: 'u5',
    role: 'r2'
  },
  {
    _id: 'pb12',
    person: { _id: 'per12', name: 'Karina Duarte Pires', document: '88877766655' },
    personBond: { _id: 'bond12' },
    admissionDate: '2025-01-20',
    dismissalDate: null,
    bond: 'b1',
    position: 'p18',
    unity: 'u1b',
    role: 'r6'
  }
]

function filterByCriteria(docs, filter) {
  if (!filter || typeof filter !== 'object') return docs
  const bonds = filter.bonds || []
  const positions = filter.positions || []
  const roles = filter.roles || []
  const unities = filter.unities || []
  return docs.filter((d) => {
    if (bonds.length && !bonds.includes(d.bond)) return false
    if (positions.length && !positions.includes(d.position)) return false
    if (unities.length && !unities.includes(d.unity)) return false
    if (roles.length && !roles.includes(d.role)) return false
    return true
  })
}

/**
 * Assinatura alinhada ao DMPeople: (client, limit, page, term, filter, populate, excludedIds)
 */
export function getByFilterAndName(client, limit, page, term, _filter, _populate, excludedIds = []) {
  const ex = new Set(excludedIds || [])
  let docs = mockDocs.filter((d) => !ex.has(d._id))
  docs = filterByCriteria(docs, _filter)
  const t = term && String(term).trim()
  if (t) {
    docs = docs.filter(
      (d) =>
        d.person.name.toLowerCase().includes(t.toLowerCase()) ||
        d.person.document.includes(t)
    )
  }
  const lim = limit != null ? Number(limit) : docs.length
  const pg = page != null ? Math.max(1, Number(page)) : 1
  const start = (pg - 1) * lim
  const pageDocs = lim > 0 ? docs.slice(start, start + lim) : docs
  return Promise.resolve({
    data: {
      docs: pageDocs,
      totalDocs: docs.length,
      totalPages: lim > 0 ? Math.max(1, Math.ceil(docs.length / lim)) : 1
    }
  })
}
