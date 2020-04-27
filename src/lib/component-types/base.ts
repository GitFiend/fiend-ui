import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Component, Rec} from './component'
import {ObserverComponent} from './observer-component'

export type Z = HostComponent | TextComponent | Component | ObserverComponent
export type ParentTree2 = HostComponent | RootNode | Component

export interface Tree {
  type: keyof HTMLElementTagNameMap | typeof Component
  props: Record<string, unknown> | null
  children: Subtree
}

export type SubtreeFlat = Tree | string | number
export type Subtree =
  | Tree
  | string
  | number
  | SubtreeFlat[]
  | (Tree | string | number | SubtreeFlat[])[]

export enum ZType {
  host,
  custom,
  text,
}

export interface ComponentBase {
  parent: unknown
  element: unknown
  type: ZType

  remove(): void
}

export class RootNode implements ComponentBase {
  type = ZType.host as const
  parent: null
  children: Z[] = []

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

export class F extends Component {
  render() {
    return this.props.children || null
  }
}
