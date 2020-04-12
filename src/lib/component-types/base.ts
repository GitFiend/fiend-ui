import {TextComponent} from './text'
import {ZComponent} from './custom'
import {OComponent} from './observer'
import {HostComponent} from './host'

export type Tree = TextComponent | HostComponent | ZComponent<unknown> | OComponent<unknown>
export type ParentTree = Exclude<Tree, TextComponent>

export enum TreeType {
  host,
  custom,
  text,
}

export interface TreeBase {
  parent: unknown
  element: unknown
  type: TreeType

  remove(): void
}
