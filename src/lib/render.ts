import {
  ParentComponent,
  RootNode,
  Subtree,
  SubtreeFlat,
  Tree,
  Z,
  ZType,
} from './component-types/base'
import {renderHost} from './component-types/host/host-component'
import {renderTextComponent} from './component-types/text-component'
import {renderCustom} from './component-types/component'

export function render(tree: Tree, target: HTMLElement): void {
  const root = new RootNode(target)

  renderTree(tree, null, root, 0)
}

export function renderTree(
  tree: Tree,
  prevTree: Z | null,
  parent: ParentComponent,
  index: number
): Z {
  const {_type, props, children} = tree

  if (typeof _type === 'string') {
    return renderHost(_type, props, children, parent, prevTree, index)
  } else {
    return renderCustom(_type, props, children, parent, prevTree, index)
  }
}

export function renderFlatSubtree(
  subtree: SubtreeFlat,
  prevTree: Z | null,
  parent: ParentComponent,
  index: number
): Z | null {
  if (subtree === null) {
    removeSubComponents(parent, index)
    return null
  }
  if (typeof subtree === 'string') {
    return renderTextComponent(subtree, prevTree, parent, index)
  } else if (typeof subtree === 'number') {
    return renderTextComponent(subtree.toString(), prevTree, parent, index)
  } else {
    return renderTree(subtree, prevTree, parent, index)
  }
}

export function renderSubtree(
  children: Subtree,
  prevChildren: Z[],
  parent: ParentComponent
): Z[] {
  const newChildren: Z[] = []

  if (children === null) {
    if (prevChildren[0] !== undefined) {
      removeSubComponents(parent, 0)
    }
  } else if (!Array.isArray(children)) {
    const s = renderFlatSubtree(children, prevChildren[0] ?? null, parent, 0)
    if (s !== null) newChildren.push(s)
  } else {
    let i = 0
    for (const c of children) {
      if (Array.isArray(c)) {
        for (const c_ of c) {
          const s = renderFlatSubtree(c_, prevChildren[i] ?? null, parent, i)
          if (s !== null) newChildren.push(s)
          i++
        }
      } else {
        const s = renderFlatSubtree(c, prevChildren[i] ?? null, parent, i)

        if (s !== null) newChildren.push(s)
        i++
      }
    }
  }
  removeSubComponents(parent, newChildren.length)
  return newChildren
}

export function removeSubComponents(parent: ParentComponent, index: number): void {
  switch (parent._type) {
    case ZType.custom:
    case ZType.host:
      const siblings: Z[] = parent.subComponents
      const len = siblings.length

      for (let i = index; i < len; i++) {
        siblings[i].remove()
      }
      siblings.length = index
      break
  }
}
