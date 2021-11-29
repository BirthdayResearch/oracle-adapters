import { getNetwork } from '@defichain/jellyfish-network'
import { WhaleApiClient } from '@defichain/whale-api-client'
import { WhaleWalletAccountProvider } from '@defichain/whale-api-wallet'
import { SalmonWalletMnemonic } from '../src'

let whaleApiClient: WhaleApiClient

beforeEach(async () => {
  whaleApiClient = new WhaleApiClient({
    url: 'https://ocean.defichain.com',
    version: 'v0',
    network: 'regtest'
  })
})

afterEach(async () => {
})

it('should generate addresses', async () => {
  const accountProvider = new WhaleWalletAccountProvider(whaleApiClient, getNetwork('regtest'))

  const words = [
    'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon'
  ]
  const wallet = new SalmonWalletMnemonic(words, getNetwork('regtest'), accountProvider)

  expect(await wallet.get(0).getAddress()).toStrictEqual('bcrt1q3pxq49dnf5mpkhq05g9mtqejahh25f9wt9utjc')
  expect(await wallet.get(1).getAddress()).toStrictEqual('bcrt1q8yk8vwwud0qf6jhc4kykfm4ep6twfekecy85cv')
  expect(await wallet.get(2).getAddress()).toStrictEqual('bcrt1qkwhwtlskl0uhresp2wwrx7jrqqxpxss65jrxx3')
})
