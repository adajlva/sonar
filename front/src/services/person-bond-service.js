/**
 * Mock de vínculos de pessoa × estrutura para o autocomplete
 * "Quais colaboradores participarão do treinamento?" (cadastro) e o planejamento.
 * Cada estrutura (unity) tem exatamente 5 colaboradores mockados; com N estruturas
 * selecionadas, o filtro retorna até 5×N opções. Não é regra de negócio ao salvar.
 */
/**
 * Quando o usuário marca uma região ou a raiz no Treeselect, o filtro envia o
 * referenceId do nó pai — os mocks só têm `unity` nas folhas. Expandimos pais
 * para as folhas que existem em UNITY_REFS_FOR_SEED.
 */
const UNITY_PARENT_TO_LEAVES = {
  'client-demo': ['u4', 'u4b'],
  'reg-centro-oeste': ['u4', 'u4b']
}

function expandUnityFilterRefs(unities) {
  if (!Array.isArray(unities) || !unities.length) return unities
  const set = new Set()
  for (const ref of unities) {
    const leaves = UNITY_PARENT_TO_LEAVES[ref]
    if (leaves && leaves.length) {
      leaves.forEach((id) => set.add(id))
    } else {
      set.add(ref)
    }
  }
  return [...set]
}

/** Folhas da árvore em unity-service (mock) */
const UNITY_REFS_FOR_SEED = ['u4', 'u4b']

/** 5 colaboradores mockados por estrutura; rotaciona cargos para o multiselect achar resultados */
const PER_UNITY_SEED = 5
const POSITION_CYCLE = [
  'p3',
  'p5',
  'p1',
  'p7',
  'p9',
  'p14',
  'p24',
  'p8',
  'p10',
  'p16',
  'p11',
  'p12'
]

/** Nomes completos fictícios (estilo BR) — sem numeração no exibido */
const FICTITIOUS_PERSON_NAMES = [
  'Ana Carolina Mendes Souza',
  'Ricardo Oliveira Lima',
  'Fernanda Rodrigues Costa',
  'Carlos Eduardo Almeida Nascimento',
  'Patrícia Gomes Duarte',
  'Lucas Martins Ferreira',
  'Juliana Ribeiro Cavalcanti',
  'Felipe Santos Barbosa',
  'Mariana Lopes Teixeira',
  'André Henrique Carvalho',
  'Camila Freitas Monteiro',
  'Rodrigo Pereira Azevedo',
  'Beatriz Nogueira Ramos',
  'Thiago Moura Cardoso',
  'Larissa Dias Fonseca',
  'Bruno Augusto Correia',
  'Amanda Vieira Machado',
  'Guilherme Castro Rocha',
  'Isabela Pinto Guimarães',
  'Diego Fernandes Lacerda',
  'Renata Cunha Batista',
  'Paulo Roberto Melo',
  'Vanessa Teles Arruda',
  'Matheus Sales Moreira',
  'Priscila Holanda Prado',
  'Gustavo Henrique Farias',
  'Tatiane Borges Coelho',
  'Eduardo Mattos Peixoto',
  'Simone Aguiar Tavares',
  'Leonardo Rezende Pacheco',
  'Daniela Brito Magalhães',
  'Fábio Luís Mesquita',
  'Cristiane Moura Siqueira',
  'João Victor Andrade',
  'Eliane Porto Vasconcelos',
  'Henrique Galvão Bueno',
  'Raquel Muniz Torquato',
  'Vinícius Paiva Damasceno',
  'Adriana Lessa Bandeira',
  'Marcelo Silveira Pontes',
  'Bianca Drummond Borghetti',
  'Rafael Costa Valadares',
  'Letícia Amaral Figueiredo',
  'Otávio Mendonça Seixas',
  'Silvia Regina Toledo',
  'Igor Camargo Bastos',
  'Natália Freire Borba',
  'Alexandre Pinho Salgado',
  'Michele Antunes Viana',
  'Renan Coimbra Godoi',
  'Carolina Xavier Diniz',
  'Douglas Mota Parente',
  'Sabrina Lemos Arantes',
  'Wagner Prado Cantuária',
  'Flávia Monte Negreiros',
  'Emerson Duarte Guimarães',
  'Jéssica Brandão Silveira',
  'Alex Sandro Reis Coutinho',
  'Monique Teodoro Lins',
  'Antônio Sérgio Freire',
  'Helena Cruz Sacramento',
  'Caio Nunes Pedrosa',
  'Cláudia Moura Aguiar',
  'Leandro César Medeiros',
  'Débora Falcão Tenório',
  'Sérgio Luís Maranhão',
  'Elisa Andrade Queiroz',
  'Marcos Vinícius Dantas',
  'Lúcia Helena Trovão',
  'Roberto Cláudio Pinheiro',
  'Aline Ferreira Mattos',
  'Nelson Franco Cabral',
  'Karina Spínola Vilela',
  'Pedro Augusto Furtado',
  'Solange Meireles Braga',
  'Everton Silva Noronha',
  'Regina Célia Fontes',
  'Evandro Costa Guimarães',
  'Meire Oliveira Dourado',
  'Júlio César Honório',
  'Rosângela Peixoto Lima',
  'Danilo Freitas Abreu',
  'Viviane Costa Mello',
  'Márcio Antônio Rezende',
  'Tânia Mara Cardoso',
  'Cláudio Roberto Malta',
  'Sandra Regina Passos',
  'Fabiano Duarte Lopes',
  'Neide Santos Arruda',
  'Rogério Melo Freitas',
  'Inês Cristina Novaes',
  'Nilson Pereira Braga',
  'Valéria Cristina Mota',
  'Edson Luís Carneiro',
  'Mônica Silveira Torres',
  'Gilberto Ramos Esteves',
  'Teresa Cristina Paes',
  'Osvaldo Mendes Cruz',
  'Zilda Ferreira Basílio',
  'Orlando Costa Matos',
  'Norma Suely Damasceno',
  'Mário Sérgio Freitas',
  'Iraci Mendonça Leite'
]

function mockPersonName(unityIndex, slotIndex) {
  const k =
    (unityIndex * PER_UNITY_SEED + slotIndex) %
    FICTITIOUS_PERSON_NAMES.length
  return FICTITIOUS_PERSON_NAMES[k]
}

function buildMockDocs() {
  const rows = []
  let seq = 0
  UNITY_REFS_FOR_SEED.forEach((unity, unityIndex) => {
    for (let i = 0; i < PER_UNITY_SEED; i++) {
      seq += 1
      const id = `pb-${unity}-${i}`
      const position = POSITION_CYCLE[i % POSITION_CYCLE.length]
      rows.push({
        _id: id,
        person: {
          _id: `per-${unity}-${i}`,
          name: mockPersonName(unityIndex, i),
          document: String(10000000000 + seq).slice(0, 11)
        },
        personBond: { _id: `bond-${unity}-${i}` },
        admissionDate: '2024-01-10',
        dismissalDate: null,
        bond: 'b1',
        position,
        unity,
        role: 'r2'
      })
    }
  })
  return rows
}

const mockDocs = buildMockDocs()

function filterByCriteria(docs, filter) {
  if (!filter || typeof filter !== 'object') return docs
  const bonds = filter.bonds || []
  const positions = filter.positions || []
  const roles = filter.roles || []
  const unities = expandUnityFilterRefs(filter.unities || [])
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
