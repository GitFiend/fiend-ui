import type {CustomElement, FiendNode, StandardProps} from '../util/element'
import {ElementType} from '../util/element'
import {
  AnyComponent,
  ComponentBase,
  ComponentType,
  ParentComponent,
} from './base-component'
import {Render} from '../render'
import {time, timeEnd} from '../util/measure'
import {Order} from '../util/order'
import {HostComponent} from './host/host-component'
import {RootComponent} from './root-component'

export interface Rec {
  [prop: string]: unknown
}

export type PropsWithChildren<T> = T & StandardProps

// P = {} to simply prop type definitions.
export abstract class PureComponent<P = {}> implements ComponentBase {
  _type = ComponentType.custom as const
  props: PropsWithChildren<P>
  order: string
  key: string

  subComponents = new Map<string, AnyComponent>()

  constructor(
    props: P,
    public parentHost: HostComponent | RootComponent,
    directParent: ParentComponent,
    public index: number
  ) {
    this.props = props
    this.order = Order.key(directParent.order, index)
    this.key = this.props.key ?? this.order
  }

  abstract render(): FiendNode | FiendNode[]

  update = () => {
    if (__DEV__) {
      time(this.constructor.name)
    }
    const res = this.render()

    this.subComponents = Render.subtrees(
      this.parentHost,
      this,
      Array.isArray(res) ? res : [res],
      this.subComponents
    )

    if (__DEV__) {
      timeEnd(this.constructor.name)
    }
  }

  updateWithNewProps(props: PropsWithChildren<P>): void {
    if (!equalProps(this.props, props)) {
      this.props = props
      this.update()
    }
    this.componentDidUpdate()
  }

  componentDidMount(): void {}

  componentDidUpdate(): void {}

  componentWillUnmount(): void {}

  forceUpdate = this.update

  mount() {
    this.update()
    this.componentDidMount()
  }

  remove(): void {
    this.componentWillUnmount()

    for (const [, c] of this.subComponents) c.remove()
    this.subComponents.clear()
  }

  static $<T extends PureComponent>(
    this: new (...args: never[]) => T,
    props: T['props']
  ): CustomElement {
    return {
      _type: this as any,
      elementType: ElementType.custom,
      props,
    }
  }
}

export function renderCustom<P extends StandardProps>(
  element: CustomElement,
  prevTree: AnyComponent | null,
  parentHost: HostComponent | RootComponent,
  directParent: ParentComponent,
  index: number
) {
  const {_type, props} = element

  if (prevTree === null) {
    return makeCustomComponent(_type, props, parentHost, directParent, index)
  }

  if (prevTree._type === ComponentType.custom && prevTree instanceof _type) {
    prevTree.index = index
    prevTree.order = Order.key(directParent.order, index)
    prevTree.updateWithNewProps(props)

    return prevTree
  }

  prevTree.remove()

  return makeCustomComponent(_type, props, parentHost, directParent, index)
}

export type CustomComponent<P extends StandardProps> = new <P>(
  props: P,
  parentHost: HostComponent | RootComponent,
  directParent: ParentComponent,
  index: number
) => PureComponent

function makeCustomComponent<P extends StandardProps>(
  cons: CustomComponent<P>,
  props: P,
  parentHost: HostComponent | RootComponent,
  directParent: ParentComponent,
  index: number
) {
  const component = new cons<P>(props, parentHost, directParent, index)
  component.mount()

  return component
}

export function equalProps(a: Rec, b: Rec): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) return false

  // We should only need to loop over aKeys since the length must be the same.
  for (const key of aKeys) if (a[key] !== b[key]) return false

  return true
}
