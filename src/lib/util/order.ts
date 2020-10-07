export interface InsertedOrder {
  order: string
  element: Element | Text
}

export class Order {
  static key(parentOrder: string, index: number): string {
    return parentOrder + String.fromCharCode(index)
  }

  static insert(
    parentElement: Element,
    inserted: InsertedOrder[],
    element: Element | Text,
    order: string
  ) {
    const len = inserted.length

    for (let i = len - 1; i >= 0; i--) {
      const ins = inserted[i]

      if (order === ins.order) {
        ins.element = element

        parentElement.insertBefore(element, inserted[i + 1]?.element ?? null)

        return
      }
      if (order > ins.order) {
        if (i < len - 1) {
          inserted.splice(i + 1, 0, {order, element})
        } else {
          inserted.push({order, element})
        }

        parentElement.insertBefore(element, inserted[i]?.element ?? null)

        return
      }
    }

    inserted.unshift({order, element})
    parentElement.prepend(element)
  }
}
