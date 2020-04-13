import {applyHostChanges, HostComponent} from './component-types/host'
import {applyCustomChanges} from './component-types/custom'
import {applyTextChanges} from './component-types/text'
import {ParentTree, Tree, TreeType} from './component-types/base'

export function render(tree: Tree, target: HTMLElement) {
  const root = new HostComponent('div', null, [tree])
  root.element = target

  renderInternal(root, tree, null, 0)
}

export function renderInternal(
  parent: ParentTree,
  tree: Tree | null,
  prevTree: Tree | null,
  index: number
) {
  const element = applyChanges(parent, tree, prevTree, index)

  if (tree === null || element === null || tree.type === TreeType.text) return

  // TODO: Need to check for prev children to delete (prev children array longer).
  // Also: May be able to speed this up slightly if already know that prev children is null?
  const len = tree.children.length

  for (let i = 0; i < len; i++) {
    const c = tree.children[i]

    renderInternal(tree, c, getPrevChild(prevTree, i), i)
  }
}

function applyChanges(parent: ParentTree, tree: Tree | null, prevTree: Tree | null, index: number) {
  if (tree === null) {
    // delete everything in prevTree
    prevTree?.remove()
    return null
  }

  tree.parent = parent

  switch (tree.type) {
    case TreeType.text:
      return applyTextChanges(parent, tree, prevTree, index)
    case TreeType.host:
      return applyHostChanges(parent, tree, prevTree, index)
    case TreeType.custom:
      return applyCustomChanges(parent, tree, prevTree, index)
  }
}

function getPrevChild(prevTree: Tree | null, index: number): Tree | null {
  if (prevTree === null) return null

  if (prevTree.type === TreeType.text) return null

  if (prevTree.children !== undefined) {
    return prevTree.children[index] || null
  }
  return null
}

export function removeFollowingElements(parent: ParentTree, index: number): void {
  const siblings = parent.children
  const len = siblings.length

  for (let i = index; i < len; i++) {
    siblings[i].remove()
  }
}

export class ZGlobals {
  static actionStack: (() => void)[] = []
}
