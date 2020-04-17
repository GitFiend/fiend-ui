import {ParentTree, Tree} from './component-types/base'
import {createTree2, SlicePart, TreeSlice} from './create-tree'
import {Component} from './component-types/custom'
import {HostComponent} from './component-types/host'

//
export function renderInternal2(
  parent: ParentTree,
  tree: TreeSlice,
  prevTree: Tree | null,
  index: number
) {}

function renderNode(parent: ParentTree, slice: TreeSlice, prevTree: Tree | null, index: number) {
  if (prevTree === null) {
    // Make tree and return it.
    const tree = createTree2(...slice)
  }

  const typeOrConstructor = slice[SlicePart.type]

  if (typeof typeOrConstructor === 'string') {
    // host component
  }
}

export function createTree3(
  typeOrConstructor: keyof HTMLElementTagNameMap | typeof Component,
  props: Record<string, unknown> | null,
  ...children: Tree[]
): Tree {
  // console.log(arguments)

  if (typeof typeOrConstructor === 'string') {
    return new HostComponent(typeOrConstructor, props, normaliseChildren(children))
  } else {
    console.time('construct')
    const c = new typeOrConstructor(props, normaliseChildren(children))
    console.timeEnd('construct')
    return c
  }
}
