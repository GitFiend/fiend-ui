import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Component, StandardProps} from './component'
import {renderTree} from '../render'
import {InsertedOrder, Order} from '../util/order'

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
  _type: ComponentType
  parent: unknown
  order: string

  remove(): void
}

export interface ParentComponent {
  order: string
  key: string

  insert: (element: Element | Text, order: string) => void
}

export class RootNode implements ParentComponent {
  // _type = ComponentType.host as const
  component: AnyComponent | null = null
  order = '1'
  key = '1'

  inserted: InsertedOrder[] = []

  constructor(public element: HTMLElement) {}

  render(tree: Tree) {
    this.component = renderTree(tree, this.component, this, this.order, 0)
  }

  insert(element: Element | Text, order: string) {
    Order.insert(this.element, this.inserted, element, order)
  }

  remove(): void {
    this.component?.remove()
    this.component = null
  }
}
