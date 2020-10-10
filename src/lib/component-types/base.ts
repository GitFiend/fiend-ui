import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Component, CustomComponent, StandardProps} from './component'
import {Render} from '../render'
import {Order} from '../util/order'

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

// export interface ParentComponent {
//   order: string
//   key: string
//
//   // Insert DOM element.
//   insertChild(element: Element | Text, order: string): void
//
//   // Remove DOM element.
//   removeChild(element: Element | Text, order: string): void
//
//   moveChild(element: Element | Text, prevOrder: string, newOrder: string): void
// }

export class RootComponent {
  component: AnyComponent | null = null
  order = '1'
  key = '1'

  inserted: (HostComponent | TextComponent)[] = []

  constructor(public element: HTMLElement) {}

  render(tree: Tree) {
    this.component = Render.tree(tree, this.component, this, this.order, 0)
  }

  insertChild(child: HostComponent | TextComponent) {
    Order.insert(this, child)
  }

  removeChild(child: HostComponent | TextComponent) {
    Order.remove(this, child)
  }

  moveChild(child: HostComponent | TextComponent, prevOrder: string) {
    Order.move(this, child, prevOrder)
  }

  remove(): void {
    this.component?.remove()
    this.component = null
  }
}
