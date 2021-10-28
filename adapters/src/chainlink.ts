import { AssetPrice, newAssetPrice } from '@defichain/salmon-fetch'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

const CHAINLINK_ABI = [{ inputs: [{ internalType: 'address', name: '_aggregator', type: 'address' }, { internalType: 'address', name: '_accessController', type: 'address' }], stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'int256', name: 'current', type: 'int256' }, { indexed: true, internalType: 'uint256', name: 'roundId', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'updatedAt', type: 'uint256' }], name: 'AnswerUpdated', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'uint256', name: 'roundId', type: 'uint256' }, { indexed: true, internalType: 'address', name: 'startedBy', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'startedAt', type: 'uint256' }], name: 'NewRound', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'from', type: 'address' }, { indexed: true, internalType: 'address', name: 'to', type: 'address' }], name: 'OwnershipTransferRequested', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'from', type: 'address' }, { indexed: true, internalType: 'address', name: 'to', type: 'address' }], name: 'OwnershipTransferred', type: 'event' }, { inputs: [], name: 'acceptOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'accessController', outputs: [{ internalType: 'contract AccessControllerInterface', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'aggregator', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: '_aggregator', type: 'address' }], name: 'confirmAggregator', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'decimals', outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'description', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_roundId', type: 'uint256' }], name: 'getAnswer', outputs: [{ internalType: 'int256', name: '', type: 'int256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }], name: 'getRoundData', outputs: [{ internalType: 'uint80', name: 'roundId', type: 'uint80' }, { internalType: 'int256', name: 'answer', type: 'int256' }, { internalType: 'uint256', name: 'startedAt', type: 'uint256' }, { internalType: 'uint256', name: 'updatedAt', type: 'uint256' }, { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_roundId', type: 'uint256' }], name: 'getTimestamp', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'latestAnswer', outputs: [{ internalType: 'int256', name: '', type: 'int256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'latestRound', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'latestRoundData', outputs: [{ internalType: 'uint80', name: 'roundId', type: 'uint80' }, { internalType: 'int256', name: 'answer', type: 'int256' }, { internalType: 'uint256', name: 'startedAt', type: 'uint256' }, { internalType: 'uint256', name: 'updatedAt', type: 'uint256' }, { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'latestTimestamp', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'owner', outputs: [{ internalType: 'address payable', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint16', name: '', type: 'uint16' }], name: 'phaseAggregators', outputs: [{ internalType: 'contract AggregatorV2V3Interface', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'phaseId', outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: '_aggregator', type: 'address' }], name: 'proposeAggregator', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'proposedAggregator', outputs: [{ internalType: 'contract AggregatorV2V3Interface', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }], name: 'proposedGetRoundData', outputs: [{ internalType: 'uint80', name: 'roundId', type: 'uint80' }, { internalType: 'int256', name: 'answer', type: 'int256' }, { internalType: 'uint256', name: 'startedAt', type: 'uint256' }, { internalType: 'uint256', name: 'updatedAt', type: 'uint256' }, { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'proposedLatestRoundData', outputs: [{ internalType: 'uint80', name: 'roundId', type: 'uint80' }, { internalType: 'int256', name: 'answer', type: 'int256' }, { internalType: 'uint256', name: 'startedAt', type: 'uint256' }, { internalType: 'uint256', name: 'updatedAt', type: 'uint256' }, { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: '_accessController', type: 'address' }], name: 'setController', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_to', type: 'address' }], name: 'transferOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'version', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }]

interface ChainlinkSymbolMapping {
  ticker: string
  inverse: boolean
}

export const CHAINLINK_SYMBOL_MAPPING: Record<string, ChainlinkSymbolMapping> = {
  ETH: {
    ticker: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
    inverse: false
  },
  BTC: {
    ticker: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
    inverse: false
  },
  LTC: {
    ticker: '0x6af09df7563c363b5763b9102712ebed3b9e859b',
    inverse: false
  },
  DOGE: {
    ticker: '0x2465cefd3b488be410b941b1d4b2767088e2a028',
    inverse: false
  },
  BCH: {
    ticker: '0x9f0f69428f923d6c95b781f89e165c9b2df9789d',
    inverse: false
  },
  BTC_TEST_INVERSE: {
    ticker: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c',
    inverse: true
  }
}

async function fetchAsset (symbol: string, provider?: any): Promise<AssetPrice> {
  const contractAddress = CHAINLINK_SYMBOL_MAPPING[symbol].ticker
  const contract = new ethers.Contract(contractAddress, CHAINLINK_ABI, provider)

  const answer = await contract.latestAnswer()
  const decimals = await contract.decimals()
  let price = (new BigNumber(answer.toString())).shiftedBy(-decimals)

  if (CHAINLINK_SYMBOL_MAPPING[symbol].inverse) {
    price = new BigNumber(1).div(price)
  }

  const timestamp = await contract.latestTimestamp()
  return newAssetPrice(symbol, price, 'USD', (new BigNumber(timestamp.toString())).multipliedBy(1000))
}

export default async function (symbols: string[], apiToken?: string): Promise<AssetPrice[]> {
  const provider = new ethers.providers.InfuraProvider('mainnet', apiToken)

  return await Promise.all(symbols.map(async symbol => {
    return await fetchAsset(symbol, provider)
  }))
}
