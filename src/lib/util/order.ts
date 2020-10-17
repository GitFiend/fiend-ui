import {HostComponent} from '../component-types/host/host-component'
import {TextComponent} from '../component-types/text-component'
import {RootComponent} from '../component-types/root-component'

export class Order {
  static key(parentOrder: string, index: number): string {
    return parentOrder + String.fromCharCode(index + 48)
  }

  static insert(
    parent: RootComponent | HostComponent,
    child: HostComponent | TextComponent
  ): void {
    const {inserted, element: parentElement} = parent
    const {element, order, key} = child

    const len = inserted.length

    for (let i = len - 1; i >= 0; i--) {
      const ins = inserted[i]

      if (order === ins.order) {
        parentElement.insertBefore(element, inserted[i + 1]?.element ?? null)

        if (key !== ins.key) {
          if (i < len - 1) inserted.splice(i + 1, 0, child)
          else inserted.push(child)
        }
        return
      }
      if (order > ins.order) {
        parentElement.insertBefore(element, inserted[i + 1]?.element ?? null)

        if (i < len - 1) inserted.splice(i + 1, 0, child)
        else inserted.push(child)

        return
      }
    }

    inserted.unshift(child)
    parentElement.prepend(element)
  }

  static move(
    parent: RootComponent | HostComponent,
    child: HostComponent | TextComponent
  ) {
    const {inserted} = parent
    const {key} = child

    const i = inserted.findIndex(ins => ins.key === key)

    if (i >= 0) {
      inserted.splice(i, 1)
    }

    this.insert(parent, child)
  }

  static remove(
    parent: RootComponent | HostComponent,
    child: HostComponent | TextComponent
  ): void {
    const {inserted} = parent
    const {key} = child

    const i = inserted.findIndex(i => i.key === key)

    if (i >= 0) {
      const [child] = inserted.splice(i, 1)

      child.element.remove()
    }
  }
}
