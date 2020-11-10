import {HostComponent} from '../component-types/host/host-component'
import {RootComponent} from '../component-types/root-component'
import {ElementComponent} from '../component-types/base-component'
import {RunStack} from '../observables/run-stack'

// export function checkOrder(inserted: ElementComponent[]) {
//   if (!__DEV__) return
//
//   let prev: ElementComponent | null = null
//
//   for (const c of inserted) {
//     console.log(c.key, prev?.key)
//     if (prev !== null) {
//       if (prev.element !== c.element.previousElementSibling) {
//         console.log('elements out of order')
//         // debugger
//       }
//       if (prev.order > c.order) {
//         console.log('keys out of order')
//       }
//     }
//     prev = c
//   }
// }

export function applyInserts(parent: RootComponent | HostComponent): void {
  const {inserted, siblings, element} = parent

  const len = inserted.length

  let next: ElementComponent | null = null

  for (let i = len - 1; i >= 0; i--) {
    const current = inserted[i]

    if (next === null) {
      if (!siblings.has(current.element)) {
        element.insertBefore(current.element, null)
        siblings.set(current.element, null)
      }
    } else if (siblings.has(next.element)) {
      const prevElement = siblings.get(next.element)

      if (prevElement !== current.element) {
        element.insertBefore(current.element, next.element)
        siblings.set(next.element, current.element)
        if (!siblings.has(current.element)) siblings.set(current.element, null)
      }
    }

    next = current
  }
}

export class Order {
  static key(parentOrder: string, index: number): string {
    return parentOrder + String.fromCharCode(index + 48)
  }

  static insert(parent: RootComponent | HostComponent, child: ElementComponent): void {
    const {inserted} = parent
    const {order, key} = child

    const len = inserted.length

    for (let i = len - 1; i >= 0; i--) {
      const current = inserted[i]
      const next: ElementComponent | undefined = inserted[i + 1]

      /*
      If order is the same we expect the keys to be different. This
      is expected for a virtual list.
       */
      if (order >= current.order) {
        if (key !== current.key) {
          if (next != null) {
            inserted.splice(i + 1, 0, child)

            RunStack.insertsStack.add(parent)
          } else {
            RunStack.insertsStack.add(parent)
            inserted.push(child)
          }
        }

        return
      }
    }

    inserted.unshift(child)
    RunStack.insertsStack.add(parent)
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
    const {inserted, siblings} = parent
    const {key} = child

    const i = inserted.findIndex(i => i.key === key)

    if (i >= 0) {
      const [child] = inserted.splice(i, 1)

      siblings.delete(child.element)
      RunStack.removeStack.add(child.element)
    }
  }
}
