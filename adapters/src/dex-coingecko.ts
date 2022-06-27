import BigNumber from 'bignumber.js'
import { AssetPrice, fetchAsJson, FetchResponse } from '@defichain/salmon-fetch'
import { DefichainSymbolMapping, DexOptions, fetchAsset, getAllPairs } from './utils/dex'

export const DEFICHAIN_DEX_SYMBOL_MAPPING: Record<string, DefichainSymbolMapping> = {
  DFI: {
    ticker: 'BTC-DFI',
    inverse: false,
    priceAdjustmentCallback: getBitcoinPrice
  }
}

export async function getBitcoinPrice (): Promise<BigNumber> {
  const res: FetchResponse = await fetchAsJson(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    { method: 'GET' }
  )

  if (res.status !== 200) {
    throw new Error('dex-cmc.invalidCoinGeckoResponse ')
  }

  return new BigNumber(res.data.bitcoin.usd)
}

/**
 * Fetches prices from Defichain DEX
 */
export default async function (symbols: string[], options: DexOptions): Promise<AssetPrice[]> {
  const pairs = await getAllPairs(options)

  const unfilteredAssetPrices: Array<AssetPrice | undefined> = await Promise.all(symbols.map(async symbol => {
    const symbolMapping = DEFICHAIN_DEX_SYMBOL_MAPPING[symbol]
    return await fetchAsset(symbol, pairs, symbolMapping)
  }))

  return unfilteredAssetPrices.filter(Boolean) as AssetPrice[]
}
