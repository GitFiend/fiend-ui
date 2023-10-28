import {
  AnyComponent,
  ComponentBase,
  ComponentType,
  ParentComponent,
} from './base-component'
import {Order} from '../util/order'
import {DomComponent} from './host/dom-component'
import {RootComponent} from './root-component'

export class TextComponent implements ComponentBase {
  _type = ComponentType.text as const
  element: Text
  order: string
  key: string

  constructor(
    public text: string,
    public domParent: DomComponent | RootComponent,
    directParent: ParentComponent,
    public index: number,
  ) {
    const order = Order.key(directParent.order, index)

    this.key = directParent.key + index
    this.order = order
    this.element = document.createTextNode(text)

    domParent.insertChild(this)
  }

  remove(): void {
    this.domParent.removeChild(this)
  }
}

export function renderTextComponent(
  text: string,
  prev: AnyComponent | null,
  domParent: DomComponent | RootComponent,
  directParent: ParentComponent,
  index: number,
): TextComponent {
  if (prev === null) {
    return new TextComponent(text, domParent, directParent, index)
  }

  if (prev._type === ComponentType.text) {
    const prevOrder = prev.order
    const newOrder = Order.key(directParent.order, index)

    if (prevOrder !== newOrder) {
      prev.index = index
      prev.order = newOrder

      domParent.moveChild(prev)
    }

    if (prev.text === text) {
      return prev
    } else {
      prev.element.nodeValue = text
      prev.text = text
      return prev
    }
  }

  prev.remove()
  return new TextComponent(text, domParent, directParent, index)
}
