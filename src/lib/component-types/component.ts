import {ComponentBase, equalProps, ParentComponent, Subtree, Z, ZType} from './base'
import {removeSubComponents, renderSubtree} from '../render'
import {time, timeEnd} from '../util/measure'

export interface Rec {
  [prop: string]: unknown
}

export type Props<T> = T & {children?: Subtree}

export class Component<P extends {} = {}> implements ComponentBase {
  type = ZType.custom as const
  element: HTMLElement
  subComponents: Z[] = []
  props: Props<P>
  location: string

  constructor(
    props: P,
    public parent: ParentComponent,
    public children: Subtree,
    public index: number
  ) {
    this.location = this.parent.location + index
    this.props = props
    this.props.children = children

    this.element = parent.element
  }

  render(): Subtree | null {
    return null
  }

  update() {
    // if (__DEV__) {
    //   time((this as any).constructor.name)
    // }

    // debugger
    const res = this.render()

    if (res !== null) this.subComponents = renderSubtree(res, this.subComponents, this)

    // if (__DEV__) {
    //   timeEnd((this as any).constructor.name)
    // }
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
    this.subComponents.forEach((s) => s.remove())
    this.componentWillUnmount()
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
  const component = new cons<P>(props || ({} as P), parent, children, index)
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
    prevTree.updateWithNewProps(props || {}, children)

    return prevTree
  }

  removeSubComponents(parent, index)

  return makeCustomComponent(cons, props, parent, children, index)
}
