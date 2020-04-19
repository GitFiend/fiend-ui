import {ParentTree2, Tree2, TreeBase, TreeSlice2, TreeType} from './base'
import {renderChildren, renderInternal2} from '../render2'

export class Custom2<P = {}, E = {}> implements TreeBase {
  type = TreeType.custom as const
  element: HTMLElement
  // children: Tree2[]

  subtree: Tree2 | null = null

  constructor(
    public props: P,
    public parent: ParentTree2,
    childrenSlices: (TreeSlice2 | string | number)[]
  ) {
    this.element = parent.element
    // this.children = createChildren(childrenSlices, this)
    const res = this.render()

    if (res !== null) this.subtree = renderInternal2(parent, res, null, 0)
  }

  render(): TreeSlice2 | null {
    return null
  }

  remove(): void {
    // this.element.remove()
    // for (const c of this.children) c.remove()
  }

  forceUpdate() {}

  // Required by JSX.ElementClass for now. Can we override this type?
  context: any
  refs: any
  state: any
  setState: any
}
