import {equalProps, ParentTree2, Subtree, Tree2, TreeBase, TreeSlice2, TreeType} from './base'
import {removeSubtrees, renderInternal2} from '../render2'
import {StoreBase} from './store'

export interface Rec {
  [prop: string]: unknown
}

type Props = {
  store: StoreBase
}

// TODO: Should probably make this abstract?
export class Custom2<P extends {} = {}, E extends {} = {}> implements TreeBase {
  type = TreeType.custom as const
  element: HTMLElement
  subtree: Tree2 | null = null

  derived: E = {} as E

  constructor(public props: P, public parent: ParentTree2, public children: Subtree[]) {
    this.element = parent.element
  }

  render(): TreeSlice2 | null {
    return null
  }

  update() {
    const res = this.render()

    if (res !== null) this.subtree = renderInternal2(this.parent, res, this.subtree, 0)
  }

  calcDerived(props: P): E {
    return {} as E
  }

  updateWithNewProps(props: P) {
    const newDerived = this.calcDerived(props)

    if (!equalProps(this.props, props) || !equalProps(this.derived, newDerived)) {
      this.props = props
      this.derived = newDerived
      this.update()
    }
  }

  updateFromStore() {
    const newDerived = this.calcDerived(this.props)

    if (!equalProps(newDerived, this.derived)) {
      this.derived = newDerived
      this.update()
    }
  }

  componentDidMount(): void {
    //
  }

  /*
  TODO: Think about how to batch actions

  Could we complain if a force update happened without an action?
   */
  action(callback: () => void): void {
    callback()
    this.update()
  }

  mount() {
    if (this.props.hasOwnProperty('store')) {
      ;((this.props as unknown) as Props).store.listeners.set(this, '')
    }
    this.derived = this.calcDerived(this.props)
    this.update()
    this.componentDidMount()
  }

  remove(): void {
    if (this.props.hasOwnProperty('store')) {
      ;((this.props as unknown) as Props).store.listeners.delete(this)
    }
    this.subtree?.remove()
  }

  // Required by JSX
  private context: any
  private refs: any
  private state: any
  private setState: any
  private forceUpdate: any
}

export function makeCustomComponent<P extends Rec>(
  cons: typeof Custom2,
  props: P | null,
  parent: ParentTree2,
  children: Subtree[]
) {
  const component = new cons<P>(props || ({} as P), parent, children)
  component.mount()

  return component
}

export function renderCustom<P extends Rec>(
  cons: typeof Custom2,
  props: P | null,
  children: Subtree[],
  parent: ParentTree2,
  prevTree: Tree2 | null,
  index: number
) {
  if (prevTree === null) {
    return makeCustomComponent(cons, props, parent, children)
  }

  if (prevTree.type === TreeType.custom && prevTree instanceof cons) {
    prevTree.updateWithNewProps(props || {})

    return prevTree
  }

  removeSubtrees(parent, index)

  return makeCustomComponent(cons, props, parent, children)
}
