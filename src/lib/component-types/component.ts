import {
  AnyComponent,
  ComponentBase,
  ComponentType,
  ParentComponent,
  Subtree,
  Tree,
} from './base'
import {Render} from '../render'
import {time, timeEnd} from '../util/measure'
import {Order} from '../util/order'

export interface Rec {
  [prop: string]: unknown
}

export type StandardProps = {children?: Subtree[]; key?: string}

export type PropsWithChildren<T> = T & StandardProps

// P = {} to simply prop type definitions.
export abstract class Component<P = {}> implements ComponentBase {
  _type = ComponentType.custom as const
  props: PropsWithChildren<P>
  order: string
  key: string

  subComponents = new Map<string, AnyComponent>()

  constructor(
    props: P,
    public parent: ParentComponent,
    parentOrder: string,
    public index: number
  ) {
    this.props = props
    this.order = Order.key(parentOrder, index)
    this.key = this.props.key ?? this.order
  }

  abstract render(): Subtree | Subtree[]

  update = () => {
    if (__DEV__) {
      time(this.constructor.name)
    }
    const res = this.render()

    this.subComponents = Render.subtrees(
      this.parent,
      this.order,
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
  }

  componentDidMount(): void {}

  componentWillUnmount(): void {}

  mount() {
    this.update()
    this.componentDidMount()
  }

  remove(): void {
    this.componentWillUnmount()

    for (const [, c] of this.subComponents) c.remove()
    this.subComponents.clear()
  }

  static $<T extends Component>(
    this: new (...args: never[]) => T,
    props: T['props']
  ): Tree {
    return {
      _type: this as any,
      props,
    }
  }
}

export function renderCustom<P extends StandardProps>(
  cons: CustomComponent<P>,
  props: P,
  prevTree: AnyComponent | null,
  parent: ParentComponent,
  parentOrder: string,
  index: number
) {
  if (prevTree === null) {
    return makeCustomComponent(cons, props, parent, parentOrder, index)
  }

  if (prevTree._type === ComponentType.custom && prevTree instanceof cons) {
    prevTree.index = index
    prevTree.order = Order.key(parentOrder, index)
    prevTree.updateWithNewProps(props)

    return prevTree
  }

  prevTree.remove()

  return makeCustomComponent(cons, props, parent, parentOrder, index)
}

export type CustomComponent<P extends StandardProps> = new <P>(
  props: P,
  parent: ParentComponent,
  parentOrder: string,
  index: number
) => Component

function makeCustomComponent<P extends StandardProps>(
  cons: CustomComponent<P>,
  props: P,
  parent: ParentComponent,
  parentOrder: string,
  index: number
) {
  const component = new cons<P>(props, parent, parentOrder, index)
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
