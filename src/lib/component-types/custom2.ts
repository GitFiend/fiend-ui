import {ParentTree2, Tree2, TreeBase, TreeSlice2, TreeType} from './base'
import {createChildren} from './host2'

export class Custom2 implements TreeBase {
  type = TreeType.custom as const
  element: HTMLElement | null = null

  prev: ParentTree2 | null = null
  curr: ParentTree2 | null = null

  children: Tree2[]

  constructor(public props: Record<string, unknown> | null, public parent: ParentTree2, childrenSlices: (TreeSlice2 | string | number)[]) {

    this.children = createChildren(childrenSlices, this)
  }

  render(): ParentTree2 | null {
    return null
  }

  remove(): void {
    this.element?.remove()

    for (const c of this.children) c.remove()
  }
}
