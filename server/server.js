import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import api from './api.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'

async function createServer() {
  const app = express()
  const port = 3000
  const hostname = 'localhost'

  app.use(express.json())

  app.use('/api', api)

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, '../client/dist')))
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: 'true'
      },
      appType: 'custom'
    })

    app.use(vite.middlewares)

    app.get('/', async (req, res) => {
      try {
        let html = fs.readFileSync(path.resolve(__dirname, '../client/index.html'), 'utf-8')
        html = await vite.transformIndexHtml(req.url, html)
        res.status(200).set({
          'Content-Type': 'text/html'
        }).end(html)
      } catch (error) {
        vite.ssrFixStacktrace(error)
        console.log(error.stack)
        res.status(500).end(error.stack)
      }
    })
  }

  app.listen(port, hostname, () => {
    console.log(`[server] http://${hostname}:${port}`)
  })
}

createServer()