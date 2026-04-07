import api from './api'
import moment from 'moment'

export async function getCountries(input) {
  return api.get(`/utils/countries`, { params: { search: input } })
}

export function getCountryLabel(countryCode) {
  return countryCode || ''
}

export function getCountryByLocale(country) {
  return country ? country.name || country.internationalName || '' : ''
}

export async function downloadData(data, filename) {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function getDate(date) {
  if (!date) return '-'
  return moment.utc(date).format('DD/MM/YYYY')
}

export function getUnitySelectOptionsMargin(group) {
  return group ? group.level * 10 : 0
}
