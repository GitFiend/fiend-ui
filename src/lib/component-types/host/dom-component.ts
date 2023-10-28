import {
  AnyComponent,
  ComponentType,
  ElementComponent,
  ParentComponent,
} from '../base-component'
import {Render} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {ElementNameMap} from './dom-component-types'
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

export class DomComponent<P extends StandardProps = {}> {
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
    public domParent: DomComponent | RootComponent,
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

    domParent.insertChild(this)
  }

  renderSubtrees(children: FiendNode[]) {
    this.subComponents = Render.subComponents(this, this, children, this.subComponents)
  }

  // What if our sub component has lots of elements to insert?
  insertChild(child: DomComponent | TextComponent) {
    Order.insert(this, child)
  }

  moveChild(child: DomComponent | TextComponent) {
    Order.move(this, child)
  }

  removeChild(child: DomComponent | TextComponent): void {
    Order.remove(this, child)
  }

  remove(): void {
    this.domParent.removeChild(this)

    if (this.subComponents.size > 0) {
      // This is required so that observer components don't keep updating.
      for (const c of this.subComponents.values()) c.remove()
      this.subComponents.clear()
    }

    if (this.inserted.length > 0) this.inserted = []
  }
}

// TODO: prevTree.children? parent.children? Seems there might be a bug here.
export function renderDom(
  tree: HostElement | SvgElement,
  prev: AnyComponent | null,
  domParent: RootComponent | DomComponent,
  directParent: ParentComponent,
  index: number,
): DomComponent {
  const {_type, namespace, props} = tree

  if (prev === null) {
    return new DomComponent(_type, namespace, props, domParent, directParent, index)
  }

  if (prev._type === ComponentType.host && prev.tag === _type) {
    const prevOrder = prev.order
    const newOrder = Order.key(directParent.order, index)

    if (prevOrder !== newOrder) {
      prev.index = index
      prev.order = newOrder

      domParent.moveChild(prev)
    }

    updateAttributes(prev.element, namespace, props, prev.props)
    prev.props = props
    prev.renderSubtrees(props.children ?? [])

    return prev
  } else {
    // Type has changed. Remove it.
    prev.remove()

    return new DomComponent(_type, namespace, props, domParent, directParent, index)
  }
}
