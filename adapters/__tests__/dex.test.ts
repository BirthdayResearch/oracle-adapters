import nock from 'nock'
import dex from '../src/dex'
import BigNumber from 'bignumber.js'

describe('multi price fetch', () => {
  beforeEach(() => {
    nock('https://api.coingecko.com')
      .get('/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .reply(200, function (_) {
        return `{
        "bitcoin": {
          "usd": 32436
        }
      }`
      })
  })

  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  it('should fetch price from defichain dex using config', async () => {
    nock('https://localhost')
      .filteringPath(() => {
        return '/'
      })
      .get('/')
      .reply(200, function (_) {
        return `{
          "data":[
              {
                "id":"4",
                "symbol":"ETH-DFI",
                "name":"Ether-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"1",
                   "reserve":"9992.54009793",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"10086876.47566493",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"317349.15536288",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.14549",
                "creation":{
                   "tx":"9827894c083b77938d13884f0404539daa054a818e0c5019afa1eeff0437a51b",
                   "height":466822
                }
              },
              {
                "id":"5",
                "symbol":"BTC-DFI",
                "name":"Bitcoin-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"2",
                   "reserve":"2902.70533676",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"46597108.22352511",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"367754.24140015",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.775945",
                "creation":{
                   "tx":"f3c99e199d0157b2b6254cf3a51bb1171569ad5c4beb797e957d245aec194d38",
                   "height":466826
                }
              },
              {
                "id":"6",
                "symbol":"USDT-DFI",
                "name":"Tether USD-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"3",
                   "reserve":"5512851.46091893",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"2730540.49527746",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"3873637.20659448",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.048497",
                "creation":{
                   "tx":"37939243c7dbacb2675cfc4e0632e9bf829dcc5cece2928f235fba4b03c09a6a",
                   "height":466826
                }
              },
              {
                "id":"8",
                "symbol":"DOGE-DFI",
                "name":"Dogecoin-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"7",
                   "reserve":"2186780.67723461",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"207343.66124432",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"663236.57277947",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.000969",
                "creation":{
                   "tx":"9e0c956f9c626c07ba3dd742748ff9872b5688a976d66d35aa09418f18620b64",
                   "height":607452
                }
              },
              {
                "id":"10",
                "symbol":"LTC-DFI",
                "name":"Litecoin-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"9",
                   "reserve":"19509.65440856",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"1156035.44827342",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"147068.2914677",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.019399",
                "creation":{
                   "tx":"75a25a52c54d12f84d4a553be354fa2c5651689d8f9f4860aad8b68c804af3f1",
                   "height":614026
                }
              },
              {
                "id":"12",
                "symbol":"BCH-DFI",
                "name":"Bitcoin Cash-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"11",
                   "reserve":"2778.86265926",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"603167.53853949",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"40654.43405601",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.0097",
                "creation":{
                   "tx":"84ef6a6733dd97d2d4b963ad99ab26829d58f4ab913dafb9cc7c84885f783854",
                   "height":696287
                }
              }
            ]
          }`
      })

    const symbols = ['DFI']

    const prices = await dex(symbols, {
      whale: {
        network: 'regtest',
        url: 'https://localhost',
        version: 'v0'
      }
    })
    expect(prices).toStrictEqual([
      {
        token: 'DFI',
        amount: new BigNumber('2.020557796237096083'),
        currency: 'USD',
        timestamp: expect.any(BigNumber) // 1635749682721
      }
    ])
  })

  it('should throw error if there are missing symbols', async () => {
    nock('https://localhost')
      .filteringPath(() => {
        return '/'
      })
      .get('/')
      .reply(200, function (_) {
        return `{
          "data":[
              {
                "id":"4",
                "symbol":"ETH-DFI",
                "name":"Ether-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"1",
                   "reserve":"9992.54009793",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"10086876.47566493",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"317349.15536288",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.14549",
                "creation":{
                   "tx":"9827894c083b77938d13884f0404539daa054a818e0c5019afa1eeff0437a51b",
                   "height":466822
                }
              }
            ]
          }`
      })

    await expect(async () => {
      const symbols = ['DFI']
      await dex(symbols, {
        whale: {
          network: 'regtest',
          url: 'https://localhost',
          version: 'v0'
        }
      })
    }).rejects.toThrowError('dex.missingTickerSymbol')
  })
})

