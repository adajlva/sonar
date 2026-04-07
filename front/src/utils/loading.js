let loadingCount = 0

export function showLoader() {
  loadingCount++
  document.body.classList.add('loading')
}

export function hideLoader() {
  loadingCount--
  if (loadingCount <= 0) {
    loadingCount = 0
    document.body.classList.remove('loading')
  }
}
