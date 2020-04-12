import {ParentTree, Tree, TreeBase, TreeType} from './host'

export interface TextComponent extends TreeBase {
  type: TreeType.text
  element: Text
  text: string
}

export function mkTextNode(text: string): TextComponent {
  return {
    parent: null,
    type: TreeType.text,
    text,
    element: document.createTextNode(text),
  }
}

export function applyTextChanges(
  parent: ParentTree,
  tree: TextComponent,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
) {
  if (prevTree === null) {
    target.appendChild(tree.element)
  } else {
    const siblings = parent.children
    const len = siblings.length

    for (let i = index; i < len; i++) {
      const s = siblings[i]
      s.element?.remove()
    }
  }
  return null
}
