import { AssetPrice, fetchAsJson, newAssetPrice } from '@defichain/salmon-fetch'
import BigNumber from 'bignumber.js'

const API_VERSION = 'v1'
const BASE_URL = `https://restapi.clouddataservice.nasdaq.com/${API_VERSION}/nasdaq/delayed/equities/lastsale`
const AUTH_URL = `https://restapi.clouddataservice.nasdaq.com/${API_VERSION}/auth/token`

export default async function (symbols: string[], apiToken: string): Promise<AssetPrice[]> {
  const authToken = await authenticate(apiToken)

  return await Promise.all(symbols.map(async symbol => {
    return await fetchAsset(symbol, authToken)
  }))
}

async function authenticate (apiToken: string): Promise<string> {
  const clientIdSecret = apiToken.split(':')

  const response = await fetchAsJson(AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientIdSecret[0],
      client_secret: clientIdSecret[1]
    })
  })

  if (response.status !== 200) {
    throw new Error('nasdaq.unableToAuth ')
  }

  if (response.data?.access_token === undefined) {
    throw new Error('nasdaq.unableToAuth ')
  }

  return response.data.access_token
}

async function fetchAsset (symbol: string, authToken: string): Promise<AssetPrice> {
  const fetchPath = `${BASE_URL}/${symbol}`

  const response = await fetchAsJson(fetchPath, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  })

  const priceObject = Array.isArray(response.data) ? response.data[0] : response.data
  const timestamp = new BigNumber(processTimestamp(priceObject.timestamp))

  if (symbol !== priceObject.symbol) {
    throw new Error('nasdaq.mismatchedTickerSymbol')
  }

  return newAssetPrice(symbol, new BigNumber(priceObject.price), 'USD', timestamp)
}

function processTimestamp (timestamp: string): number {
  const priceDate = new Date(timestamp + 'Z')
  const dateNow = new Date()
  const paddMs = String(dateNow.getUTCMilliseconds()).padStart(3, '0')

  const localeDate = dateNow.toLocaleString('en-CA',
    {
      timeZone: 'America/New_York',
      hour12: false
    }).replace(', 24', ', 00')

  // en-CA instead of en-US is needed here ('-' vs '/')
  const dateNowEt = new Date(localeDate.replace(', ', 'T') + `.${paddMs}Z`)

  const timezoneOffset = dateNow.getTime() - dateNowEt.getTime()
  return priceDate.getTime() + timezoneOffset
}
