import {
  AnyComponent,
  ComponentBase,
  ComponentType,
  equalProps,
  ParentComponent,
  Subtree,
  Tree,
} from './base'
import {removeChildren, renderSubtrees} from '../render'
import {time, timeEnd} from '../util/measure'

export interface Rec {
  [prop: string]: unknown
}

export type StandardProps = {children?: Subtree[]; key?: string}

export type PropsWithChildren<T> = T & StandardProps

// P = {} to simply prop type definitions.
export class Component<P = {}> implements ComponentBase {
  _type = ComponentType.custom as const
  element: Element
  subComponents: {[key: string]: AnyComponent} = {}
  props: PropsWithChildren<P>
  order: string

  constructor(props: P, public parent: ParentComponent, private index: number) {
    this.order = this.parent.order + index
    this.props = props
    this.element = parent.element
  }

  render(): Subtree {
    return null
  }

  update = () => {
    if (__DEV__) {
      time(this.constructor.name)
    }
    const res = this.render()

    this.subComponents = renderSubtrees([res], this.subComponents, this)
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
    // this.subComponents.forEach(s => s.remove())
    removeChildren(this.subComponents)

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
  parent: ParentComponent,
  prevTree: AnyComponent | null,
  index: number
) {
  if (prevTree === null) {
    return makeCustomComponent(cons, props, parent, index)
  }

  if (prevTree._type === ComponentType.custom && prevTree instanceof cons) {
    prevTree.updateWithNewProps(props)

    return prevTree
  }

  prevTree.remove()
  // removeSubComponents(parent, index)

  return makeCustomComponent(cons, props, parent, index)
}

function makeCustomComponent<P extends StandardProps>(
  cons: typeof Component,
  props: P,
  parent: ParentComponent,
  index: number
) {
  const component = new cons<P>(props, parent, index)
  component.mount()

  return component
}
