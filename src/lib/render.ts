import {AnyComponent} from './component-types/base-component'
import {HostComponent, renderHost} from './component-types/host/host-component'
import {renderTextComponent} from './component-types/text-component'
import {PureComponent, renderCustom} from './component-types/pure-component'
import {RootComponent} from './component-types/root-component'
import {ElementType, FiendElement, FiendNode, HostElement} from './util/element'

class RenderManager {
  rootNode: RootComponent | null = null
  target: HTMLElement | null = null

  render(tree: FiendElement, target: HTMLElement) {
    if (this.target !== target) {
      this.clear()
      this.rootNode = new RootComponent(target)
    } else if (this.rootNode === null) {
      this.rootNode = new RootComponent(target)
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
    tree: FiendElement,
    prevTree: AnyComponent | null,
    parent: HostComponent | RootComponent,
    parentOrder: string,
    index: number
  ): HostComponent | PureComponent {
    if (tree.elementType === ElementType.host) {
      return renderHost(tree, prevTree, parent, parentOrder, index)
    } else {
      return renderCustom(tree, prevTree, parent, parentOrder, index)
    }
  }

  static subtrees(
    parent: HostComponent | RootComponent,
    parentOrder: string,
    children: FiendNode[],
    prevComponents: Map<string, AnyComponent>
  ): Map<string, AnyComponent> {
    const newComponents = new Map<string, AnyComponent>()

    const len = children.length - 1

    for (let i = len; i >= 0; i--) {
      const child = children[i]

      if (child !== null) {
        this.subtree(parent, parentOrder, child, prevComponents, newComponents, i)
      }
    }
    for (const [, c] of prevComponents) c.remove()

    return newComponents
  }

  private static subtree(
    parent: HostComponent | RootComponent,
    parentOrder: string,
    subtree: FiendElement | string | number,
    prevChildren: Map<string, AnyComponent>,
    newChildren: Map<string, AnyComponent>,
    index: number
  ): AnyComponent {
    if (typeof subtree === 'string') {
      const key = index.toString()

      const s = renderTextComponent(
        subtree,
        prevChildren.get(key) ?? null,
        parent,
        parentOrder,
        index
      )
      prevChildren.delete(key)
      newChildren.set(key, s)
      return s
    }

    if (typeof subtree === 'number') {
      const key = subtree.toString()

      const s = renderTextComponent(
        subtree.toString(),
        prevChildren.get(key) ?? null,
        parent,
        parentOrder,
        index
      )
      prevChildren.delete(key)
      newChildren.set(key, s)
      return s
    }

    const key: string = subtree.props.key ?? index.toString()
    const s = this.tree(
      subtree,
      prevChildren.get(key) ?? null,
      parent,
      parentOrder,
      index
    )
    prevChildren.delete(key)
    newChildren.set(key, s)
    return s
  }
}

export function render(tree: FiendElement | null, target: HTMLElement): void {
  if (tree === null) renderManager.clear()
  else renderManager.render(tree, target)
}
