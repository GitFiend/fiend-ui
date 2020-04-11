import {ZComponent} from './custom'
import {OComponent} from './observer'

export type Tree = string | HostComponent | ZComponent<unknown> | OComponent<unknown>

export enum TreeType {
  host,
  custom
}

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
