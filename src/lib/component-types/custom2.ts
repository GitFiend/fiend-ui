import {equalProps, ParentTree2, Subtree, Tree2, TreeBase, TreeSlice2, TreeType} from './base'
import {removeSubtrees, renderInternal2} from '../render2'

export interface Rec {
  [prop: string]: unknown
}

export class Custom2<P extends {} = {}, E = {}> implements TreeBase {
  type = TreeType.custom as const
  element: HTMLElement
  subtree: Tree2 | null = null

  constructor(public props: P, public parent: ParentTree2, public children: Subtree[]) {
    this.element = parent.element

    console.log({props})
  }

  render(): TreeSlice2 | null {
    return null
  }

  remove(): void {
    this.subtree?.remove()
  }

  update() {
    const res = this.render()

    if (res !== null) this.subtree = renderInternal2(this.parent, res, this.subtree, 0)
  }

  updateWithNewProps(props: P) {
    if (!equalProps(this.props, props)) {
      //
      this.props = props
      this.update()
    }
  }

  /*
  TODO: Think about how to batch actions

  Could we complain if a force update happened without an action?
   */
  action(callback: () => void): void {
    callback()
    this.update()
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
  component.update()
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
