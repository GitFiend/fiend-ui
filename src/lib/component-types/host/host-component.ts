import {ComponentBase, ParentComponent, Subtree, Z, ZType} from '../base'
import {removeSubComponents, renderSubtree} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'

export class HostComponent implements ComponentBase {
  type = ZType.host as const
  element: HTMLElement
  children: Z[] = []

  constructor(
    public tag: keyof HTMLElementTagNameMap,
    public props: Record<string, unknown> | null,
    public parent: ParentComponent,
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

// TODO: prevTree.children? parent.children? Seems there might be a bug here.
export function renderHost(
  tag: keyof HTMLElementTagNameMap,
  props: Record<string, unknown> | null,
  children: Subtree,
  parent: ParentComponent,
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
    prevTree.children = renderSubtree(children, prevTree.children, prevTree)

    return prevTree
  } else {
    // Type has changed. Remove it.
    removeSubComponents(parent, index)
    return new HostComponent(tag, props, parent, children)
  }
}
