import config from '/SERVER_CONFIG'

export function initHEader() {
  document.getElementById('headerBarBotName').innerText = config.botName
  document.getElementById('headerBarLickuiVersion').innerText = config.version
}
