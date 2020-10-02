import {AnyComponent, ComponentBase, ComponentType} from './base'

export class TextComponent implements ComponentBase {
  _type = ComponentType.text as const
  containerElement: Text
  // firstElement: Text

  constructor(
    public text: string,
    // public parent: ParentComponent,
    public index: number
  ) {
    this.containerElement = document.createTextNode(text)
    // this.firstElement = this.containerElement

    // const siblingEl = sibling?.firstElement ?? null
    // parent.containerElement.insertBefore(this.containerElement, parent.lastInserted)
    // parent.lastInserted = this.containerElement

    // if (sibling === null) {
    //   parent.containerElement.appendChild(this.containerElement)
    // } else {
    //   parent.containerElement.insertBefore(
    //     this.containerElement,
    //     sibling.containerElement
    //   )
    // }
  }

  remove(): void {
    this.containerElement.remove()
  }
}

export function renderTextComponent(
  text: string,
  prevTree: AnyComponent | null,
  // parent: ParentComponent,
  index: number
): TextComponent {
  if (prevTree === null) {
    return new TextComponent(text, index)
  }

  if (prevTree._type === ComponentType.text) {
    // if (index !== prevTree.index) {
    // parent.containerElement.insertBefore(prevTree.containerElement, parent.lastInserted)
    // parent.lastInserted = prevTree.containerElement
    prevTree.index = index
    // }

    if (prevTree.text === text) {
      return prevTree
    } else {
      prevTree.containerElement.nodeValue = text
      prevTree.text = text
      return prevTree
    }
  }

  prevTree.remove()
  return new TextComponent(text, index)
}
