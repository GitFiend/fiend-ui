import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Component, StandardProps} from './component'
import {renderTree} from '../render'

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

  remove(): void
}

export interface ParentComponent extends ComponentBase {
  order: string
  key: string
}

export class RootNode implements ParentComponent {
  _type = ComponentType.host as const
  component: AnyComponent | null = null
  order = '1'
  key = '1'

  constructor(public element: HTMLElement) {}

  render(tree: Tree) {
    const component = renderTree(tree, this.component, this.order, 0)

    this.component = component
    let prevElement: Element | Text | null = null

    switch (component._type) {
      case ComponentType.host:
        const {element} = component

        this.element.insertBefore(element, prevElement)
        prevElement = element

        break
      case ComponentType.custom:
        const {elements} = component

        for (const element of elements) {
          this.element.insertBefore(element, prevElement)
          prevElement = element
        }
        break
    }
  }

  remove(): void {
    this.component?.remove()
    this.component = null
  }
}
