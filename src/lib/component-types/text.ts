import {ParentTree, Tree, TreeBase, TreeType} from './host'

// export interface TextComponent extends TreeBase {
//   type: TreeType.text
//   element: Text
//   text: string
// }

export class TextComponent implements TreeBase {
  type = TreeType.text as const
  parent: ParentTree | null = null
  element: Text

  constructor(public text: string) {
    this.element = document.createTextNode(text)
  }

  remove(): void {
    this.element.remove()
  }
}

// export function mkTextNode(text: string): TextComponent {
//   return {
//     parent: null,
//     type: TreeType.text,
//     text,
//     element: document.createTextNode(text),
//   }
// }

export function applyTextChanges(
  parent: ParentTree,
  tree: TextComponent,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
) {
  if (prevTree !== null) {
    if (prevTree.type === TreeType.text && prevTree.text === tree.text) return null

    const siblings = parent.children
    const len = siblings.length

    for (let i = index; i < len; i++) {
      const s = siblings[i]
      s.remove()
    }
  }
  target.appendChild(tree.element)

  return null
}
