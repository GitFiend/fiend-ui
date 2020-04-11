import {ZComponent} from './custom'
import {OComponent} from './observer'

export type Tree = TextComponent | HostComponent | ZComponent<unknown> | OComponent<unknown>

export enum TreeType {
  host,
  custom,
  text
}

export interface TreeBase {
  type: TreeType
}

export interface HostComponent extends TreeBase {
  type: TreeType.host
  tag: keyof HTMLElementTagNameMap
  props: null | Record<string, unknown>
  children: Tree[]
  element?: HTMLElement
}

export interface TextComponent extends TreeBase {
  type: TreeType.text
  element: Text
}

export function mkTextNode(text: string): TextComponent {
  return {
    type: TreeType.text,
    element: document.createTextNode(text)
  }
}
