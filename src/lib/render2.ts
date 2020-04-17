import {ParentTree, Tree} from './component-types/base'
import {createTree2, SlicePart, TreeSlice} from './create-tree'
import {Component} from './component-types/custom'
import {HostComponent} from './component-types/host'
import {TextComponent} from './component-types/text'

//
export function renderInternal2(
  parent: ParentTree,
  tree: TreeSlice,
  prevTree: Tree | null,
  index: number
) {}

/*
renderNode doesn't create dom nodes yet. It creates a subtree (E.g. a custom component)

if prevTree doesn't exist:
Convert slice into a tree. Recurse into children

 */
function renderNode(parent: ParentTree, slice: TreeSlice, prevTree: Tree | null, index: number) {
  if (prevTree === null) {
    // Make tree and return it.
    const tree = createTree3(slice)
  }

  const typeOrConstructor = slice[SlicePart.type]

  if (typeof typeOrConstructor === 'string') {
    // host component
  }
}

export function createTree3(
  slice: TreeSlice
): Tree {
  // console.log(arguments)
  const [typeOrConstructor, props, ...children] = slice
  // const typeOrConstructor = slice[SlicePart.type]
  // const props = slice[SlicePart.props]

  if (typeof typeOrConstructor === 'string') {
    return new HostComponent(typeOrConstructor, props, normaliseChildren(children))
  } else {
    console.time('construct')
    const c = new typeOrConstructor(props, normaliseChildren(children))
    console.timeEnd('construct')
    return c
  }
}

function normaliseChildren(children: (Tree | string | number)[]): Tree[] {
  const len = children.length
  const newChildren: Tree[] = new Array(children.length)

  for (let i = 0; i < len; i++) {
    const c = children[i]

    if (typeof c === 'string') {
      newChildren[i] = new TextComponent(c)
    } else if (typeof c === 'number') {
      newChildren[i] = new TextComponent(c.toString())
    } else {
      newChildren[i] = c
    }
  }
  return newChildren
}
