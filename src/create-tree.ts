//
export type Tree = HostComponent | string

export interface TreeBase {
  type: TreeType
  tag: any
  children: Tree[]
  element?: HTMLElement
  id?: string
}

export interface HostComponent extends TreeBase {
  tag: keyof HTMLElementTagNameMap
  props: null | Record<string, unknown>
}

export enum TreeType {
  host,
  custom
}

export function createTree(
  typeOrConstructor: keyof HTMLElementTagNameMap,
  props: Record<string, unknown> | null,
  ...children: Tree[]
): Tree {
  // console.log(arguments)

  // if (typeof typeOrConstructor === 'string') {
  // Host component
  return {
    type: TreeType.host,
    tag: typeOrConstructor,
    props,
    children
    // target: undefined
  }
  // } else {
  // typeof type === 'function'

  //   if (typeOrConstructor.prototype.render !== undefined) {
  //     // class component
  //   } else {
  //     // function component
  //   }
  // }
  //
  // return null
}
