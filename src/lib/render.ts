import {AnyComponent, RootComponent, Subtree, Tree} from './component-types/base'
import {HostComponent, renderHost} from './component-types/host/host-component'
import {renderTextComponent} from './component-types/text-component'
import {PureComponent, renderCustom} from './component-types/pure-component'

class RenderManager {
  rootNode: RootComponent | null = null
  target: HTMLElement | null = null

  render(tree: Tree, target: HTMLElement) {
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
    tree: Tree,
    prevTree: AnyComponent | null,
    parent: HostComponent | RootComponent,
    parentOrder: string,
    index: number
  ): HostComponent | PureComponent {
    const {_type, props} = tree

    if (typeof _type === 'string') {
      return renderHost(_type, props, prevTree, parent, parentOrder, index)
    } else {
      return renderCustom(_type, props, prevTree, parent, parentOrder, index)
    }
  }

  static subtrees(
    parent: HostComponent | RootComponent,
    parentOrder: string,
    children: Subtree[],
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
        parentOrder,
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
        parentOrder,
        index
      )
      prevChildren.delete(text)
      newChildren.set(text, s)
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

export function render(tree: Tree | null, target: HTMLElement): void {
  if (tree === null) renderManager.clear()
  else renderManager.render(tree, target)
}
