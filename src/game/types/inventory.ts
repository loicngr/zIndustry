export type TBagItem = {
  id: number
  name: string
  icon?: string
  count: number
}

type TBag = {
  id: number
  size: number
  items: TBagItem[]
}

export type TInventory = {
  bags: TBag[]
}
