import { TBagItem } from './inventory'

export type TActionBar = {
  size: number
  items: TBagItem[]
  selected: number | undefined
}
