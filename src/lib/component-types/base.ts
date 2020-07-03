import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Component, Rec} from './component'
import {ObserverComponent} from './observer-component'

export type Z = HostComponent | TextComponent | Component | ObserverComponent
export type ParentComponent = HostComponent | RootNode | Component

export interface Tree {
  type: keyof HTMLElementTagNameMap | typeof Component
  props: Record<string, unknown> | null
  children: Subtree
}

export type SubtreeFlat = Tree | string | number | null
export type Subtree = SubtreeFlat | SubtreeFlat[] | (SubtreeFlat | SubtreeFlat[])[]

export enum ZType {
  host,
  custom,
  text,
  // empty,
}

export interface ComponentBase {
  parent: unknown
  // element: unknown
  type: ZType

  remove(): void
}

export class RootNode implements ComponentBase {
  type = ZType.host as const
  parent: null
  subComponents: Z[] = []
  order: string = '1'

  constructor(public element: HTMLElement) {}

  remove(): void {
    this.element.remove()
    this.subComponents.forEach(s => s.remove())
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

export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}
