import {ParentTree2, SubSlice, Tree2, ComponentBase, TreeType} from '../base'
import {removeSubtrees, renderChildInternal} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'

export class HostComponent implements ComponentBase {
  type = TreeType.host as const
  element: HTMLElement
  children: Tree2[]

  constructor(
    public tag: keyof HTMLElementTagNameMap,
    public props: Record<string, unknown> | null,
    public parent: ParentTree2,
    childrenSlices: SubSlice[]
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
  children: SubSlice[],
  parent: ParentTree2,
  prevTree: Tree2 | null,
  index: number
): HostComponent {
  if (prevTree === null) {
    return new HostComponent(tag, props, parent, children)
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
    return new HostComponent(tag, props, parent, children)
  }
}

function renderHostChildren(children: SubSlice[], prevChildren: Tree2[], parent: ParentTree2) {
  /*
    Sometimes there is one child that's also an array.
     */
  if (children.length === 1 && Array.isArray(children[0])) {
    children = (children as SubSlice[][])[0]
  }

  const len = children.length
  const newChildren: Tree2[] = Array(len)

  for (let i = 0; i < len; i++) {
    newChildren[i] = renderChildInternal(children[i], prevChildren[i] || null, parent, i)
  }

  return newChildren
}
