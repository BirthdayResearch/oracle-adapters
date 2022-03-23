import { getNetwork } from '@defichain/jellyfish-network'
import { WhaleApiClient } from '@defichain/whale-api-client'
import { WhaleWalletAccountProvider } from '@defichain/whale-api-wallet'
import { SalmonWalletMnemonic } from '../src'

const ABANDON_WORDS = [
  'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon'
]

it('should generate addresses', async () => {
  const client = new WhaleApiClient({
    url: 'https://ocean.defichain.com',
    network: 'regtest'
  })
  const accountProvider = new WhaleWalletAccountProvider(client, getNetwork('regtest'))
  const wallet = new SalmonWalletMnemonic(ABANDON_WORDS, getNetwork('regtest'), accountProvider)

  expect(await wallet.get(0).getAddress()).toStrictEqual('bcrt1q3pxq49dnf5mpkhq05g9mtqejahh25f9wt9utjc')
  expect(await wallet.get(1).getAddress()).toStrictEqual('bcrt1q8yk8vwwud0qf6jhc4kykfm4ep6twfekecy85cv')
  expect(await wallet.get(2).getAddress()).toStrictEqual('bcrt1qkwhwtlskl0uhresp2wwrx7jrqqxpxss65jrxx3')
})

it('should generate addresses without accessing a node', async () => {
  const client = new WhaleApiClient({
    url: 'https://ocean.defichain.com',
    network: 'regtest'
  })
  const accountProvider = new WhaleWalletAccountProvider(client, getNetwork('regtest'))
  const wallet = new SalmonWalletMnemonic(ABANDON_WORDS, getNetwork('regtest'), accountProvider)

  expect(await wallet.getAddress(0)).toStrictEqual(await wallet.get(0).getAddress())
  expect(await wallet.getAddress(1)).toStrictEqual(await wallet.get(1).getAddress())
  expect(await wallet.getAddress(2)).toStrictEqual(await wallet.get(2).getAddress())
})

it('should be able to get private key in WIF (regtest)', async () => {
  const wallet = new SalmonWalletMnemonic(ABANDON_WORDS, getNetwork('regtest'))

  expect(await wallet.getWIF(0)).toStrictEqual(await wallet.getWIF(0))
  expect(await wallet.getWIF(0)).toStrictEqual('cSSzEEsyvfvEWgy3zQ3pEZfdY9kRVwnHd7jYuvZ5CXP1sUmzhdUv')
  expect(await wallet.getWIF(1)).toStrictEqual('cPMw2NPvBnk46uQFrQ3NS4vgSh5S3UawUe1vo7DqcMSRRGxJTGDo')
  expect(await wallet.getWIF(10000)).toStrictEqual('cQjx59Z5eqTvDWtTx7oYohLgby65BGoJkHFmPUtM7RuqG1nDVc2b')
})

it('should be able to get private key in WIF (mainnet)', async () => {
  const wallet = new SalmonWalletMnemonic(ABANDON_WORDS, getNetwork('mainnet'))

  expect(await wallet.getWIF(0)).toStrictEqual(await wallet.getWIF(0))
  expect(await wallet.getWIF(0)).toStrictEqual('L25zmKt8VcDyMFVnbzEgsFAZuvT1qVgbZ5b5oW6ZhQj1cjeccjZQ')
  expect(await wallet.getWIF(1)).toStrictEqual('KxzwZTQ4kj3nwTvzTzEF4kRcpTn2P2VFQbsTggmL7EnRAXsS79zX')
  expect(await wallet.getWIF(12000)).toStrictEqual('L4Souhb352a2gnVXXWdPRMVQNBEdrTsigdeVjRLe6jzusN2GSngk')
})
