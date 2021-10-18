import { WhaleMasternodeRegTestContainer } from '@defichain/salmon-testing'

const container = new WhaleMasternodeRegTestContainer()

beforeAll(async () => {
  await container.start()
  await container.ain.waitForWalletCoinbaseMaturity()
})

afterAll(async () => {
  await container.stop()
})

it('should get blocks with WhaleApiClient', async () => {
  const client = container.getWhaleApiClient()
  const blocks = await client.blocks.list(50)

  expect(blocks.length).toStrictEqual(50)
  expect(blocks.hasNext).toStrictEqual(true)
})
