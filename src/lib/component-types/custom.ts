import {removeFollowingElements, renderInternal} from '../render'
import {checkPrevTree, ParentTree, Tree, TreeBase, TreeType} from './base'
import {OComponent} from './observer'

export enum CustomComponentType {
  standard,
  mobx,
  pure,
}

export class Component<P = {}, E = {}> implements TreeBase {
  type = TreeType.custom as const
  customType: CustomComponentType = CustomComponentType.standard

  element: HTMLElement | null = null
  parent: ParentTree | null = null

  prev: ParentTree | null = null
  curr: ParentTree | null = null

  derived: E

  constructor(
    public props: P,
    public children: Tree[] // public key: string
  ) {
    this.derived = this.calcDerived(props)
  }

  render(): ParentTree | null {
    return null
  }

  /*
  TODO: Think about how to batch actions

  Could we complain if a force update happened without an action?
   */
  action(callback: () => void): void {
    // console.log(arguments)
    callback()
    this.forceUpdate()
  }

  calcDerived(props: P): E {
    return {} as E
  }

  renderTree(): {curr: ParentTree | null; prev: ParentTree | null} {
    this.prev = this.curr
    this.curr = this.render()

    return {
      prev: this.prev,
      curr: this.curr,
    }
  }

  forceUpdate(): void {
    if (this.parent !== null && this.parent.element !== null) {
      // TODO: Do we have new props at this point?
      this.derived = this.calcDerived(this.props)
      const {curr, prev} = this.renderTree()

      renderInternal(this.parent, curr, prev, 0)

      if (curr?.element) {
        this.element = curr.element
      }
    }
  }

  remove(): void {
    this.element?.remove()

    for (const c of this.children) c.remove()
  }

  // Required by JSX.ElementClass for now. Can we override this type?
  context: any
  refs: any
  state: any
  setState: any
}

export function applyCustomChanges(
  parent: ParentTree,
  tree: Component<unknown>,
  prevTree: Tree | null,
  index: number
) {
  if (prevTree !== null) {
    // checkPrevTree(prevTree)

    if (prevTree.type === TreeType.custom) {
      // Update it.

      // TODO

      if (prevTree.element) {
        tree.element = prevTree.element
        tree.prev = prevTree.prev
        tree.curr = prevTree.curr
      }

      // if (tree.customType === CustomComponentType.standard) {
      tree.forceUpdate()
      // }
      // TODO: Should we force update here? Seems we are skipping render?
      return null
    } else {
      // The type of prevTree is different. Delete it and following elements
      removeFollowingElements(parent, index)
    }
  }

  if (tree.customType === CustomComponentType.mobx) {
    ;(tree as OComponent<unknown>).setupObserving()
  } else {
    tree.forceUpdate()
  }

  return null
}

function equalProps(
  props: Record<string, unknown> | null,
  prevProps: Record<string, unknown> | null
) {
  // TODO
  return true
}
