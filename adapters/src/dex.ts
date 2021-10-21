import BigNumber from 'bignumber.js'
import fetch from 'node-fetch'
import {
  JellyfishJSON
} from '@defichain/jellyfish-json'
import { poolpairs, WhaleApiClient } from '@defichain/whale-api-client'
import { AssetPrice, newAssetPrice } from '@defichain/salmon-fetch'

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
      const response = await fetch(url, { method: 'GET' })
      const text = await response.text()
      const json = JellyfishJSON.parse(text, 'bignumber')
      return new BigNumber(json.bitcoin.usd)
    }
  }
}

export interface EnvironmentConfig {
  oceanUrl: string
  network: string
}

async function getEnvironmentConfig (): Promise<EnvironmentConfig> {
  return {
    oceanUrl: process.env.OCEAN_URL ?? 'https://localhost',
    network: process.env.NETWORK ?? 'regtest'
  }
}

/**
 * Fetches prices from Defichain DEX
 */
export default async function (symbols: string[], _apiToken?: string): Promise<AssetPrice[]> {
  const pairs = await getAllPairs()
  const unfilteredData = (await Promise.all(symbols.map(async symbol => {
    return await fetchAsset(symbol, pairs)
  })))
  const assets: AssetPrice[] = unfilteredData.filter(x => (x !== undefined)) as AssetPrice[]
  return assets
}

async function getAllPairs (): Promise<PoolPairData[]> {
  const env: EnvironmentConfig = await getEnvironmentConfig()
  const client = new WhaleApiClient({
    url: env.oceanUrl,
    network: env.network,
    version: 'v0'
  })

  const pairs: poolpairs.PoolPairData[] = []

  let response = await client.poolpairs.list()
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
