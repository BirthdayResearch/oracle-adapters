import { Network } from '@defichain/jellyfish-network'
import { JellyfishWallet, WalletAccountProvider } from '@defichain/jellyfish-wallet'
import { Bip32Options, MnemonicHdNode, MnemonicHdNodeProvider } from '@defichain/jellyfish-wallet-mnemonic'
import { WhaleWalletAccount } from '@defichain/whale-api-wallet'

const PURPOSE_LIGHT_ORACLE_ADAPTER = 2

/**
 * Basic wrapper around JellyfishWallet, so we can extend with any oracle specific
 * functionality we might need
 */

export class SalmonWalletMnemonic extends JellyfishWallet<WhaleWalletAccount, MnemonicHdNode> {
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
