async function loadComponent(element) {
  const src = element.getAttribute('src')
  const rawReponse = await fetch(src)
  const html = await rawReponse.text()
  element.outerHTML = html
}

export async function includeComponents() {
  const elements = document.getElementsByTagName('include')
  for (const element of Array.from(elements)) {
    await loadComponent(element)
  }
}
