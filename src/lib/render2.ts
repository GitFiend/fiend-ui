import {ParentTree2, RootNode, Subtree, Tree2, TreeSlice2, TreeType} from './component-types/base'
import {renderHost} from './component-types/host/host2'
import {renderTextComponent} from './component-types/text2'
import {renderCustom} from './component-types/custom2'

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

  if (typeof typeOrConstructor === 'string') {
    return renderHost(typeOrConstructor, props, children, parent, prevTree, index)
  } else {
    return renderCustom(typeOrConstructor, props, children, parent, prevTree, index)
  }
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
