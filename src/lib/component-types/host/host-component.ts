import {
  AnyComponent,
  ComponentType,
  ElementComponent,
  ParentComponent,
} from '../base-component'
import {Render} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {ElementNameMap} from './host-component-types'
import {Order} from '../../util/order'
import {TextComponent} from '../text-component'
import {RootComponent} from '../root-component'
import {FiendNode} from '../../..'
import {
  ElementNamespace,
  HostElement,
  StandardProps,
  SvgElement,
} from '../../util/element'

export class HostComponent<P extends StandardProps = {}> {
  _type = ComponentType.host as const
  element: ElementNameMap[this['tag']]
  order: string
  key: string

  subComponents = new Map<string, AnyComponent>()
  inserted: ElementComponent[] = []

  // key is an element, value is the previous element
  siblings = new WeakMap<Element | Text, Element | Text | null>()

  constructor(
    public tag: keyof ElementNameMap,
    public namespace: ElementNamespace,
    public props: P,
    public parentHost: HostComponent | RootComponent,
    directParent: ParentComponent,
    public index: number,
  ) {
    this.order = Order.key(directParent.order, index)
    this.key = this.props.key ?? directParent.key + index

    if (namespace === ElementNamespace.svg) {
      this.element = document.createElementNS(
        'http://www.w3.org/2000/svg',
        tag,
      ) as ElementNameMap[this['tag']]
    } else {
      this.element = document.createElement(tag) as ElementNameMap[this['tag']]
    }

    setAttributesFromProps(this.element, namespace, props)

    this.renderSubtrees(props.children ?? [])

    parentHost.insertChild(this)
  }

  renderSubtrees(children: FiendNode[]) {
    this.subComponents = Render.subtrees(this, this, children, this.subComponents)
  }

  // What if our sub component has lots of elements to insert?
  insertChild(child: HostComponent | TextComponent) {
    Order.insert(this, child)
  }

  moveChild(child: HostComponent | TextComponent) {
    Order.move(this, child)
  }

  removeChild(child: HostComponent | TextComponent): void {
    Order.remove(this, child)
  }

  remove(): void {
    this.parentHost.removeChild(this)

    if (this.subComponents.size > 0) {
      // This is required so that observer components don't keep updating.
      for (const c of this.subComponents.values()) c.remove()
      this.subComponents.clear()
    }

    if (this.inserted.length > 0) this.inserted = []
  }
}

// TODO: prevTree.children? parent.children? Seems there might be a bug here.
export function renderHost(
  tree: HostElement | SvgElement,
  prevTree: AnyComponent | null,
  parentHost: RootComponent | HostComponent,
  directParent: ParentComponent,
  index: number,
): HostComponent {
  const {_type, namespace, props} = tree

  if (prevTree === null) {
    return new HostComponent(_type, namespace, props, parentHost, directParent, index)
  }

  if (prevTree._type === ComponentType.host && prevTree.tag === _type) {
    const newOrder = Order.key(directParent.order, index)
    const prevOrder = prevTree.order

    if (prevOrder !== newOrder) {
      prevTree.index = index
      prevTree.order = newOrder

      parentHost.moveChild(prevTree)
    }

    updateAttributes(prevTree.element, namespace, props, prevTree.props)
    prevTree.props = props
    prevTree.renderSubtrees(props.children ?? [])

    return prevTree
  } else {
    // Type has changed. Remove it.
    prevTree.remove()

    return new HostComponent(_type, namespace, props, parentHost, directParent, index)
  }
}
