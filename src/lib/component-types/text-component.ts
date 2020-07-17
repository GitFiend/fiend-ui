import {ParentComponent, Z, ComponentBase, ZType} from './base'
import {removeSubComponents} from '../render'

export class TextComponent implements ComponentBase {
  _type = ZType.text as const
  element: Text

  constructor(public text: string, public parent: ParentComponent) {
    this.element = document.createTextNode(text)
    parent.element.appendChild(this.element)
  }

  remove(): void {
    this.element.remove()
  }
}

export function renderTextComponent(
  text: string,
  prevTree: Z | null,
  parent: ParentComponent,
  index: number
): TextComponent {
  if (prevTree === null) {
    return new TextComponent(text, parent)
  }

  if (prevTree._type === ZType.text) {
    if (prevTree.text === text) return prevTree
    else {
      prevTree.element.nodeValue = text
      prevTree.text = text
      return prevTree
    }
  }

  removeSubComponents(parent, index)

  return new TextComponent(text, parent)
}
