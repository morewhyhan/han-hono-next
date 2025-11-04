import { AppType } from '@/server/api'
import { hc } from 'hono/client'
import ky from 'ky'

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''

// 创建基础的fetch客户端
export const fetch = ky.extend({
  hooks: {
    afterResponse: [
      async (_, __, response: Response) => {
        if (response.ok) {
          return response
        } else {
          throw await response.json()
        }
      },
    ],
  },
})

// 创建Hono类型安全客户端
export const client: ReturnType<typeof hc<AppType>> = hc<AppType>(baseUrl, {
  fetch: fetch,
})