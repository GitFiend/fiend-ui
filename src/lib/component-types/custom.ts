import {renderInternal} from '../render'
import {ParentTree, Tree, TreeBase, TreeType} from './base'

export enum CustomComponentType {
  standard,
  mobx,
  pure,
}

export class ZComponent<P> implements TreeBase {
  type = TreeType.custom as const
  customType: CustomComponentType = CustomComponentType.standard

  target: HTMLElement | null = null
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
    if (this.target !== null && this.parent !== null) {
      // console.log('forceUpdate')
      const {curr, prev} = this.renderTree()

      renderInternal(this.parent, curr, prev, this.target, 0)
    }
  }

  remove(): void {
    this.element?.remove()
  }

  // Required by JSX.ElementClass for now. Can we override this type?
  context: any
  refs = {}
  state = {}

  setState(state: unknown, callback?: () => void): void {}
}

export function applyCustomChanges(
  parent: ParentTree,
  tree: ZComponent<unknown>,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
) {
  return null
}
