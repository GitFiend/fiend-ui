import {ParentTree2, Tree2, TreeBase, TreeSlice2, TreeType} from './base'
import {setAttributesFromProps} from './host'
import {renderChildren} from '../render2'

export class Host2 implements TreeBase {
  type = TreeType.host as const
  element: HTMLElement
  children: Tree2[]

  constructor(
    public tag: keyof HTMLElementTagNameMap,
    public props: Record<string, unknown> | null,
    public parent: ParentTree2,
    childrenSlices: (TreeSlice2 | string | number)[]
  ) {
    this.element = document.createElement(tag)

    if (props !== null) setAttributesFromProps(this.element, props)

    parent.element.appendChild(this.element)

    this.children = renderChildren(childrenSlices, this)
  }

  remove(): void {
    this.element.remove()

    for (const c of this.children) c.remove()
  }

  update() {
    // TODO
  }
}
