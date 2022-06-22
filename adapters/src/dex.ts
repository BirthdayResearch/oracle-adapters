import BigNumber from 'bignumber.js'
import { poolpairs, WhaleApiClient } from '@defichain/whale-api-client'
import { AssetPrice, fetchAsJson, FetchResponse, newAssetPrice } from '@defichain/salmon-fetch'

type PoolPairData = poolpairs.PoolPairData

interface DefichainSymbolMapping {
  ticker: string
  inverse: boolean
  /**
   * Async function to return a value that the price is multiplied by
   * Return 1.0 if not needed
   */
  priceAdjustmentCallback: () => Promise<BigNumber>
}

const DEFICHAIN_DEX_SYMBOL_MAPPING: Record<string, DefichainSymbolMapping> = {
  DFI: {
    ticker: 'BTC-DFI',
    inverse: false,
    priceAdjustmentCallback: async () => {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      const res: FetchResponse = await fetchAsJson(url, { method: 'GET' })
      if (!(Object.keys(res.data).includes('bitcoin'))) {
        throw new Error('dex.invalidTickerSymbol')
      }
      return new BigNumber(res.data.bitcoin.usd)
    }
  }
}

export interface DexOptions {
  whale: {
    url: string
    network: string
    version: string
  }
}

/**
 * @deprecated use dex-coingecko instead
 */
export default async function (symbols: string[], options: DexOptions): Promise<AssetPrice[]> {
  const pairs = await getAllPairs(options)

  const unfilteredAssetPrices: Array<AssetPrice | undefined> = await Promise.all(symbols.map(async symbol => {
    return await fetchAsset(symbol, pairs)
  }))

  const res = unfilteredAssetPrices.filter(x => (x !== undefined)) as AssetPrice[]

  if (res.length !== symbols.length) {
    throw new Error('dex.missingTickerSymbol')
  }

  return res
}

async function getAllPairs (options: DexOptions): Promise<PoolPairData[]> {
  const client = new WhaleApiClient({
    url: options.whale.url,
    network: options.whale.network,
    version: options.whale.version
  })

  const pairs: poolpairs.PoolPairData[] = []

  let response = await client.poolpairs.list(200)
  pairs.push(...response)

  while (response.hasNext) {
    response = await client.paginate(response)
    pairs.push(...response)
  }

  return pairs
}

async function fetchAsset (asset: string, pairs: PoolPairData[]): Promise<AssetPrice | undefined> {
  const symbolMapping = DEFICHAIN_DEX_SYMBOL_MAPPING[asset]
  const data = pairs.find((y: PoolPairData) => y.symbol === symbolMapping.ticker)
  if (data === undefined) {
    return undefined
  }

  const tokenA = new BigNumber(symbolMapping.inverse ? data.tokenB.reserve : data.tokenA.reserve)
  const tokenB = new BigNumber(symbolMapping.inverse ? data.tokenA.reserve : data.tokenB.reserve)
  const price = tokenA.div(tokenB).multipliedBy(await symbolMapping.priceAdjustmentCallback())

  return newAssetPrice(asset, price, 'USD', new BigNumber(Date.now()))
}
