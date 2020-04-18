import {
  ParentTree,
  ParentTree2,
  RootNode,
  Tree,
  Tree2,
  TreeSlice2,
  TreeType,
} from './component-types/base'
import {TreeSlice} from './create-tree'
import {HostComponent} from './component-types/host'
import {TextComponent} from './component-types/text'
import {Host2} from './component-types/host2'

export function render2(slice: TreeSlice2 | any, target: HTMLElement) {
  const root = new RootNode(target)

  const [typeOrConstructor, props, ...children] = slice

  new Host2(typeOrConstructor, props, root, children)

  // console.log(tree)
  // const root = new HostComponent('div', null, [tree])
  // root.element = target
  //
  // renderInternal(root, tree, null, 0)
}
//
export function renderInternal2(
  parent: ParentTree2,
  slice: TreeSlice2,
  prevTree: Tree2 | null,
  index: number
) {
  if (prevTree === null) {
    const [typeOrConstructor, props, ...children] = slice

    new Host2(typeOrConstructor, props, parent, children)
  } else {
  }
}

/*

renderNode creates dom nodes as we go.

if prevTree doesn't exist:
Convert slice into a tree. Recurse into children


Plan is to create or reuse. If we reuse, we need to also check for attributes to update.

How do we create children? We can't do it until current tree has been created.
 */
function renderNode(parent: ParentTree, slice: TreeSlice, prevTree: Tree | null, index: number) {
  if (prevTree === null) {
    // Make tree and return it.
    const tree = createTree3(slice)
  }

  const [typeOrConstructor, props, ...children] = slice

  if (typeof typeOrConstructor === 'string') {
    // host component
  }
}

export function createTree3(slice: TreeSlice): Tree {
  const [typeOrConstructor, props, ...children] = slice

  if (typeof typeOrConstructor === 'string') {
    return new HostComponent(typeOrConstructor, props, createChildren(children))
  }
  return new typeOrConstructor(props, createChildren(children))
}

function createChildren(children: (TreeSlice | string | number)[]): Tree[] {
  const len = children.length
  const newChildren: Tree[] = new Array(children.length)

  for (let i = 0; i < len; i++) {
    const c = children[i]

    if (typeof c === 'string') {
      newChildren[i] = new TextComponent(c)
    } else if (typeof c === 'number') {
      newChildren[i] = new TextComponent(c.toString())
    } else {
      newChildren[i] = createTree3(c)
    }
  }
  return newChildren
}
