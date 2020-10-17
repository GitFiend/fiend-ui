import {AnyComponent, ComponentBase, ComponentType} from './base-component'
import {Order} from '../util/order'
import {HostComponent} from './host/host-component'
import {RootComponent} from './root-component'

export class TextComponent implements ComponentBase {
  _type = ComponentType.text as const
  element: Text
  order: string
  key: string

  constructor(
    public text: string,
    public parent: HostComponent | RootComponent,
    parentOrder: string,
    public index: number
  ) {
    this.key = text
    this.element = document.createTextNode(text)

    this.order = Order.key(parentOrder, index)

    parent.insertChild(this)
  }

  remove(): void {
    this.parent.removeChild(this)
  }
}

export function renderTextComponent(
  text: string,
  prevTree: AnyComponent | null,
  parent: HostComponent | RootComponent,
  parentOrder: string,
  index: number
): TextComponent {
  if (prevTree === null) {
    return new TextComponent(text, parent, parentOrder, index)
  }

  if (prevTree._type === ComponentType.text) {
    const prevOrder = prevTree.order
    const newOrder = Order.key(parentOrder, index)

    if (prevOrder !== newOrder) {
      prevTree.index = index
      prevTree.order = newOrder

      parent.moveChild(prevTree)
    }

    if (prevTree.text === text) {
      return prevTree
    } else {
      prevTree.element.nodeValue = text
      prevTree.text = text
      return prevTree
    }
  }

  prevTree.remove()
  return new TextComponent(text, parent, parentOrder, index)
}
