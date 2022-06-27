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

export async function getBitcoinPrice (apiToken?: string): Promise<BigNumber> {
  if (apiToken === undefined) {
    return new BigNumber(0)
  }

  const res: FetchResponse = await fetchAsJson(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC&CMC_PRO_API_KEY=${apiToken}`,
    { method: 'GET' }
  )

  if (res.status !== 200) {
    throw new Error('dex-cmc.invalidCMCResponse ')
  }

  return new BigNumber(res.data.data.BTC.quote.USD.price)
}

/**
 * Fetches prices from Defichain DEX
 */
export default async function (symbols: string[], options: DexOptions, apiToken: string): Promise<AssetPrice[]> {
  const pairs = await getAllPairs(options)

  const unfilteredAssetPrices: Array<AssetPrice | undefined> = await Promise.all(symbols.map(async symbol => {
    const symbolMapping = DEFICHAIN_DEX_SYMBOL_MAPPING[symbol]
    return await fetchAsset(symbol, pairs, symbolMapping, apiToken)
  }))

  return unfilteredAssetPrices.filter(Boolean) as AssetPrice[]
}
