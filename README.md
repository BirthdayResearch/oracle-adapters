# DeFiChain Oracle Adapters (The Salmon Project)

> Mono-repo for DeFiChain Oracle Adapters.

## Technical Design

DeFiChain Oracle Adapters follows a mono-repo design with two distinct aspects, packages, and adapters. Packages
represent each module component of the oracle system with a runner. Adapters are a data-only, price feed fetcher that
conforms to the specification of `packages/salmon-fetch`.

### [@defichain/oracle-adapters](./adapters)

Featuring a collection of Oracle Price Feed adapters. Powered with `@defichain/salmon-fetch` it fetches data and
transforms it into a list of `AssetPrice` for publishing.

### [@defichain/salmon-fetch](./packages/salmon-fetch)

Helper utility to fetch form URL with Response as JSON with all numbers parsed as BigNumber. Providing an `AssetPrice`
interface that contains the token-amount pair and the currency that represent the pair. This format is used for
SalmonRunner downstream.

### [@defichain/salmon-filter](./packages/salmon-filter)

SalmonFilter orchestrates all Filter configured, it is run in the given order set in the constructor. Using a chain of
responsibility design pattern, it is configured with the network, whale client, and oracleId. This filter pattern
receives a list of prices for filtering. Once filtered, it can accept, warn, reject partial by filtering or rejecting
all.

This approach allows all filtering and data manipulation to be carried out in a separate manner without singular scope.
Using the chain of responsibility design pattern, the filter only needs to be responsible for its filtering logic.

This filter logic can be greatly expanded to category more data pruning and cleaning processes with all sorts of
integration capabilities.

### [@defichain/salmon-runner](./packages/salmon-runner)

SalmonRunner to run the prices through a filter and pushes it into SalmonWallet.

There are 3 lifecycles of SalmonRunner; setup, filter, and publish. Additionally, prior to running SalmonRunner, you
fetch the price feed from an adapter and push it to SalmonRunner.

1. Setup reads the env configs, initializes the instances and client.
2. Filter reads the price feed data and decides whether to alter, accept or reject it.
3. Publish finally broadcast the accepted prices data.

### [@defichain/salmon-wallet](./packages/salmon-wallet)

SalmonWallet is a serverless first lightweight wallet setup that is easy to configure. Powered by DeFiCh/jellyfish
ecosystem, this wallet uses Ocean APIs and required all transactions to be signed in Bech32 format.

Requiring just PrivateKey (WIF), NetworkName, and WhaleApiClient for its entirety. This wallet will construct an oracle
price feed for submission, sign the oracle price feed with the given private key. Lastly, submit the price feed into the
connected network.

## Usage

```ts
import coingecko from 'coingecko'
import { push } from '@defichain/salmon-runner'

/**
 * As simple as coingecko() to get prices and push to publish.
 */
async function main (): Promise<void> {
  await push(await coingecko())
}
```

## Security issues

If you discover a security vulnerability in
`@defichain/salmon`, [please see submit it privately](https://github.com/DeFiCh/.github/blob/main/SECURITY.md).

## License & Disclaimer

By using `@defichain/salmon` (this repo), you (the user) agree to be bound by [the terms of this license](LICENSE).
