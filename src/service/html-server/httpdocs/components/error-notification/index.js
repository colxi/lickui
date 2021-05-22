export function hideErrorMessage() {
  const errorMessageContainer = document.getElementById('serviceError')
  errorMessageContainer.setAttribute('hidden', 'true')

}

export function showErrorMessage() {
  const errorMessageContainer = document.getElementById('serviceError')
  errorMessageContainer.removeAttribute('hidden')
}