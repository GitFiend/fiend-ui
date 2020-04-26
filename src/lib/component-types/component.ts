import {ComponentBase, equalProps, ParentTree2, SubTree, Tree, Z, ZType} from './base'
import {removeSubtrees, renderInternal} from '../render'

export interface Rec {
  [prop: string]: unknown
}

export class Component<P extends {} = {}> implements ComponentBase {
  type = ZType.custom as const
  element: HTMLElement
  subtree: Z | null = null

  constructor(public props: P, public parent: ParentTree2, public children: SubTree[]) {
    this.element = parent.element
  }

  render(): Tree | null {
    return null
  }

  update() {
    const res = this.render()

    if (res !== null) this.subtree = renderInternal(this.parent, res, this.subtree, 0)
  }

  updateWithNewProps(props: P): void {
    if (!equalProps(this.props, props)) {
      this.props = props
      this.update()
    }
  }

  componentDidMount(): void {
    //
  }

  mount() {
    this.update()
    this.componentDidMount()
  }

  remove(): void {
    this.subtree?.remove()
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
  parent: ParentTree2,
  children: SubTree[]
) {
  const component = new cons<P>(props || ({} as P), parent, children)
  component.mount()

  return component
}

export function renderCustom<P extends Rec>(
  cons: typeof Component,
  props: P | null,
  children: SubTree[],
  parent: ParentTree2,
  prevTree: Z | null,
  index: number
) {
  if (prevTree === null) {
    return makeCustomComponent(cons, props, parent, children)
  }

  if (prevTree.type === ZType.custom && prevTree instanceof cons) {
    prevTree.updateWithNewProps(props || {})

    return prevTree
  }

  removeSubtrees(parent, index)

  return makeCustomComponent(cons, props, parent, children)
}
