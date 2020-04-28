import {ParentTree, Z, ComponentBase, ZType} from './base'
import {removeSubtrees} from '../render'

export class TextComponent implements ComponentBase {
  type = ZType.text as const
  element: Text

  constructor(public text: string, public parent: ParentTree) {
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
  parent: ParentTree,
  index: number
): TextComponent {
  if (prevTree === null) {
    return new TextComponent(text, parent)
  }

  if (prevTree.type === ZType.text) {
    if (prevTree.text === text) return prevTree
    else {
      prevTree.element.nodeValue = text
      return prevTree
    }
  }

  removeSubtrees(parent, index)

  return new TextComponent(text, parent)
}
