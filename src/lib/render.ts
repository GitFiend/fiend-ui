import {
  applyHostChanges,
  completeTree,
  HostComponent,
  setAttributesFromProps,
} from './component-types/host'
import {applyCustomChanges, CustomComponentType} from './component-types/custom'
import {OComponent} from './component-types/observer'
import {applyTextChanges} from './component-types/text'
import {ParentTree, Tree, TreeType} from './component-types/base'

export function render(tree: Tree, target: HTMLElement) {
  const root = new HostComponent('div', null, [tree])
  root.element = target

  renderInternal(root, tree, null, target, 0)
}

export function renderInternal(
  parent: ParentTree,
  tree: Tree | null,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
) {
  const element = apply(parent, tree, prevTree, target, index)

  if (tree === null || element === null || tree.type === TreeType.text) return

  completeTree(tree, parent, element)
  // tree.element = element

  // TODO: Need to check for prev children to delete (prev children array longer).
  // Also: May be able to speed this up slightly if already know that prev children is null?
  const len = tree.children.length

  for (let i = 0; i < len; i++) {
    const c = tree.children[i]

    // if (typeof c === 'string') {
    //   renderInternal(mkTextNode(c), getPrevChild(prevTree, i), element, '', i)
    // } else {
    renderInternal(tree, c, getPrevChild(prevTree, i), element, i)
    // }
  }
}

function applyChanges(
  parent: ParentTree,
  tree: Tree | null,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
) {
  if (tree === null) {
    // delete everything in prevTree
    return null
  }

  switch (tree.type) {
    case TreeType.text:
      return applyTextChanges(parent, tree, prevTree, target, index)
    case TreeType.host:
      return applyHostChanges(parent, tree, prevTree, target, index)
    case TreeType.custom:
      return applyCustomChanges(parent, tree, prevTree, target, index)
  }
}

function apply(
  parent: ParentTree,
  tree: Tree | null,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
): HTMLElement | null {
  if (tree === null) {
    removeFollowingElements(target, index)
    return null
  }

  if (prevTree === null) {
    // tree not null, could be a string.
    return addElement(parent, tree, target, index)
  }

  // Both tree and prevTree not null.
  if (typeof tree === 'string') {
    if (tree !== prevTree) {
      return replaceElement(parent, tree, target, index)
    }
    return null // equal strings
  }
  if (typeof prevTree === 'string') {
    return replaceElement(parent, tree, target, index)
  }

  if (tree.type !== prevTree.type) {
    return replaceElement(parent, tree, target, index)
  }
  if (tree.type === TreeType.custom) {
    // TODO
    // tree.target = target
  }
  if (tree.type === TreeType.host && prevTree.type === TreeType.host) {
    if (tree.tag === prevTree.tag) {
      if (equalProps(tree.props, prevTree.props)) {
        return prevTree.element || null
      }
      return updateElement(tree, prevTree, target, index)
    }
  }
  return replaceElement(parent, tree, target, index)
}

function addElement(
  parent: ParentTree,
  tree: Tree,
  target: HTMLElement,
  index: number
): HTMLElement | null {
  if (tree.type === TreeType.text) {
    target.appendChild(tree.element)
    return null
  } else if (tree.type === TreeType.custom) {
    tree.parent = parent
    tree.target = target

    if (tree.customType === CustomComponentType.mobx) {
      ;(tree as OComponent<unknown>).setupObserving()
    } else {
      tree.forceUpdate()
    }
    // const {curr, prev} = tree.renderTree()
    //
    // renderInternal(curr, prev, target, '', index)
    return null
  } else {
    const el = document.createElement(tree.tag)

    if (tree.props) setAttributesFromProps(el, tree.props)

    target.appendChild(el)
    return el
  }
}

function replaceElement(parent: ParentTree, tree: Tree, target: HTMLElement, index: number) {
  removeFollowingElements(target, index)

  return addElement(parent, tree, target, index)
}

function updateElement(
  tree: Tree,
  prevTree: Tree,
  target: HTMLElement,
  index: number
): HTMLElement {
  const el = target.childNodes[index]

  if (el !== undefined) {
    // TODO
  }
  return el as HTMLElement
}

function getPrevChild(prevTree: Tree | null, index: number): Tree | null {
  if (prevTree === null) return null

  if (prevTree.type === TreeType.text) return null

  if (prevTree.children !== undefined) {
    return prevTree.children[index] || null
  }
  return null
}

function removeFollowingElements(target: HTMLElement, index: number): void {
  if (index === 0) {
    // target.innerHTML = ''
    while (target.childNodes.length > 0) target.childNodes[0].remove()
  } else {
    const {length} = target.childNodes

    for (let i = index; i < length; i++) {
      target.childNodes[index].remove()
    }
  }
}

function equalProps(
  props: Record<string, unknown> | null,
  prevProps: Record<string, unknown> | null
) {
  // TODO
  return true
}
