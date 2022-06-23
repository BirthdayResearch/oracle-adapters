import { AssetPrice, fetchAsJson, newAssetPrice } from '@defichain/salmon-fetch'

const URL = 'https://finnhub.io/api/v1/quote'

export default async function (symbols: string[], apiToken: string): Promise<AssetPrice[]> {
  return await Promise.all(symbols.map(async symbol => {
    const res = await fetchAsJson(`${URL}?symbol=${symbol}&token=${apiToken}`)
    return newAssetPrice(symbol, res.data.c, 'USD', res.data.t.multipliedBy(1000))
  }))
}
