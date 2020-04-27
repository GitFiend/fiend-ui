import {ParentTree2, Z, ComponentBase, ZType, SubTree} from '../base'
import {removeSubtrees, renderSubTree} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'

export class HostComponent implements ComponentBase {
  type = ZType.host as const
  element: HTMLElement
  children: Z[]

  constructor(
    public tag: keyof HTMLElementTagNameMap,
    public props: Record<string, unknown> | null,
    public parent: ParentTree2,
    childrenSlices: SubTree
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
  children: SubTree,
  parent: ParentTree2,
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
    prevTree.children = renderHostChildren(children, prevTree.children, parent)

    return prevTree
  } else {
    removeSubtrees(parent, index)
    return new HostComponent(tag, props, parent, children)
  }
}

function renderHostChildren(children: SubTree, prevChildren: Z[], parent: ParentTree2) {
  if (!Array.isArray(children)) {
    return [renderSubTree(children, prevChildren[0] || null, parent, 0)]
  }

  const newChildren: Z[] = []

  let i = 0
  for (const c of children) {
    if (Array.isArray(c)) {
      for (const c_ of c) {
        newChildren.push(renderSubTree(c_, prevChildren[i] || null, parent, i))
        i++
      }
    } else {
      newChildren.push(renderSubTree(c, prevChildren[i] || null, parent, i))
      i++
    }
  }

  return newChildren
}
