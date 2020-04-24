import {ParentTree2, Subtree, Tree2, TreeBase, TreeType} from '../base'
import {removeSubtrees, renderChildInternal} from '../../render2'
import {setAttributesFromProps, updateAttributes} from './set-attributes'

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

    this.children = renderHostChildren(childrenSlices, [], this)
  }

  remove(): void {
    this.element.remove()

    for (const c of this.children) c.remove()
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
    if (props !== null) {
      updateAttributes(prevTree.element, props, prevTree.props)
    }

    prevTree.props = props
    prevTree.children = renderHostChildren(children, prevTree.children, parent)

    return prevTree
  } else {
    removeSubtrees(parent, index)
    return new Host2(tag, props, parent, children)
  }
}

function renderHostChildren(children: Subtree[], prevChildren: Tree2[], parent: ParentTree2) {
  /*
    Sometimes there is one child that's also an array.
     */
  if (children.length === 1 && Array.isArray(children[0])) {
    children = (children as Subtree[][])[0]
  }

  const len = children.length
  const newChildren: Tree2[] = Array(len)

  for (let i = 0; i < len; i++) {
    newChildren[i] = renderChildInternal(children[i], prevChildren[i] || null, parent, i)
  }

  return newChildren
}
