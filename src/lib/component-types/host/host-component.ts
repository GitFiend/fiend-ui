import {AnyComponent, ComponentType, ParentComponent, Subtree, Tree} from '../base'
import {removeChildren, Render} from '../../render'
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
    this.subComponents = Render.subtrees(this, children, this.subComponents)

    // const prevChildren = this.subComponents
    // this.subComponents = new Map<string, AnyComponent>()
    //
    // const len = children.length - 1
    //
    // for (let i = len; i >= 0; i--) {
    //   const child = children[i]
    //
    //   if (child !== null) {
    //     this.renderSubtree(child, prevChildren, this.subComponents, i)
    //   }
    // }
    // removeChildren(prevChildren)
  }

  renderSubtree(
    subtree: Tree | string | number,
    prevChildren: Map<string, AnyComponent>,
    newChildren: Map<string, AnyComponent>,
    index: number
  ): AnyComponent {
    return Render.subtree(this, subtree, prevChildren, newChildren, index)

    // if (typeof subtree === 'string') {
    //   const s = renderTextComponent(
    //     subtree,
    //     prevChildren.get(subtree) ?? null,
    //     this,
    //     this.order,
    //     index
    //   )
    //   prevChildren.delete(subtree)
    //   newChildren.set(subtree, s)
    //   return s
    // }
    //
    // if (typeof subtree === 'number') {
    //   const text = subtree.toString()
    //   const s = renderTextComponent(
    //     text,
    //     prevChildren.get(text) ?? null,
    //     this,
    //     this.order,
    //     index
    //   )
    //   prevChildren.delete(text)
    //   newChildren.set(text, s)
    //   return s
    // }
    //
    // const key: string = subtree.props.key ?? index.toString()
    // const s = renderTree(subtree, prevChildren.get(key) ?? null, this, this.order, index)
    // prevChildren.delete(key)
    // newChildren.set(key, s)
    // return s
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
    // this.element.remove()
    this.parent.removeChild(this.order)

    // TODO: Do we even need this? Only for componentWillUnmount?
    removeChildren(this.subComponents)
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

      // parent.insertChild(prevTree.element, prevTree.order)
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
