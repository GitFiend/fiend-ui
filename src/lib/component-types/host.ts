import {ZComponent} from './custom'
import {OComponent} from './observer'

export type Part = null

export type Tree = TextComponent | HostComponent | ZComponent<unknown> | OComponent<unknown>

export enum TreeType {
  host,
  custom,
  text
}

export interface TreeBase {
  parent: Tree | null
  type: TreeType
}

export interface HostComponent extends TreeBase {
  type: TreeType.host
  tag: keyof HTMLElementTagNameMap
  props: Record<string, unknown> | null
  element: HTMLElement | null
  children: Tree[]
}

export interface TextComponent extends TreeBase {
  type: TreeType.text
  element: Text
  text: string
}

export function mkTextNode(text: string): TextComponent {
  return {
    parent: null,
    type: TreeType.text,
    text,
    element: document.createTextNode(text)
  }
}

export function completeTree(tree: Tree, parent: Tree, element: HTMLElement) {
  tree.element = element
  tree.parent = parent
}
