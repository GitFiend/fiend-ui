import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Component, Rec, StandardProps} from './component'
import {removeChildren} from '../render'

export type AnyComponent = HostComponent | TextComponent | Component
export type ParentComponent = HostComponent | RootNode | Component

export interface Tree<P extends StandardProps = {}> {
  _type: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | typeof Component
  props: P
}

export type Subtree = Tree | string | number | null
// export type Subtrees = [Subtree] | ((Tree & {key: string}) | string | number | null)[]

// const a: Subtrees = ['', '']
// const b: Subtrees = [div({key: ''}), '']

export enum ComponentType {
  host,
  custom,
  text,
}

export interface ComponentBase {
  parent: unknown
  _type: ComponentType

  remove(): void
}

export class RootNode implements ComponentBase {
  _type = ComponentType.host as const
  parent: null
  subComponents: {[key: string]: AnyComponent} = {}
  order: string = '1'

  constructor(public element: HTMLElement) {}

  remove(): void {
    this.element.remove()
    removeChildren(this.subComponents)
    // this.subComponents.forEach(s => s.remove())
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
