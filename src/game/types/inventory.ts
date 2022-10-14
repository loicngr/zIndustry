import { EKey } from '../enums/key'

export type TBagItemType = {
  [key: string]: {
    tile: number
    canPlace: true
  }
}

export type TBagItem = {
  id: number
  name: string
  icon?: string
  count: number
  floatingText?: number
  key: EKey
  type?: string
}

type TBag = {
  id: number
  size: number
  items: Pick<TBagItem, 'key' | 'type' | 'floatingText'>[]
}

export type TInventory = {
  bags: TBag[]
}
