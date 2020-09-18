import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Component, Rec} from './component'

export type Z = HostComponent | TextComponent | Component
export type ParentComponent = HostComponent | RootNode | Component

export interface Tree {
  _type: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | typeof Component
  props: Record<string, unknown> | null
  children: Subtree[]
}

export type Subtree = Tree | string | number | null

export enum ZType {
  host,
  custom,
  text,
}

export interface ComponentBase {
  parent: unknown
  _type: ZType

  remove(): void
}

export class RootNode implements ComponentBase {
  _type = ZType.host as const
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

  // We should only need to loop over aKeys since the length must be the same.
  for (const key of aKeys) if (a[key] !== b[key]) return false

  return true
}

export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}
