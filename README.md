[![CI](https://github.com/DeFiCh/oracle-adapters/actions/workflows/ci.yml/badge.svg)](https://github.com/DeFiCh/oracle-adapters/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/DeFiCh/oracle-adapters/branch/main/graph/badge.svg?token=IYL9K0WROA)](https://codecov.io/gh/DeFiCh/oracle-adapters)
[![Maintainability](https://api.codeclimate.com/v1/badges/02685503dbd6a40ba1eb/maintainability)](https://codeclimate.com/github/DeFiCh/oracle-adapters/maintainability)
[![npm](https://img.shields.io/npm/v/@defichain/salmon)](https://www.npmjs.com/package/@defichain/salmon)

# DeFiChain Oracle Adapters (The Salmon Project)

> Mono-repo for DeFiChain Oracle Adapters. Next generation implementation replacing existing [`DeFiCh/salmon`](https://github.com/DeFiCh/salmon).

## Technical Design

DeFiChain Oracle Adapters follows a mono-repo design with two distinct sections: salmon packages, and adapters. Packages
represent each module component of the oracle system with a runner. Adapters are a data-only, price feed fetcher that
conforms to the specification of `packages/salmon-fetch`.

### [@defichain/oracle-adapters](./adapters)

Featuring a collection of Oracle Price Feed adapters. Powered with `@defichain/salmon-fetch` it fetches data and
transforms it into a list of `AssetPrice` for publishing.

## The Salmon Framework

A runner agnostic ephemeral oracle publishing framework. Each module component represent a modular subsystem of salmon.

### [@defichain/salmon](./packages/salmon)

A modular PriceFeed publisher to push prices through a filter and publish it into SalmonWallet.

0. Prior - fetch the price feed from an adapter and pushes it to a Salmon instance.
1. Setup - reads the env configs, initialize the instances and client.
2. Filter - reads the price feed data and decide whether to alter, accept or reject it.
3. Publish - finally broadcast the accepted prices' data.

### [@defichain/salmon-fetch](./packages/salmon-fetch)

Helper utility to fetch form URL with Response as JSON with all numbers parsed as BigNumber. Providing an `AssetPrice`
interface that contains the token-amount pair and the currency that represent the pair. This format is used for
SalmonRunner downstream.

### [@defichain/salmon-filter](./packages/salmon-filter)

SalmonFilter orchestrates all Filter configured, it is run in the given order set in the constructor. Using a chain of
responsibility design pattern, it is configured with the network, whale client, and oracleId. This filter pattern
receives a list of prices for filtering. Once filtered, it can accept, warn, reject partial by filtering or rejecting
all.

This approach allows all filtering and data manipulation to be carried out in a separate manner within a singular scope.
Using the chain of responsibility design pattern, the filter only needs to be responsible for its filtering logic.

This filter logic can be greatly expanded to many categories for more data pruning and cleaning processes with all sorts
of integration capabilities.

### [@defichain/salmon-testing](./packages/salmon-testing)

Providing the e2e testing capability for salmon framework. This package is a Whale + Ain Masternode RegTest Container
that automatically setup a `network` and connects `ain` and `whale` together providing a `WhaleApiClient` for testing.

### [@defichain/salmon-wallet](./packages/salmon-wallet)

SalmonWallet is a serverless first lightweight wallet setup that is easy to configure. Powered by DeFiCh/oracle-adapters
ecosystem, this wallet uses Ocean APIs and required all transactions to be signed in Bech32 format.

Requiring just PrivateKey (WIF), NetworkName, and WhaleApiClient for its entirety. This wallet will construct an oracle
price feed for submission, sign the oracle price feed with the given private key. Lastly, submit the price feed into the
connected network.

## Usage

```ts
import { Salmon, SalmonWallet, WhaleApiClient } from '@defichain/salmon'
import coingecko from 'coingecko'

/**
 * As simple as coingecko() to get prices and push to publish.
 */
async function main (): Promise<void> {
  const client = new WhaleApiClient()
  const wallet = new SalmonWallet()
  const salmon = new Salmon('oracleId', 'mainnet', client, wallet)
  await salmon.publish(await coingecko())
}
```

## Security issues

If you discover a security vulnerability in
`@defichain/salmon`, [please see submit it privately](https://github.com/DeFiCh/.github/blob/main/SECURITY.md).

## License & Disclaimer

By using `@defichain/salmon` (this repo), you (the user) agree to be bound by [the terms of this license](LICENSE).
