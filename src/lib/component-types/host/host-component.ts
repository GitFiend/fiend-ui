import {AnyComponent, ComponentType, ParentComponent, Subtree} from '../base'
import {Render} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {StandardProps} from '../component'
import {ElementNameMap} from './host-component-types'
import {InsertedOrder, Order} from '../../util/order'

export class HostComponent<P extends StandardProps = {}> implements ParentComponent {
  _type = ComponentType.host as const
  element: ElementNameMap[this['tag']]
  order: string
  key: string

  subComponents = new Map<string, AnyComponent>()
  inserted: InsertedOrder[] = []

  constructor(
    public tag: keyof ElementNameMap,
    public props: P,
    public parent: ParentComponent,
    parentOrder: string,
    public index: number
  ) {
    this.order = Order.key(parentOrder, index)
    this.key = this.props.key ?? this.order

    this.element = document.createElement(tag) as ElementNameMap[this['tag']]
    setAttributesFromProps(this.element, props)

    this.renderSubtrees(props.children ?? [])

    parent.insertChild(this.element, this.order)
  }

  renderSubtrees(children: Subtree[]) {
    this.subComponents = Render.subtrees(this, this.order, children, this.subComponents)
  }

  // What if our sub component has lots of elements to insert?
  insertChild(element: Element | Text, order: string) {
    Order.insert(this.element, this.inserted, element, order)
  }

  moveChild(element: Element | Text, prevOrder: string, newOrder: string) {
    Order.move(this.inserted, this.element, element, prevOrder, newOrder)
  }

  removeChild(order: string): void {
    Order.remove(order, this.inserted)
  }

  remove(): void {
    this.parent.removeChild(this.order)

    // TODO: Do we even need this? Only for componentWillUnmount?
    for (const [, c] of this.subComponents) c.remove()
    this.subComponents.clear()
  }
}

// TODO: prevTree.children? parent.children? Seems there might be a bug here.
export function renderHost<P extends StandardProps = {}>(
  tag: keyof ElementNameMap,
  props: P,
  prevTree: AnyComponent | null,
  parent: ParentComponent,
  parentOrder: string,
  index: number
): HostComponent {
  if (prevTree === null) {
    return new HostComponent(tag, props, parent, parentOrder, index)
  }

  if (prevTree._type === ComponentType.host && prevTree.tag === tag) {
    if (prevTree.index !== index) {
      const prevOrder = prevTree.order
      prevTree.index = index
      prevTree.order = Order.key(parentOrder, index)

      parent.moveChild(prevTree.element, prevOrder, prevTree.order)
    }

    updateAttributes(prevTree.element, props, prevTree.props)
    prevTree.props = props
    prevTree.renderSubtrees(props.children ?? [])

    return prevTree
  } else {
    // Type has changed. Remove it.
    prevTree.remove()

    return new HostComponent(tag, props, parent, parentOrder, index)
  }
}