describe('multi price fetch when coingecko fails', () => {
  beforeEach(() => {
    nock('https://api.coingecko.com')
      .get('/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .reply(200, function (_) {
        return `{
        "ethereum": {
          "usd": 2299.63
        }
      }`
      })
  })

  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  it('throw error if coingecko fails to return BTC price', async () => {
    nock('https://localhost')
      .filteringPath(() => {
        return '/'
      })
      .get('/')
      .reply(200, function (_) {
        return `{
          "data":[
              {
                "id":"4",
                "symbol":"ETH-DFI",
                "name":"Ether-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"1",
                   "reserve":"9992.54009793",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"10086876.47566493",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"317349.15536288",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.14549",
                "creation":{
                   "tx":"9827894c083b77938d13884f0404539daa054a818e0c5019afa1eeff0437a51b",
                   "height":466822
                }
              },
              {
                "id":"5",
                "symbol":"BTC-DFI",
                "name":"Bitcoin-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"2",
                   "reserve":"2902.70533676",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"46597108.22352511",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"367754.24140015",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.775945",
                "creation":{
                   "tx":"f3c99e199d0157b2b6254cf3a51bb1171569ad5c4beb797e957d245aec194d38",
                   "height":466826
                }
              },
              {
                "id":"6",
                "symbol":"USDT-DFI",
                "name":"Tether USD-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"3",
                   "reserve":"5512851.46091893",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"2730540.49527746",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"3873637.20659448",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.048497",
                "creation":{
                   "tx":"37939243c7dbacb2675cfc4e0632e9bf829dcc5cece2928f235fba4b03c09a6a",
                   "height":466826
                }
              },
              {
                "id":"8",
                "symbol":"DOGE-DFI",
                "name":"Dogecoin-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"7",
                   "reserve":"2186780.67723461",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"207343.66124432",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"663236.57277947",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.000969",
                "creation":{
                   "tx":"9e0c956f9c626c07ba3dd742748ff9872b5688a976d66d35aa09418f18620b64",
                   "height":607452
                }
              },
              {
                "id":"10",
                "symbol":"LTC-DFI",
                "name":"Litecoin-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"9",
                   "reserve":"19509.65440856",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"1156035.44827342",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"147068.2914677",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.019399",
                "creation":{
                   "tx":"75a25a52c54d12f84d4a553be354fa2c5651689d8f9f4860aad8b68c804af3f1",
                   "height":614026
                }
              },
              {
                "id":"12",
                "symbol":"BCH-DFI",
                "name":"Bitcoin Cash-Default Defi token",
                "status":true,
                "tokenA":{
                   "id":"11",
                   "reserve":"2778.86265926",
                   "blockCommission":"0"
                },
                "tokenB":{
                   "id":"0",
                   "reserve":"603167.53853949",
                   "blockCommission":"0"
                },
                "commission":"0.002",
                "totalLiquidity":"40654.43405601",
                "tradeEnabled":true,
                "ownerAddress":"8UAhRuUFCyFUHEPD7qvtj8Zy2HxF5HH5nb",
                "rewardPct":"0.0097",
                "creation":{
                   "tx":"84ef6a6733dd97d2d4b963ad99ab26829d58f4ab913dafb9cc7c84885f783854",
                   "height":696287
                }
              }
            ]
          }`
      })

    await expect(async () => {
      const symbols = ['DFI']
      await dex(symbols, {
        whale: {
          network: 'regtest',
          url: 'https://localhost',
          version: 'v0'
        }
      })
    }).rejects.toThrowError('dex.missingTickerSymbol')
  })
})
