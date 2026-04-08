/** Mock — Tipos de cargos (multiselect usa label `type`) */
export const positionTypeService = {
  getByClient(_client) {
    return Promise.resolve({
      data: [
        { _id: 'pt1', type: 'Operacional', name: 'Operacional' },
        { _id: 'pt2', type: 'Administrativo', name: 'Administrativo' },
        { _id: 'pt3', type: 'Comercial', name: 'Comercial' },
        { _id: 'pt4', type: 'Tecnologia', name: 'Tecnologia' },
        { _id: 'pt5', type: 'Logística', name: 'Logística' },
        { _id: 'pt6', type: 'Saúde ocupacional', name: 'Saúde ocupacional' },
        { _id: 'pt7', type: 'Financeiro', name: 'Financeiro' },
        { _id: 'pt8', type: 'Jurídico', name: 'Jurídico' },
        { _id: 'pt9', type: 'Recursos humanos', name: 'Recursos humanos' },
        { _id: 'pt10', type: 'Facilities / manutenção', name: 'Facilities / manutenção' }
      ]
    })
  }
}
