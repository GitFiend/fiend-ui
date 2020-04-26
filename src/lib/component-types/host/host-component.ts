import {ParentTree2, Z, ComponentBase, ZType, SubTree} from '../base'
import {removeSubtrees, renderChildInternal} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'

export class HostComponent implements ComponentBase {
  type = ZType.host as const
  element: HTMLElement
  children: Z[]

  constructor(
    public tag: keyof HTMLElementTagNameMap,
    public props: Record<string, unknown> | null,
    public parent: ParentTree2,
    childrenSlices: SubTree[]
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
  children: SubTree[],
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

function renderHostChildren(children: SubTree[], prevChildren: Z[], parent: ParentTree2) {
  // /*
  //   Sometimes there is one child that's also an array.
  //    */
  // if (children.length === 1 && Array.isArray(children[0])) {
  //   children = (children as SubTree[][])[0]
  // }

  // const len = children.length
  const newChildren: Z[] = []

  // for (let i = 0; i < len; i++) {
  //   const child = children[i]
  //
  //   if (Array.isArray(child)) {
  //   }
  //   newChildren[i] = renderChildInternal(children[i], prevChildren[i] || null, parent, i)
  // }

  let i = 0
  for (const c of children) {
    if (Array.isArray(c)) {
      for (const c_ of c) {
        newChildren.push(renderChildInternal(c_, prevChildren[i] || null, parent, i))
        i++
      }
    } else {
      newChildren.push(renderChildInternal(c, prevChildren[i] || null, parent, i))
      i++
    }
  }

  return newChildren
}
