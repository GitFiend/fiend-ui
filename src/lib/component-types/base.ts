import {TextComponent} from './text'
import {Component} from './custom'
import {OComponent} from './observer'
import {HostComponent} from './host'

export type Tree = TextComponent | HostComponent | Component<unknown> | OComponent<unknown>
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

export function checkPrevTree(tree: Tree) {
  console.assert(tree.parent !== null, 'prevTree has parent')
  console.assert(tree.element !== null, 'prevTree element set')

  if (tree.parent === null || tree.element === null) {
    debugger
  }
}
