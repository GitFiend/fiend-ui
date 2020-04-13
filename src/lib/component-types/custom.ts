import {removeFollowingElements2, renderInternal} from '../render'
import {ParentTree, Tree, TreeBase, TreeType} from './base'
import {OComponent} from './observer'

export enum CustomComponentType {
  standard,
  mobx,
  pure,
}

export class ZComponent<P> implements TreeBase {
  type = TreeType.custom as const
  customType: CustomComponentType = CustomComponentType.standard

  element: HTMLElement | null = null
  parent: ParentTree | null = null

  private prev: Tree | null = null
  private curr: Tree | null = null

  constructor(
    public props: P,
    public children: Tree[] // public key: string
  ) {}

  render(): Tree | null {
    return null
  }

  renderTree(): {curr: Tree | null; prev: Tree | null} {
    this.prev = this.curr
    this.curr = this.render()

    return {
      prev: this.prev,
      curr: this.curr,
    }
  }

  forceUpdate(): void {
    if (this.parent !== null && this.parent.element !== null) {
      // console.log('forceUpdate')
      const {curr, prev} = this.renderTree()

      console.log(curr, prev)

      renderInternal(this.parent, curr, prev, 0)
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
  tree: ZComponent<unknown>,
  prevTree: Tree | null,
  index: number
) {
  if (prevTree !== null) {
    if (prevTree.type === TreeType.custom) {
      // Update it.

      // TODO

      if (prevTree.element) {
        tree.element = prevTree.element
      }

      // if (tree.customType === CustomComponentType.standard) {
      tree.forceUpdate()
      // }
      // TODO: Should we force update here? Seems we are skipping render?
      return null
    } else {
      // The type of prevTree is different. Delete it and following elements
      removeFollowingElements2(parent, index)
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
