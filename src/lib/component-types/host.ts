import {ZComponent} from './custom'
import {OComponent} from './observer'
import {TextComponent} from './text'

export type Tree = TextComponent | HostComponent | ZComponent<unknown> | OComponent<unknown>

export type ParentTree = Exclude<Tree, TextComponent>

export enum TreeType {
  host,
  custom,
  text,
}

export interface TreeBase {
  parent: ParentTree | null
  type: TreeType
  remove(): void
}

// export interface HostComponent extends TreeBase {
//   type: TreeType.host
//   tag: keyof HTMLElementTagNameMap
//   props: Record<string, unknown> | null
//   element: HTMLElement | null
//   children: Tree[]
// }

export class HostComponent implements TreeBase {
  type = TreeType.host as const
  parent: ParentTree | null = null
  element: HTMLElement | null = null

  constructor(
    public tag: keyof HTMLElementTagNameMap,
    public props: Record<string, unknown> | null,
    public children: Tree[]
  ) {}

  remove(): void {}
}

// TODO: Duplicate calls to this in some branches.
export function completeTree(tree: Tree, parent: ParentTree, element: HTMLElement) {
  tree.element = element
  tree.parent = parent
}

export function applyHostChanges(
  parent: ParentTree,
  tree: HostComponent,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
) {
  return null
}
