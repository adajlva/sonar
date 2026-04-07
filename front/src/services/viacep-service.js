import axios from 'axios'

export async function findByCEP(cep) {
  return axios.get(`https://viacep.com.br/ws/${cep}/json/`)
}
