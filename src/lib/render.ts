import {ParentTree2, RootNode, Subtree, SubtreeFlat, Tree, Z, ZType} from './component-types/base'
import {renderHost} from './component-types/host/host-component'
import {renderTextComponent} from './component-types/text-component'
import {renderCustom} from './component-types/component'

export function render(tree: Tree, target: HTMLElement): void {
  const root = new RootNode(target)

  renderTree(tree, null, root, 0)
}

export function renderTree(tree: Tree, prevTree: Z | null, parent: ParentTree2, index: number): Z {
  const {type, props, children} = tree

  // WHat about number?
  if (typeof type === 'string') {
    return renderHost(type, props, children, parent, prevTree, index)
  } else {
    return renderCustom(type, props, children, parent, prevTree, index)
  }
}

export function renderFlatSubtree(
  subtree: SubtreeFlat,
  prevTree: Z | null,
  parent: ParentTree2,
  index: number
): Z {
  if (typeof subtree === 'string') {
    return renderTextComponent(subtree, prevTree, parent, index)
  } else if (typeof subtree === 'number') {
    return renderTextComponent(subtree.toString(), prevTree, parent, index)
  } else {
    return renderTree(subtree, prevTree, parent, index)
  }
}

export function removeSubtrees(parent: ParentTree2, index: number): void {
  switch (parent.type) {
    case ZType.host:
      const siblings = parent.children
      const len = siblings.length

      for (let i = index; i < len; i++) {
        siblings[i].remove()
      }
      break
    case ZType.custom:
      // Custom components one have child?
      // if (index === 0)
      //   parent.subtree?.remove()

      break
  }
}

export function renderSubtree(children: Subtree, prevChildren: Z[], parent: ParentTree2) {
  if (!Array.isArray(children)) {
    return [renderFlatSubtree(children, prevChildren[0] || null, parent, 0)]
  }

  const newChildren: Z[] = []

  let i = 0
  for (const c of children) {
    if (Array.isArray(c)) {
      for (const c_ of c) {
        newChildren.push(renderFlatSubtree(c_, prevChildren[i] || null, parent, i))
        i++
      }
    } else {
      newChildren.push(renderFlatSubtree(c, prevChildren[i] || null, parent, i))
      i++
    }
  }

  return newChildren
}
