import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Component, Rec} from './component'
import {ObserverComponent} from './observer-component'

export type Tree2 = HostComponent | TextComponent | Component | ObserverComponent
export type ParentTree2 = HostComponent | RootNode | Component

export type JSXSlice = [
  keyof HTMLElementTagNameMap | typeof Component,
  Record<string, unknown> | null,
  ...SubSlice[]
]

export type SubSlice = JSXSlice | string | number

export enum TreeType {
  host,
  custom,
  text,
}

export interface ComponentBase {
  parent: unknown
  element: unknown
  type: TreeType

  remove(): void
}

export class RootNode implements ComponentBase {
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
