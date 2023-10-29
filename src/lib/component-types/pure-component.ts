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
import {DomComponent} from './host/dom-component'
import {RootComponent} from './root-component'
import {RefObject} from '../util/ref'
import {RunStack} from '../observables/run-stack'

export interface Rec {
  [prop: string]: unknown
}

export type PropsWithChildren<T> = T & StandardProps

// P = {} to simply prop type definitions.
export abstract class PureComponent<P extends StandardProps & object = {}>
  implements ComponentBase
{
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
    public domParent: DomComponent | RootComponent,
    directParent: ParentComponent,
    // TODO: Is this safe? It doesn't get updated? So could be reassigned accidentally?
    public index: number,
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

    this.subComponents = Render.subComponents(
      this.domParent,
      this,
      Array.isArray(res) ? res : [res],
      this.subComponents,
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

    // Doesn't componentDidUpdate get called after update?
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
    props: T['props'],
  ): CustomElement {
    return {
      _type: this as any,
      elementType: ElementType.custom,
      props,
    }
  }
}

export function renderCustom(
  tree: CustomElement,
  prev: AnyComponent | null,
  domParent: DomComponent | RootComponent,
  directParent: ParentComponent,
  index: number,
) {
  const {_type, props} = tree

  if (prev === null) {
    return makeCustomComponent(_type, props, domParent, directParent, index)
  }

  if (prev._type === ComponentType.custom && prev instanceof _type) {
    const newOrder = Order.key(directParent.order, index)
    const prevOrder = prev.order

    if (newOrder !== prevOrder) {
      prev.index = index
      prev.order = newOrder

      for (const c of prev.subComponents.values()) {
        const no = Order.key(prev.order, c.index)

        if (c.order !== no) {
          c.order = no

          switch (c._type) {
            case ComponentType.host:
            case ComponentType.text:
              domParent.moveChild(c)
              break
            case ComponentType.custom:
              c.update()
              break
          }
        }
      }
    }

    prev.updateWithNewProps(props)

    return prev
  }

  prev.remove()

  return makeCustomComponent(_type, props, domParent, directParent, index)
}

export type CustomComponent<P extends StandardProps> = new <P>(
  props: P,
  parentHost: DomComponent | RootComponent,
  directParent: ParentComponent,
  index: number,
) => PureComponent

function makeCustomComponent<P extends StandardProps>(
  cons: CustomComponent<P>,
  props: P,
  parentHost: DomComponent | RootComponent,
  directParent: ParentComponent,
  index: number,
) {
  const component = new cons<P>(props, parentHost, directParent, index)
  component.mount()

  return component
}

export function equalProps(a: object, b: object): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) return false

  // We should only need to loop over aKeys since the length must be the same.
  for (const key of aKeys) {
    // @ts-ignore
    if (a[key] !== b[key]) return false
  }

  return true
}
