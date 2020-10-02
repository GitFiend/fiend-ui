import {
  AnyComponent,
  ComponentType,
  equalProps,
  ParentComponent,
  Subtree,
  Tree,
} from './base'
import {removeChildren, renderSubtree2, renderSubtrees} from '../render'
import {time, timeEnd} from '../util/measure'

export interface Rec {
  [prop: string]: unknown
}

export type StandardProps = {children?: Subtree[]; key?: string}

export type PropsWithChildren<T> = T & StandardProps

// P = {} to simply prop type definitions.
export class Component<P = {}> implements ParentComponent {
  _type = ComponentType.custom as const
  containerElement: Element | null = null
  // lastInserted: Element | Text | null = null
  // subComponents = new Map<string, AnyComponent>()
  subComponent: AnyComponent | null = null
  props: PropsWithChildren<P>
  order: string
  key: string

  constructor(
    props: P,
    // public parent: ParentComponent,
    public index: number,
    parentOrder: string
  ) {
    this.props = props
    // this.containerElement = parent.containerElement
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

    // this.lastInserted = this.parent.lastInserted

    if (res !== null) {
      this.subComponent = renderSubtree2(res, this.subComponent, this, 0)
    } else {
      this.subComponent?.remove()
    }
    // this.subComponents = renderSubtrees([res], this.subComponents, this)

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
    // removeChildren(this.subComponents)
    this.subComponent?.remove()

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
    // if (index !== prevTree.index) {
    //   //   console.log(index, prevTree.index)
    // }

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
  const component = new cons<P>(props, index, parent.order)
  component.mount()

  return component
}
