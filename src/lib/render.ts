import {AnyComponent, ParentComponent, RootNode, Tree} from './component-types/base'
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
    return renderHost(_type, props, prevTree, parent, index)
  } else {
    return renderCustom(_type, props, prevTree, parent, index)
  }
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
