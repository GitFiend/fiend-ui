import {HTMLAttributes} from 'react'

export type Tree = HostComponent | string

export interface TreeBase {
  type: unknown
  children?: Tree[] | string
  target?: HTMLElement
  id?: string
}

export interface HostComponent extends TreeBase {
  type: keyof HTMLElementTagNameMap
  props: null | Record<string, unknown>
}

// export interface DivElement extends TreeBase {
//   type: 'div'
//   props: HTMLAttributes<HTMLDivElement>
//   key?: string
// }

// export interface TextElement extends TreeBase {
//   type: 'text'
//   text: string
// }
//
// export function div(
//   props: HTMLAttributes<HTMLDivElement>,
//   children: Tree[],
//   key?: string
// ): DivElement {
//   return {
//     type: 'div',
//     props,
//     children,
//     key,
//     target: undefined
//   }
// }
//
// export function text(text: string): TextElement {
//   return {
//     type: 'text',
//     text,
//     target: undefined
//   }
// }

export function createTree(
  typeOrConstructor: keyof HTMLElementTagNameMap | Function,
  props: Record<string, unknown> | null,
  ...children: Tree[]
): Tree | null {
  // console.log(arguments)

  if (typeof typeOrConstructor === 'string') {
    // Host component
    return {
      type: typeOrConstructor,
      props,
      children,
      target: undefined
    }
  } else {
    // typeof type === 'function'

    if (typeOrConstructor.prototype.render !== undefined) {
      // class component
    } else {
      // function component
    }
  }

  return null
}
