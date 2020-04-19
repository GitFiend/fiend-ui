import {ParentTree2, RootNode, Subtree, Tree2, TreeSlice2, TreeType} from './component-types/base'
import {Host2, renderHost} from './component-types/host2'
import {renderTextComponent, Text2} from './component-types/text2'
import {makeCustomComponent, renderCustom} from './component-types/custom2'

export function render2(slice: TreeSlice2, target: HTMLElement): void {
  const root = new RootNode(target)

  renderInternal2(root, slice, null, 0)
}

export function renderInternal2(
  parent: ParentTree2,
  slice: TreeSlice2,
  prevTree: Tree2 | null,
  index: number
): Tree2 {
  const [typeOrConstructor, props, ...children] = slice

  // // TODO: Might cause a bug.
  // if (Array.isArray(children[0])) {
  //   children = children.flat()
  // }

  if (typeof typeOrConstructor === 'string') {
    return renderHost(typeOrConstructor, props, children, parent, prevTree, index)
  } else {
    return renderCustom(typeOrConstructor, props, children, parent, prevTree, index)
  }

  // if (prevTree === null) {
  //   if (typeof typeOrConstructor === 'string') {
  //     return new Host2(typeOrConstructor, props, parent, children)
  //   } else {
  //     return makeCustomComponent(typeOrConstructor, props, parent, children)
  //   }
  // }
  // Check if it needs to be replaced

  // return null
}

export function renderChildrenInternal(
  childrenSlices: Subtree[],
  prevTree: Tree2 | null,
  parent: ParentTree2,
  index: number
) {
  // TODO. Maybe only host components actually render children? (Custom components just pass them to host components).
}

export function renderChildInternal(
  subtree: Subtree,
  prevTree: Tree2 | null,
  parent: ParentTree2,
  index: number
) {
  if (typeof subtree === 'string') {
    return renderTextComponent(subtree, prevTree, parent, index)
  } else if (typeof subtree === 'number') {
    return renderTextComponent(subtree.toString(), prevTree, parent, index)
  } else {
    return renderInternal2(parent, subtree, prevTree, index)
  }
}

export function renderChildren(childrenSlices: Subtree[], parent: ParentTree2): Tree2[] {
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

export function removeSubtrees(parent: ParentTree2, index: number): void {
  switch (parent.type) {
    case TreeType.host:
      const siblings = parent.children
      const len = siblings.length

      for (let i = index; i < len; i++) {
        siblings[i].remove()
      }
      break
    case TreeType.custom:
      // Custom components one have child?
      // if (index === 0)
      //   parent.subtree?.remove()

      break
  }
}
