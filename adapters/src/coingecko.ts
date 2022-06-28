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

  if (Object.keys(res.data).length !== symbols.length) {
    throw new Error('coingecko.missingTickerSymbol')
  }

  return symbols.map((symbol: string): AssetPrice => {
    if (res.data[MAPPING[symbol]] === undefined) {
      throw new Error('coingecko.mismatchedTickerSymbol')
    }

    return newAssetPrice(symbol, res.data[MAPPING[symbol]].usd, 'USD', Date.now())
  })
}
