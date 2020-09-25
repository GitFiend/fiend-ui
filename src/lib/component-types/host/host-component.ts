import {AnyComponent, ComponentBase, ComponentType, ParentComponent} from '../base'
import {removeChildren, renderSubtrees} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {StandardProps} from '../component'
import {ElementNameMap} from '../../host-component-types'

export class HostComponent<P extends StandardProps = {}> implements ParentComponent {
  _type = ComponentType.host as const
  element: ElementNameMap[this['tag']]
  subComponents: {[key: string]: AnyComponent} = {}
  order: string

  constructor(
    public tag: keyof ElementNameMap,
    public props: P,
    public parent: ParentComponent,
    index: number
  ) {
    this.order = this.parent.order + index

    // TODO: Could improve types.
    this.element = document.createElement(tag) as any

    setAttributesFromProps(this.element, props)

    parent.element.appendChild(this.element)

    this.subComponents = renderSubtrees(props.children ?? [], {}, this)
  }

  remove(): void {
    this.element.remove()

    removeChildren(this.subComponents)
    // for (const c of this.subComponents) c.remove()
  }
}

// TODO: prevTree.children? parent.children? Seems there might be a bug here.
export function renderHost<P extends StandardProps = {}>(
  tag: keyof ElementNameMap,
  props: P,
  parent: ParentComponent,
  prevTree: AnyComponent | null,
  index: number
): HostComponent {
  if (prevTree === null) {
    return new HostComponent(tag, props, parent, index)
  }

  if (prevTree._type === ComponentType.host && prevTree.tag === tag) {
    updateAttributes(prevTree.element, props, prevTree.props)

    prevTree.props = props
    prevTree.subComponents = renderSubtrees(
      props.children ?? [],
      prevTree.subComponents,
      prevTree
    )

    return prevTree
  } else {
    // Type has changed. Remove it.
    prevTree.remove()
    // removeSubComponents(parent, index)
    return new HostComponent(tag, props, parent, index)
  }
}
