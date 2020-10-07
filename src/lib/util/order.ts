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

        const next = inserted[i + 1]
        if (next !== undefined) {
          parentElement.insertBefore(element, next.element)
        }

        return
      }
      if (order > ins.order) {
        inserted.splice(i, 0, {
          order,
          element,
        })

        const next = inserted[i + 1]
        if (next !== undefined) {
          parentElement.insertBefore(element, next.element)
        }
        return
      }
    }

    // if (len > 0) {
    inserted.unshift({order, element})
    parentElement.prepend(element)
    // } else {
    //   inserted.push({order, element})
    //   parentElement.insertBefore(element, null)
    // }
  }
}
