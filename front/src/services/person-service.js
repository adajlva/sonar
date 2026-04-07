import api from './api'

export async function getPersonById(personId) {
  return api.get(`/person/${personId}`)
}

export async function getByDocumentAndClient(document, client) {
  return api.get(`/person/document/${document}/client/${client}`)
}

export async function checkHasDuplicatedContacts(email, phone, client, excludePersonId) {
  return api.get('/person/duplicated-contacts', {
    params: { email, phone, client, excludePersonId }
  })
}

export function parseCustomData(model, schema) {
  const parsed = { ...model }
  schema.fields.forEach((field) => {
    if (parsed[field.model] === undefined) {
      parsed[field.model] = null
    }
  })
  return parsed
}
