import {AnyComponent, ParentComponent} from './component-types/base-component'
import {HostComponent, renderHost} from './component-types/host/host-component'
import {renderTextComponent} from './component-types/text-component'
import {PureComponent, renderCustom} from './component-types/pure-component'
import {RootComponent} from './component-types/root-component'
import {ElementType, FiendElement, FiendNode} from './util/element'

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
    parentHost: HostComponent | RootComponent,
    directParent: ParentComponent,
    index: number
  ): HostComponent | PureComponent {
    if (tree.elementType === ElementType.host) {
      return renderHost(tree, prevTree, parentHost, directParent, index)
    } else {
      return renderCustom(tree, prevTree, parentHost, directParent, index)
    }
  }

  static subtrees(
    parentHost: HostComponent | RootComponent,
    directParent: ParentComponent,
    children: FiendNode[],
    prevComponents: Map<string, AnyComponent>
  ): Map<string, AnyComponent> {
    const newComponents = new Map<string, AnyComponent>()

    const len = children.length - 1

    for (let i = len; i >= 0; i--) {
      const child = children[i]

      if (child !== null) {
        this.subtree(parentHost, directParent, child, prevComponents, newComponents, i)
      }
    }
    for (const [, c] of prevComponents) c.remove()

    return newComponents
  }

  private static subtree(
    parentHost: HostComponent | RootComponent,
    directParent: ParentComponent,
    subtree: FiendElement | string,
    prevChildren: Map<string, AnyComponent>,
    newChildren: Map<string, AnyComponent>,
    index: number
  ): AnyComponent {
    if (typeof subtree === 'string') {
      const key = index.toString()

      const s = renderTextComponent(
        subtree,
        prevChildren.get(key) ?? null,
        parentHost,
        directParent,
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
      parentHost,
      directParent,
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
