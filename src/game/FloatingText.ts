import { TFloatingText } from '../common/types'
import { Ui } from './Ui'

export class FloatingText {
  elements: TFloatingText[]
  ui: Ui

  constructor(ui: Ui) {
    this.ui = ui
    this.elements = []
  }

  /**
   * Add floating text in collection
   */
  add(item: Omit<TFloatingText, 'id'>): number {
    const itemId = (this.elements[this.elements.length - 1]?.id ?? 0) + 1
    this.elements.push({ ...item, id: itemId })
    this.ui.update()

    return itemId
  }

  /**
   * Remove a floating text by id in collection
   */
  remove(id: number): void {
    const index = this.elements.findIndex((i) => i.id === id)

    if (index !== -1) {
      this.elements.splice(index, 1)
      this.ui.update()
    }
  }

  /**
   * Update a floating text by id in collection
   */
  update(id: number, item: Partial<TFloatingText>): void {
    const index = this.elements.findIndex((i) => i.id === id)

    if (index !== -1) {
      this.elements[index] = {
        ...this.elements[index],
        ...item,
      }
      this.ui.update()
    }
  }
}
