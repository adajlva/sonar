import api from './api'

export async function getAdmissionById(admissionId) {
  return api.get(`/admission/${admissionId}`)
}
