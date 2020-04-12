import {mkTextNode, Tree, TreeType} from './component-types/host'
import {ZComponent} from './component-types/custom'

export function createTree(
  typeOrConstructor: keyof HTMLElementTagNameMap | typeof ZComponent,
  props: Record<string, unknown> | null,
  ...children: Tree[]
): Tree {
  // console.log(arguments)

  if (typeof typeOrConstructor === 'string') {
    return {
      type: TreeType.host,
      tag: typeOrConstructor,
      props,
      children: normaliseChildren(children),
      element: null,
      parent: null
    }
  } else {
    console.time('construct')
    const c = new typeOrConstructor(props, normaliseChildren(children))
    console.timeEnd('construct')
    return c
  }
}

function normaliseChildren(children: (Tree | string)[]): Tree[] {
  const len = children.length
  const newChildren: Tree[] = new Array(children.length)

  for (let i = 0; i < len; i++) {
    const c = children[i]

    if (typeof c === 'string') {
      newChildren[i] = mkTextNode(c)
    } else {
      newChildren[i] = c
    }
  }
  return newChildren
}
