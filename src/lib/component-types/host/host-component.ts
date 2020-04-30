import {ComponentBase, ParentTree, Subtree, Z, ZType} from '../base'
import {removeSubtrees, renderSubtree} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'

export class HostComponent implements ComponentBase {
  type = ZType.host as const
  element: HTMLElement
  children: Z[] = []

  constructor(
    public tag: keyof HTMLElementTagNameMap,
    public props: Record<string, unknown> | null,
    public parent: ParentTree,
    childrenSlices: Subtree
  ) {
    this.element = document.createElement(tag)

    if (props !== null) setAttributesFromProps(this.element, props)

    parent.element.appendChild(this.element)

    this.children = renderSubtree(childrenSlices, [], this)
  }

  remove(): void {
    this.element.remove()

    for (const c of this.children) c.remove()
  }
}

export function renderHost(
  tag: keyof HTMLElementTagNameMap,
  props: Record<string, unknown> | null,
  children: Subtree,
  parent: ParentTree,
  prevTree: Z | null,
  index: number
): HostComponent {
  if (prevTree === null) {
    return new HostComponent(tag, props, parent, children)
  }

  if (prevTree.type === ZType.host && prevTree.tag === tag) {
    if (props !== null) {
      updateAttributes(prevTree.element, props, prevTree.props)
    }

    prevTree.props = props
    removeExtraChildren(children, prevTree)
    prevTree.children = renderSubtree(children, prevTree.children, parent)

    return prevTree
  } else {
    // Type has changed. Remove it.
    removeSubtrees(parent, index)
    return new HostComponent(tag, props, parent, children)
  }
}

function removeExtraChildren(children: Subtree, prevTree: HostComponent) {
  if (children === null) return

  const length = Array.isArray(children) ? children.length : 1

  const prevLength = prevTree.children.length

  if (prevLength > length) removeSubtrees(prevTree, length)
}
