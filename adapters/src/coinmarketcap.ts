import { AssetPrice, newAssetPrice } from '@defichain/salmon-fetch'
import BigNumber from 'bignumber.js'
import fetch from 'node-fetch'
import {
  JellyfishJSON
} from '@defichain/jellyfish-json'

const COINMARKETCAP_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'

export default async function (symbols: string[], apiToken = ''): Promise<AssetPrice[]> {
  const fetchPath = `${COINMARKETCAP_URL}?symbol=${symbols.join(',')}&CMC_PRO_API_KEY=${apiToken}`
  const response = await fetch(fetchPath, {
    method: 'GET'
  })

  const text = await response.text()
  const json = JellyfishJSON.parse(text, 'bignumber').data
  return Object.keys(json).map((asset: any) => {
    const data = json[asset]
    const timestamp = new BigNumber(Date.parse(data.last_updated))
    return newAssetPrice(
      asset,
      new BigNumber(data.quote.USD.price),
      'USD',
      (new BigNumber(timestamp.toString())).multipliedBy(1000)
    )
  })
}
