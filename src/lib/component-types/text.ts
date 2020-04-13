import {ParentTree, Tree, TreeBase, TreeType} from './base'
import {removeFollowingElements} from '../render'

export class TextComponent implements TreeBase {
  type = TreeType.text as const
  parent: ParentTree | null = null
  element: Text | null = null

  constructor(public text: string) {}

  remove(): void {
    this.element?.remove()
  }
}

export function applyTextChanges(
  parent: ParentTree,
  tree: TextComponent,
  prevTree: Tree | null,
  index: number
) {
  if (prevTree !== null) {
    // prevTree exists

    if (prevTree.type === TreeType.text) {
      // Update it
      if (prevTree.text === tree.text) {
        if (prevTree.element) {
          tree.element = prevTree.element
        }
        return null
      } else {
        if (prevTree.element) {
          prevTree.element.nodeValue = tree.text
          tree.element = prevTree.element
        }
        return null
      }
    } else {
      // The type of prevTree is different. Delete it and following elements
      removeFollowingElements(parent, index)
    }
  }

  const element = document.createTextNode(tree.text)
  parent.element?.appendChild(element)
  tree.element = element

  return null
}
