import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Component, Rec, StandardProps} from './component'
import {removeChildren} from '../render'

export interface Tree<P extends StandardProps = StandardProps> {
  _type: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | typeof Component
  props: P
}

export type Subtree = Tree | string | number | null

export type AnyComponent = HostComponent | TextComponent | Component

export enum ComponentType {
  host,
  custom,
  text,
}

export interface ComponentBase {
  // parent: unknown
  _type: ComponentType

  remove(): void
}

export interface ParentComponent extends ComponentBase {
  order: string
  // subComponents: Map<string, AnyComponent>
  // containerElement: Element
  // lastInserted: Element | Text | null
  key: string
}

export class RootNode implements ParentComponent {
  _type = ComponentType.host as const
  parent: null
  lastInserted = null
  // subComponents = new Map<string, AnyComponent>()
  order = '1'
  key = '1'

  constructor(public containerElement: HTMLElement) {}

  remove(): void {
    this.containerElement.remove()
    // removeChildren(this.subComponents)
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
