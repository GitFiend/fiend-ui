export interface InsertedOrder {
  order: string
  element: Element | Text
}

export class Order {
  static key(parentOrder: string, index: number): string {
    return parentOrder + String.fromCharCode(index + 48)
  }

  static insert(
    parentElement: Element,
    inserted: InsertedOrder[],
    element: Element | Text,
    order: string
  ): void {
    const len = inserted.length

    for (let i = len - 1; i >= 0; i--) {
      const ins = inserted[i]

      if (order === ins.order) {
        parentElement.insertBefore(element, inserted[i + 1]?.element ?? null)
        return
      }
      if (order > ins.order) {
        parentElement.insertBefore(element, inserted[i + 1]?.element ?? null)

        if (i < len - 1) inserted.splice(i + 1, 0, {order, element})
        else inserted.push({order, element})

        return
      }
    }

    inserted.unshift({order, element})
    parentElement.prepend(element)
  }

  static move(
    inserted: InsertedOrder[],
    parentElement: Element,
    element: Element | Text,
    prevOrder: string,
    newOrder: string
  ) {
    const i = inserted.findIndex(ins => ins.order === prevOrder)

    if (i >= 0) {
      inserted.splice(i, 1)
    }

    this.insert(parentElement, inserted, element, newOrder)
  }

  static remove(position: string, inserted: InsertedOrder[]): void {
    const i = inserted.findIndex(i => i.order === position)

    if (i >= 0) {
      const [child] = inserted.splice(i, 1)

      child.element.remove()

      // for (const c of children) {
      //   c.element.remove()
      // }
    }
  }
}
