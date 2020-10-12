export interface OElement {
  order: string
}

export class OArray {
  static insert(array: OElement[], element: OElement): number {
    const {order} = element

    for (let i = 0; i < array.length; i++) {
      const current = array[i]

      if (order < current.order) {
        array.splice(i, 0, element)
        return i
      } else if (order === current.order) {
        array[i] = element
        return i
      }
    }

    array.push(element)
    return array.length - 1
  }

  static remove(array: OElement[], element: OElement): void {
    const {order} = element

    for (let i = 0; i < array.length; i++) {
      if (array[i].order === order) {
        array.splice(i, 1)
      }
    }
  }
}
