import {AnyComponent, ComponentType, ParentComponent} from '../base'
import {removeChildren, renderSubtrees} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {StandardProps} from '../component'
import {ElementNameMap} from '../../host-component-types'

// TODO: Untested performance optimisation.
const emptyMap = new Map<string, AnyComponent>()

export class HostComponent<P extends StandardProps = {}> implements ParentComponent {
  _type = ComponentType.host as const
  containerElement: ElementNameMap[this['tag']]
  lastInserted = null
  subComponents = new Map<string, AnyComponent>()
  order: string
  key: string

  constructor(
    public tag: keyof ElementNameMap,
    public props: P,
    public parent: ParentComponent,
    public index: number
  ) {
    this.order = this.parent.order + index
    this.key = this.props.key ?? this.order

    this.containerElement = document.createElement(tag) as ElementNameMap[this['tag']]

    setAttributesFromProps(this.containerElement, props)

    // parent.element.insertAdjacentElement()

    // parent.element.appendChild(this.element)
    // const siblingEl = sibling?.firstElement ?? null

    // if (siblingEl === null) {
    //   parent.containerElement.appendChild(this.containerElement)
    // } else {
    parent.containerElement.insertBefore(this.containerElement, parent.lastInserted)
    parent.lastInserted = this.containerElement
    // }

    this.subComponents = renderSubtrees(props.children ?? [], emptyMap, this)
  }

  remove(): void {
    this.containerElement.remove()

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
    if (index !== prevTree.index) {
      // const siblingEl = sibling?.firstElement ?? null
      parent.containerElement.insertBefore(prevTree.containerElement, parent.lastInserted)
      parent.lastInserted = prevTree.containerElement

      // if (sibling === null) {
      //   parent.containerElement.appendChild(prevTree.containerElement)
      // } else {
      //   parent.containerElement.insertBefore(
      //     prevTree.containerElement,
      //     sibling.containerElement
      //   )
      // }
      prevTree.index = index
      // console.log(index, prevTree.index)
    }
    updateAttributes(prevTree.containerElement, props, prevTree.props)

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
