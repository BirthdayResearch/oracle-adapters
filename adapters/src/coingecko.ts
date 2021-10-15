import { AssetPrice, fetchAsJson, newAssetPrice } from '@defichain/salmon-fetch'

const URL = 'https://api.coingecko.com/api/v3/simple/price'
const MAPPING: Record<string, string> = {
  BTC: 'bitcoin',
  DFI: 'defichain',
  ETH: 'ethereum',
  DOGE: 'dogecoin',
  BCH: 'bitcoin-cash',
  LTC: 'litecoin',
  USDT: 'tether',
  USDC: 'usd-coin'
}

export default async function (symbols: string[]): Promise<AssetPrice[]> {
  const ids = symbols.map(symbol => MAPPING[symbol])
  const res = await fetchAsJson(`${URL}?ids=${ids.join(',')}&vs_currencies=usd`)

  return Object.entries(MAPPING).map(([internal, external]): AssetPrice => {
    return newAssetPrice(internal, res.data[external].usd, 'USD', Date.now())
  })
}
