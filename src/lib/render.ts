import {ParentComponent, RootNode, Subtree, Tree, Z, ZType} from './component-types/base'
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

export function renderSubtree(
  subtree: Subtree,
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

export function renderSubtrees(
  children: Subtree[],
  prevChildren: Z[],
  parent: ParentComponent
): Z[] {
  const newChildren: Z[] = []

  for (let i = 0; i < children.length; i++) {
    const s = renderSubtree(children[i], prevChildren[i] ?? null, parent, i)

    if (s !== null) newChildren.push(s)
  }

  if (prevChildren.length > 0) removeSubComponents(parent, newChildren.length)

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

      if (siblings.length > index) siblings.length = index
      break
  }
}
