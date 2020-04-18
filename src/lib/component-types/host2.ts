import {ParentTree2, Tree2, TreeBase, TreeSlice2, TreeType} from './base'
import {setAttributesFromProps} from './host'
import {Text2} from './text2'

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

    this.children = createChildren(childrenSlices, this)
    // this.children = new Array(childrenSlices.length)
    //
    // for (let i = 0; i < childrenSlices.length; i++) {
    //   const c = childrenSlices[i]
    //
    //   if (typeof c === 'string') {
    //     this.children[i] = new Text2(c, this)
    //   } else if (typeof c === 'number') {
    //     this.children[i] = new Text2(c.toString(), this)
    //   } else {
    //     const [tag, props, ...children] = c
    //     this.children[i] = new Host2(tag, props, this, children)
    //   }
    // }
  }

  remove(): void {
    this.element.remove()

    for (const c of this.children) c.remove()
  }

  update() {
    // TODO
  }
}

export function createChildren(childrenSlices: (TreeSlice2 | string | number)[], parent: ParentTree2): Tree2[] {
  const childrenTrees: Tree2[] = new Array(childrenSlices.length)

  for (let i = 0; i < childrenSlices.length; i++) {
    const c = childrenSlices[i]

    if (typeof c === 'string') {
      childrenTrees[i] = new Text2(c, parent)
    } else if (typeof c === 'number') {
      childrenTrees[i] = new Text2(c.toString(), parent)
    } else {
      const [tag, props, ...children] = c
      childrenTrees[i] = new Host2(tag, props, parent, children)
    }
  }

  return childrenTrees
}