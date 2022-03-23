import { Network } from '@defichain/jellyfish-network'
import { JellyfishWallet, WalletAccountProvider, WalletEllipticPair } from '@defichain/jellyfish-wallet'
import { Bip32Options, MnemonicHdNode, MnemonicHdNodeProvider } from '@defichain/jellyfish-wallet-mnemonic'
import { WhaleWalletAccount } from '@defichain/whale-api-wallet'
import { Bech32, WIF } from '@defichain/jellyfish-crypto'

/**
 * Basic wrapper around JellyfishWallet, this uses a mnemonic phrase to initialise
 * an HD wallet, and provides the same functionality as JellyfishWallet
 *
 * See: https://github.com/DeFiCh/jellyfish/tree/main/packages/jellyfish-wallet/src/wallet.ts
 */
export class SalmonWalletMnemonic extends JellyfishWallet<WhaleWalletAccount, MnemonicHdNode> {
  private readonly network: Network

  /**
   * @param {string[]} words to derive
   * @param {Network} network
   * @param {WalletAccountProvider<WhaleWalletAccount>} accountProvider
   */
  constructor (
    words: string[],
    network: Network,
    accountProvider: WalletAccountProvider<WhaleWalletAccount> = new EmptyWalletAccountProvider()
  ) {
    const hdNodeProvider = SalmonWalletMnemonic.getMnemonicHdNodeProvider(words, network)
    const coinType: number = JellyfishWallet.COIN_TYPE_DFI
    const purpose: number = JellyfishWallet.PURPOSE_LIGHT_PRICE_ORACLE
    super(hdNodeProvider, accountProvider, coinType, purpose)
    this.network = network
  }

  /**
   * Get Private Key in Wallet Import Format (WIF) in SalmonWalletMnemonic.
   *
   * @param {number} account number to get
   * @return {Promise<string>} PrivateKey in WIF
   */
  async getWIF (account: number): Promise<string> {
    const node = this.deriveNode(account)
    const privateKey = await node.privateKey()
    return WIF.encode(this.network.wifPrefix, privateKey)
  }

  /**
   * Get address with account number in SalmonWalletMnemonic.
   *
   * @param {number} account number to get
   * @return {Promise<string>} address
   */
  async getAddress (account: number): Promise<string> {
    const node = this.deriveNode(account)
    const pubKey = await node.publicKey()
    return Bech32.fromPubKey(pubKey, this.network.bech32.hrp, 0x00)
  }

  private static getMnemonicHdNodeProvider (words: string[], network: Network): MnemonicHdNodeProvider {
    const options = SalmonWalletMnemonic.getBip32Options(network)
    return MnemonicHdNodeProvider.fromWords(words, options)
  }

  private static getBip32Options (network: Network): Bip32Options {
    return {
      bip32: {
        public: network.bip32.publicPrefix,
        private: network.bip32.privatePrefix
      },
      wif: network.wifPrefix
    }
  }
}

/**
 * Default empty wallet account provider to perform session-less disconnected Wallet operations.
 */
class EmptyWalletAccountProvider implements WalletAccountProvider<WhaleWalletAccount> {
  provide (_: WalletEllipticPair): WhaleWalletAccount {
    throw new Error('You are using EmptyWalletAccountProvider which do not have access to WhaleApiClient.')
  }
}
