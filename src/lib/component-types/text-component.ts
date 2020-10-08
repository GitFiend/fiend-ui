import {AnyComponent, ComponentBase, ComponentType, ParentComponent} from './base'
import {Order} from '../util/order'

export class TextComponent implements ComponentBase {
  _type = ComponentType.text as const
  element: Text
  order: string

  constructor(
    public text: string,
    public parent: ParentComponent,
    parentOrder: string,
    public index: number
  ) {
    this.element = document.createTextNode(text)
    this.order = Order.key(parentOrder, index)

    parent.insertChild(this.element, this.order)
  }

  remove(): void {
    this.parent.removeChild(this.order)

    // this.element.remove()
  }
}

export function renderTextComponent(
  text: string,
  prevTree: AnyComponent | null,
  parent: ParentComponent,
  parentOrder: string,
  index: number
): TextComponent {
  if (prevTree === null) {
    return new TextComponent(text, parent, parentOrder, index)
  }

  if (prevTree._type === ComponentType.text) {
    if (index !== prevTree.index) {
      const prevOrder = prevTree.order
      prevTree.index = index
      prevTree.order = Order.key(parentOrder, index)

      parent.moveChild(prevTree.element, prevOrder, prevTree.order)
      // parent.insertChild(prevTree.element, prevTree.order)
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
