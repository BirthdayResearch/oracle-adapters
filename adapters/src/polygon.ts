import { AssetPrice, fetchAsJson, newAssetPrice } from '@defichain/salmon-fetch'
import BigNumber from 'bignumber.js'

const PO_URL = 'https://api.polygon.io/v2/last/trade/'

export default async function (symbols: string[], apiToken: string): Promise<AssetPrice[]> {
  return await Promise.all(symbols.map(async symbol => {
    const res = await fetchAsJson(`${PO_URL}${symbol}?apikey=${apiToken}`, {
      method: 'GET'
    })
    return newAssetPrice(
      symbol,
      res.data.results.p,
      'USD',
      // convert nano seconds to milli seconds
      (res.data.results.t.div(1000000)).integerValue(BigNumber.ROUND_DOWN))
  }))
}
