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
  target: HTMLElement | null = null

  render(tree: Tree, target: HTMLElement) {
    if (this.target !== target) {
      this.clear()
      this.rootNode = new RootNode(target)
    } else if (this.rootNode === null) {
      this.rootNode = new RootNode(target)
    }

    this.rootNode.render(tree)
  }

  clear() {
    this.rootNode?.remove()
    this.rootNode = null
  }
}

const renderManager = new RenderManager()

export class Render {
  static tree(
    tree: Tree,
    prevTree: AnyComponent | null,
    parent: ParentComponent,
    parentOrder: string,
    index: number
  ): HostComponent | Component {
    const {_type, props} = tree

    if (typeof _type === 'string') {
      return renderHost(_type, props, prevTree, parent, parentOrder, index)
    } else {
      return renderCustom(_type, props, prevTree, parent, parentOrder, index)
    }
  }

  static subtrees(
    parent: ParentComponent,
    children: Subtree[],
    prevComponents: Map<string, AnyComponent>
  ): Map<string, AnyComponent> {
    const newComponents = new Map<string, AnyComponent>()

    const len = children.length - 1

    for (let i = len; i >= 0; i--) {
      const child = children[i]

      if (child !== null) {
        this.subtree(parent, child, prevComponents, newComponents, i)
      }
    }
    this.removeChildren(prevComponents)

    return newComponents
  }

  static subtree(
    parent: ParentComponent,
    subtree: Tree | string | number,
    prevChildren: Map<string, AnyComponent>,
    newChildren: Map<string, AnyComponent>,
    index: number
  ): AnyComponent {
    if (typeof subtree === 'string') {
      const s = renderTextComponent(
        subtree,
        prevChildren.get(subtree) ?? null,
        parent,
        parent.order,
        index
      )
      prevChildren.delete(subtree)
      newChildren.set(subtree, s)
      return s
    }

    if (typeof subtree === 'number') {
      const text = subtree.toString()
      const s = renderTextComponent(
        text,
        prevChildren.get(text) ?? null,
        parent,
        parent.order,
        index
      )
      prevChildren.delete(text)
      newChildren.set(text, s)
      return s
    }

    const key: string = subtree.props.key ?? index.toString()
    const s = renderTree(
      subtree,
      prevChildren.get(key) ?? null,
      parent,
      parent.order,
      index
    )
    prevChildren.delete(key)
    newChildren.set(key, s)
    return s
  }

  static removeChildren(children: Map<string, AnyComponent>): void {
    for (const [, c] of children) c.remove()
  }
}

export function render(tree: Tree | null, target: HTMLElement): void {
  if (tree === null) renderManager.clear()
  else renderManager.render(tree, target)
}

export function renderTree(
  tree: Tree,
  prevTree: AnyComponent | null,
  parent: ParentComponent,
  parentOrder: string,
  index: number
): HostComponent | Component {
  const {_type, props} = tree

  if (typeof _type === 'string') {
    return renderHost(_type, props, prevTree, parent, parentOrder, index)
  } else {
    return renderCustom(_type, props, prevTree, parent, parentOrder, index)
  }
}

export function renderSubtree2(
  subtree: Tree | string | number,
  prevTree: AnyComponent | null,
  parent: ParentComponent,
  parentOrder: string,
  index: number
): AnyComponent {
  if (typeof subtree === 'string') {
    return renderTextComponent(subtree, prevTree, parent, parentOrder, index)
  } else if (typeof subtree === 'number') {
    return renderTextComponent(subtree.toString(), prevTree, parent, parentOrder, index)
  } else {
    return renderTree(subtree, prevTree, parent, parentOrder, index)
  }
}

export function removeChildren(children: Map<string, AnyComponent>): void {
  for (const [, c] of children) c.remove()
}
