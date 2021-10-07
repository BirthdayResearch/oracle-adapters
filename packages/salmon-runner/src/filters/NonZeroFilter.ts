import { AbstractFilter } from './Filter'
import { AssetPrice } from '@defichain/salmon-fetch'

export class NonZeroFilter extends AbstractFilter {
  async call (prices: AssetPrice[]): Promise<AssetPrice[]> {
    return prices.filter(value => !value.amount.isZero())
  }
}
