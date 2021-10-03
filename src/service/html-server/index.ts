import http from "http"
import url from "url"
import path from "path"
import fs from "fs"
import config from '@/core/config'
import packageJSON from '@/../package.json'

const httpDocsPath = '/src/service/html-server/httpdocs/'

const MIMETypes: Record<string, string> = {
  '.js': 'text/javascript',
  '.ts': 'text/javascript',
  '.html': 'text/html',
  '.htm': 'text/html',
}

export default async function initHTMLServerService() {
  console.log('Initializing HTTP static server...')
  http.createServer(function (request, response) {
    const uri = url.parse(request.url || '').pathname || ''

    if (uri === '/SERVER_CONFIG') {
      const publicConfig = {
        version: packageJSON.version,
        botName: config.botName,
        apiServicePort: config.apiServicePort,
        apiServiceIp: config.apiServiceIp,
        updateIntervalInMillis: config.updateIntervalInMillis,
        takeProfit: config.takeProfit,
        network: config.network,
      }

      response.writeHead(200, { 'Content-Type': 'text/javascript' })
      response.write(`export default ${JSON.stringify(publicConfig)}`, 'utf-8')
      response.end()
      return
    }

    const basePath = path.join(process.cwd(), httpDocsPath)
    let filename = path.join(basePath, uri)

    // prevent directory traversal
    if (filename.substr(0, basePath.length) !== basePath) {
      response.writeHead(404, { "Content-Type": "text/plain" })
      response.write("404 Not Found\n")
      response.end()
      return
    }

    fs.exists(filename, function (exists) {
      if (!exists) {
        response.writeHead(404, { "Content-Type": "text/plain" })
        response.write("404 Not Found\n")
        response.end()
        return
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html'

      fs.readFile(filename, "binary", function (err, file) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/plain" })
          response.write(err + "\n")
          response.end()
          return
        }

        const extension = path.extname(filename)
        response.writeHead(200, { 'Content-Type': MIMETypes[extension] || 'text/plain' })
        response.write(file, "binary")
        response.end()
      })
    })
  }).listen(config.httpServicePort, config.httpServiceIp)

  console.log(`Static file server running at\n   ===> http://${config.httpServiceIp}:${config.httpServicePort}`)
}

