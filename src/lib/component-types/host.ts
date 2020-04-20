import {ParentTree, Tree, TreeBase, TreeType} from './base'
import {removeFollowingElements} from '../render'
import {setAttributesFromProps} from './host/set-attributes'

export class HostComponent implements TreeBase {
  type = TreeType.host as const
  parent: ParentTree | null = null
  element: HTMLElement | null = null

  constructor(
    public tag: keyof HTMLElementTagNameMap,
    public props: Record<string, unknown> | null,
    public children: Tree[]
  ) {}

  remove(): void {
    this.element?.remove()

    for (const c of this.children) c.remove()
  }
}

export function applyHostChanges(
  parent: ParentTree,
  tree: HostComponent,
  prevTree: Tree | null,
  index: number
) {
  if (prevTree !== null) {
    if (prevTree.type === TreeType.host && prevTree.tag === tree.tag) {
      // prevTree is the same type, update it if needed.

      // TODO: Update it.
      if (prevTree.element) {
        tree.element = prevTree.element
      }
      return tree.element
    } else {
      // The type of prevTree is different. Delete it and following elements
      removeFollowingElements(parent, index)
    }
  }

  const el = document.createElement(tree.tag)

  if (tree.props) setAttributesFromProps(el, tree.props)

  parent.element?.appendChild(el)
  tree.element = el

  return el
}
