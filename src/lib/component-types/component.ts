import {
  ComponentBase,
  equalProps,
  ParentComponent,
  Subtree,
  SubtreeFlat,
  Tree,
  Z,
  ZType,
} from './base'
import {removeSubComponents, renderSubtree} from '../render'
import {time, timeEnd} from '../util/measure'
import {isPropsObject} from '../host-components'
// import {createElement} from '../create-element'

export interface Rec {
  [prop: string]: unknown
}

export type Props<T> = T & {children?: Subtree}

export class Component<P extends {} = {}> implements ComponentBase {
  type = ZType.custom as const
  element: HTMLElement
  subComponents: Z[] = []
  props: Props<P>
  order: string

  constructor(
    props: P,
    public parent: ParentComponent,
    public children: Subtree,
    public index: number
  ) {
    this.order = this.parent.order + index
    this.props = props
    this.props.children = children

    this.element = parent.element
  }

  render(): Subtree | null {
    return null
  }

  update = () => {
    if (__DEV__) {
      time(this.constructor.name)
    }
    const res = this.render()

    this.subComponents = renderSubtree(res, this.subComponents, this)
    if (__DEV__) {
      timeEnd(this.constructor.name)
    }
  }

  updateWithNewProps(props: P, children: Subtree): void {
    const p = props as Props<P>
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

  static _<P extends {} = {}>(...args: [(P | SubtreeFlat)?, ...SubtreeFlat[]]): Tree {
    const [props, ...children] = args

    if (args.length === 0) {
      return {
        type: this,
        props: null,
        children: [],
      }
    } else {
      if (isPropsObject(props)) {
        return {
          type: this,
          props: props as any,
          children,
        }
      } else {
        return {
          type: this,
          props: null,
          children: args as any[],
        }
      }
    }
  }

  // Required by JSX
  context: any
  refs: any
  state: any
  setState: any
  forceUpdate: any
}

export function makeCustomComponent<P extends Rec>(
  cons: typeof Component,
  props: P | null,
  parent: ParentComponent,
  children: Subtree,
  index: number
) {
  const component = new cons<P>(props ?? ({} as P), parent, children, index)
  component.mount()

  return component
}

export function renderCustom<P extends Rec>(
  cons: typeof Component,
  props: P | null,
  children: Subtree,
  parent: ParentComponent,
  prevTree: Z | null,
  index: number
) {
  if (prevTree === null) {
    return makeCustomComponent(cons, props, parent, children, index)
  }

  if (prevTree.type === ZType.custom && prevTree instanceof cons) {
    prevTree.updateWithNewProps(props ?? {}, children)

    return prevTree
  }

  removeSubComponents(parent, index)

  return makeCustomComponent(cons, props, parent, children, index)
}
