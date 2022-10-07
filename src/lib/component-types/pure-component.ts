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
import {RefObject} from '../util/ref'
import {RunStack} from '../observables/run-stack'

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

  _ref: RefObject<this> = {
    current: this,
  }

  constructor(
    props: P,
    public parentHost: HostComponent | RootComponent,
    directParent: ParentComponent,
    public index: number
  ) {
    this.props = props
    this.order = Order.key(directParent.order, index)
    this.key = this.props.key ?? directParent.key + index
  }

  abstract render(): FiendNode | FiendNode[]

  update() {
    if (__DEV__ && this.removed) {
      throw 'Called update after removed!'
    }
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

  // noinspection JSUnusedGlobalSymbols
  updateWithNewProps(props: PropsWithChildren<P>): void {
    if (!equalProps(this.props, props)) {
      this.props = props
      this.update()
      RunStack.componentDidUpdateStack.push(this._ref)
    }
  }

  componentDidMount(): void {}

  componentDidUpdate(): void {}

  componentWillUnmount(): void {}

  forceUpdate = () => {
    // Sometimes we put a forceUpdate inside a setTimeout, we don't want it
    // to run if this element has been removed before it runs.
    if (this.removed) return

    this.update()
  }

  mount() {
    this.update()
    RunStack.componentDidMountStack.push(this._ref)
  }

  removed = false

  remove(): void {
    if (__DEV__ && this.removed) {
      console.error('already removed')
    }
    this.componentWillUnmount()

    for (const c of this.subComponents.values()) c.remove()
    this.subComponents.clear()
    this.removed = true
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
  tree: CustomElement,
  prevTree: AnyComponent | null,
  parentHost: HostComponent | RootComponent,
  directParent: ParentComponent,
  index: number
) {
  const {_type, props} = tree

  if (prevTree === null) {
    return makeCustomComponent(_type, props, parentHost, directParent, index)
  }

  if (prevTree._type === ComponentType.custom && prevTree instanceof _type) {
    const newOrder = Order.key(directParent.order, index)
    const prevOrder = prevTree.order

    if (newOrder !== prevOrder) {
      prevTree.index = index
      prevTree.order = newOrder

      for (const c of prevTree.subComponents.values()) {
        const no = Order.key(prevTree.order, c.index)

        if (c.order !== no) {
          c.order = no

          switch (c._type) {
            case ComponentType.host:
            case ComponentType.text:
              parentHost.moveChild(c)
              break
            case ComponentType.custom:
              c.update()
              break
          }
        }
      }
    }

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
