import {ComponentBase, equalProps, ParentTree, Subtree, Z, ZType} from './base'
import {removeSubtrees, renderSubtree} from '../render'

export interface Rec {
  [prop: string]: unknown
}

export type Props<T> = T & {children?: Subtree}

export class Component<P extends {} = {}> implements ComponentBase {
  type = ZType.custom as const
  element: HTMLElement
  subtree: Z[] = []
  props: Props<P>

  constructor(props: P, public parent: ParentTree, public children: Subtree) {
    this.props = props
    this.props.children = children

    this.element = parent.element
  }

  render(): Subtree | null {
    return null
  }

  update() {
    const res = this.render()

    if (res !== null) this.subtree = renderSubtree(res, this.subtree, this.parent)
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
    this.subtree.forEach((s) => s.remove())
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
  parent: ParentTree,
  children: Subtree
) {
  const component = new cons<P>(props || ({} as P), parent, children)
  component.mount()

  return component
}

export function renderCustom<P extends Rec>(
  cons: typeof Component,
  props: P | null,
  children: Subtree,
  parent: ParentTree,
  prevTree: Z | null,
  index: number
) {
  if (prevTree === null) {
    return makeCustomComponent(cons, props, parent, children)
  }

  if (prevTree.type === ZType.custom && prevTree instanceof cons) {
    prevTree.updateWithNewProps(props || {}, children)

    return prevTree
  }

  removeSubtrees(parent, index)

  return makeCustomComponent(cons, props, parent, children)
}
