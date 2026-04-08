/** Mock — Tipo de vínculo (multiselect cadastro de treinamento) */
export function getBondsByClient(_client) {
  return Promise.resolve({
    data: [
      { _id: 'b1', name: 'CLT' },
      { _id: 'b2', name: 'Temporário' },
      { _id: 'b3', name: 'Estágio' },
      { _id: 'b4', name: 'PJ / Prestador de serviço' },
      { _id: 'b5', name: 'Aprendiz' },
      { _id: 'b6', name: 'Intermitente' },
      { _id: 'b7', name: 'Cooperado' },
      { _id: 'b8', name: 'Bolsista / trainee programa' },
      { _id: 'b9', name: 'Menor aprendiz' },
      { _id: 'b10', name: 'Diretor não empregado (administração)' }
    ]
  })
}
