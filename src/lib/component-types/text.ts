import {ParentTree, Tree, TreeBase, TreeType} from './base'

export class TextComponent implements TreeBase {
  type = TreeType.text as const
  parent: ParentTree | null = null
  element: Text | null = null

  constructor(public text: string) {
    // this.element = document.createTextNode(text)
  }

  create() {
    this.element = document.createTextNode(this.text)
  }

  update(prev: Text, newText: string) {
    prev.nodeValue = newText
    this.element = prev
  }

  remove(): void {
    this.element?.remove()
  }
}

export function applyTextChanges(
  parent: ParentTree,
  tree: TextComponent,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
) {
  if (prevTree !== null) {
    if (prevTree.type === TreeType.text) {
      if (prevTree.text === tree.text) {
        return null
      } else {
      }
    }

    // TODO: Update case

    const siblings = parent.children
    const len = siblings.length

    for (let i = index; i < len; i++) {
      const s = siblings[i]
      s.remove()
    }
  }
  // TODO
  // target.appendChild(tree.element)

  return null
}
