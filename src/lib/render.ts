import {ParentComponent, RootNode, Subtree, Tree, Z, ZType} from './component-types/base'
import {renderHost} from './component-types/host/host-component'
import {renderTextComponent} from './component-types/text-component'
import {renderCustom} from './component-types/component'

class RenderManager {
  rootNode: RootNode | null = null
  component: Z | null = null
  target: HTMLElement | null = null

  render(tree: Tree, target: HTMLElement) {
    if (this.target !== target) {
      this.clear()
      this.rootNode = new RootNode(target)
    } else if (this.rootNode === null) {
      this.rootNode = new RootNode(target)
    }

    this.component = renderTree(tree, this.component, this.rootNode, 0)
  }

  clear() {
    this.rootNode?.subComponents.forEach(c => c.remove())
  }
}

const renderManager = new RenderManager()

export function render(tree: Tree | null, target: HTMLElement): void {
  if (tree === null) renderManager.clear()
  else renderManager.render(tree, target)

  // const root = new RootNode(target)
  //
  // renderTree(tree, null, root, 0)
}

export function renderTree(
  tree: Tree,
  prevTree: Z | null,
  parent: ParentComponent,
  index: number
): Z {
  const {_type, props} = tree

  if (typeof _type === 'string') {
    return renderHost(_type, props, parent, prevTree, index)
  } else {
    return renderCustom(_type, props, parent, prevTree, index)
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
