import {Component, CustomComponentType, OComponent, ZComponent} from './custom-component'

export type Tree = HostComponent | string | ZComponent<unknown> | OComponent<unknown>

export interface TreeBase {
  type: TreeType
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
): Tree {
  // console.log(arguments)

  if (typeof typeOrConstructor === 'string') {
    return {
      type: TreeType.host,
      tag: typeOrConstructor,
      props,
      children
    }
  } else {
    console.time('construct')
    const c = new typeOrConstructor(props, children)
    console.timeEnd('construct')
    return c
  }
}
