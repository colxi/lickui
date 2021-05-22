export function showLoader() {
  const loader = document.getElementById('loader')
  loader.removeAttribute('hidden')
}

export function hideLoader() {
  const loader = document.getElementById('loader')
  loader.setAttribute('hidden', 'true')
}