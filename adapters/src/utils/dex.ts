import { AssetPrice, newAssetPrice } from '@defichain/salmon-fetch'
import { poolpairs, WhaleApiClient } from '@defichain/whale-api-client'
import BigNumber from 'bignumber.js'

type PoolPairData = poolpairs.PoolPairData

export interface DefichainSymbolMapping {
  ticker: string
  inverse: boolean
  /**
   * Async function to return a value that the price is multiplied by
   * Return 1.0 if not needed
   */
  priceAdjustmentCallback: (apiToken?: string) => Promise<BigNumber>
}

export interface DexOptions {
  whale: {
    url: string
    network: string
    version: string
  }
}

export async function getAllPairs (options: DexOptions): Promise<PoolPairData[]> {
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

export async function fetchAsset (asset: string, pairs: PoolPairData[], symbolMapping: DefichainSymbolMapping, apiToken?: string): Promise<AssetPrice | undefined> {
  const data = pairs.find((y: PoolPairData) => y.symbol === symbolMapping.ticker)
  if (data === undefined) {
    return undefined
  }

  const tokenA = new BigNumber(symbolMapping.inverse ? data.tokenB.reserve : data.tokenA.reserve)
  const tokenB = new BigNumber(symbolMapping.inverse ? data.tokenA.reserve : data.tokenB.reserve)
  let price
  if (apiToken !== undefined) {
    price = tokenA.div(tokenB).multipliedBy(await symbolMapping.priceAdjustmentCallback(apiToken))
  } else {
    price = tokenA.div(tokenB).multipliedBy(await symbolMapping.priceAdjustmentCallback())
  }

  return newAssetPrice(asset, price, 'USD', new BigNumber(Date.now()))
}
