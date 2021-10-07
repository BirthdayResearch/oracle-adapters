import { WalletClassic } from '@defichain/jellyfish-wallet-classic'
import { WhaleWalletAccount } from '@defichain/whale-api-wallet'
import { WIF } from '@defichain/jellyfish-crypto'
import { getNetwork, NetworkName } from '@defichain/jellyfish-network'
import { WhaleApiClient } from '@defichain/whale-api-client'
import { AssetPrice, BigNumber } from '@defichain/salmon-fetch'
import { SetOracleData, CTransactionSegWit } from '@defichain/jellyfish-transaction'

export class SalmonWallet {
  constructor (
    private readonly privateKey: string,
    private readonly network: NetworkName,
    private readonly client: WhaleApiClient,
    private readonly classic = new WalletClassic(WIF.asEllipticPair(privateKey)),
    private readonly account = new WhaleWalletAccount(client, classic, getNetwork(network))
  ) {
  }

  public async send (oracleId: string, prices: AssetPrice[]): Promise<void> {
    const change = await this.account.getScript()
    const data = SalmonWallet.createSetOracleData(oracleId, prices)

    const signed = await this.account
      .withTransactionBuilder()
      .oracles.setOracleData(data, change)

    const hex = new CTransactionSegWit(signed).toHex()
    await this.client.rawtx.send({ hex: hex })
  }

  private static createSetOracleData (oracleId: string, prices: AssetPrice[]): SetOracleData {
    return {
      oracleId: oracleId,
      timestamp: new BigNumber(Math.floor(Date.now() / 1000)),
      tokens: prices.map(value => {
        return {
          token: value.token,
          prices: [
            {
              currency: value.currency,
              amount: value.amount
            }
          ]
        }
      })
    }
  }
}
