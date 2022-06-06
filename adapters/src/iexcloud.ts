import { AssetPrice, fetchAsJson, newAssetPrice, FetchResponse } from '@defichain/salmon-fetch'

const URL = 'https://cloud.iexapis.com/stable/stock'

function fetchPath (symbol: string, apiToken: string): string {
  return `${URL}/${symbol}/quote?token=${apiToken}`
}

export default async function (symbols: string[], apiToken: string): Promise<AssetPrice[]> {
  const responses = await Promise.all(symbols.map(
    async (symbol: string) => await fetchAsJson(fetchPath(symbol, apiToken), { method: 'GET' })
  ))

  return responses
    .flatMap((res: FetchResponse) => res.data)
    .map((x: any): AssetPrice => {
      const { symbol, latestPrice, latestUpdate } = x
      return newAssetPrice(symbol, latestPrice, 'USD', latestUpdate)
    })
}
