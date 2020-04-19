import {ParentTree2, Tree2, TreeBase, TreeType} from './base'
import {removeSubtrees} from '../render2'

export class Text2 implements TreeBase {
  type = TreeType.text as const
  element: Text

  constructor(public text: string, public parent: ParentTree2) {
    this.element = document.createTextNode(text)
    parent.element.appendChild(this.element)
  }

  remove(): void {
    this.element.remove()
  }
}

export function renderTextComponent(
  text: string,
  prevTree: Tree2 | null,
  parent: ParentTree2,
  index: number
): Text2 {
  if (prevTree === null) {
    return new Text2(text, parent)
  }

  if (prevTree.type === TreeType.text) {
    if (prevTree.text === text) return prevTree
    else {
      prevTree.element.nodeValue = text
      return prevTree
    }
  }

  removeSubtrees(parent, index)

  return new Text2(text, parent)
}
