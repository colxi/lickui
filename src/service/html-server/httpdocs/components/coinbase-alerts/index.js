import { getElapsedDays } from '../../lib/time/index.js'


export async function updateCoinbaseAlerts(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const content = xmlDoc.getElementsByTagName('channel')[0].children
    const items = Array.from(content).filter(i => i.localName === 'item')
  
    const entries = items.map(i => {
      const title = Array.from(i.children).filter(c => c.localName === 'title')[0].innerHTML
      const date = Array.from(i.children).filter(c => c.localName === 'pubDate')[0].innerHTML
      return { title, date }
    })
  
    const alerts = Object.values(entries).filter(i => i.title.includes('available') || i.title.includes('launching'))
    document.getElementById('coinbaseAlerts').innerHTML = ''
    for (const alert of alerts) {
  
      const elapsedDays = getElapsedDays(new Date(alert.date), Date.now())
      const a = `
        <div class="alert-entry">
          <div class="alert-date">${alert.date}</div>
          <div class="alert-title">${alert.title.replace("<![CDATA[", "").replace("]]>", "")}</div>
        </div>
      `
      document.getElementById('coinbaseAlerts').innerHTML += a
  
    }
  }
  