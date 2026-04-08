/** Mock clientes para cópia/duplicação de treinamento */
export const clientService = {
  get() {
    return Promise.resolve({
      data: [
        { _id: 'c1', code: 'demo-client', tradeName: 'Cliente Demo', deleted: false },
        { _id: 'c2', code: 'ALLIS', tradeName: 'ALLIS LOGÍSTICA', deleted: false }
      ]
    })
  },
  getByUserClients(clients) {
    return Promise.resolve({
      data: (clients && clients.length
        ? clients.map((c, i) => ({ _id: `uc${i}`, code: c, tradeName: `Cliente ${c}`, deleted: false }))
        : [{ _id: 'c1', code: 'demo-client', tradeName: 'Cliente Demo', deleted: false }])
    })
  }
}
