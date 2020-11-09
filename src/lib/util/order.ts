import {HostComponent} from '../component-types/host/host-component'
import {RootComponent} from '../component-types/root-component'
import {ElementComponent} from '../component-types/base-component'

export function checkOrder(inserted: ElementComponent[]) {
  if (!__DEV__) return

  let prev: ElementComponent | null = null

  for (const c of inserted) {
    console.log(c.key, prev?.key)
    if (prev !== null) {
      if (prev.element !== c.element.previousElementSibling) {
        console.log('elements out of order')
        // debugger
      }
      if (prev.order > c.order) {
        console.log('keys out of order')
      }
    }
    prev = c
  }
}

// export function fixOrder(inserted: ElementComponent[]) {
//   let prev: ElementComponent | null = null
//
//   for (const c of inserted) {
//     if (prev !== null) {
//       // console.log(
//       //   (c.prevElement !== prev.element) ===
//       //     (prev.element !== c.element.previousElementSibling)
//       // )
//
//       if (c.prevElement !== prev.element) {
//         c.insertBefore(prev, c)
//       }
//     }
//     prev = c
//   }
// }

export let insertsCount = 0
export function resetInsertsCount() {
  insertsCount = 0
}

export class Order {
  static key(parentOrder: string, index: number): string {
    return parentOrder + String.fromCharCode(index + 48)
  }

  static insert(parent: RootComponent | HostComponent, child: ElementComponent): void {
    // if (insertsCount > 10) {
    //   debugger
    // }

    const {inserted, element: parentElement} = parent
    const {element, order, key} = child

    const len = inserted.length

    for (let i = len - 1; i >= 0; i--) {
      const current = inserted[i]
      const next: ElementComponent | undefined = inserted[i + 1]

      if (order >= current.order) {
        /*
        If order is the same we expect the keys to be different. This
        is expected for a virtual list.
         */

        if (key !== current.key) {
          if (next != null) {
            // next.insertBefore(child, current)
            if (
              next.prevElement !== child ||
              next.prevElement.element !== child.element
            ) {
              parentElement.insertBefore(element, next.element)

              insertsCount++

              next.prevElement = child
            }
            child.prevElement = current

            inserted.splice(i + 1, 0, child)
          } else {
            if (
              child.prevElement !== current ||
              child?.prevElement.element !== current.element
            ) {
              parentElement.insertBefore(element, null)

              insertsCount++

              child.prevElement = current
            }
            inserted.push(child)
          }
        }

        // checkOrder(inserted)
        return
      }
    }

    inserted.unshift(child)
    parentElement.prepend(element)

    // console.log('insert')
    insertsCount++
    // insertsCount[parent.key]++

    if (inserted.length > 1) {
      // console.log('omg', inserted.length)

      inserted[1].prevElement = child
    }

    // checkOrder(inserted)
  }

  static move(parent: RootComponent | HostComponent, child: ElementComponent) {
    const {inserted} = parent
    const {key} = child

    const i = inserted.findIndex(ins => ins.key === key)

    if (i >= 0) {
      inserted.splice(i, 1)
    }

    this.insert(parent, child)
  }

  static remove(parent: RootComponent | HostComponent, child: ElementComponent): void {
    const {inserted} = parent
    const {key} = child

    const i = inserted.findIndex(i => i.key === key)

    if (i >= 0) {
      const [child] = inserted.splice(i, 1)
      const prev = inserted[i]
      const next = inserted[i + 1]

      if (prev !== undefined && next !== undefined) {
        next.prevElement = prev
      }

      child.element.remove()
    }

    // checkOrder(inserted)
  }
}
