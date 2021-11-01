import BigNumber from 'bignumber.js'
import { AssetPrice, fetchAsJson, FetchResponse, newAssetPrice } from '@defichain/salmon-fetch'

const FINNHUBB_URL = 'https://finnhub.io/api/v1/forex/candle'
const CANDLE_RES = 5

interface OandaSymbolMapping {
  ticker: string
  inverse: boolean
}

export const FINNHUBB_OANDA_SYMBOL_MAPPING: Record<string, OandaSymbolMapping> = {
  XAU: {
    ticker: 'OANDA:XAU_USD',
    inverse: false
  },
  XCU: {
    ticker: 'OANDA:XCU_USD',
    inverse: false
  },
  XAG: {
    ticker: 'OANDA:XAG_USD',
    inverse: false
  },
  BCO: {
    ticker: 'OANDA:BCO_USD',
    inverse: false
  },
  GBP: {
    ticker: 'OANDA:GBP_USD',
    inverse: false
  },
  EUR: {
    ticker: 'OANDA:EUR_USD',
    inverse: false
  },
  SGD: {
    ticker: 'OANDA:USD_SGD',
    inverse: true
  }
}

/**
 * Fetches forex prices from Finnhubb
 * https://finnhub.io
 */
export default async function (symbols: string[], apiToken: string): Promise<AssetPrice[]> {
  return await Promise.all(symbols.map(async symbol => {
    return await fetchAsset(symbol, apiToken)
  }))
}

async function fetchAsset (symbol: string, apiToken: string): Promise<AssetPrice> {
  const interval = parseInt(process.env.INTERVAL_SECONDS ?? '300')
  const tNow = Math.floor(Date.now() / 1000)
  const tPrev = tNow - interval
  const oandaSymbol = FINNHUBB_OANDA_SYMBOL_MAPPING[symbol].ticker

  const fetchPath = `${FINNHUBB_URL}?symbol=${oandaSymbol}&resolution=${CANDLE_RES}&token=${apiToken}&from=${tPrev}&to=${tNow}`
  const res: FetchResponse = await fetchAsJson(fetchPath, {
    method: 'GET'
  })

  // Out of market will return an object with null values
  if (res.data.c === null) {
    return newAssetPrice(symbol, new BigNumber(NaN), 'USD', new BigNumber(NaN))
  }

  let price = new BigNumber(res.data.c.slice(-1))
  if (FINNHUBB_OANDA_SYMBOL_MAPPING[symbol].inverse) {
    price = new BigNumber(1).div(price)
  }

  return newAssetPrice(symbol, price, 'USD', new BigNumber(res.data.t.slice(-1)))
}
