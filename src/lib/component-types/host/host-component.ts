import {ComponentBase, ParentComponent, Subtree, Z, ZType} from '../base'
import {removeSubComponents, renderSubtrees} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {ElementNameMap} from '../../host-components'
import {StandardProps} from '../component'

export class HostComponent<P extends StandardProps = {}> implements ComponentBase {
  _type = ZType.host as const
  element: ElementNameMap[this['tag']]
  subComponents: Z[] = []
  order: string

  constructor(
    public tag: keyof ElementNameMap,
    public props: P,
    public parent: ParentComponent,
    // childrenSlices: Subtree[],
    index: number
  ) {
    this.order = this.parent.order + index

    // TODO: Could improve types.
    this.element = document.createElement(tag) as any

    // if (props !== null)
    setAttributesFromProps(this.element, props)

    parent.element.appendChild(this.element)

    this.subComponents = renderSubtrees(props.children ?? [], [], this)
  }

  remove(): void {
    this.element.remove()

    for (const c of this.subComponents) c.remove()
  }
}

// TODO: prevTree.children? parent.children? Seems there might be a bug here.
export function renderHost<P extends StandardProps = {}>(
  tag: keyof ElementNameMap,
  props: P,
  parent: ParentComponent,
  prevTree: Z | null,
  index: number
): HostComponent {
  if (prevTree === null) {
    return new HostComponent(tag, props, parent, index)
  }

  if (prevTree._type === ZType.host && prevTree.tag === tag) {
    // if (props !== null) {
    updateAttributes(prevTree.element, props, prevTree.props)
    // }

    prevTree.props = props
    prevTree.subComponents = renderSubtrees(
      props.children ?? [],
      prevTree.subComponents,
      prevTree
    )

    return prevTree
  } else {
    // Type has changed. Remove it.
    removeSubComponents(parent, index)
    return new HostComponent(tag, props, parent, index)
  }
}
