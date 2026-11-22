import type { Plugin } from 'vite'
import assistantHandler from '../api/assistant'

const MAX_BODY_BYTES = 16 * 1024

export const assistantDevApi = (): Plugin => ({
  name: 'portfolio-assistant-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/assistant', async (request, response) => {
      if (request.method !== 'POST') {
        response.statusCode = 405
        response.setHeader('Allow', 'POST')
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify({ ok: false, reason: 'method_not_allowed' }))
        return
      }

      try {
        const chunks: Buffer[] = []
        let totalBytes = 0
        for await (const chunk of request) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
          totalBytes += buffer.length
          if (totalBytes > MAX_BODY_BYTES) {
            response.statusCode = 413
            response.setHeader('Content-Type', 'application/json; charset=utf-8')
            response.end(JSON.stringify({ ok: false, reason: 'request_too_large' }))
            return
          }
          chunks.push(buffer)
        }

        const body = JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
        Object.assign(request, { body })
        const apiResponse = {
          setHeader: response.setHeader.bind(response),
          status(code: number) {
            response.statusCode = code
            return apiResponse
          },
          json(payload: unknown) {
            if (!response.headersSent) response.statusCode ||= 200
            response.end(JSON.stringify(payload))
          },
        }

        await assistantHandler(
          request as unknown as Parameters<typeof assistantHandler>[0],
          apiResponse as Parameters<typeof assistantHandler>[1]
        )
      } catch {
        if (!response.headersSent) {
          response.statusCode = 400
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(JSON.stringify({ ok: false, reason: 'bad_request' }))
        }
      }
    })
  },
})
