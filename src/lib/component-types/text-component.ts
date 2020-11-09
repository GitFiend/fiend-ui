import {
  AnyComponent,
  ComponentBase,
  ComponentType,
  ElementComponent,
  ParentComponent,
} from './base-component'
import {Order} from '../util/order'
import {HostComponent} from './host/host-component'
import {RootComponent} from './root-component'

export class TextComponent implements ComponentBase {
  _type = ComponentType.text as const
  element: Text
  order: string
  key: string
  prevElement: ElementComponent | null = null

  constructor(
    public text: string,
    public parentHost: HostComponent | RootComponent,
    directParent: ParentComponent,
    public index: number
  ) {
    const order = Order.key(directParent.order, index)

    this.key = directParent.key + index
    this.order = order
    this.element = document.createTextNode(text)

    parentHost.insertChild(this)
  }

  remove(): void {
    this.parentHost.removeChild(this)
  }
}

export function renderTextComponent(
  text: string,
  prevTree: AnyComponent | null,
  parentHost: HostComponent | RootComponent,
  directParent: ParentComponent,
  index: number
): TextComponent {
  if (prevTree === null) {
    return new TextComponent(text, parentHost, directParent, index)
  }

  if (prevTree._type === ComponentType.text) {
    const prevOrder = prevTree.order
    const newOrder = Order.key(directParent.order, index)

    if (prevOrder !== newOrder) {
      prevTree.index = index
      prevTree.order = newOrder

      parentHost.moveChild(prevTree)
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
  return new TextComponent(text, parentHost, directParent, index)
}
