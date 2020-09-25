import {
  AnyComponent,
  ParentComponent,
  RootNode,
  Subtree,
  Tree,
} from './component-types/base'
import {renderHost} from './component-types/host/host-component'
import {renderTextComponent} from './component-types/text-component'
import {renderCustom} from './component-types/component'

class RenderManager {
  rootNode: RootNode | null = null
  component: AnyComponent | null = null
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
    if (this.rootNode !== null) {
      removeChildren(this.rootNode.subComponents)
    }
    // this.rootNode?.subComponents.forEach(c => c.remove())
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
  prevTree: AnyComponent | null,
  parent: ParentComponent,
  index: number
): AnyComponent {
  const {_type, props} = tree

  if (typeof _type === 'string') {
    return renderHost(_type, props, parent, prevTree, index)
  } else {
    return renderCustom(_type, props, parent, prevTree, index)
  }
}

function renderSubtree(
  subtree: Tree | string | number,
  prevTree: AnyComponent | null,
  parent: ParentComponent,
  index: number
): AnyComponent {
  // if (subtree === null) {
  //   // removeSubComponents(parent, index)
  //   return null
  // }
  if (typeof subtree === 'string') {
    return renderTextComponent(subtree, prevTree, parent)
  } else if (typeof subtree === 'number') {
    return renderTextComponent(subtree.toString(), prevTree, parent)
  } else {
    return renderTree(subtree, prevTree, parent, index)
  }
}

export function renderSubtrees(
  children: Subtree[],
  prevChildren: {[key: string]: AnyComponent},
  parent: ParentComponent
): {[key: string]: AnyComponent} {
  const newChildren: {[key: string]: AnyComponent} = {}

  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    if (child !== null) {
      const s = renderSubtree(child, prevChildren[i] ?? null, parent, i)

      // if (s !== null) {
      // newChildren.push(s)
      delete prevChildren[i]

      newChildren[i] = s
      // }
    }
  }

  removeChildren(prevChildren)
  // if (prevChildren.length > 0) removeSubComponents(parent, newChildren.length)

  return newChildren
}

export function removeChildren(children: {[key: string]: AnyComponent}): void {
  for (const c in children) {
    children[c as keyof typeof children].remove()
  }
}

// export function removeSubComponents(parent: ParentComponent, index: number): void {
//   switch (parent._type) {
//     case ComponentType.custom:
//     case ComponentType.host:
//       const siblings: AnyComponent[] = parent.subComponents
//       const len = siblings.length
//
//       for (let i = index; i < len; i++) {
//         siblings[i].remove()
//       }
//
//       if (siblings.length > index) siblings.length = index
//       break
//   }
// }
