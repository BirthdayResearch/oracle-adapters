import { WalletClassic } from '@defichain/jellyfish-wallet-classic'
import { WhaleWalletAccount } from '@defichain/whale-api-wallet'
import { WIF } from '@defichain/jellyfish-crypto'
import { getNetwork, NetworkName } from '@defichain/jellyfish-network'
import { WhaleApiClient } from '@defichain/whale-api-client'
import { AssetPrice, BigNumber } from '@defichain/salmon-fetch'
import { SetOracleData, CTransactionSegWit } from '@defichain/jellyfish-transaction'

/**
 * SalmonWallet is a serverless first lightweight wallet setup that is easy to configure. Powered by DeFiCh/jellyfish
 * ecosystem, this wallet uses Ocean APIs and required all transactions to be signed in Bech32 format.
 *
 * Requiring just PrivateKey (WIF), NetworkName and WhaleApiClient for its entirety. This wallet will construct oracle
 * price feed for submission, sign the oracle price feed with the given private key. Lastly, submit the price feed into
 * the connected network.
 */
export class SalmonWallet {
  constructor (
    private readonly privateKey: string,
    private readonly network: NetworkName,
    private readonly client: WhaleApiClient,
    private readonly wallet = new WalletClassic(WIF.asEllipticPair(privateKey)),
    private readonly account = new WhaleWalletAccount(client, wallet, getNetwork(network))
  ) {
  }

  /**
   * Construct, sign and submit price feed.
   *
   * @param {string} oracleId of the oracle to submit prices to
   * @param {AssetPrice[]} prices to submit to the blockchain
   */
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
