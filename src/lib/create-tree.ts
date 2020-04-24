import {HostComponent} from './component-types/host'
import {Component} from './component-types/custom'
import {TextComponent} from './component-types/text'
import {Tree, TreeSlice2} from './component-types/base'
import {Custom2} from './component-types/custom2'

declare global {
  namespace JSX {
    // @ts-ignore
    type Element = TreeSlice2

    // @ts-ignore
    interface ElementClass extends Custom2<any> {}
  }
}

export type TreeSlice = [
  keyof HTMLElementTagNameMap | typeof Component,
  Record<string, unknown> | null,
  ...(TreeSlice | string | number)[]
]

export const createTree = (...slice: TreeSlice) => {
  // debugger

  return slice
}

// export function createTree(...slice: TreeSlice): TreeSlice {
//   // console.log(args)
//
//   // console.log(args[SlicePart.type], args[SlicePart.props])
//
//   return slice
// }

export function createTree2(
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
