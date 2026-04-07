import api from './api'

export async function upload(formData) {
  return api.post('/storage/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export async function findById(id) {
  return api.get(`/storage/${id}`)
}
