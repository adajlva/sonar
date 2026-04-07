export function getInfo() {
  return Promise.resolve({ data: { name: 'Usuário', avatar: '' } })
}

export function login(data) {
  return Promise.resolve({ data })
}

export function logout() {
  return Promise.resolve({})
}
