//
import {ZComponent} from './custom-component'

export type Tree = HostComponent | string | ZComponent<unknown>

export interface TreeBase {
  type: TreeType
  // tag: any
  children: Tree[]
  element?: HTMLElement
  id?: string
}

export interface HostComponent extends TreeBase {
  type: TreeType.host
  tag: keyof HTMLElementTagNameMap
  props: null | Record<string, unknown>
}

export enum TreeType {
  host,
  custom
}

export function createTree(
  typeOrConstructor: keyof HTMLElementTagNameMap | typeof ZComponent,
  props: Record<string, unknown> | null,
  ...children: Tree[]
): Tree | any {
  // console.log(arguments)

  if (typeof typeOrConstructor === 'string') {
    // Host component
    return {
      type: TreeType.host,
      tag: typeOrConstructor,
      props,
      children
      // target: undefined
    }
  } else {
    return new typeOrConstructor(props, children)
    // typeof type === 'function'
    // if (typeOrConstructor.prototype.render !== undefined) {
    //   // class component
    // } else {
    //   // function component
    // }
  }
}
