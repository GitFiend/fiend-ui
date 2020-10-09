import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Component, CustomComponent, StandardProps} from './component'
import {renderTree} from '../render'
import {InsertedOrder, Order} from '../util/order'

export interface Tree<P extends StandardProps = StandardProps> {
  _type: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | CustomComponent<P>
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

  // Remove the component and run cleanup. Not necessarily related to element removal.
  remove(): void
}

export interface ParentComponent {
  order: string
  key: string

  // Insert DOM element.
  insertChild(element: Element | Text, order: string): void

  // Remove DOM element.
  removeChild(order: string): void

  moveChild(element: Element | Text, prevOrder: string, newOrder: string): void
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

  insertChild(element: Element | Text, order: string) {
    Order.insert(this.element, this.inserted, element, order)
  }

  removeChild(order: string) {
    Order.remove(order, this.inserted)
  }

  moveChild(element: Element | Text, prevOrder: string, newOrder: string) {
    Order.move(this.inserted, this.element, element, prevOrder, newOrder)
  }

  remove(): void {
    this.component?.remove()
    this.component = null
  }
}
