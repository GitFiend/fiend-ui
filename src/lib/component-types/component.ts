import {AnyComponent, ComponentType, ParentComponent, Subtree, Tree} from './base'
import {renderSubtree2} from '../render'
import {time, timeEnd} from '../util/measure'

export interface Rec {
  [prop: string]: unknown
}

export type StandardProps = {children?: Subtree[]; key?: string}

export type PropsWithChildren<T> = T & StandardProps

// P = {} to simply prop type definitions.
export class Component<P = {}> implements ParentComponent {
  _type = ComponentType.custom as const
  subComponent: AnyComponent | null = null
  props: PropsWithChildren<P>
  order: string
  key: string

  constructor(props: P, parentOrder: string, public index: number) {
    this.props = props
    this.order = parentOrder + index
    this.key = this.props.key ?? this.order
  }

  render(): Subtree {
    return null
  }

  update = () => {
    if (__DEV__) {
      time(this.constructor.name)
    }
    const res = this.render()

    if (res !== null) {
      this.subComponent = renderSubtree2(res, this.subComponent, this.order, 0)
    } else {
      this.subComponent?.remove()
      this.subComponent = null
    }

    if (__DEV__) {
      timeEnd(this.constructor.name)
    }
  }

  get elements(): (Element | Text)[] {
    if (this.subComponent === null) return []

    switch (this.subComponent._type) {
      case ComponentType.host:
      case ComponentType.text:
        return [this.subComponent.element]
      case ComponentType.custom:
        return this.subComponent.elements
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
    this.subComponent?.remove()
    this.subComponent = null
    this.componentWillUnmount()
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
  cons: typeof Component,
  props: P,
  prevTree: AnyComponent | null,
  parentOrder: string,
  index: number
) {
  if (prevTree === null) {
    return makeCustomComponent(cons, props, parentOrder, index)
  }

  if (prevTree._type === ComponentType.custom && prevTree instanceof cons) {
    prevTree.updateWithNewProps(props)

    return prevTree
  }

  prevTree.remove()

  return makeCustomComponent(cons, props, parentOrder, index)
}

function makeCustomComponent<P extends StandardProps>(
  cons: typeof Component,
  props: P,
  parentOrder: string,
  index: number
) {
  const component = new cons<P>(props, parentOrder, index)
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
