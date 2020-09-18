import {ComponentBase, equalProps, ParentComponent, Subtree, Tree, Z, ZType} from './base'
import {removeSubComponents, renderSubtrees} from '../render'
import {time, timeEnd} from '../util/measure'
import {$$, isPropsObject} from '../host-components'

export interface Rec {
  [prop: string]: unknown
}

export type PropsWithChildren<T> = T & {children?: Subtree[]; key?: string}

export class Component<P = {}> implements ComponentBase {
  _type = ZType.custom as const
  element: Element
  subComponents: Z[] = []
  props: PropsWithChildren<P>
  order: string

  constructor(
    props: P,
    public parent: ParentComponent,
    private children: Subtree[],
    private index: number
  ) {
    this.order = this.parent.order + index
    this.props = {...props, children}
    // this.props.children = children

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

  updateWithNewProps(props: P, children: Subtree[]): void {
    const p = props as PropsWithChildren<P>
    p.children = children

    if (!equalProps(this.props, p)) {
      this.props = p
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
    this.subComponents.forEach(s => s.remove())
    this.componentWillUnmount()
  }

  static get n() {
    return $$(this)
  }
}

export function makeCustomComponent<P extends Rec>(
  cons: typeof Component,
  props: P | null,
  parent: ParentComponent,
  children: Subtree[],
  index: number
) {
  const component = new cons<P>(props ?? ({} as P), parent, children, index)
  component.mount()

  return component
}

export function renderCustom<P extends Rec>(
  cons: typeof Component,
  props: P | null,
  children: Subtree[],
  parent: ParentComponent,
  prevTree: Z | null,
  index: number
) {
  if (prevTree === null) {
    return makeCustomComponent(cons, props, parent, children, index)
  }

  if (prevTree._type === ZType.custom && prevTree instanceof cons) {
    prevTree.updateWithNewProps(props ?? {}, children)

    return prevTree
  }

  removeSubComponents(parent, index)

  return makeCustomComponent(cons, props, parent, children, index)
}

export function $<C extends Component>(
  cons: new (...a: any[]) => C,
  ...args: [C['props'], ...Subtree[]] | Subtree[]
): Tree {
  const [props, ...children] = args

  if (args.length === 0) {
    return {
      _type: cons as any,
      props: null,
      children: [],
    }
  } else {
    if (isPropsObject(props)) {
      return {
        _type: cons as any,
        props: props as any,
        children: children as Subtree[],
      }
    } else {
      return {
        _type: cons as any,
        props: null,
        children: args as any[],
      }
    }
  }
}

// export function $$$<C extends Component>(
//   cons: new (...a: any[]) => C
// ): (...args: [C['props'], ...Subtree[]] | Subtree[]) => Tree {
//   return (...args) => $(cons, ...args)
// }

export function makeCustomComponentConstructor<C extends Component>(
  cons: new (...a: any[]) => C
): (...args: [C['props'], ...Subtree[]] | Subtree[]) => Tree {
  return (...args: [C['props'], ...Subtree[]] | Subtree[]): Tree => {
    const [props, ...children] = args

    if (args.length === 0) {
      return {
        _type: cons as any,
        props: null,
        children: [],
      }
    } else {
      if (isPropsObject(props)) {
        return {
          _type: cons as any,
          props: props as any,
          children: children as Subtree[],
        }
      } else {
        return {
          _type: cons as any,
          props: null,
          children: args as any[],
        }
      }
    }
  }
}
