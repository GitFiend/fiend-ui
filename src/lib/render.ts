import {
  AnyComponent,
  ParentComponent,
  RootNode,
  Subtree,
  Tree,
} from './component-types/base'
import {HostComponent, renderHost} from './component-types/host/host-component'
import {renderTextComponent} from './component-types/text-component'
import {Component, renderCustom} from './component-types/component'

class RenderManager {
  rootNode: RootNode | null = null
  component: HostComponent | Component | null = null
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
    this.component?.remove()

    // this.rootNode?.subComponents.forEach(c => c.remove())
  }
}

const renderManager = new RenderManager()

export function render(tree: Tree | null, target: HTMLElement): void {
  if (tree === null) renderManager.clear()
  else renderManager.render(tree, target)
}

export function renderTree(
  tree: Tree,
  prevTree: AnyComponent | null,
  parent: ParentComponent,
  index: number
): HostComponent | Component {
  const {_type, props} = tree

  if (typeof _type === 'string') {
    return renderHost(_type, props, parent, prevTree, index)
  } else {
    return renderCustom(_type, props, parent, prevTree, index)
  }
}

export function renderSubtrees(
  children: Subtree[],
  prevChildren: Map<string, AnyComponent>,
  parent: ParentComponent
): Map<string, AnyComponent> {
  const newChildren = new Map<string, AnyComponent>()

  const len = children.length - 1

  for (let i = len; i >= 0; i--) {
    const child = children[i]

    if (child !== null) {
      renderSubtree(child, prevChildren, newChildren, parent, i)

      // const s = renderSubtree2(child, prevChildren.get(child.key) ?? null, parent, i)

      // if (s !== null) {
      // newChildren.push(s)
      // delete prevChildren[i]

      // newChildren[i] = s
      // }
    }
  }

  removeChildren(prevChildren)
  // if (prevChildren.length > 0) removeSubComponents(parent, newChildren.length)

  // console.log(newChildren)

  return newChildren
}

// Mutates prevChildren and newChildren
function renderSubtree(
  subtree: Tree | string | number,
  prevChildren: Map<string, AnyComponent>,
  newChildren: Map<string, AnyComponent>,
  parent: ParentComponent,
  index: number
): AnyComponent {
  if (typeof subtree === 'string') {
    const s = renderTextComponent(
      subtree,
      prevChildren.get(subtree) ?? null,
      parent,
      index
    )
    prevChildren.delete(subtree)
    newChildren.set(subtree, s)
    return s
  }

  if (typeof subtree === 'number') {
    const text = subtree.toString()
    const s = renderTextComponent(text, prevChildren.get(text) ?? null, parent, index)
    prevChildren.delete(text)
    newChildren.set(text, s)
    return s
  }

  const key: string = subtree.props.key ?? index.toString()
  const s = renderTree(subtree, prevChildren.get(key) ?? null, parent, index)
  prevChildren.delete(key)
  newChildren.set(key, s)
  return s
}

export function renderSubtree2(
  subtree: Tree | string | number,
  prevTree: AnyComponent | null,
  parent: ParentComponent,
  index: number
): AnyComponent {
  if (typeof subtree === 'string') {
    return renderTextComponent(subtree, prevTree, parent, index)
  } else if (typeof subtree === 'number') {
    return renderTextComponent(subtree.toString(), prevTree, parent, index)
  } else {
    return renderTree(subtree, prevTree, parent, index)
  }
}

export function removeChildren(children: Map<string, AnyComponent>): void {
  for (const [, c] of children) c.remove()
}
