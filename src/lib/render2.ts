import {ParentTree2, RootNode, Tree2, TreeSlice2} from './component-types/base'
import {Host2} from './component-types/host2'
import {Text2} from './component-types/text2'
import {makeCustomComponent} from './component-types/custom2'

export function render2(slice: TreeSlice2, target: HTMLElement): void {
  const root = new RootNode(target)

  renderInternal2(root, slice, null, 0)
}

export function renderInternal2(
  parent: ParentTree2,
  slice: TreeSlice2,
  prevTree: Tree2 | null,
  index: number
): Tree2 | null {
  let [typeOrConstructor, props, ...children] = slice

  // // TODO: Might cause a bug.
  // if (Array.isArray(children[0])) {
  //   children = children.flat()
  // }

  if (prevTree === null) {
    if (typeof typeOrConstructor === 'string') {
      return new Host2(typeOrConstructor, props, parent, children)
    } else {
      return makeCustomComponent(typeOrConstructor, props, parent, children)
    }
  }
  // Check if it needs to be replaced

  return null
}

export function renderChildren(
  childrenSlices: (TreeSlice2 | string | number)[],
  parent: ParentTree2
): Tree2[] {
  const childrenTrees: Tree2[] = new Array(childrenSlices.length)

  for (let i = 0; i < childrenSlices.length; i++) {
    const c = childrenSlices[i]

    if (typeof c === 'string') {
      childrenTrees[i] = new Text2(c, parent)
    } else if (typeof c === 'number') {
      childrenTrees[i] = new Text2(c.toString(), parent)
    } else {
      const [tag, props, ...children] = c

      if (typeof tag === 'string') {
        childrenTrees[i] = new Host2(tag, props, parent, children)
      } else {
        childrenTrees[i] = makeCustomComponent(tag, props, parent, children)
      }
    }
  }

  return childrenTrees
}
