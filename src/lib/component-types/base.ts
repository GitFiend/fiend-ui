import {Host2} from './host/host2'
import {Text2} from './text2'
import {Custom2, Rec} from './custom2'
import {Observer2} from './observer2'

export type Tree2 = Host2 | Text2 | Custom2 | Observer2
export type ParentTree2 = Host2 | RootNode | Custom2

export type TreeSlice2 = [
  keyof HTMLElementTagNameMap | typeof Custom2,
  Record<string, unknown> | null,
  ...Subtree[]
]

export type Subtree = TreeSlice2 | string | number

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

export class RootNode implements TreeBase {
  type = TreeType.host as const
  parent: null
  children: Tree2[] = []

  constructor(public element: HTMLElement) {}

  remove(): void {
    this.element.remove()
  }
}

export function equalProps(a: Rec, b: Rec): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) return false

  for (const key of aKeys) {
    if (a[key] !== b[key]) return false
  }
  for (const key of bKeys) {
    if (b[key] !== a[key]) return false
  }

  return true
}
