import { AssetPrice, fetchAsJson, newAssetPrice } from '@defichain/salmon-fetch'

const URL = 'https://cloud.iexapis.com/stable/tops'

export default async function (symbols: string[], apiToken: string): Promise<AssetPrice[]> {
  const fetchPath = `${URL}?symbols=${symbols.join(',')}&token=${apiToken}`
  const response = await fetchAsJson(fetchPath, {
    method: 'GET'
  })

  return response.data.map((x: any): AssetPrice => {
    return newAssetPrice(x.symbol, x.lastSalePrice, 'USD', x.lastSaleTime)
  })
}
