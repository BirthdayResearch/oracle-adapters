import { Network } from '@defichain/jellyfish-network'
import { JellyfishWallet, WalletAccountProvider } from '@defichain/jellyfish-wallet'
import { Bip32Options, MnemonicHdNode, MnemonicHdNodeProvider } from '@defichain/jellyfish-wallet-mnemonic'
import { WhaleWalletAccount } from '@defichain/whale-api-wallet'

const PURPOSE_LIGHT_ORACLE_ADAPTER = 2

/**
 * Basic wrapper around JellyfishWallet, this uses a mnemonic phrase to initialise
 * an HD wallet, and provides the same functionality as JellyfishWallet
 *
 * See: https://github.com/DeFiCh/jellyfish/tree/main/packages/jellyfish-wallet/src/wallet.ts
 */

export class SalmonWalletMnemonic extends JellyfishWallet<WhaleWalletAccount, MnemonicHdNode> {
  /**
   * @param {string[]} words to derive
   * @param {Network} network
   * @param {WalletAccountProvider<WhaleWalletAccount>} accountProvider
   */
  constructor (
    words: string[],
    network: Network,
    accountProvider: WalletAccountProvider<WhaleWalletAccount>
  ) {
    const hdNodeProvider = MnemonicHdNodeProvider.fromWords(words,
      SalmonWalletMnemonic.getBip32Options(network))

    const coinType: number = JellyfishWallet.COIN_TYPE_DFI
    const purpose: number = PURPOSE_LIGHT_ORACLE_ADAPTER
    super(hdNodeProvider, accountProvider, coinType, purpose)
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
