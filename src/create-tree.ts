//
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
