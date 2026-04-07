import api from './api'

export async function getByDocumentAndClient(document, client) {
  return api.get(`/person-bond/document/${document}/client/${client}`)
}

export async function getBondsByAdmissionIdWithDeleted(admissionId) {
  return api.get(`/admission/${admissionId}`)
}

export async function getBondsSearch(client, limit, page, person, unity, userBondId) {
  return api.get(`/person-bond/search`, {
    params: { client, limit, page, person, unity, userBondId }
  })
}

export async function getStatusByPersonBond(personId) {
  return api.get(`/person-bond/status/${personId}`)
}

export async function getBondsWithDeletedByClient(client) {
  return api.get(`/bond/client/${client}`)
}

export async function movementHistoryGetByDocumentAndClientWithDeleted(document, client) {
  return api.get(`/person-bond/movement/document/${document}/client/${client}`)
}

export async function movementHistoryGetByPersonIdWithDeleted(personId) {
  return api.get(`/person-bond/movement/person/${personId}`)
}

export async function getBondsSearchWorksheetSummary(client, locale, person, unity, userBondId) {
  return api.post(`/person-bond/worksheet/summary`, { client, locale, person, unity, userBondId })
}

export async function getBondsSearchWorksheetComplete(client, locale, person, unity, userBondId) {
  return api.post(`/person-bond/worksheet/complete`, { client, locale, person, unity, userBondId })
}

export async function getActiveBondsSearchWorksheetSummary(client, locale, person, unity, userBondId) {
  return api.post(`/person-bond/worksheet/active/summary`, { client, locale, person, unity, userBondId })
}

export async function getActiveBondsSearchWorksheetComplete(client, locale, person, unity, userBondId) {
  return api.post(`/person-bond/worksheet/active/complete`, { client, locale, person, unity, userBondId })
}
