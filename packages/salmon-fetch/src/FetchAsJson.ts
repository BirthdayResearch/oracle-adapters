import _fetch from 'cross-fetch'
import AbortController from 'abort-controller'
import { JellyfishJSON } from '@defichain/jellyfish-json'

export interface FetchOptions {
  /**
   * @default GET
   */
  method?: string
  body?: string
  headers?: string[][] | Record<string, string>
  /**
   * @default to 60000ms
   */
  timeout?: number
}

export interface FetchResponse {
  status: number
  data: any
}

/**
 * Fetch url with Response as JSON. All numbers are parsed as BigNumber.
 *
 * @param {string} url to fetch
 * @param {FetchOptions} [options] to fetch
 * @return Promise<FetchResponse>
 */
export async function fetchAsJson (url: string, options?: FetchOptions): Promise<FetchResponse> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? 60000)

  const response = await _fetch(url, {
    method: options?.method,
    headers: options?.headers,
    body: options?.body,
    cache: 'no-cache',
    signal: controller.signal
  })

  const text = await response.text()
  clearTimeout(timeoutId)

  return {
    status: response.status,
    data: JellyfishJSON.parse(text, 'bignumber')
  }
}
