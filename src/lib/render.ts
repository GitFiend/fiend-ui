import {AnyComponent, ParentComponent} from './component-types/base-component'
import {DomComponent, renderDom} from './component-types/host/dom-component'
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
  static component(
    tree: FiendElement,
    prevTree: AnyComponent | null,
    parentHost: DomComponent | RootComponent,
    directParent: ParentComponent,
    index: number,
  ): DomComponent | PureComponent {
    if (tree.elementType === ElementType.dom) {
      return renderDom(tree, prevTree, parentHost, directParent, index)
    } else {
      return renderCustom(tree, prevTree, parentHost, directParent, index)
    }
  }

  static subComponents(
    parentHost: DomComponent | RootComponent,
    directParent: ParentComponent,
    children: FiendNode[],
    prevComponents: Map<string, AnyComponent>,
  ): Map<string, AnyComponent> {
    const newComponents = new Map<string, AnyComponent>()

    const len = children.length - 1

    if (__DEV__) {
      checkChildrenKeys(children)
    }

    for (let i = len; i >= 0; i--) {
      const child = children[i]

      if (child !== null) {
        this.subComponent(
          parentHost,
          directParent,
          child,
          prevComponents,
          newComponents,
          i,
        )
      }
    }

    for (const c of prevComponents.values()) c.remove()

    return newComponents
  }

  private static subComponent(
    parentHost: DomComponent | RootComponent,
    directParent: ParentComponent,
    subtree: FiendElement | string,
    prevChildren: Map<string, AnyComponent>,
    newChildren: Map<string, AnyComponent>,
    index: number,
  ): AnyComponent {
    if (typeof subtree === 'string') {
      const key = index.toString()

      const s = renderTextComponent(
        subtree,
        prevChildren.get(key) ?? null,
        parentHost,
        directParent,
        index,
      )
      prevChildren.delete(key)
      newChildren.set(key, s)
      return s
    }

    const key: string = subtree.props.key ?? index.toString()
    const s = this.component(
      subtree,
      prevChildren.get(key) ?? null,
      parentHost,
      directParent,
      index,
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

function checkChildrenKeys(children: FiendNode[]) {
  let numKeys = 0
  const set = new Set<string>()

  for (const child of children) {
    if (child !== null && typeof child !== 'string') {
      if (typeof child.props.key === 'string') {
        numKeys++
        set.add(child.props.key)
      }
    }
  }

  if (numKeys !== set.size) {
    console.error(`Subtrees contain duplicate keys: `, children)
  }
}
