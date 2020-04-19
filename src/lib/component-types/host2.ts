import {ParentTree2, Subtree, Tree2, TreeBase, TreeType} from './base'
import {setAttributesFromProps} from './host'
import {removeSubtrees, renderChildInternal, renderChildren} from '../render2'

export class Host2 implements TreeBase {
  type = TreeType.host as const
  element: HTMLElement
  children: Tree2[]

  constructor(
    public tag: keyof HTMLElementTagNameMap,
    public props: Record<string, unknown> | null,
    public parent: ParentTree2,
    childrenSlices: Subtree[]
  ) {
    this.element = document.createElement(tag)

    if (props !== null) setAttributesFromProps(this.element, props)

    parent.element.appendChild(this.element)

    this.children = renderChildren(childrenSlices, this)
  }

  remove(): void {
    this.element.remove()

    for (const c of this.children) c.remove()
  }

  update() {
    // TODO
  }
}

export function renderHost(
  tag: keyof HTMLElementTagNameMap,
  props: Record<string, unknown> | null,
  children: Subtree[],
  parent: ParentTree2,
  prevTree: Tree2 | null,
  index: number
): Host2 {
  if (prevTree === null) {
    return new Host2(tag, props, parent, children)
  }

  if (prevTree.type === TreeType.host && prevTree.tag === tag) {
    // TODO: Update attributes. Update children.
    prevTree.children = renderHostChildren(children, prevTree.children, parent)

    return prevTree
  } else {
    removeSubtrees(parent, index)
    return new Host2(tag, props, parent, children)
  }
}

function renderHostChildren(children: Subtree[], prevChildren: Tree2[], parent: ParentTree2) {
  const len = children.length
  const newChildren: Tree2[] = Array(len)

  for (let i = 0; i < len; i++) {
    newChildren[i] = renderChildInternal(children[i], prevChildren[i] || null, parent, i)
  }

  return newChildren
}
