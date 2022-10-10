import { EKey } from '../enums/key'

export type TBagItem = {
  id: number
  name: string
  icon?: string
  count: number
  key: EKey
}

type TBag = {
  id: number
  size: number
  items: Pick<TBagItem, 'key'>[]
}

export type TInventory = {
  bags: TBag[]
}
