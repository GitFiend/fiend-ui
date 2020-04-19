import {TextComponent} from './text'
import {Component} from './custom'
import {OComponent} from './observer'
import {HostComponent} from './host'
import {Host2} from './host2'
import {Text2} from './text2'
import {Custom2} from './custom2'

export type Tree = TextComponent | HostComponent | Component<unknown> | OComponent<unknown>
export type ParentTree = Exclude<Tree, TextComponent>

export type Tree2 = Host2 | Text2 | Custom2<unknown, unknown>
export type ParentTree2 = Host2 | RootNode | Custom2<unknown, unknown>

export type TreeSlice2 = [
  keyof HTMLElementTagNameMap | typeof Custom2,
  Record<string, unknown> | null,
  ...(TreeSlice2 | string | number)[]
]

// export type Subtree = TreeSlice2 | string | number | Subtree[]

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

export class RootNode implements TreeBase {
  type = TreeType.host as const
  parent: null

  constructor(public element: HTMLElement) {}

  remove(): void {
    this.element.remove()
  }
}
