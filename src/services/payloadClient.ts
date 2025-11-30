type QueryValue = string | number | boolean | null | undefined
type QueryParams = Record<string, QueryValue | QueryValue[]>

export interface PayloadClientOptions {
  baseURL?: string
  token?: string
  defaultHeaders?: Record<string, string>
}

export interface PayloadListResult<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page?: number
  totalPages?: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
  nextPage?: number | null
  prevPage?: number | null
}

const toQueryString = (params?: QueryParams) => {
  if (!params) return ''

  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry !== undefined && entry !== null) {
          search.append(key, String(entry))
        }
      })
      return
    }

    search.append(key, String(value))
  })

  const query = search.toString()
  return query ? `?${query}` : ''
}

const DEFAULT_API_BASE = (() => {
  const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL?.replace(/\/$/, '')
  if (serverURL) return `${serverURL}/api`
  return 'http://localhost:3000/api'
})()

export const createPayloadClient = (options: PayloadClientOptions = {}) => {
  const baseURL = (options.baseURL ?? DEFAULT_API_BASE).replace(/\/$/, '')

  const request = async <T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> => {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.defaultHeaders,
      ...init.headers,
    })

    if (options.token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${options.token}`)
    }

    const response = await fetch(`${baseURL}${path}`, {
      ...init,
      headers,
    })

    if (!response.ok) {
      const message = await response.text().catch(() => response.statusText)
      throw new Error(
        `Payload request failed (${response.status} ${response.statusText}): ${message}`,
      )
    }

    return (await response.json()) as T
  }

  const find = async <T>(
    slug: string,
    params?: QueryParams,
  ): Promise<PayloadListResult<T>> => {
    return request<PayloadListResult<T>>(`/api/${slug}${toQueryString(params)}`)
  }

  const findById = async <T>(slug: string, id: string): Promise<T> => {
    return request<T>(`/api/${slug}/${id}`)
  }

  const create = async <T>(
    slug: string,
    body: unknown,
    init?: RequestInit,
  ): Promise<T> => {
    return request<T>(`/api/${slug}`, {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    })
  }

  const update = async <T>(
    slug: string,
    id: string,
    body: unknown,
    init?: RequestInit,
  ): Promise<T> => {
    return request<T>(`/api/${slug}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...init,
    })
  }

  return {
    baseURL,
    request,
    find,
    findById,
    create,
    update,
  }
}

export const payloadClient = createPayloadClient()
